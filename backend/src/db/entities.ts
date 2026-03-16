import { pgPool } from './client';

export interface EntityRow {
  id: number;
  name: string;
  entity_type: string;
  description: string | null;
  score_env: number;
  score_labor: number;
  score_integrity: number;
  score_political: number;
  score_community: number;
  score_conduct: number;
  score_avg: number;
  reason_env: string | null;
  reason_labor: string | null;
  reason_integrity: string | null;
  reason_political: string | null;
  reason_community: string | null;
  reason_conduct: string | null;
}

export async function findEntityByName(name: string): Promise<EntityRow | null> {
  const term = name.trim();
  const result = await pgPool.query<EntityRow>(
    `SELECT * FROM entities WHERE name ILIKE $1 OR name ILIKE $2 LIMIT 1`,
    [term, `%${term}%`]
  );
  return result.rows[0] ?? null;
}
