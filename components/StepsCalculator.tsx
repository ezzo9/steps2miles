"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BiologicalSex,
  DEFAULT_STEPS_PER_MILE,
  KM_PER_MILE,
  PACE_OPTIONS,
  PaceKey,
  US_AVERAGE_DAILY_STEPS,
  cmToInches,
  estimateCalories,
  estimateStepsPerMile,
  estimateTimeHours,
  feetInchesToInches,
  formatDuration,
  getPaceOption,
  lbToKg,
  percentOfUsAverage,
  stepsToCalories,
  stepsToMiles,
} from "@/lib/steps";
import { ChevronDownIcon, ClockIcon, FootprintsIcon, PersonIcon } from "./icons";
import ShareResult from "./ShareResult";
import { StatChip, inputClass, toggleBtnClass, toggleWrapClass } from "./calculatorUi";

const STEPS_DEBOUNCE_MS = 150;

type CalcResult = {
  miles: number;
  km: number;
  calories: number;
  duration: string;
  percent: number;
};

export default function StepsCalculator() {
  const [steps, setSteps] = useState("");
  const [debouncedSteps, setDebouncedSteps] = useState(steps);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [sex, setSex] = useState<BiologicalSex>("female");
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">(
    "imperial"
  );
  const [heightFeet, setHeightFeet] = useState("5");
  const [heightInches, setHeightInches] = useState("6");
  const [heightCm, setHeightCm] = useState("168");
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

  // Zero inputs required: distance, time, and calories using the standard
  // 2,000-steps-per-mile conversion and an average walking pace.
  const standard: CalcResult | null = useMemo(() => {
    if (!validSteps) return null;
    const miles = stepsToMiles(stepsNum);
    const averagePace = getPaceOption("average");
    const hours = estimateTimeHours(miles, averagePace.mph);

    return {
      miles,
      km: miles * KM_PER_MILE,
      calories: stepsToCalories(stepsNum),
      duration: formatDuration(hours),
      percent: percentOfUsAverage(stepsNum),
    };
  }, [stepsNum, validSteps]);

  // Only computed once the user opts into personalizing: derives stride from
  // height/sex instead of the flat default.
  const personalized: CalcResult | null = useMemo(() => {
    if (!validSteps) return null;

    const heightInchesTotal =
      unitSystem === "imperial"
        ? feetInchesToInches(Number(heightFeet) || 0, Number(heightInches) || 0)
        : cmToInches(Number(heightCm) || 0);
    if (!Number.isFinite(heightInchesTotal) || heightInchesTotal <= 0) {
      return null;
    }

    const stepsPerMile = estimateStepsPerMile(heightInchesTotal, sex);
    const weightKgValue =
      unitSystem === "imperial"
        ? lbToKg(Number(weightLb) || 0)
        : Number(weightKg) || 0;

    const miles = stepsToMiles(stepsNum, stepsPerMile);
    const paceOption = getPaceOption(pace);
    const hours = estimateTimeHours(miles, paceOption.mph);

    return {
      miles,
      km: miles * KM_PER_MILE,
      calories: estimateCalories(paceOption.met, weightKgValue, hours),
      duration: formatDuration(hours),
      percent: percentOfUsAverage(stepsNum),
    };
  }, [
    stepsNum,
    validSteps,
    sex,
    unitSystem,
    heightFeet,
    heightInches,
    heightCm,
    weightLb,
    weightKg,
    pace,
  ]);

  const isPersonalized = personalizeOpen && personalized !== null;
  const active = isPersonalized ? personalized : standard;

  return (
    <div className="w-full max-w-lg">
      <div className="overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-[0_2px_8px_rgba(33,29,24,0.05),0_20px_48px_rgba(33,29,24,0.08)]">
        <span className="block h-1.5 w-full bg-rust" aria-hidden="true" />

        <div className="flex flex-col gap-5 p-6 sm:gap-4 sm:p-6">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="steps"
              className="flex items-center gap-1.5 font-display text-xs uppercase tracking-wide text-forest sm:text-sm"
            >
              <FootprintsIcon className="h-4 w-4 shrink-0" />
              Number of steps
            </label>
            <input
              id="steps"
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
                  Distance
                </p>
                <p className="font-mono text-4xl font-semibold text-rust sm:text-5xl">
                  {active.miles.toFixed(2)} mi
                </p>
                <p className="mt-1 text-[11px] text-ink/50">
                  {isPersonalized
                    ? "Personalized to your height & stride"
                    : `Standard estimate (${DEFAULT_STEPS_PER_MILE.toLocaleString()} steps/mile)`}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <StatChip label="Kilometers" value={`${active.km.toFixed(2)} km`} />
                <StatChip label="Walk time" value={active.duration} />
                <StatChip
                  label="Calories"
                  value={`${active.calories.toFixed(0)} kcal`}
                />
              </div>

              <p className="text-center text-[11px] text-ink/50">
                That&apos;s about{" "}
                <span className="font-mono text-ink/70">
                  {active.percent}%
                </span>{" "}
                of the U.S. average of{" "}
                {US_AVERAGE_DAILY_STEPS.toLocaleString()} daily steps.
              </p>
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
                <PersonIcon className="h-4 w-4 shrink-0" />
                Personalize for your height &amp; pace
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
                  <span className="whitespace-nowrap text-xs text-ink/70 sm:text-sm">
                    Biological sex
                  </span>
                  <div className={`${toggleWrapClass} w-32`}>
                    {(["female", "male"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSex(s)}
                        className={toggleBtnClass(sex === s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

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
                    Height
                  </span>
                  <div className="flex items-center gap-1.5">
                    {unitSystem === "imperial" ? (
                      <>
                        <input
                          type="number"
                          min={0}
                          aria-label="Height, feet"
                          placeholder="5"
                          value={heightFeet}
                          onChange={(e) => setHeightFeet(e.target.value)}
                          className={`${inputClass} w-14 text-right font-mono`}
                        />
                        <span className="shrink-0 text-[11px] text-ink/40">
                          ft
                        </span>
                        <input
                          type="number"
                          min={0}
                          aria-label="Height, inches"
                          placeholder="6"
                          value={heightInches}
                          onChange={(e) => setHeightInches(e.target.value)}
                          className={`${inputClass} w-14 text-right font-mono`}
                        />
                        <span className="shrink-0 text-[11px] text-ink/40">
                          in
                        </span>
                      </>
                    ) : (
                      <>
                        <input
                          type="number"
                          min={0}
                          aria-label="Height, centimeters"
                          placeholder="168"
                          value={heightCm}
                          onChange={(e) => setHeightCm(e.target.value)}
                          className={`${inputClass} w-20 text-right font-mono`}
                        />
                        <span className="shrink-0 text-[11px] text-ink/40">
                          cm
                        </span>
                      </>
                    )}
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
                    htmlFor="pace"
                    className="flex shrink-0 items-center gap-1.5 text-xs text-ink/70 sm:text-sm"
                  >
                    <ClockIcon className="h-4 w-4 shrink-0" />
                    Walking pace
                  </label>
                  <select
                    id="pace"
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

          {active && (
            <ShareResult
              steps={stepsNum}
              miles={active.miles}
              km={active.km}
            />
          )}
        </div>
      </div>
    </div>
  );
}
