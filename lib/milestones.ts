import { milesToSteps } from "./steps";
import { HUNDRED_ROUNDING_MAX } from "./canonicalSteps";

export type MilestoneKey = "5k" | "10k" | "15k" | "half-marathon";

export type Milestone = {
  key: MilestoneKey;
  label: string;
  title: string;
  steps: number;
};

// Step-equivalents derived from the standard 2,000-steps-per-mile
// conversion, all four are real race/run distances (not mixed with the
// flat 10,000-step daily goal, which reads too similarly to "10K" next to
// it). `label` reads naturally inline ("within 5% of a 5K"), `title` is the
// standalone noun-phrase used as a card/heading label ("5K").
export const MILESTONES: Milestone[] = [
  {
    key: "5k",
    label: "a 5K",
    title: "5K",
    steps: Math.round(milesToSteps(3.1)),
  },
  {
    key: "10k",
    label: "a 10K",
    title: "10K",
    steps: Math.round(milesToSteps(6.2)),
  },
  {
    key: "15k",
    label: "a 15K",
    title: "15K",
    steps: Math.round(milesToSteps(9.3)),
  },
  {
    key: "half-marathon",
    label: "a half marathon",
    title: "Half Marathon",
    steps: Math.round(milesToSteps(13.1)),
  },
];

export type MilestoneGap = {
  key: MilestoneKey;
  title: string;
  targetSteps: number;
  gap: number;
  reached: boolean;
};

/**
 * How far this step count is from each milestone, sorted nearest-target
 * first. Milestones already passed are marked `reached` (with `gap` as how
 * far past it, not how far to go) rather than dropped, so a page above every
 * milestone still shows a complete, honest picture instead of an empty
 * section.
 */
export function buildMilestoneGaps(steps: number): MilestoneGap[] {
  return [...MILESTONES]
    .sort((a, b) => a.steps - b.steps)
    .map((m) => ({
      key: m.key,
      title: m.title,
      targetSteps: m.steps,
      gap: Math.abs(m.steps - steps),
      reached: steps >= m.steps,
    }));
}

const MILESTONE_MATCH_TOLERANCE = 0.05;

/** Returns the milestone this step count is within 5% of, if any. */
export function getMatchingMilestone(steps: number): Milestone | null {
  for (const milestone of MILESTONES) {
    const relativeDiff = Math.abs(steps - milestone.steps) / milestone.steps;
    if (relativeDiff <= MILESTONE_MATCH_TOLERANCE) return milestone;
  }
  return null;
}

/**
 * Returns whichever milestone page is numerically closest, match or not.
 * Excludes an exact match on `steps` itself, so a milestone page (e.g. the
 * 10,000-step goal page) doesn't link to itself.
 */
export function getClosestMilestone(steps: number): Milestone {
  const candidates = MILESTONES.filter((m) => m.steps !== steps);
  const pool = candidates.length > 0 ? candidates : MILESTONES;
  return [...pool].sort(
    (a, b) => Math.abs(a.steps - steps) - Math.abs(b.steps - steps)
  )[0];
}

/** Round numbers (x,000 or x,500) get more direct search traffic. */
export function isRoundNumber(steps: number): boolean {
  return steps % 500 === 0;
}

const MIN_SLUG_STEPS = 1;
const MAX_SLUG_STEPS = 30000;
const HUNDRED_STEP = 100;
const THOUSAND_STEP = 1000;

/**
 * The nearest round-page below and above `steps`, excluding `steps` itself.
 * The granularity switches from hundreds to thousands once `steps` is past
 * HUNDRED_ROUNDING_MAX, matching the point where lib/canonicalSteps.ts
 * itself switches rounding granularity. That match is deliberate: for any
 * page above the self-canonical threshold, the "next" value returned here
 * is always that page's own canonical target too, so internal links always
 * point toward an indexable page, never a consolidated one.
 *
 * Either end is null when there's no valid page in range (e.g. no previous
 * hundred below 100, no next thousand above MAX_SLUG_STEPS).
 */
export function getHundredNeighbors(
  steps: number
): { previous: number | null; next: number | null } {
  const granularity = steps > HUNDRED_ROUNDING_MAX ? THOUSAND_STEP : HUNDRED_STEP;
  const isExact = steps % granularity === 0;
  const previous = isExact
    ? steps - granularity
    : Math.floor(steps / granularity) * granularity;
  let next = isExact
    ? steps + granularity
    : Math.ceil(steps / granularity) * granularity;

  // steps === HUNDRED_ROUNDING_MAX is the one value that still rounds with
  // hundred-granularity above but whose plain +100 step lands past the
  // boundary, where only exact thousands are self-canonical. Bump it up to
  // the next thousand instead of a non-canonical hundred.
  if (next > HUNDRED_ROUNDING_MAX && next % THOUSAND_STEP !== 0) {
    next = Math.ceil(next / THOUSAND_STEP) * THOUSAND_STEP;
  }

  return {
    previous: previous >= MIN_SLUG_STEPS ? previous : null,
    next: next <= MAX_SLUG_STEPS ? next : null,
  };
}

const NEARBY_OFFSET = 500;

/**
 * A couple of contextually-nearby pages (steps ± 500), clamped to the valid
 * range. Deliberately just this, not a dense grid, plain proximity to give
 * the reader somewhere to browse.
 */
export function getNearbySteps(steps: number): number[] {
  return [steps - NEARBY_OFFSET, steps + NEARBY_OFFSET].filter(
    (n) => n >= MIN_SLUG_STEPS && n <= MAX_SLUG_STEPS
  );
}

export { MIN_SLUG_STEPS, MAX_SLUG_STEPS };
