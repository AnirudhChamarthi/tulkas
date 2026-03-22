export type PageType =
  | 'marketplace-product'
  | 'person'
  | 'org'
  | 'informational-wikipedia'
  | 'informational-encyclopedia'
  | 'informational-article'
  | 'unknown';

export interface PageContext {
  type:              PageType;
  primaryEntity:     string;
  primaryEntityType: 'person' | 'org';
  secondaryEntity?:  string;
  sourceUrl:         string;
  confidence:        'high' | 'medium' | 'low';
  /** Social profile: platform name for home vs handle for profile; triggers backend resolve */
  platform?:         string;
  resolveHandle?:    boolean;
  /** AI fallback: ask backend to resolve best entity to score for this URL */
  resolveEntity?:    boolean;
  /** Optional context for AI resolution (page title, extracted candidates) */
  pageTitle?:        string;
  candidates?:       string[];
}

export interface DimensionScore {
  score:         number;            // 1–10
  justification: string;
}

export interface ScorePayload {
  entity_id:   string;
  entity_name: string;
  entity_type: string;
  tier:        1 | 2;
  environment: DimensionScore;
  labor:       DimensionScore;
  corruption:  DimensionScore;
  political:   DimensionScore;
  community:   DimensionScore;
  conduct:     DimensionScore;
  source?:     'cache' | 'database' | 'live';
}

export interface DimensionWeights {
  environment: 1 | 2 | 3 | 4 | 5;
  labor:       1 | 2 | 3 | 4 | 5;
  corruption:  1 | 2 | 3 | 4 | 5;
  political:   1 | 2 | 3 | 4 | 5;
  community:   1 | 2 | 3 | 4 | 5;
  conduct:     1 | 2 | 3 | 4 | 5;
}

export interface JobStatus {
  status:     'pending' | 'complete' | 'failed';
  started_at?: string;
  score?:     ScorePayload;
}

// Messages between content script, background, and popup
export type Message =
  | { type: 'PAGE_CONTEXT';      context: PageContext }
  | { type: 'GET_SCORE' }
  | { type: 'SCORE_READY';       score: ScorePayload; entity: string }
  | { type: 'REQUEST_ADVANCED';  entity: string; entityType: string; note?: string }
  | { type: 'ADVANCED_UPDATE';   jobId: string; status: JobStatus }
  | { type: 'CONTEXT_READY';     context: PageContext }
  | { type: 'TULKAS_RELOAD' }
  | { type: 'PAGE_CHANGED' }
  | { type: 'CANCEL_ADVANCED'; entity: string; entityType: string }
  | { type: 'FETCH_SCORE'; entity: string; entityType: string }   // manual search via background
  | { type: 'RESOLVE_ENTITY'; url: string; title?: string; candidates?: string[] }; // AI resolve via background
