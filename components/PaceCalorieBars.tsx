import type { PaceCalorieRow } from "@/lib/calorieContent";

// One-hue rust ramp, light -> dark, for the 4 ordered pace tiers (slow ->
// running). Validated with the dataviz skill's palette validator in
// --ordinal mode: monotone lightness, adjacent steps >= 0.06 L apart, and
// the light end still clears a 2:1 contrast floor against the page surface.
const PACE_RAMP = ["#DFA492", "#D28169", "#C1502E", "#913C23"];

export default function PaceCalorieBars({ rows }: { rows: PaceCalorieRow[] }) {
  const max = Math.max(...rows.map((r) => r.caloriesPerHour));

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row, i) => {
        const widthPct = Math.max((row.caloriesPerHour / max) * 100, 4);
        return (
          <div
            key={row.pace.key}
            className="group -mx-2 flex flex-col gap-1.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-forest/[0.03]"
          >
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-ink/80">
                {row.pace.label}
              </span>
              <span className="font-mono text-ink/70">
                {row.caloriesPerHour.toFixed(0)} kcal/hr
              </span>
            </div>
            <div className="h-3.5 w-full rounded-r-[4px] bg-forest/[0.06]">
              <div
                className="h-3.5 rounded-r-[4px] transition-[width] duration-300 ease-out group-hover:brightness-110"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: PACE_RAMP[i] ?? PACE_RAMP[PACE_RAMP.length - 1],
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
