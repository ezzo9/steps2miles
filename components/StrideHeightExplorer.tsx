"use client";

import { useMemo, useState } from "react";
import { estimateStepsPerMile } from "@/lib/steps";

const MIN_HEIGHT_IN = 58; // 4'10"
const MAX_HEIGHT_IN = 82; // 6'10"
const DEFAULT_HEIGHT_IN = 67; // 5'7"

const CHART_WIDTH = 560;
const CHART_HEIGHT = 180;
const PAD_X = 8;
const PAD_Y = 20;

function neutralStepsPerMile(heightIn: number): number {
  return (
    (estimateStepsPerMile(heightIn, "female") +
      estimateStepsPerMile(heightIn, "male")) /
    2
  );
}

function formatHeight(heightIn: number): string {
  const feet = Math.floor(heightIn / 12);
  const inches = Math.round(heightIn % 12);
  return `${feet}'${inches}"`;
}

// A single continuous series (steps/mile by height): one hue, no legend
// needed. The live slider marker doubles as the hover/interaction layer for
// this small in-content chart.
export default function StrideHeightExplorer() {
  const [heightIn, setHeightIn] = useState(DEFAULT_HEIGHT_IN);

  const curve = useMemo(() => {
    const points: { h: number; steps: number }[] = [];
    for (let h = MIN_HEIGHT_IN; h <= MAX_HEIGHT_IN; h += 1) {
      points.push({ h, steps: neutralStepsPerMile(h) });
    }
    return points;
  }, []);

  const minSteps = Math.min(...curve.map((p) => p.steps));
  const maxSteps = Math.max(...curve.map((p) => p.steps));

  const toX = (h: number) =>
    PAD_X +
    ((h - MIN_HEIGHT_IN) / (MAX_HEIGHT_IN - MIN_HEIGHT_IN)) *
      (CHART_WIDTH - PAD_X * 2);

  const toY = (steps: number) =>
    PAD_Y +
    (1 - (steps - minSteps) / (maxSteps - minSteps)) *
      (CHART_HEIGHT - PAD_Y * 2);

  const pathD = curve
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.h).toFixed(1)} ${toY(p.steps).toFixed(1)}`)
    .join(" ");

  const currentSteps = neutralStepsPerMile(heightIn);
  const markerX = toX(heightIn);
  const markerY = toY(currentSteps);
  const baselineY = CHART_HEIGHT - PAD_Y;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-forest/10 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-xs uppercase tracking-wide text-forest/70">
          Drag to your height
        </p>
        <p className="font-mono text-sm text-ink/70">
          {formatHeight(heightIn)} &rarr;{" "}
          <span className="font-medium text-rust">
            {Math.round(currentSteps).toLocaleString()}
          </span>{" "}
          steps/mile
        </p>
      </div>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="w-full"
        role="img"
        aria-label={`Steps per mile by height, currently ${formatHeight(
          heightIn
        )} at ${Math.round(currentSteps).toLocaleString()} steps per mile`}
      >
        <line
          x1={PAD_X}
          y1={baselineY}
          x2={CHART_WIDTH - PAD_X}
          y2={baselineY}
          stroke="#B8B2A4"
          strokeWidth={1}
        />
        <path
          d={pathD}
          fill="none"
          stroke="#1F3D2B"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={markerX}
          y1={PAD_Y}
          x2={markerX}
          y2={baselineY}
          stroke="#C1502E"
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.5}
        />
        <circle
          cx={markerX}
          cy={markerY}
          r={5}
          fill="#C1502E"
          stroke="#ffffff"
          strokeWidth={2}
        />
      </svg>

      <input
        type="range"
        min={MIN_HEIGHT_IN}
        max={MAX_HEIGHT_IN}
        step={1}
        value={heightIn}
        onChange={(e) => setHeightIn(Number(e.target.value))}
        aria-label="Height in inches"
        className="w-full accent-rust"
      />
      <div className="flex justify-between text-xs text-ink/40">
        <span>{formatHeight(MIN_HEIGHT_IN)}</span>
        <span>{formatHeight(MAX_HEIGHT_IN)}</span>
      </div>
    </div>
  );
}
