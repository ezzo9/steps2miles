// Shared visual language for the site's card-style calculators (steps to
// miles, steps to calories, ...): the input/toggle styling and the compact
// stat chip. Kept in one place so every calculator looks and behaves
// identically instead of drifting apart over time.

export const inputClass =
  "min-h-11 sm:min-h-9 rounded-lg border border-forest/15 bg-white px-3 py-2 sm:py-1.5 text-ink focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15";

export const toggleWrapClass =
  "flex h-11 sm:h-9 shrink-0 overflow-hidden rounded-lg border border-forest/15";

export function toggleBtnClass(active: boolean): string {
  return `flex-1 text-xs font-medium capitalize transition-colors sm:text-sm ${
    active ? "bg-forest text-white" : "bg-white text-ink hover:bg-forest/5"
  }`;
}

export function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-forest/10 bg-white px-2 py-2.5 text-center">
      <p className="text-[10px] uppercase tracking-wide text-ink/50">
        {label}
      </p>
      <p className="font-mono text-sm font-medium text-ink/80 sm:text-base">
        {value}
      </p>
    </div>
  );
}
