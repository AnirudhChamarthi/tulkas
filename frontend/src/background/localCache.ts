import { ScorePayload } from '../shared/types';
import { LOCAL_CACHE_TTL_MS } from '../shared/constants';

interface CacheEntry {
  score:      ScorePayload;
  cachedAt:   number;
}

function cacheKey(entity: string, tier: 1 | 2): string {
  return `tulkas_score_${entity.toLowerCase()}_t${tier}`;
}

export async function getCached(entity: string, tier: 1 | 2 = 1): Promise<ScorePayload | null> {
  try {
    const key    = cacheKey(entity, tier);
    const result = await chrome.storage.local.get(key);
    const entry  = result[key] as CacheEntry | undefined;
    if (!entry) return null;
    if (Date.now() - entry.cachedAt > LOCAL_CACHE_TTL_MS) {
      chrome.storage.local.remove(key);
      return null;
    }
    return entry.score;
  } catch {
    return null;
  }
}

export async function setCached(entity: string, score: ScorePayload, tier: 1 | 2 = 1): Promise<void> {
  try {
    const key: string = cacheKey(entity, tier);
    const entry: CacheEntry = { score, cachedAt: Date.now() };
    await chrome.storage.local.set({ [key]: entry });
  } catch {
    // storage quota — non-fatal
  }
}
