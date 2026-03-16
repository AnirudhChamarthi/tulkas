export interface DimensionScore {
  score: number;
  justification: string;
}

export interface ScorePayload {
  entity_id: string;
  entity_name: string;
  entity_type: string;
  tier: 1 | 2;
  environment: DimensionScore;
  labor: DimensionScore;
  corruption: DimensionScore;
  political: DimensionScore;
  community: DimensionScore;
  conduct: DimensionScore;
}

export interface JobStatus {
  status: 'pending' | 'complete' | 'failed';
  started_at?: string;
  score?: ScorePayload;
}
