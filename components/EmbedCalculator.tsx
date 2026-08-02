"use client";

import { useMemo, useState } from "react";
import { DEFAULT_STEPS_PER_MILE, KM_PER_MILE, stepsToCalories, stepsToMiles } from "@/lib/steps";
import { SITE_URL } from "@/lib/site";

export default function EmbedCalculator() {
  const [steps, setSteps] = useState("10000");

  const result = useMemo(() => {
    const stepsNum = Number(steps);
    if (!Number.isFinite(stepsNum) || stepsNum < 0) return null;
    const miles = stepsToMiles(stepsNum, DEFAULT_STEPS_PER_MILE);
    const km = miles * KM_PER_MILE;
    const calories = stepsToCalories(stepsNum);
    return { miles, km, calories };
  }, [steps]);

  return (
    <div className="w-full max-w-[380px] rounded-2xl border border-forest/15 bg-white p-4 shadow-[0_1px_2px_rgba(33,29,24,0.05),0_6px_16px_rgba(33,29,24,0.06)]">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="embed-steps"
          className="font-display text-[11px] uppercase tracking-wide text-forest"
        >
          Number of steps
        </label>
        <input
          id="embed-steps"
          type="number"
          min={0}
          inputMode="numeric"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          className="min-h-10 rounded-lg border border-forest/15 bg-white px-3 py-1.5 font-mono text-base text-ink focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
        />
      </div>

      <div className="mt-3 rounded-xl bg-forest/[0.04] px-4 py-3">
        {result ? (
          <>
            <p className="font-display text-[10px] uppercase tracking-wide text-forest/70">
              Distance
            </p>
            <p className="font-mono text-3xl font-semibold text-rust">
              {result.miles.toFixed(2)} mi
            </p>
            <div className="mt-2 flex gap-5 border-t border-forest/10 pt-2">
              <div>
                <p className="text-[9px] uppercase tracking-wide text-ink/50">
                  Km
                </p>
                <p className="font-mono text-xs font-medium text-ink/80">
                  {result.km.toFixed(2)} km
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wide text-ink/50">
                  Calories
                </p>
                <p className="font-mono text-xs font-medium text-ink/80">
                  {result.calories.toFixed(0)} kcal
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="font-display text-sm text-forest">
            Enter a step count above
          </p>
        )}
      </div>

      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-center text-[10px] text-ink/40 hover:text-rust"
      >
        Powered by Steps2Miles.org
      </a>
    </div>
  );
}
