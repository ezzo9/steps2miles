import { estimateStepsPerMile, milesToSteps } from "./steps";

// Every number here comes from the same conversion functions the calculator
// uses, computed at request/build time, no hand-typed figures to drift out
// of sync.

export type ReferenceDistance = { label: string; miles: number; steps: number };

const REFERENCE_DISTANCES_MI: { label: string; miles: number }[] = [
  { label: "1 Mile", miles: 1 },
  { label: "5K", miles: 3.1 },
  { label: "10K", miles: 6.2 },
  { label: "10 Miles", miles: 10 },
  { label: "Half Marathon", miles: 13.1 },
  { label: "Marathon", miles: 26.2 },
];

/** Steps for common race/round distances, at the standard 2,000 steps/mile. */
export function buildReferenceDistances(): ReferenceDistance[] {
  return REFERENCE_DISTANCES_MI.map((d) => ({
    ...d,
    steps: Math.round(milesToSteps(d.miles)),
  }));
}

export type StrideComparisonRow = {
  label: string;
  heightLabel: string;
  stepsPerMile: number;
};

const STRIDE_HEIGHTS_IN = [
  { label: "Short stride", heightLabel: "~5'2\"", heightIn: 62 },
  { label: "Average stride", heightLabel: "~5'7\"", heightIn: 67 },
  { label: "Tall stride", heightLabel: "~6'2\"", heightIn: 74 },
];

/** Averages the male/female stride formulas for a sex-neutral estimate at a given height. */
function neutralStepsPerMile(heightIn: number): number {
  return (
    (estimateStepsPerMile(heightIn, "female") +
      estimateStepsPerMile(heightIn, "male")) /
    2
  );
}

export function buildStrideComparison(): StrideComparisonRow[] {
  return STRIDE_HEIGHTS_IN.map((h) => ({
    label: h.label,
    heightLabel: h.heightLabel,
    stepsPerMile: Math.round(neutralStepsPerMile(h.heightIn)),
  }));
}

export type FormulaExample = {
  heightIn: number;
  heightLabel: string;
  femaleStepsPerMile: number;
  maleStepsPerMile: number;
};

const FORMULA_EXAMPLE_HEIGHT_IN = 67; // 5'7"

/** Plugs one reference height into the real stride formula so the derivation in the research section always matches the live math. */
export function buildFormulaExample(): FormulaExample {
  return {
    heightIn: FORMULA_EXAMPLE_HEIGHT_IN,
    heightLabel: "5'7\"",
    femaleStepsPerMile: Math.round(
      estimateStepsPerMile(FORMULA_EXAMPLE_HEIGHT_IN, "female")
    ),
    maleStepsPerMile: Math.round(
      estimateStepsPerMile(FORMULA_EXAMPLE_HEIGHT_IN, "male")
    ),
  };
}

export type MilesToStepsFaqItem = { question: string; answer: string };

export function buildMilesToStepsFaq(): MilesToStepsFaqItem[] {
  const stride = buildStrideComparison();
  const short = stride[0];
  const tall = stride[2];
  const distances = buildReferenceDistances();
  const fiveK = distances.find((d) => d.label === "5K")!;
  const marathon = distances.find((d) => d.label === "Marathon")!;
  const strideGap = Math.abs(short.stepsPerMile - tall.stepsPerMile);
  const example = buildFormulaExample();

  return [
    {
      question: "How many steps are in a mile?",
      answer: `About 2,000 for an average adult stride, but it depends a lot on height. A shorter stride (${short.heightLabel}) needs closer to ${short.stepsPerMile.toLocaleString()} steps per mile, while a taller stride (${tall.heightLabel}) needs closer to ${tall.stepsPerMile.toLocaleString()}.`,
    },
    {
      question: "How many steps is a 5K or a marathon?",
      answer: `At the standard 2,000 steps per mile, a 5K (${fiveK.miles} mi) is about ${fiveK.steps.toLocaleString()} steps, and a full marathon (${marathon.miles} mi) is about ${marathon.steps.toLocaleString()} steps. See the table above for 10K, 10 miles, and a half marathon too.`,
    },
    {
      question: "Does stride length really change the number that much?",
      answer: `Yes. Over a single mile, a short stride and a tall stride land about ${strideGap.toLocaleString()} steps apart. Stack that over a 10-mile training run and it is a difference of several thousand steps, which is why the calculator lets you pick a stride instead of assuming one.`,
    },
    {
      question: "Where does the stride formula actually come from?",
      answer: `It's the height-to-stride formula pedometer makers have used for years, popularized by Omron and the American Council on Exercise: stride length in inches equals height times 0.413 for women or 0.415 for men. At ${example.heightLabel}, that's ${example.femaleStepsPerMile.toLocaleString()} steps per mile for a woman and ${example.maleStepsPerMile.toLocaleString()} for a man. It's an industry formula, not a clinical study, so treat it as a solid estimate rather than a lab measurement.`,
    },
    {
      question: "Does walking speed change how many steps you take per mile?",
      answer: "Yes, and this calculator doesn't account for it. Gait research is clear that people naturally take longer, faster strides as they speed up, so this fixed-stride math is most accurate at a normal walking pace. Jog or run the same distance and your real steps per mile will come in lower than what's shown here.",
    },
    {
      question: "Can I use this for running instead of walking?",
      answer: "You can, but it'll be less precise. Running strides are longer and vary more from person to person than walking strides. If you know your own running stride, use the \"Custom steps/mile\" option in the calculator instead of one of the height presets, which are built around walking pace.",
    },
    {
      question: "Why convert miles to steps instead of steps to miles?",
      answer: "Training plans, race distances, and doctor's recommendations are usually given in miles, but most fitness trackers and daily step goals are set in steps. This flips a target distance into the step count you actually need to hit.",
    },
  ];
}
