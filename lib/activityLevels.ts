export type ActivityLevel = {
  key: string;
  label: string;
  rangeLabel: string;
  minSteps: number;
  maxSteps: number | null;
};

// Standard Tudor-Locke step-count activity classification.
export const ACTIVITY_LEVELS: ActivityLevel[] = [
  {
    key: "sedentary",
    label: "Sedentary",
    rangeLabel: "Under 5,000",
    minSteps: 0,
    maxSteps: 4999,
  },
  {
    key: "low-active",
    label: "Low Active",
    rangeLabel: "5,000–7,499",
    minSteps: 5000,
    maxSteps: 7499,
  },
  {
    key: "somewhat-active",
    label: "Somewhat Active",
    rangeLabel: "7,500–9,999",
    minSteps: 7500,
    maxSteps: 9999,
  },
  {
    key: "active",
    label: "Active",
    rangeLabel: "10,000–12,499",
    minSteps: 10000,
    maxSteps: 12499,
  },
  {
    key: "highly-active",
    label: "Highly Active",
    rangeLabel: "12,500+",
    minSteps: 12500,
    maxSteps: null,
  },
];

export function getActivityLevel(steps: number): ActivityLevel {
  return (
    ACTIVITY_LEVELS.find(
      (level) =>
        steps >= level.minSteps &&
        (level.maxSteps === null || steps <= level.maxSteps)
    ) ?? ACTIVITY_LEVELS[ACTIVITY_LEVELS.length - 1]
  );
}
