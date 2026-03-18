const PROD_BACKEND  = 'https://tulkas-backend-ctpjf.ondigitalocean.app';
const LOCAL_BACKEND = 'http://localhost:8081';

export const BACKEND_URL = import.meta.env.PROD ? PROD_BACKEND : LOCAL_BACKEND;

export const DIMENSIONS = [
  'environment',
  'labor',
  'corruption',
  'political',
  'community',
  'conduct',
] as const;

export const DIMENSION_LABELS: Record<string, string> = {
  environment: 'Environment',
  labor:       'Labour',
  corruption:  'Corruption',
  political:   'Political',
  community:   'Community',
  conduct:     'Conduct',
};

export const LOCAL_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const POLL_INTERVAL_MS   = 3000;
export const POLL_MAX_ATTEMPTS  = 60; // 3 min max
