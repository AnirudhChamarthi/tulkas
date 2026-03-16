const LOCAL_DEFAULT = 'http://localhost:8081';

/** Local backend (development). */
const LOCAL_BACKEND =
  (import.meta.env.VITE_BACKEND_URL_LOCAL ?? LOCAL_DEFAULT).trim() || LOCAL_DEFAULT;

/** Production backend (DigitalOcean App Platform). Set in .env.production before publishing. */
const PROD_BACKEND =
  (import.meta.env.VITE_BACKEND_URL_PROD || import.meta.env.VITE_BACKEND_URL)?.trim() || null;

/** Resolves to local URL in dev, production URL in built extension. Never empty. */
export const BACKEND_URL =
  (import.meta.env.PROD ? (PROD_BACKEND ?? LOCAL_BACKEND) : LOCAL_BACKEND) || LOCAL_DEFAULT;

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
