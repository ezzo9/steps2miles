// Below 1,000 steps, pages are consolidated onto 1,000; from 1,001 to
// 1,999, onto 2,000. At this scale (well under half a mile) the content is
// thin and near-identical page to page, so two indexed pages cover the
// range instead of 1,999 near-duplicates.
const LOW_CONSOLIDATION_TARGETS = [1000, 2000] as const;

// Above this many steps, individual pages stop being worth indexing on
// their own, they get consolidated onto the nearest hundred instead.
export const CANONICAL_CONSOLIDATION_THRESHOLD = 15000;

// From CANONICAL_CONSOLIDATION_THRESHOLD+1 up through here, pages round to
// the nearest hundred instead of being self-canonical.
export const HUNDRED_ROUNDING_MAX = 20000;

// From HUNDRED_ROUNDING_MAX+1 up through here, pages round to the nearest
// thousand instead. This is also the top of the range this site actively
// submits for indexing (it matches MAX_SLUG_STEPS in lib/milestones.ts, the
// highest step count any page renders for).
export const SITEMAP_MAX_STEPS = 30000;

/**
 * The canonical step count for a given page.
 * - 1 through 999: consolidated onto 1,000.
 * - 1,000: self-canonical (it's the target of the bucket above).
 * - 1,001 through 1,999: consolidated onto 2,000.
 * - 2,000 through 15,000: self-canonical, every page is its own canonical URL.
 * - 15,001 through 20,000: rounds UP to the nearest hundred (16551 -> 16600,
 *   16520 -> 16600, exact hundreds like 16600 canonicalize to themselves),
 *   capped at 20,000.
 * - 20,001 through 30,000: rounds UP to the nearest thousand (22450 -> 23000,
 *   exact thousands like 23000 canonicalize to themselves), capped at
 *   30,000. So the only indexable pages in this range are 21,000, 22,000,
 *   23,000 ... 30,000.
 */
export function getCanonicalSteps(steps: number): number {
  if (steps < LOW_CONSOLIDATION_TARGETS[0]) return LOW_CONSOLIDATION_TARGETS[0];
  if (steps > LOW_CONSOLIDATION_TARGETS[0] && steps < LOW_CONSOLIDATION_TARGETS[1]) {
    return LOW_CONSOLIDATION_TARGETS[1];
  }
  if (steps <= CANONICAL_CONSOLIDATION_THRESHOLD) return steps;
  if (steps <= HUNDRED_ROUNDING_MAX) {
    return Math.min(Math.ceil(steps / 100) * 100, HUNDRED_ROUNDING_MAX);
  }
  if (steps > SITEMAP_MAX_STEPS) return steps;
  return Math.min(Math.ceil(steps / 1000) * 1000, SITEMAP_MAX_STEPS);
}

export function isCanonicalSelf(steps: number): boolean {
  return getCanonicalSteps(steps) === steps;
}
