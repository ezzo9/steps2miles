"use client";

import { useState } from "react";
import { CheckIcon, XIcon } from "./icons";

type OptionKey = "page" | "comparison";

type Props = {
  stepsLabel: string;
  pageMiles: number;
  comparisonName: string;
  comparisonMiles: number;
};

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function DistanceQuiz({
  stepsLabel,
  pageMiles,
  comparisonName,
  comparisonMiles,
}: Props) {
  const [selected, setSelected] = useState<OptionKey | null>(null);

  const isTie = Math.abs(pageMiles - comparisonMiles) < 0.005;
  const correctKey: OptionKey | null = isTie
    ? null
    : pageMiles > comparisonMiles
    ? "page"
    : "comparison";

  const comparisonLabel = capitalize(comparisonName);

  function optionClasses(key: OptionKey): string {
    const base =
      "min-h-11 flex-1 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors duration-200 sm:text-base";

    if (!selected) {
      return `${base} border-forest/25 bg-white text-forest hover:border-rust hover:bg-rust/5`;
    }
    if (isTie) {
      return key === selected
        ? `${base} border-forest bg-forest/5 text-forest`
        : `${base} border-forest/15 bg-white text-ink/40`;
    }
    if (key === correctKey) {
      return `${base} border-green-600 bg-green-50 text-green-700`;
    }
    if (key === selected) {
      return `${base} border-red-600 bg-red-50 text-red-700`;
    }
    return `${base} border-forest/15 bg-white text-ink/40`;
  }

  function statValueClasses(key: OptionKey): string {
    if (isTie) return "text-ink/70";
    if (key === correctKey) return "font-semibold text-green-700";
    if (key === selected) return "font-semibold text-red-700";
    return "text-ink/70";
  }

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-[0_2px_8px_rgba(33,29,24,0.04),0_16px_40px_rgba(33,29,24,0.08)]">
      <div className="bg-rust px-5 py-3 sm:px-6">
        <p className="font-display text-sm uppercase tracking-wide text-white">
          Guess the Distance
        </p>
      </div>

      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <p className="leading-relaxed text-ink/80">
          Which is farther:{" "}
          <span className="font-medium text-forest">{stepsLabel} steps</span>,
          or <span className="font-medium text-forest">{comparisonLabel}</span>?
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setSelected("page")}
            disabled={selected !== null}
            className={optionClasses("page")}
          >
            {stepsLabel} steps
          </button>
          <button
            type="button"
            onClick={() => setSelected("comparison")}
            disabled={selected !== null}
            className={optionClasses("comparison")}
          >
            {comparisonLabel}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            selected ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-3 rounded-xl border border-forest/10 bg-gray-50 p-4">
            <p className="flex items-center gap-1.5 text-sm font-medium text-ink/80">
              {isTie ? (
                "Almost exactly the same distance."
              ) : selected === correctKey ? (
                <>
                  <CheckIcon className="h-4 w-4 shrink-0 text-green-600" />
                  <span className="text-green-700">Correct!</span>
                </>
              ) : (
                <>
                  <XIcon className="h-4 w-4 shrink-0 text-red-600" />
                  <span className="text-red-700">Not quite.</span>
                </>
              )}
            </p>
            <div className="flex flex-col gap-1.5 font-mono text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-ink/60">{stepsLabel} steps</span>
                <span className={statValueClasses("page")}>
                  {pageMiles.toFixed(2)} mi
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-ink/60">{comparisonLabel}</span>
                <span className={statValueClasses("comparison")}>
                  {comparisonMiles.toFixed(2)} mi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
