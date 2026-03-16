/** Colour token for a 1-10 ethical score */
export function scoreColour(s: number): string {
  if (s >= 8) return 'var(--c-green)';
  if (s >= 6) return 'var(--c-lime)';
  if (s >= 4) return 'var(--c-neutral)';  // 4–6 = average
  if (s >= 3) return 'var(--c-amber)';
  return 'var(--c-red)';
}

/** Short label for a score. 5 is average. */
export function scoreLabel(s: number): string {
  if (s >= 8) return 'Good';
  if (s >= 6) return 'Fair';
  if (s >= 4) return 'Average';  // 4–6 = average (5 is midpoint)
  if (s >= 3) return 'Poor';
  return 'Harmful';
}
