import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { redisClient, getCachedScore, setCachedScore, setJobStatus } from '../cache/redis';
import { findEntityByName } from '../db/entities';
import { entityToScorePayload } from '../db/scores';
import { runBasicScorer } from '../agents/basicScorer';
import { runAdvancedScorer } from '../agents/advancedScorer';
import { callLLMRaw } from '../agents/llmClient';

export const scoreRouter = Router();

const RESOLVE_TTL = 60 * 60 * 24 * 7; // 7 days

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

    const prompt = `Is the ${platform} account @${handle} associated with a public figure who has a first and last name? If yes, reply with ONLY that person's full name (e.g. "Elon Musk"). If no, reply exactly: ACCOUNT_ONLY`;
    const raw = await callLLMRaw(prompt);
    const entity = raw.trim().toUpperCase() === 'ACCOUNT_ONLY' ? handle : raw.trim();
    if (entity) await redisClient.set(cacheKey, entity, { EX: RESOLVE_TTL });
    res.json({ entity: entity || handle });
  } catch (err) {
    console.error('GET /score/resolve error:', err);
    res.json({ entity: handle }); // fallback: keep handle
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

    // Path 3: Cache and DB both missed — run live Tier 1 scorer
    const liveScore = await runBasicScorer(name, type);
    res.json({ source: 'live', ...liveScore });

  } catch (err) {
    console.error('GET /score error:', err);
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

      console.log(`[Advanced] No Tier 1 found for "${name}" — running basic scorer first`);
      return runBasicScorer(name, type);
    }

    // Fire-and-forget — waits for Tier 1 internally, then runs the agent
    ensureTier1()
      .then((tier1) => runAdvancedScorer(name, type, job_id, note, tier1))
      .catch((err) => console.error('[Advanced] Unhandled scorer error:', err));

    res.json({ job_id });

  } catch (err) {
    console.error('POST /score/advanced error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
