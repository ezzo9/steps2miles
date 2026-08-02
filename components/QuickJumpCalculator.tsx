"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { MAX_SLUG_STEPS, MIN_SLUG_STEPS } from "@/lib/milestones";

export default function QuickJumpCalculator({
  defaultSteps,
}: {
  defaultSteps: number;
}) {
  const router = useRouter();
  const [value, setValue] = useState(String(defaultSteps));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const steps = Math.round(Number(value));
    if (!Number.isFinite(steps)) return;
    const clamped = Math.min(Math.max(steps, MIN_SLUG_STEPS), MAX_SLUG_STEPS);
    router.push(`/${clamped}-steps-to-miles`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2"
      aria-label="Jump to a different step count"
    >
      <input
        type="number"
        min={MIN_SLUG_STEPS}
        max={MAX_SLUG_STEPS}
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Step count"
        className="min-h-10 w-full min-w-0 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 font-mono text-sm text-white placeholder:text-white/50 focus:border-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
      />
      <button
        type="submit"
        className="min-h-10 shrink-0 rounded-lg bg-white px-3.5 py-1.5 font-display text-xs uppercase tracking-wide text-rust transition-colors hover:bg-white/90"
      >
        Go
      </button>
    </form>
  );
}
