"use client";

import { useMemo, useState } from "react";
import { DEFAULT_STEPS_PER_MILE, milesToSteps } from "@/lib/steps";
import { STRIDE_PRESETS, neutralStepsPerMile } from "@/lib/stridePresets";
import { inputClass } from "./calculatorUi";

type StrideMode = "short" | "average" | "tall" | "custom";

function presetButtonClass(active: boolean): string {
  return `rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
    active
      ? "border-forest bg-forest text-white"
      : "border-forest/15 bg-white text-ink hover:bg-forest/5"
  }`;
}

export default function MilesToStepsCalculator() {
  const [miles, setMiles] = useState("");
  const [strideMode, setStrideMode] = useState<StrideMode>("average");
  const [customStepsPerMile, setCustomStepsPerMile] = useState(
    String(DEFAULT_STEPS_PER_MILE)
  );

  const stepsPerMile = useMemo(() => {
    if (strideMode === "custom") {
      const n = Number(customStepsPerMile);
      return Number.isFinite(n) && n > 0 ? n : null;
    }
    const preset = STRIDE_PRESETS.find((p) => p.mode === strideMode);
    return preset ? neutralStepsPerMile(preset.heightIn) : null;
  }, [strideMode, customStepsPerMile]);

  const steps = useMemo(() => {
    if (miles.trim() === "") return null;
    const milesNum = Number(miles);
    if (!Number.isFinite(milesNum) || milesNum < 0 || stepsPerMile === null) {
      return null;
    }
    return milesToSteps(milesNum, stepsPerMile);
  }, [miles, stepsPerMile]);

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-[0_2px_8px_rgba(33,29,24,0.05),0_20px_48px_rgba(33,29,24,0.08)]">
      <span className="block h-1.5 w-full bg-forest" aria-hidden="true" />

      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="miles"
            className="font-display text-xs uppercase tracking-wide text-forest sm:text-sm"
          >
            Distance in miles
          </label>
          <input
            id="miles"
            type="number"
            min={0}
            step="0.1"
            inputMode="decimal"
            value={miles}
            onChange={(e) => setMiles(e.target.value)}
            className="min-h-14 rounded-xl border border-forest/15 bg-white px-4 text-right font-mono text-2xl text-ink focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
          />
        </div>

        <div className="rounded-2xl bg-forest/[0.04] px-5 py-4 text-center">
          <p className="font-display text-xs uppercase tracking-wide text-forest/70">
            Steps
          </p>
          <p className="font-mono text-4xl font-semibold text-rust sm:text-5xl">
            {steps === null ? "-" : Math.round(steps).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-ink/50">
            {stepsPerMile
              ? `At about ${Math.round(
                  stepsPerMile
                ).toLocaleString()} steps per mile`
              : "Enter a valid stride"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-display text-xs uppercase tracking-wide text-forest">
            Stride length
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {STRIDE_PRESETS.map((p) => (
              <button
                key={p.mode}
                type="button"
                onClick={() => setStrideMode(p.mode)}
                className={presetButtonClass(strideMode === p.mode)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStrideMode("custom")}
            className={presetButtonClass(strideMode === "custom")}
          >
            Custom steps/mile
          </button>
          {strideMode === "custom" && (
            <input
              type="number"
              min={1}
              value={customStepsPerMile}
              onChange={(e) => setCustomStepsPerMile(e.target.value)}
              aria-label="Custom steps per mile"
              className={`${inputClass} text-right font-mono`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
