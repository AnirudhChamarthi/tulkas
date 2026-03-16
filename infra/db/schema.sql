-- Tulkas — static entity scores
-- schema.sql  (run before seed.sql)

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS entities (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  entity_type     TEXT NOT NULL,   -- 'individual' | 'corporation' | 'organization' | 'vc_firm' | 'combined'
  description     TEXT,            -- concise summary: arc, three-gate finding, funder note where relevant
  score_env       SMALLINT NOT NULL CHECK (score_env BETWEEN 1 AND 10),
  score_labor     SMALLINT NOT NULL CHECK (score_labor BETWEEN 1 AND 10),
  score_integrity SMALLINT NOT NULL CHECK (score_integrity BETWEEN 1 AND 10),
  score_political SMALLINT NOT NULL CHECK (score_political BETWEEN 1 AND 10),
  score_community SMALLINT NOT NULL CHECK (score_community BETWEEN 1 AND 10),
  score_conduct   SMALLINT NOT NULL CHECK (score_conduct BETWEEN 1 AND 10),
  score_avg       NUMERIC(3,1) NOT NULL,
  reason_env      TEXT,
  reason_labor    TEXT,
  reason_integrity TEXT,
  reason_political TEXT,
  reason_community TEXT,
  reason_conduct  TEXT
);

-- Trigram index: enables fast ILIKE at any scale
-- Lookup: SELECT * FROM entities WHERE name ILIKE '%search term%'
CREATE INDEX IF NOT EXISTS idx_entities_name_trgm
  ON entities USING gin (name gin_trgm_ops);
