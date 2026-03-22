import { Router, Request, Response } from 'express';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { redisClient, getCachedScore, setCachedScore, setJobStatus } from '../cache/redis';
import { findEntityByName } from '../db/entities';
import { entityToScorePayload } from '../db/scores';
import { runBasicScorer } from '../agents/basicScorer';
import { runAdvancedScorer } from '../agents/advancedScorer';
import { callLLMRaw } from '../agents/llmClient';
import { isBroadPublicGroup } from '../data/publicGroups';

export const scoreRouter = Router();

const RESOLVE_TTL = 60 * 60 * 24 * 7; // 7 days
const GATE_TTL    = 60 * 60 * 24 * 7; // 7 days

const PUBLIC_GROUP_MSG = 'Tulkas does not score public groups of people.';

async function isPublicGroupAI(name: string): Promise<boolean> {
  const norm = name.trim().toLowerCase();
  const key  = `gate:${createHash('sha1').update(norm).digest('hex')}`;

  try {
    const cached = await redisClient.get(key);
    if (cached === '1') return true;
    if (cached === '0') return false;
  } catch { /* ignore cache read failure */ }

  const prompt = [
    `Is "${name}" a specific person or a specific company/organization?`,
    '',
    'If YES (person or company) → reply with only: ACCEPT',
    'If NO — it is a nation, country, religion, ethnic group, nationality, demonym, tribe, caste, or demographic category → reply with only: REJECT',
    '',
    'When unsure, reply ACCEPT. Only reply REJECT if you are certain this refers to a broad group, not a person or organization.',
    '',
    'Reply with only one word: ACCEPT or REJECT',
  ].join('\n');

  try {
    const raw = await callLLMRaw(prompt);
    const reject = /^\s*REJECT\s*$/i.test(raw.trim());
    await redisClient.set(key, reject ? '1' : '0', { EX: GATE_TTL }).catch(() => {});
    return reject;
  } catch {
    return false;
  }
}

function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start !== -1 && end !== -1) return raw.slice(start, end + 1);
  return raw.trim();
}

// GET /score/resolve?handle=:h&platform=:p — resolve social handle to public figure or ACCOUNT_ONLY
scoreRouter.get('/resolve', async (req: Request, res: Response): Promise<void> => {
  const handle  = (req.query.handle as string | undefined)?.trim();
  const platform = (req.query.platform as string | undefined)?.trim() ?? '';

  if (!handle || handle.length > 80) {
    res.status(400).json({ error: 'handle required, max 80 chars' });
    return;
  }

  const cacheKey = `resolve:${handle.toLowerCase()}:${platform.toLowerCase()}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      res.json({ entity: cached });
      return;
    }

    const prompt = [
      `Is the ${platform} account @${handle} a public figure with a real first and last name?`,
      `If YES: reply with ONLY the full name, nothing else. Example: Elon Musk`,
      `If NO or UNSURE: reply with exactly: ACCOUNT_ONLY`,
      `Do NOT explain your reasoning. Output ONLY the name or ACCOUNT_ONLY.`,
    ].join('\n');
    const raw = await callLLMRaw(prompt);
    const trimmed = raw.trim().replace(/^["']|["']$/g, '');
    const isAccountOnly = trimmed.toUpperCase().includes('ACCOUNT_ONLY');
    const looksLikeName = trimmed.length <= 80 && !trimmed.includes('.') && !/\b(I |found|however|couldn|information|associated|recognized)\b/i.test(trimmed);
    const entity = !isAccountOnly && looksLikeName ? trimmed : handle;
    if (entity) await redisClient.set(cacheKey, entity, { EX: RESOLVE_TTL });
    res.json({ entity });
  } catch {
    res.json({ entity: handle });
  }
});

// POST /score/resolve-entity — AI fallback to resolve what to score from a URL/page
scoreRouter.post('/resolve-entity', async (req: Request, res: Response): Promise<void> => {
  const { url, title, candidates } = req.body as {
    url?:        string;
    title?:      string;
    candidates?: string[];
  };

  const cleanUrl = (url ?? '').trim();
  const cleanTitle = (title ?? '').trim();
  const cleanCandidates = Array.isArray(candidates)
    ? candidates.map((c) => String(c).trim()).filter(Boolean).slice(0, 10)
    : [];

  if (!cleanUrl || cleanUrl.length > 2000) {
    res.status(400).json({ error: 'url required, max 2000 chars' });
    return;
  }
  if (cleanTitle.length > 200) {
    res.status(400).json({ error: 'title must be 200 characters or fewer' });
    return;
  }

  const key = `resolve_entity:${createHash('sha1').update(cleanUrl).digest('hex')}`;
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      res.json(JSON.parse(cached) as { entity: string; entityType: 'person' | 'org'; confidence?: string });
      return;
    }
  } catch {
    // ignore cache parse failures
  }

  const prompt = [
    `You help a browser extension decide WHAT ENTITY to score ethically for the current page.`,
    ``,
    `Given:`,
    `- URL: ${cleanUrl}`,
    cleanTitle ? `- Title: ${cleanTitle}` : `- Title: (missing)`,
    cleanCandidates.length ? `- Candidates: ${cleanCandidates.join(' | ')}` : `- Candidates: (none)`,
    ``,
    `Rules:`,
    `- If this is a marketplace product page (Amazon/etc), return the BRAND or MANUFACTURER (e.g. "Vaseline", "Rogaine"), NOT the marketplace ("Amazon"), unless you truly cannot infer the brand.`,
    `- If this is a social profile page, return the person or organisation behind the account if obvious; otherwise return the handle/account name.`,
    `- If the subject is a whole country, nationality, ethnic group, religion, or other broad public group (e.g. "America", "Americans", "secularists") do NOT invent a leader or government name. In that case, respond with entity: "" and confidence: "low".`,
    `- Prefer a real-world entity name over a full product title in all other cases.`,
    `- entityType must be "person" or "org".`,
    ``,
    `Respond with ONLY valid JSON in this schema:`,
    `{"entity":"<string or empty>","entityType":"person|org","confidence":"high|medium|low"}`,
  ].join('\n');

  try {
    const raw = await callLLMRaw(prompt);
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    const slice = jsonStart !== -1 && jsonEnd !== -1 ? raw.slice(jsonStart, jsonEnd + 1) : raw;
    const parsed = JSON.parse(slice) as { entity?: unknown; entityType?: unknown; confidence?: unknown };

    const entity = String(parsed.entity ?? '').trim();
    const entityTypeRaw = String(parsed.entityType ?? '').trim().toLowerCase();
    const entityType: 'person' | 'org' = entityTypeRaw === 'person' ? 'person' : 'org';
    const confidence = String(parsed.confidence ?? '').trim().toLowerCase();

    const payload = {
      entity: entity || '',
      entityType,
      confidence: confidence === 'high' || confidence === 'medium' || confidence === 'low' ? confidence : 'low',
    };

    try {
      await redisClient.set(key, JSON.stringify(payload), { EX: RESOLVE_TTL });
    } catch {
      // ignore cache set failures
    }

    res.json(payload);
  } catch {
    res.json({ entity: '', entityType: 'org', confidence: 'low' });
  }
});

// GET /score?entity=:name&type=:type
scoreRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const name = (req.query.entity as string | undefined)?.trim();
  const type = (req.query.type  as string | undefined)?.trim() ?? 'person';

  if (!name) {
    res.status(400).json({ error: 'entity query parameter is required' });
    return;
  }
  if (name.length > 200) {
    res.status(400).json({ error: 'entity name must be 200 characters or fewer' });
    return;
  }

  try {
    // Path 1: Redis cache
    const cached = await getCachedScore(name, type, 1);
    if (cached) {
      res.json({ source: 'cache', ...cached });
      return;
    }

    // Path 2: Static Postgres DB
    const entity = await findEntityByName(name);
    if (entity) {
      const payload = entityToScorePayload(entity, 1);
      await setCachedScore(name, type, payload, 1);
      res.json({ source: 'database', ...payload });
      return;
    }

    // Path 3: Block broad public groups before live scoring
    // Fast-path: static set catches countries and religions instantly
    if (isBroadPublicGroup(name)) {
      res.status(400).json({ error: PUBLIC_GROUP_MSG });
      return;
    }
    // AI gate: catches ethnic groups, demonyms, demographics the static set can't enumerate
    if (await isPublicGroupAI(name)) {
      res.status(400).json({ error: PUBLIC_GROUP_MSG });
      return;
    }

    // Path 4: Run live Tier 1 scorer
    const liveScore = await runBasicScorer(name, type);
    res.json({ source: 'live', ...liveScore });

  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /score/advanced
scoreRouter.post('/advanced', async (req: Request, res: Response): Promise<void> => {
  const { entity_name, entity_type, user_note } = req.body as {
    entity_name?: string;
    entity_type?: string;
    user_note?:   string;
  };

  if (!entity_name || !entity_type) {
    res.status(400).json({ error: 'entity_name and entity_type are required' });
    return;
  }
  if (entity_name.length > 200) {
    res.status(400).json({ error: 'entity_name must be 200 characters or fewer' });
    return;
  }
  // Normalise legacy DB values (e.g. 'combined') rather than rejecting — the
  // scorer only needs to know person vs org.
  const normalisedType = entity_type === 'org' ? 'org' : 'person';

  if (user_note && user_note.length > 100) {
    res.status(400).json({ error: 'user_note must be 100 characters or fewer' });
    return;
  }

  const name  = entity_name;
  const type  = normalisedType;
  const note  = user_note;

  const job_id = uuidv4();

  try {
    await setJobStatus(job_id, {
      status:     'pending',
      started_at: new Date().toISOString(),
    });

    // Guarantee Tier 1 exists before the agent starts — it needs it as a baseline.
    // Resolution order mirrors GET /score: cache → DB → live scorer.
    async function ensureTier1() {
      const cached = await getCachedScore(name, type, 1).catch(() => null);
      if (cached) return cached;

      const entity = await findEntityByName(name).catch(() => null);
      if (entity) {
        const payload = entityToScorePayload(entity, 1);
        await setCachedScore(name, type, payload, 1);
        return payload;
      }

      return runBasicScorer(name, type);
    }

    // Fire-and-forget — waits for Tier 1 internally, then runs the agent
    ensureTier1()
      .then((tier1) => runAdvancedScorer(name, type, job_id, note, tier1))
      .catch(() => {});

    res.json({ job_id });

  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});
