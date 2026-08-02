export const DEFAULT_STEPS_PER_MILE = 2000;

export function stepsToMiles(
  steps: number,
  stepsPerMile: number = DEFAULT_STEPS_PER_MILE
): number {
  return steps / stepsPerMile;
}

export function milesToSteps(
  miles: number,
  stepsPerMile: number = DEFAULT_STEPS_PER_MILE
): number {
  return miles * stepsPerMile;
}

export function stepsToCalories(steps: number): number {
  return steps * 0.04;
}

export const COMMON_STEP_COUNTS = [
  1000, 2000, 5000, 7500, 10000, 12500, 15000, 17500, 20000, 22500, 25000,
  27500, 30000,
];

export const MILES_PER_KM = 0.621371;
export const KM_PER_MILE = 1.60934;

export type BiologicalSex = "female" | "male";

/**
 * Step-length formula used by pedometer makers (e.g. Omron/ACE):
 * step length (inches) = height (inches) x 0.413 (women) or 0.415 (men).
 * Converted to feet, then steps per mile = 5280 / step length in feet.
 */
export function estimateStepsPerMile(
  heightInches: number,
  sex: BiologicalSex
): number {
  const multiplier = sex === "female" ? 0.413 : 0.415;
  const stepLengthFeet = (heightInches * multiplier) / 12;
  return 5280 / stepLengthFeet;
}

export function feetInchesToInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}

export function cmToInches(cm: number): number {
  return cm / 2.54;
}

export function lbToKg(lb: number): number {
  return lb / 2.20462;
}

export type PaceKey = "slow" | "average" | "brisk" | "running";

export type PaceOption = {
  key: PaceKey;
  label: string;
  mph: number;
  met: number;
};

export const PACE_OPTIONS: PaceOption[] = [
  { key: "slow", label: "Slow (~2 mph)", mph: 2, met: 2.8 },
  { key: "average", label: "Average (~3 mph)", mph: 3, met: 3.5 },
  { key: "brisk", label: "Brisk (~4 mph)", mph: 4, met: 5.0 },
  { key: "running", label: "Running (~6 mph)", mph: 6, met: 9.8 },
];

export function getPaceOption(key: PaceKey): PaceOption {
  return PACE_OPTIONS.find((p) => p.key === key) ?? PACE_OPTIONS[1];
}

export function estimateTimeHours(miles: number, paceMph: number): number {
  return miles / paceMph;
}

export function formatDuration(hours: number): string {
  if (!Number.isFinite(hours) || hours < 0) return "-";
  const totalMinutes = Math.round(hours * 60);
  if (totalMinutes < 1) return "< 1 min";
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

/** Calories = MET x weight (kg) x duration (hours). */
export function estimateCalories(
  met: number,
  weightKg: number,
  hours: number
): number {
  return met * weightKg * hours;
}

export function hoursToMinutes(hours: number): number {
  return Math.round(hours * 60);
}

/**
 * U.S. adult average daily step count, from NHANES 2011-2014 accelerometer
 * data (National Health and Nutrition Examination Survey).
 */
export const US_AVERAGE_DAILY_STEPS = 8818;

export function percentOfUsAverage(steps: number): number {
  return Math.round((steps / US_AVERAGE_DAILY_STEPS) * 100);
}
