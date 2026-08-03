"use client";

import Link from "next/link";
import { useState } from "react";
import { stepsToCalories } from "@/lib/steps";
import { FootprintsIcon } from "./icons";

export default function CaloriesTeaser() {
  const [steps, setSteps] = useState("");
  const stepsNum = Number(steps);
  const valid = steps.trim() !== "" && Number.isFinite(stepsNum) && stepsNum >= 0;
  const calories = valid ? stepsToCalories(stepsNum) : null;

  return (
    <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-[0_2px_8px_rgba(33,29,24,0.05),0_20px_48px_rgba(33,29,24,0.08)]">
      <span className="block h-1.5 w-full bg-rust" aria-hidden="true" />

      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex flex-col gap-1.5 sm:flex-1">
          <label
            htmlFor="teaser-steps"
            className="flex items-center gap-1.5 font-display text-xs uppercase tracking-wide text-forest sm:text-sm"
          >
            <FootprintsIcon className="h-4 w-4 shrink-0" />
            Number of steps
          </label>
          <input
            id="teaser-steps"
            type="number"
            min={0}
            inputMode="numeric"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            className="min-h-11 rounded-lg border border-forest/15 bg-white px-3 py-2 font-mono text-lg text-ink focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl bg-forest/[0.04] px-5 py-3 sm:w-40 sm:flex-col sm:items-center sm:justify-center sm:gap-1">
          <p className="font-mono text-2xl font-semibold text-rust sm:text-3xl">
            {calories === null ? "-" : `${calories.toFixed(0)} kcal`}
          </p>
          <p className="text-xs uppercase tracking-wide text-ink/50">
            calories burned
          </p>
        </div>
      </div>

      <Link
        href="/steps-to-calories-converter"
        className="flex items-center justify-center gap-1.5 border-t border-forest/10 bg-forest px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-forest/90"
      >
        Get your personalized breakdown
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
