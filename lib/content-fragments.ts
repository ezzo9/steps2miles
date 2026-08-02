import { US_AVERAGE_DAILY_STEPS, stepsToCalories } from "./steps";
import { Landmark } from "./landmarks";

/**
 * Everything a fragment needs to render itself. Built once per page from
 * numbers already produced by buildSlugPageData/stepsToMiles/etc; fragments
 * never compute their own numbers, they only format the ones they're given.
 */
export type FragmentContext = {
  steps: number;
  miles: number;
  landmark: Landmark;
  secondLandmark: Landmark | null;
  percent: number;
  averagePaceDuration: string;
};

function stepsLabel(ctx: FragmentContext): string {
  return ctx.steps.toLocaleString();
}

function milesLabel(ctx: FragmentContext): string {
  return ctx.miles.toFixed(2);
}

function usAverageLabel(): string {
  return US_AVERAGE_DAILY_STEPS.toLocaleString();
}

function caloriesLabel(ctx: FragmentContext): string {
  return Math.round(stepsToCalories(ctx.steps)).toLocaleString();
}

const DAILY_GOAL_STEPS = 10000;

function goalPercentLabel(ctx: FragmentContext): string {
  return Math.round((ctx.steps / DAILY_GOAL_STEPS) * 100).toLocaleString();
}

/**
 * Shared by the closing fragments and the FAQ builder so there's a single
 * definition of what "more/less/about the same" means, instead of every
 * piece of copy re-deciding the 95-105% band on its own.
 */
export function compareToAveragePhrase(percent: number): string {
  if (percent >= 95 && percent <= 105) return "just about the same as";
  if (percent > 105) return "more than";
  return "less than";
}

// ---------------------------------------------------------------------------
// Openings: state the steps -> miles conversion. Eight distinct sentence
// shapes (question, inversion, imperative, conditional, fragment...), not
// eight synonym-swapped copies of the same sentence.
// ---------------------------------------------------------------------------

const OPENINGS: Array<(ctx: FragmentContext) => string> = [
  (ctx) =>
    `Walking ${stepsLabel(ctx)} steps works out to about ${milesLabel(
      ctx
    )} miles.`,

  (ctx) =>
    `If you've logged ${stepsLabel(
      ctx
    )} steps today, that's roughly ${milesLabel(ctx)} miles of ground covered.`,

  (ctx) =>
    `How far is ${stepsLabel(ctx)} steps? About ${milesLabel(
      ctx
    )} miles, using the standard 2,000-steps-per-mile conversion.`,

  (ctx) =>
    `${milesLabel(ctx)} miles: that's the distance behind ${stepsLabel(
      ctx
    )} steps, at 2,000 steps to the mile.`,

  (ctx) =>
    `Put ${stepsLabel(
      ctx
    )} steps on a tracker and the readout comes to about ${milesLabel(
      ctx
    )} miles.`,

  (ctx) =>
    `${stepsLabel(ctx)} steps. At the standard conversion rate, that's ${milesLabel(
      ctx
    )} miles.`,

  (ctx) =>
    `Covering ${stepsLabel(
      ctx
    )} steps in a day means covering close to ${milesLabel(
      ctx
    )} miles of ground.`,

  (ctx) =>
    `Convert ${stepsLabel(ctx)} steps to distance and you land on approximately ${milesLabel(
      ctx
    )} miles.`,
];

// ---------------------------------------------------------------------------
// Transitions: introduce the closest landmark comparison. Landmark names in
// landmarks.json are lowercase noun phrases (e.g. "a lap around a standard
// track"), so every template is worded to read naturally with one dropped in.
// ---------------------------------------------------------------------------

const TRANSITIONS: Array<(ctx: FragmentContext) => string> = [
  (ctx) => `To put that in perspective, it's close to ${ctx.landmark.name}.`,

  (ctx) => `Picture ${ctx.landmark.name}: that's roughly the same distance.`,

  (ctx) => `For a real-world comparison, think of ${ctx.landmark.name}.`,

  (ctx) => `That distance lines up closely with ${ctx.landmark.name}.`,

  (ctx) => `A useful way to picture it: ${ctx.landmark.name}.`,

  (ctx) =>
    `Distance-wise, that's in the same neighborhood as ${ctx.landmark.name}.`,

  (ctx) =>
    `If a landmark helps more than a number, that's about ${ctx.landmark.name}.`,

  (ctx) => `Here's a familiar reference point: ${ctx.landmark.name}.`,
];

// ---------------------------------------------------------------------------
// Closings: four reference the NHANES daily-average comparison, the other
// four cover a different metric entirely (calories, walking time, the
// 10,000-step goal, both benchmarks at once) so pages vary in what they say,
// not just how they phrase the same stat.
// ---------------------------------------------------------------------------

const CLOSINGS: Array<(ctx: FragmentContext) => string> = [
  (ctx) =>
    `That's about ${ctx.percent}% of the ${usAverageLabel()} steps the average American walks daily, per NHANES data.`,

  (ctx) =>
    `At a standard 0.04-calories-per-step estimate, that's also roughly ${caloriesLabel(
      ctx
    )} calories burned along the way. Actual burn shifts with pace and body weight.`,

  (ctx) =>
    `NHANES accelerometer data puts the average American at ${usAverageLabel()} steps a day. This step count comes out to about ${
      ctx.percent
    }% of that.`,

  (ctx) =>
    `Time on your feet: at an average 3 mph walking pace, that's about ${ctx.averagePaceDuration}.`,

  (ctx) =>
    `The average American, per NHANES data, logs ${usAverageLabel()} steps a day. This step count is ${compareToAveragePhrase(
      ctx.percent
    )} that, at about ${ctx.percent}%.`,

  (ctx) =>
    `Measured against the popular 10,000-step daily goal instead of the national average, this comes out to about ${goalPercentLabel(
      ctx
    )}%.`,

  (ctx) =>
    `That's roughly ${ctx.percent}% of what NHANES data shows the average American walks each day (${usAverageLabel()} steps).`,

  (ctx) =>
    `Two benchmarks worth knowing: about ${
      ctx.percent
    }% of the NHANES national average, and ${goalPercentLabel(
      ctx
    )}% of the popular 10,000-step daily goal.`,
];

// ---------------------------------------------------------------------------
// Title tag + meta description templates, paired by the same index.
// ---------------------------------------------------------------------------

const TITLE_TEMPLATES: Array<(ctx: FragmentContext) => string> = [
  (ctx) => `${stepsLabel(ctx)} Steps to Miles | How Far Is It?`,
  (ctx) => `${stepsLabel(ctx)} Steps in Miles: Full Conversion`,
  (ctx) => `How Many Miles Is ${stepsLabel(ctx)} Steps?`,
  (ctx) => `${stepsLabel(ctx)} Steps to Miles Calculator & Conversion`,
];

const DESCRIPTION_TEMPLATES: Array<(ctx: FragmentContext) => string> = [
  (ctx) =>
    `${stepsLabel(ctx)} steps equals ${milesLabel(
      ctx
    )} miles at the standard 2,000-steps-per-mile rate. See a real-world distance comparison and how it stacks up against the U.S. daily step average.`,

  (ctx) =>
    `Convert ${stepsLabel(ctx)} steps to miles instantly: ${milesLabel(
      ctx
    )} miles. Includes a real-world distance comparison and NHANES step data context.`,

  (ctx) =>
    `${stepsLabel(ctx)} steps works out to about ${milesLabel(
      ctx
    )} miles. Get the exact conversion, a landmark comparison, and how it compares to average daily steps.`,

  (ctx) =>
    `Wondering how far ${stepsLabel(ctx)} steps is? It's ${milesLabel(
      ctx
    )} miles. See the math, a real-world comparison, and how that compares to the average American's day.`,
];

// ---------------------------------------------------------------------------
// Selection: pure modulo math on the step count. Same number always produces
// the same fragment indices, no randomness, no state, no I/O.
//
// The opening index uses steps % 8 directly. Transitions and closings use
// steps * 5 and steps * 3 respectively; both multipliers are coprime with 8,
// so each cycles through all 8 fragments as steps increases, but out of
// lockstep with the opening (and with each other). Without that, opening[i]
// would always pair with transition[i] and closing[i], and the 8x8x8 = 512
// possible combinations would collapse down to 8.
// ---------------------------------------------------------------------------

const FRAGMENT_COUNT = 8;
const TRANSITION_MULTIPLIER = 5;
const CLOSING_MULTIPLIER = 3;

export type FragmentSelection = {
  opening: string;
  transition: string;
  closing: string;
  openingIndex: number;
  transitionIndex: number;
  closingIndex: number;
};

export function selectFragments(ctx: FragmentContext): FragmentSelection {
  const openingIndex = ctx.steps % FRAGMENT_COUNT;
  const transitionIndex = (ctx.steps * TRANSITION_MULTIPLIER) % FRAGMENT_COUNT;
  const closingIndex = (ctx.steps * CLOSING_MULTIPLIER) % FRAGMENT_COUNT;

  return {
    opening: OPENINGS[openingIndex](ctx),
    transition: TRANSITIONS[transitionIndex](ctx),
    closing: CLOSINGS[closingIndex](ctx),
    openingIndex,
    transitionIndex,
    closingIndex,
  };
}

export function assembleParagraph(ctx: FragmentContext): string {
  const { opening, transition, closing } = selectFragments(ctx);
  return `${opening} ${transition} ${closing}`;
}

export function selectMetaVariant(ctx: FragmentContext): {
  title: string;
  description: string;
} {
  const index = ctx.steps % TITLE_TEMPLATES.length;
  return {
    title: TITLE_TEMPLATES[index](ctx),
    description: DESCRIPTION_TEMPLATES[index](ctx),
  };
}
