import {
  US_AVERAGE_DAILY_STEPS,
  estimateTimeHours,
  formatDuration,
  getPaceOption,
  percentOfUsAverage,
  stepsToCalories,
  stepsToMiles,
} from "./steps";
import { Landmark, findClosestLandmarks } from "./landmarks";
import { Milestone, getMatchingMilestone, isRoundNumber } from "./milestones";
import {
  FragmentContext,
  assembleParagraph,
  compareToAveragePhrase,
  selectMetaVariant,
} from "./content-fragments";

export type SlugPageData = {
  steps: number;
  miles: number;
  percent: number;
  landmarks: Landmark[];
  isRound: boolean;
  matchingMilestone: Milestone | null;
  averagePaceDuration: string;
};

export function buildSlugPageData(steps: number): SlugPageData {
  const miles = stepsToMiles(steps);
  const percent = percentOfUsAverage(steps);
  const landmarks = findClosestLandmarks(miles, 2);
  const averagePace = getPaceOption("average");
  const averagePaceDuration = formatDuration(
    estimateTimeHours(miles, averagePace.mph)
  );

  return {
    steps,
    miles,
    percent,
    landmarks,
    isRound: isRoundNumber(steps),
    matchingMilestone: getMatchingMilestone(steps),
    averagePaceDuration,
  };
}

/**
 * The single conversion point from page-level data to what the fragment
 * system consumes. Every piece of generated copy on a slug page (the main
 * paragraph, the meta title/description, the FAQ answers) goes through this
 * so there's one content system, not a fragment-based one plus a second
 * hand-written one.
 */
function toFragmentContext(data: SlugPageData): FragmentContext {
  return {
    steps: data.steps,
    miles: data.miles,
    landmark: data.landmarks[0],
    secondLandmark: data.landmarks[1] ?? null,
    percent: data.percent,
    averagePaceDuration: data.averagePaceDuration,
  };
}

export function getParagraphVariant(data: SlugPageData): string {
  return assembleParagraph(toFragmentContext(data));
}

/** Extra paragraph shown only on round-number pages (x,000 / x,500). */
export function getRoundNumberBonusParagraph(data: SlugPageData): string {
  return `Because ${data.steps.toLocaleString()} is a round number, it's one people search for directly, often straight off a fitness tracker goal or a step challenge. At an average walking pace of about 3 mph, ${data.steps.toLocaleString()} steps takes roughly ${
    data.averagePaceDuration
  } to walk, steady, without stopping.`;
}

export function getMetaVariant(data: SlugPageData): {
  title: string;
  description: string;
} {
  return selectMetaVariant(toFragmentContext(data));
}

export type KeepItUpRow = {
  label: string;
  steps: number;
  miles: number;
  calories: number;
};

const KEEP_IT_UP_PERIODS: { label: string; days: number }[] = [
  { label: "Weekly", days: 7 },
  { label: "Monthly", days: 30 },
  { label: "Yearly", days: 365 },
];

/** If this step count were a daily habit, what a week/month/year of it adds up to. Pure multiplication of numbers already on the page, not a new estimate. */
export function buildKeepItUpTable(data: SlugPageData): KeepItUpRow[] {
  const dailyCalories = stepsToCalories(data.steps);

  return KEEP_IT_UP_PERIODS.map(({ label, days }) => ({
    label,
    steps: data.steps * days,
    miles: data.miles * days,
    calories: dailyCalories * days,
  }));
}

export type SlugFaqItem = { question: string; answer: string };

export function buildSlugFaq(data: SlugPageData): SlugFaqItem[] {
  const stepsLabel = data.steps.toLocaleString();

  return [
    {
      question: `Is ${stepsLabel} steps a lot?`,
      answer: `It's ${compareToAveragePhrase(data.percent)} the average U.S. adult walks in a day. ${stepsLabel} steps is about ${
        data.percent
      }% of the NHANES-measured daily average of ${US_AVERAGE_DAILY_STEPS.toLocaleString()} steps.`,
    },
    {
      question: `How long does it take to walk ${stepsLabel} steps?`,
      answer: `At an average walking pace of about 3 mph, ${stepsLabel} steps takes roughly ${data.averagePaceDuration}. Walking slower or faster will shift that time up or down.`,
    },
  ];
}
