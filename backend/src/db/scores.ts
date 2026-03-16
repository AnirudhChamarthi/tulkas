import { EntityRow } from './entities';
import { ScorePayload } from '../types';

/**
 * The DB uses a richer 'entity_type' vocabulary (e.g. 'combined' for a
 * person+company entry).  Normalise to the 'person' | 'org' range that the
 * rest of the system expects, so downstream callers (advanced scorer, search
 * templates, cache keys) always receive a valid type.
 */
function normaliseEntityType(raw: string): 'person' | 'org' {
  return raw === 'org' ? 'org' : 'person';
}

export function entityToScorePayload(entity: EntityRow, tier: 1 | 2 = 1): ScorePayload {
  return {
    entity_id: String(entity.id),
    entity_name: entity.name,
    entity_type: normaliseEntityType(entity.entity_type),
    tier,
    environment:  { score: entity.score_env,       justification: entity.reason_env       ?? 'No data available.' },
    labor:        { score: entity.score_labor,      justification: entity.reason_labor      ?? 'No data available.' },
    corruption:   { score: entity.score_integrity,  justification: entity.reason_integrity  ?? 'No data available.' },
    political:    { score: entity.score_political,  justification: entity.reason_political  ?? 'No data available.' },
    community:    { score: entity.score_community,  justification: entity.reason_community  ?? 'No data available.' },
    conduct:      { score: entity.score_conduct,    justification: entity.reason_conduct    ?? 'No data available.' },
  };
}
