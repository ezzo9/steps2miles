import { COMMON_STEP_COUNTS, stepsToMiles } from "./steps";

// EPA-420-F-23-014 (2023 update, "Greenhouse Gas Emissions from a Typical
// Passenger Vehicle"): 400 g CO2 per mile is the national average passenger
// vehicle tailpipe figure, and 4.6 metric tons (4,600,000 g) is the average
// annual footprint of a passenger vehicle, from that same report, so the two
// figures are internally consistent with each other.
export const CO2_GRAMS_PER_MILE = 400;
export const AVERAGE_CAR_ANNUAL_FOOTPRINT_GRAMS = 4_600_000;

export const GRAMS_PER_LB = 453.592;
export const GRAMS_PER_KG = 1000;
const DAYS_PER_YEAR = 365;

export function milesToCarbonGrams(miles: number): number {
  return miles * CO2_GRAMS_PER_MILE;
}

export function gramsToLbs(grams: number): number {
  return grams / GRAMS_PER_LB;
}

export function gramsToKg(grams: number): number {
  return grams / GRAMS_PER_KG;
}

export function percentOfAverageCarFootprint(grams: number): number {
  return (grams / AVERAGE_CAR_ANNUAL_FOOTPRINT_GRAMS) * 100;
}

export type CarbonResult = {
  grams: number;
  lbs: number;
  kg: number;
};

/** CO2 that would have been emitted driving this same distance instead of walking it. */
export function buildCarbonResult(miles: number): CarbonResult {
  const grams = milesToCarbonGrams(miles);
  return { grams, lbs: gramsToLbs(grams), kg: gramsToKg(grams) };
}

export type AnnualCarbonResult = CarbonResult & {
  percentOfCarFootprint: number;
};

/** Same daily distance, sustained every day for a year. */
export function buildAnnualCarbonResult(dailyMiles: number): AnnualCarbonResult {
  const dailyGrams = milesToCarbonGrams(dailyMiles);
  const grams = dailyGrams * DAYS_PER_YEAR;
  return {
    grams,
    lbs: gramsToLbs(grams),
    kg: gramsToKg(grams),
    percentOfCarFootprint: percentOfAverageCarFootprint(grams),
  };
}

export type CarbonWorkedExample = {
  steps: number;
  miles: number;
  daily: CarbonResult;
  annual: AnnualCarbonResult;
};

const WORKED_EXAMPLE_STEPS = 10000;

/** The reference walk shown in the "where these numbers come from" explainer, same 10,000-step default used elsewhere on the site. */
export function buildCarbonWorkedExample(milesForSteps: number): CarbonWorkedExample {
  return {
    steps: WORKED_EXAMPLE_STEPS,
    miles: milesForSteps,
    daily: buildCarbonResult(milesForSteps),
    annual: buildAnnualCarbonResult(milesForSteps),
  };
}

export type CarbonReferenceRow = {
  steps: number;
  daily: CarbonResult;
  annual: AnnualCarbonResult;
};

/** CO2 saved at each of the site's common reference step counts, same list used on the homepage's quick-conversion table. */
export function buildCarbonReferenceTable(): CarbonReferenceRow[] {
  return COMMON_STEP_COUNTS.map((steps) => {
    const miles = stepsToMiles(steps);
    return {
      steps,
      daily: buildCarbonResult(miles),
      annual: buildAnnualCarbonResult(miles),
    };
  });
}

export type CarbonFaqItem = { question: string; answer: string };

/** FAQ content, every number here is computed from the same constants as the calculator, not a second hand-typed source of truth. */
export function buildCarbonFaq(): CarbonFaqItem[] {
  const example = buildCarbonWorkedExample(stepsToMiles(WORKED_EXAMPLE_STEPS));
  const annualTons = (
    AVERAGE_CAR_ANNUAL_FOOTPRINT_GRAMS / 1_000_000
  ).toFixed(1);

  return [
    {
      question: "How is CO2 saved actually calculated?",
      answer: `Distance walked, in miles, multiplied by ${CO2_GRAMS_PER_MILE} grams. That figure is the EPA's national average tailpipe emissions per mile for a passenger vehicle. For example, ${example.steps.toLocaleString()} steps is ${example.miles.toFixed(
        2
      )} miles, so ${example.miles.toFixed(2)} times ${CO2_GRAMS_PER_MILE} comes out to ${Math.round(
        example.daily.grams
      ).toLocaleString()} grams.`,
    },
    {
      question: "Is this my actual personal carbon footprint?",
      answer:
        "No. It's an estimate of what an average gas-powered car would have emitted driving the same distance, not a measurement of anything you actually did. It assumes the trip would have happened by car at all, which isn't always true, a lot of walking replaces no drive whatsoever.",
    },
    {
      question: "What if I actually drive an electric or hybrid car?",
      answer:
        "Then your real savings would be lower than this estimate. The 400g figure is a fleet-wide average dominated by gas-powered vehicles, so it doesn't represent any single car, electric, hybrid, or otherwise. There isn't a reliable single EPA figure for \"average EV emissions\" that's directly comparable, so this calculator sticks to the one well-documented number instead of guessing at others.",
    },
    {
      question: "Why compare to a full year of driving?",
      answer: `The ${annualTons}-metric-ton figure is the EPA's average annual footprint for one passenger vehicle, from the same report as the per-mile number. Comparing a habit's yearly total against a full car-year of emissions gives a sense of scale that a single day's number can't.`,
    },
    {
      question: "Does this include how the car was manufactured?",
      answer:
        "No, only tailpipe emissions from driving. Manufacturing a vehicle, refining fuel, and other lifecycle emissions aren't part of the EPA figure this calculator uses, so the real difference between walking and driving is larger than what's shown here, not smaller.",
    },
  ];
}
