import { LANDMARKS } from "./landmarks";
import { MILESTONES } from "./milestones";
import { stepsToMiles } from "./steps";

export type QuizComparison = {
  name: string;
  miles: number;
};

// Same fixed-pool-plus-deterministic-index pattern as content-fragments.ts:
// candidates come from data that's already built (milestones, landmarks),
// nothing is generated per page.
const COMPARISON_POOL: QuizComparison[] = [
  ...MILESTONES.map((m) => ({ name: m.label, miles: stepsToMiles(m.steps) })),
  ...LANDMARKS.map((l) => ({ name: l.name, miles: l.miles })),
];

const MIN_SCALE_RATIO = 1.15;
const MAX_SCALE_RATIO = 4;
const CANDIDATE_WINDOW = 5;

function scaleRatio(a: number, b: number): number {
  return Math.max(a, b) / Math.min(a, b);
}

/**
 * Picks a quiz comparison that's in the same rough scale as `pageMiles`,
 * close enough to be a genuine guess, far enough apart not to be a trivial
 * near-tie. Deterministic: sorts the pool by closeness-in-scale, takes the
 * closest few candidates, then picks among them with steps % windowSize,
 * same steps number always yields the same comparison, no randomness.
 */
export function selectQuizComparison(
  steps: number,
  pageMiles: number
): QuizComparison {
  const inScale = COMPARISON_POOL.filter((c) => {
    const ratio = scaleRatio(c.miles, pageMiles);
    return ratio >= MIN_SCALE_RATIO && ratio <= MAX_SCALE_RATIO;
  });

  const byCloseness = (a: QuizComparison, b: QuizComparison) =>
    scaleRatio(a.miles, pageMiles) - scaleRatio(b.miles, pageMiles);

  const pool = (inScale.length > 0 ? inScale : [...COMPARISON_POOL]).sort(
    byCloseness
  );

  const window = pool.slice(0, Math.min(CANDIDATE_WINDOW, pool.length));
  const index = steps % window.length;
  return window[index];
}
