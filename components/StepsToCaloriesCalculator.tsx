"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PACE_OPTIONS,
  PaceKey,
  estimateCalories,
  estimateTimeHours,
  formatDuration,
  getPaceOption,
  lbToKg,
  stepsToCalories,
  stepsToMiles,
} from "@/lib/steps";
import { ChevronDownIcon, ClockIcon, FootprintsIcon, ScaleIcon } from "./icons";
import { StatChip, inputClass, toggleBtnClass, toggleWrapClass } from "./calculatorUi";

const STEPS_DEBOUNCE_MS = 150;

type CalcResult = {
  calories: number;
  miles: number;
  duration: string;
};

export default function StepsToCaloriesCalculator() {
  const [steps, setSteps] = useState("");
  const [debouncedSteps, setDebouncedSteps] = useState(steps);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">(
    "imperial"
  );
  const [weightLb, setWeightLb] = useState("150");
  const [weightKg, setWeightKg] = useState("68");
  const [pace, setPace] = useState<PaceKey>("average");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSteps(steps), STEPS_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [steps]);

  const stepsNum = Number(debouncedSteps);
  const validSteps =
    debouncedSteps.trim() !== "" && Number.isFinite(stepsNum) && stepsNum >= 0;

  // Zero inputs required: a flat ~0.04 kcal/step average-adult estimate.
  const standard: CalcResult | null = useMemo(() => {
    if (!validSteps) return null;
    const miles = stepsToMiles(stepsNum);
    const averagePace = getPaceOption("average");
    const hours = estimateTimeHours(miles, averagePace.mph);

    return {
      calories: stepsToCalories(stepsNum),
      miles,
      duration: formatDuration(hours),
    };
  }, [stepsNum, validSteps]);

  // Only computed once personalized: uses the real MET formula with your
  // weight and walking pace instead of the flat estimate.
  const personalized: CalcResult | null = useMemo(() => {
    if (!validSteps) return null;

    const weightKgValue =
      unitSystem === "imperial"
        ? lbToKg(Number(weightLb) || 0)
        : Number(weightKg) || 0;
    if (!Number.isFinite(weightKgValue) || weightKgValue <= 0) return null;

    const miles = stepsToMiles(stepsNum);
    const paceOption = getPaceOption(pace);
    const hours = estimateTimeHours(miles, paceOption.mph);

    return {
      calories: estimateCalories(paceOption.met, weightKgValue, hours),
      miles,
      duration: formatDuration(hours),
    };
  }, [stepsNum, validSteps, unitSystem, weightLb, weightKg, pace]);

  const isPersonalized = personalizeOpen && personalized !== null;
  const active = isPersonalized ? personalized : standard;

  return (
    <div className="w-full max-w-lg">
      <div className="overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-[0_2px_8px_rgba(33,29,24,0.05),0_20px_48px_rgba(33,29,24,0.08)]">
        <span className="block h-1.5 w-full bg-rust" aria-hidden="true" />

        <div className="flex flex-col gap-5 p-6 sm:gap-4 sm:p-6">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="calorie-steps"
              className="flex items-center gap-1.5 font-display text-xs uppercase tracking-wide text-forest sm:text-sm"
            >
              <FootprintsIcon className="h-4 w-4 shrink-0" />
              Number of steps
            </label>
            <input
              id="calorie-steps"
              type="number"
              min={0}
              inputMode="numeric"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="min-h-14 rounded-xl border border-forest/15 bg-white px-4 text-right font-mono text-2xl text-ink focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15 sm:min-h-12 sm:text-xl"
            />
          </div>

          {active ? (
            <>
              <div className="rounded-2xl bg-forest/[0.04] px-5 py-4 text-center">
                <p className="font-display text-xs uppercase tracking-wide text-forest/70">
                  Calories Burned
                </p>
                <p className="font-mono text-4xl font-semibold text-rust sm:text-5xl">
                  {active.calories.toFixed(0)} kcal
                </p>
                <p className="mt-1 text-[11px] text-ink/50">
                  {isPersonalized
                    ? "Personalized to your weight & pace"
                    : "Standard estimate (~0.04 kcal/step)"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <StatChip label="Distance" value={`${active.miles.toFixed(2)} mi`} />
                <StatChip label="Walk time" value={active.duration} />
              </div>
            </>
          ) : (
            <p className="rounded-2xl bg-forest/[0.04] px-5 py-6 text-center font-display text-forest">
              Enter your steps above to get started
            </p>
          )}

          <div className="border-t border-forest/10 pt-4">
            <button
              type="button"
              onClick={() => setPersonalizeOpen((v) => !v)}
              className="flex min-h-9 w-full items-center justify-between text-sm font-medium text-forest hover:text-rust"
            >
              <span className="flex items-center gap-1.5">
                <ScaleIcon className="h-4 w-4 shrink-0" />
                Personalize for your weight &amp; pace
              </span>
              <ChevronDownIcon
                className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                  personalizeOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {personalizeOpen && (
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-ink/70 sm:text-sm">Units</span>
                  <div className={`${toggleWrapClass} w-36`}>
                    <button
                      type="button"
                      onClick={() => setUnitSystem("imperial")}
                      aria-pressed={unitSystem === "imperial"}
                      className={toggleBtnClass(unitSystem === "imperial")}
                    >
                      US
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnitSystem("metric")}
                      aria-pressed={unitSystem === "metric"}
                      className={toggleBtnClass(unitSystem === "metric")}
                    >
                      Metric
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-ink/70 sm:text-sm">
                    Weight
                  </span>
                  <div className="flex items-center gap-1.5">
                    {unitSystem === "imperial" ? (
                      <input
                        type="number"
                        min={0}
                        aria-label="Weight, pounds"
                        placeholder="lb"
                        value={weightLb}
                        onChange={(e) => setWeightLb(e.target.value)}
                        className={`${inputClass} w-20 text-right font-mono`}
                      />
                    ) : (
                      <input
                        type="number"
                        min={0}
                        aria-label="Weight, kilograms"
                        placeholder="kg"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        className={`${inputClass} w-20 text-right font-mono`}
                      />
                    )}
                    <span className="shrink-0 text-[11px] text-ink/40">
                      {unitSystem === "imperial" ? "lb" : "kg"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="calorie-pace"
                    className="flex shrink-0 items-center gap-1.5 text-xs text-ink/70 sm:text-sm"
                  >
                    <ClockIcon className="h-4 w-4 shrink-0" />
                    Walking pace
                  </label>
                  <select
                    id="calorie-pace"
                    value={pace}
                    onChange={(e) => setPace(e.target.value as PaceKey)}
                    className={`${inputClass} w-44 text-sm sm:w-52`}
                  >
                    {PACE_OPTIONS.map((p) => (
                      <option key={p.key} value={p.key}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
