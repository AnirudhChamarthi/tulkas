import { braveSearch, SEARCH_TEMPLATES, DIMENSIONS, Dimension } from '../search/braveSearch';
import { queryKnowledgeBase, indexEvidence }                    from '../search/gradientKB';
import { scoreEntity }                                          from './llmClient';
import { runAssociationPhase1 }                                 from './associationAgent';
import { setCachedScore }                                       from '../cache/redis';
import { ScorePayload }                                         from '../types';

const HARD_TIMEOUT_MS = 30000;

function buildEntityId(name: string, type: string): string {
  return `live:${name.toLowerCase().replace(/\s+/g, '-')}:${type}`;
}

function normaliseType(type: string): 'person' | 'org' {
  return type === 'person' ? 'person' : 'org';
}

export async function runBasicScorer(
  entityName: string,
  entityType: string
): Promise<ScorePayload> {
  const start    = Date.now();
  const normType = normaliseType(entityType);
  const templates = SEARCH_TEMPLATES[normType];
  const entityId  = buildEntityId(entityName, entityType);

  const evidence: Partial<Record<Dimension, string>> = {};

  // Check KB first, then fire web searches for misses
  const kbResults = await Promise.all(
    DIMENSIONS.map((dim) => queryKnowledgeBase(entityName, dim))
  );

  const searchPromises: Promise<void>[] = [];

  for (let i = 0; i < DIMENSIONS.length; i++) {
    const dim = DIMENSIONS[i];
    if (kbResults[i]) {
      evidence[dim] = kbResults[i]!;
    } else {
      searchPromises.push(
        (async () => {
          const query   = templates[dim](entityName);
          const results = await braveSearch(query, 5);
          if (results.length === 0) return;

          const text = results.map((r) => `[${r.title}]\n${r.snippet}`).join('\n\n');
          evidence[dim] = text;

          await indexEvidence(entityId, entityName, dim, text);
        })()
      );
    }
  }

  // Race web searches against hard timeout
  await Promise.race([
    Promise.all(searchPromises),
    new Promise<void>((resolve) => setTimeout(resolve, HARD_TIMEOUT_MS - 500)),
  ]);

  // Score via LLM
  const scores = await Promise.race([
    scoreEntity(entityName, entityType, evidence),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('LLM timeout')), HARD_TIMEOUT_MS - (Date.now() - start))
    ),
  ]).catch(() => {
    return Object.fromEntries(
      DIMENSIONS.map((d) => [d, { score: 5, justification: 'Score pending — timed out.' }])
    ) as Awaited<ReturnType<typeof scoreEntity>>;
  });

  // Association penalty (Phase 1)
  const assoc = await runAssociationPhase1(entityName);
  if (assoc.penalty > 0) {
    const current = scores.conduct.score;
    scores.conduct = {
      score:         Math.max(1, current - assoc.penalty),
      justification: `${scores.conduct.justification} ${assoc.summary}`,
    };
  }

  const payload: ScorePayload = {
    entity_id:   entityId,
    entity_name: entityName,
    entity_type: entityType,
    tier:        1,
    ...scores,
  };

  await setCachedScore(entityName, entityType, payload, 1);
  return payload;
}
