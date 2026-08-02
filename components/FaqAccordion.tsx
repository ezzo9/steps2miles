"use client";

import { useState } from "react";
import { ChevronDownIcon } from "./icons";

type FaqItem = { question: string; answer: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col divide-y divide-forest/10 rounded-2xl border border-forest/10">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex min-h-12 w-full items-center justify-between gap-4 px-5 py-3 text-left"
            >
              <span className="font-display text-sm uppercase tracking-wide text-forest sm:text-base">
                {item.question}
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 shrink-0 text-rust transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="px-5 pb-4 leading-relaxed text-ink/80">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
