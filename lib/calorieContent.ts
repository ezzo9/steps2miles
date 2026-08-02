import {
  PACE_OPTIONS,
  PaceOption,
  estimateCalories,
  estimateTimeHours,
  formatDuration,
  getPaceOption,
  lbToKg,
  stepsToCalories,
  stepsToMiles,
} from "./steps";

// Every number on the calories page is derived from these functions at
// request/build time, not written by hand, so the reference tables and the
// FAQ answers can never drift out of sync with the calculator itself.

export const REFERENCE_STEP_COUNTS = [2000, 5000, 7500, 10000, 15000, 20000];
export const REFERENCE_WEIGHTS_LB = [130, 150, 180, 210];

export type CalorieByWeightRow = {
  steps: number;
  caloriesByWeight: number[]; // same order as REFERENCE_WEIGHTS_LB
};

/** Calories burned at each reference step count, across a spread of body weights, at an average walking pace. */
export function buildCalorieByWeightTable(): CalorieByWeightRow[] {
  const averagePace = getPaceOption("average");

  return REFERENCE_STEP_COUNTS.map((steps) => {
    const miles = stepsToMiles(steps);
    const hours = estimateTimeHours(miles, averagePace.mph);
    const caloriesByWeight = REFERENCE_WEIGHTS_LB.map((lb) =>
      estimateCalories(averagePace.met, lbToKg(lb), hours)
    );
    return { steps, caloriesByWeight };
  });
}

export type PaceCalorieRow = {
  pace: PaceOption;
  caloriesPerHour: number;
};

/** Calories burned in one hour of walking at each pace option, for a given body weight. */
export function buildPaceCalorieTable(weightLb: number): PaceCalorieRow[] {
  const weightKg = lbToKg(weightLb);
  return PACE_OPTIONS.map((pace) => ({
    pace,
    caloriesPerHour: estimateCalories(pace.met, weightKg, 1),
  }));
}

export type WorkedExample = {
  steps: number;
  weightLb: number;
  weightKg: number;
  paceLabel: string;
  met: number;
  miles: number;
  hours: number;
  duration: string;
  calories: number;
};

const WORKED_EXAMPLE_STEPS = 10000;
const WORKED_EXAMPLE_WEIGHT_LB = 150;

/** The exact numbers plugged into the MET formula for one reference walk, used by the "3 steps" explainer. */
export function buildWorkedExample(): WorkedExample {
  const averagePace = getPaceOption("average");
  const weightKg = lbToKg(WORKED_EXAMPLE_WEIGHT_LB);
  const miles = stepsToMiles(WORKED_EXAMPLE_STEPS);
  const hours = estimateTimeHours(miles, averagePace.mph);
  const calories = estimateCalories(averagePace.met, weightKg, hours);

  return {
    steps: WORKED_EXAMPLE_STEPS,
    weightLb: WORKED_EXAMPLE_WEIGHT_LB,
    weightKg,
    paceLabel: averagePace.label,
    met: averagePace.met,
    miles,
    hours,
    duration: formatDuration(hours),
    calories,
  };
}

export type CalorieFaqItem = { question: string; answer: string };

const FAQ_REFERENCE_STEPS = 10000;
const FAQ_REFERENCE_WEIGHT_LB = 150;

export function buildCalorieFaq(): CalorieFaqItem[] {
  const flatKcal = Math.round(stepsToCalories(FAQ_REFERENCE_STEPS));

  const averagePace = getPaceOption("average");
  const miles = stepsToMiles(FAQ_REFERENCE_STEPS);
  const hours = estimateTimeHours(miles, averagePace.mph);
  const personalizedKcal = Math.round(
    estimateCalories(averagePace.met, lbToKg(FAQ_REFERENCE_WEIGHT_LB), hours)
  );

  const briskPace = getPaceOption("brisk");
  const briskKcalPerHour = Math.round(
    estimateCalories(briskPace.met, lbToKg(FAQ_REFERENCE_WEIGHT_LB), 1)
  );
  const slowKcalPerHour = Math.round(
    estimateCalories(
      getPaceOption("slow").met,
      lbToKg(FAQ_REFERENCE_WEIGHT_LB),
      1
    )
  );

  const stepsLabel = FAQ_REFERENCE_STEPS.toLocaleString();

  return [
    {
      question: `How many calories does ${stepsLabel} steps burn?`,
      answer: `Using the flat average-adult estimate of about 0.04 kcal per step, ${stepsLabel} steps works out to roughly ${flatKcal} kcal. Factor in an actual body weight, like ${FAQ_REFERENCE_WEIGHT_LB} lb walking at an average pace, and it comes out closer to ${personalizedKcal} kcal. Heavier bodies and faster paces burn more; lighter bodies and slower paces burn less.`,
    },
    {
      question: "Does walking pace actually change how many calories you burn?",
      answer: `Yes, meaningfully. Calorie burn scales with MET (metabolic equivalent), and MET rises with speed. For a ${FAQ_REFERENCE_WEIGHT_LB} lb adult, an hour at a slow pace burns about ${slowKcalPerHour} kcal, while an hour at a brisk pace burns about ${briskKcalPerHour} kcal, same amount of time, closer to double the burn.`,
    },
    {
      question: "Why do heavier people burn more calories walking the same steps?",
      answer: "Because the standard calorie formula is MET × body weight in kilograms × time. Weight is directly in the equation, so moving more mass the same distance takes more energy. It's not a guess or a stereotype, it's just the physics of moving a heavier body.",
    },
    {
      question: "Is a steps-based calorie estimate accurate?",
      answer: "It's a reasonable estimate, not a lab measurement. The flat 0.04 kcal/step figure ignores your weight and pace entirely. The personalized estimate above (using your weight and walking pace) is meaningfully more accurate, but still doesn't account for incline, terrain, or individual metabolic differences. Treat it as a solid ballpark, not a precise reading.",
    },
  ];
}
