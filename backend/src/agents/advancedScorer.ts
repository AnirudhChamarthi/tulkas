import { v4 as uuidv4 } from 'uuid';
import { ScorePayload, DimensionScore } from '../types';
import { DIMENSIONS } from '../search/braveSearch';
import { setJobStatus, setCachedScore } from '../cache/redis';
import { uploadEvidence, hashQuery } from '../storage/spaces';
import { SYSTEM_PROMPT } from './llmClient';

const AGENT_ENDPOINT    = () => process.env.GRADIENT_AGENT_ENDPOINT ?? '';
const AGENT_KEY         = () => process.env.GRADIENT_AGENT_KEY      ?? '';
const AGENT_TIMEOUT     = 180_000; // 3 minutes — agent runs multi-step research loop
const TIER2_MAX_TOKENS  = 4096;   // Tier 2: longer justifications + tool-call overhead

const FALLBACK_DIM: DimensionScore = {
  score:         5,
  justification: 'Insufficient data returned from research loop.',
};

function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = raw.indexOf('{');
  const end   = raw.lastIndexOf('}');
  if (start !== -1 && end !== -1) return raw.slice(start, end + 1);
  return raw.trim();
}

function parseAgentScores(raw: string): Record<string, DimensionScore> | null {
  try {
    const parsed = JSON.parse(extractJson(raw)) as Record<string, unknown>;
    const result: Record<string, DimensionScore> = {};
    for (const dim of DIMENSIONS) {
      const d     = parsed[dim] as { score?: unknown; justification?: unknown } | undefined;
      const score = Number(d?.score);
      if (!d || isNaN(score) || score < 1 || score > 10) return null;
      result[dim] = {
        score:         Math.round(score),
        justification: String(d.justification ?? 'No justification provided.'),
      };
    }
    return result;
  } catch {
    return null;
  }
}

/**
 * Runs the Gradient ADK agent to research and score an entity in depth (Tier 2).
 * This function is intended to be called fire-and-forget from the route handler.
 * It writes its result (or failure) back to Redis so the status endpoint can serve it.
 */
export async function runAdvancedScorer(
  entityName:  string,
  entityType:  string,
  jobId:       string,
  userNote?:   string,
  tier1Score?: ScorePayload,
): Promise<void> {
  const endpoint = AGENT_ENDPOINT();
  const key      = AGENT_KEY();

  if (!endpoint || endpoint === 'pending') {
    await setJobStatus(jobId, { status: 'failed', started_at: new Date().toISOString() });
    return;
  }

  try {
    // Build Tier 1 baseline block if available
    const tier1Block = tier1Score
      ? [
          `--- TIER 1 BASELINE ---`,
          `A basic first-pass score already exists. Use your search and article-fetch tools`,
          `to verify, challenge, and deepen each dimension. You are NOT bound by these scores`,
          `— override any where your research supports a different conclusion.`,
          ``,
          ...DIMENSIONS.map((dim) => {
            const d = tier1Score[dim];
            return `${dim.toUpperCase()}: score ${d.score} — "${d.justification}"`;
          }),
          ``,
          `Focus your tool calls on dimensions where the justification is vague, cites weak`,
          `sources, or scores an opinion/statement rather than a documented action.`,
        ].join('\n')
      : [
          `No prior score exists for this entity. Use your search and article-fetch tools`,
          `to gather evidence on all six dimensions before scoring.`,
        ].join('\n');

    const userMessage = [
      `--- SCORING INSTRUCTIONS (apply these rules exactly) ---`,
      ``,
      SYSTEM_PROMPT,
      ``,
      `--- TASK ---`,
      ``,
      `Entity name: ${entityName}`,
      `Entity type: ${entityType}`,
      ...(userNote ? [``, `Additional context from user: ${userNote}`] : []),
      ``,
      tier1Block,
      ``,
      `Return your final scores as a JSON object following the schema in your instructions.`,
      `Do not include any text outside the JSON object.`,
    ].join('\n');

    const controller = new AbortController();
    const timer      = setTimeout(() => controller.abort(), AGENT_TIMEOUT);

    const res = await fetch(`${endpoint}/api/v1/chat/completions`, {
      signal:  controller.signal,
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        messages:               [{ role: 'user', content: userMessage }],
        stream:                 false,
        max_tokens:             TIER2_MAX_TOKENS,
        include_functions_info: true,
        include_retrieval_info: true,
      }),
    });

    clearTimeout(timer);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Agent returned HTTP ${res.status}: ${text.slice(0, 300)}`);
    }

    const data = await res.json() as {
      choices:    Array<{ message: { content: string } }>;
      functions?: { called_functions?: string[] };
      retrieval?: { retrieved_data?: unknown[] };
    };

    const content = data.choices?.[0]?.message?.content ?? '';

    let scores = parseAgentScores(content);
    if (!scores) {
      throw new Error(`Could not parse agent JSON output for ${entityName}`);
    }

    const entityId  = uuidv4();
    const dimScores = Object.fromEntries(
      DIMENSIONS.map((d) => [d, scores![d] ?? FALLBACK_DIM])
    ) as Record<string, DimensionScore>;

    const avg = DIMENSIONS.reduce((sum, d) => sum + dimScores[d].score, 0) / DIMENSIONS.length;

    const payload: ScorePayload = {
      entity_id:   entityId,
      entity_name: entityName,
      entity_type: entityType,
      tier:        2,
      environment: dimScores.environment,
      labor:       dimScores.labor,
      corruption:  dimScores.corruption,
      political:   dimScores.political,
      community:   dimScores.community,
      conduct:     dimScores.conduct,
    };

    await setCachedScore(entityName, entityType, payload, 2);
    await setJobStatus(jobId, {
      status:     'complete',
      started_at: new Date().toISOString(),
      score:      payload,
    });

    // Upload research summary to Spaces (non-blocking)
    const evidenceSummary = [
      `Entity:            ${entityName} (${entityType})`,
      `Job ID:            ${jobId}`,
      `Score avg:         ${avg.toFixed(2)}`,
      `Functions called:  ${data.functions?.called_functions?.join(', ') ?? 'none'}`,
      `Retrieval hits:    ${data.retrieval?.retrieved_data?.length ?? 0}`,
      ``,
      `--- Raw agent response ---`,
      content,
    ].join('\n');

    uploadEvidence(entityId, hashQuery(entityName, 'advanced'), evidenceSummary)
      .catch(() => {});

  } catch (err) {
    await setJobStatus(jobId, {
      status:     'failed',
      started_at: new Date().toISOString(),
    }).catch(() => {});
  }
}
