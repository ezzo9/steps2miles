import { estimateStepsPerMile } from "./steps";

// Shared by MilesToStepsCalculator (interactive short/average/tall presets)
// and the slug pages' stride-by-height table, one source of truth for what
// "short/average/tall" mean in inches so the two never drift apart.
export type StridePresetMode = "short" | "average" | "tall";

export const STRIDE_PRESETS: {
  mode: StridePresetMode;
  label: string;
  heightIn: number;
}[] = [
  { mode: "short", label: "Short (~5'2\")", heightIn: 62 },
  { mode: "average", label: "Average (~5'7\")", heightIn: 67 },
  { mode: "tall", label: "Tall (~6'2\")", heightIn: 74 },
];

/** Steps-per-mile at a given height, averaged across the male/female stride formulas (no sex specified). */
export function neutralStepsPerMile(heightIn: number): number {
  return (
    (estimateStepsPerMile(heightIn, "female") +
      estimateStepsPerMile(heightIn, "male")) /
    2
  );
}

export type StrideDistanceRow = {
  label: string;
  miles: number;
};

/** How far a fixed step count reaches for each stride preset, genuinely different numbers for every step count, not a static reference table. */
export function buildStrideDistanceTable(steps: number): StrideDistanceRow[] {
  return STRIDE_PRESETS.map((preset) => ({
    label: preset.label,
    miles: steps / neutralStepsPerMile(preset.heightIn),
  }));
}
