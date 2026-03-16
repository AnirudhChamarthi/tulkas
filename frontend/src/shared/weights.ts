import { DimensionWeights, ScorePayload } from './types';
import { DIMENSIONS } from './constants';

export const DEFAULT_WEIGHTS: DimensionWeights = {
  environment: 3,
  labor:       3,
  corruption:  3,
  political:   3,
  community:   3,
  conduct:     3,
};

const STORAGE_KEY = 'tulkas_weights';

export async function loadWeights(): Promise<DimensionWeights> {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    return (result[STORAGE_KEY] as DimensionWeights) ?? DEFAULT_WEIGHTS;
  } catch {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      return (result[STORAGE_KEY] as DimensionWeights) ?? DEFAULT_WEIGHTS;
    } catch {
      return DEFAULT_WEIGHTS;
    }
  }
}

export async function saveWeights(w: DimensionWeights): Promise<void> {
  try {
    await chrome.storage.sync.set({ [STORAGE_KEY]: w });
  } catch {
    await chrome.storage.local.set({ [STORAGE_KEY]: w });
  }
}

export function computeOverall(score: ScorePayload, weights: DimensionWeights): number {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const dim of DIMENSIONS) {
    const w = weights[dim];
    weightedSum += score[dim].score * w;
    totalWeight += w;
  }
  return Math.round((weightedSum / totalWeight) * 10) / 10;
}
