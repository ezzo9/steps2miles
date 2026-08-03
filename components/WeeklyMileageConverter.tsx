"use client";

import { useState } from "react";
import { milesToSteps } from "@/lib/steps";

export default function WeeklyMileageConverter() {
  const [weeklyMiles, setWeeklyMiles] = useState("");

  const milesNum = Number(weeklyMiles);
  const valid =
    weeklyMiles.trim() !== "" && Number.isFinite(milesNum) && milesNum >= 0;
  const weeklySteps = valid ? milesToSteps(milesNum) : null;
  const dailyAverage = weeklySteps !== null ? weeklySteps / 7 : null;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-forest/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="weekly-miles"
          className="font-display text-xs uppercase tracking-wide text-forest"
        >
          Weekly training miles
        </label>
        <input
          id="weekly-miles"
          type="number"
          min={0}
          step="1"
          inputMode="decimal"
          value={weeklyMiles}
          onChange={(e) => setWeeklyMiles(e.target.value)}
          className="min-h-11 w-32 rounded-lg border border-forest/15 bg-white px-3 py-2 text-right font-mono text-lg text-ink focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
        />
      </div>

      <div className="flex gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50">
            Weekly steps
          </p>
          <p className="font-mono text-xl font-medium text-rust">
            {weeklySteps === null
              ? "-"
              : Math.round(weeklySteps).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50">
            Daily average
          </p>
          <p className="font-mono text-xl font-medium text-forest">
            {dailyAverage === null
              ? "-"
              : Math.round(dailyAverage).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
