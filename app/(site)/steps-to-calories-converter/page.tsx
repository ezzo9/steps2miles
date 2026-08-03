import type { Metadata } from "next";
import StepsToCaloriesCalculator from "@/components/StepsToCaloriesCalculator";
import PaceCalorieBars from "@/components/PaceCalorieBars";
import FaqAccordion from "@/components/FaqAccordion";
import RelatedCalculators from "@/components/RelatedCalculators";
import {
  REFERENCE_WEIGHTS_LB,
  buildCalorieByWeightTable,
  buildCalorieFaq,
  buildPaceCalorieTable,
  buildWorkedExample,
} from "@/lib/calorieContent";
import { buildOgMeta } from "@/lib/ogMeta";
import { buildBreadcrumbSchema } from "@/lib/breadcrumb";

const TITLE = "Steps to Calories Converter | How Many Calories Did You Burn?";
const DESCRIPTION =
  "Convert your step count into calories burned. Get an instant estimate, then personalize it with your weight and walking pace for a more accurate number.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/steps-to-calories-converter",
  },
  ...buildOgMeta(TITLE, DESCRIPTION, "/steps-to-calories-converter"),
};

const PACE_TABLE_WEIGHT_LB = 150;

function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rust font-display text-sm text-white">
      {n}
    </span>
  );
}

export default function StepsToCaloriesConverterPage() {
  const faqItems = buildCalorieFaq();
  const weightTable = buildCalorieByWeightTable();
  const paceTable = buildPaceCalorieTable(PACE_TABLE_WEIGHT_LB);
  const example = buildWorkedExample();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Steps to Calories Converter", path: "/steps-to-calories-converter" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="bg-white">
        {/* Asymmetric hero: narrative + quick facts on one side, calculator pinned on the other. */}
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-16 pt-3 sm:pb-20 sm:pt-4 lg:flex-row lg:items-start lg:gap-12">
          <div className="flex flex-col gap-5 lg:w-3/5">
            <span className="w-fit rounded-full bg-rust/10 px-3 py-1 font-display text-xs uppercase tracking-wide text-rust">
              Calorie Calculator
            </span>
            <h1 className="font-display text-3xl uppercase leading-tight tracking-wide text-forest sm:text-4xl">
              Steps to Calories Converter: How Many Are You Actually Burning?
            </h1>
            <p className="max-w-lg leading-relaxed text-ink/70">
              A flat step count only tells half the story. Your weight and
              your pace both change the answer, sometimes by a lot. Get a
              quick number instantly, or personalize it below for one that
              actually reflects you.
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-lg border border-forest/10 bg-forest/[0.03] px-3 py-2 text-xs text-ink/70">
                <span className="font-mono font-medium text-rust">~0.04</span>{" "}
                kcal per step, flat average
              </span>
              <span className="rounded-lg border border-forest/10 bg-forest/[0.03] px-3 py-2 text-xs text-ink/70">
                <span className="font-mono font-medium text-rust">
                  {example.calories.toFixed(0)}
                </span>{" "}
                kcal for {example.steps.toLocaleString()} steps at{" "}
                {example.weightLb} lb
              </span>
              <span className="rounded-lg border border-forest/10 bg-forest/[0.03] px-3 py-2 text-xs text-ink/70">
                Formula:{" "}
                <span className="font-mono font-medium text-rust">
                  MET &times; kg &times; hr
                </span>
              </span>
            </div>
          </div>

          <div className="lg:w-2/5">
            <div className="lg:sticky lg:top-24">
              <StepsToCaloriesCalculator />
            </div>
          </div>
        </section>

        {/* The math, as a 3-step worked example instead of a prose block. */}
        <section className="bg-forest/[0.03] px-4 py-14 sm:py-16">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="font-display text-xl uppercase tracking-wide text-forest sm:text-2xl">
                The Math, in 3 Steps
              </h2>
              <p className="text-sm text-ink/60">
                Worked example: {example.steps.toLocaleString()} steps, a{" "}
                {example.weightLb} lb walker, {example.paceLabel.toLowerCase()}.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white p-5">
                <StepBadge n={1} />
                <p className="font-display text-sm uppercase tracking-wide text-forest">
                  Get distance & time
                </p>
                <p className="text-sm leading-relaxed text-ink/70">
                  {example.steps.toLocaleString()} steps works out to{" "}
                  <span className="font-mono text-ink/80">
                    {example.miles.toFixed(2)} mi
                  </span>
                  , which takes about{" "}
                  <span className="font-mono text-ink/80">
                    {example.duration}
                  </span>{" "}
                  at {example.paceLabel.toLowerCase()}.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white p-5">
                <StepBadge n={2} />
                <p className="font-display text-sm uppercase tracking-wide text-forest">
                  Bring in body weight
                </p>
                <p className="text-sm leading-relaxed text-ink/70">
                  {example.weightLb} lb converts to{" "}
                  <span className="font-mono text-ink/80">
                    {example.weightKg.toFixed(1)} kg
                  </span>
                  . The formula runs on kilograms, and weight is what makes
                  the estimate personal.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white p-5">
                <StepBadge n={3} />
                <p className="font-display text-sm uppercase tracking-wide text-forest">
                  Apply the MET formula
                </p>
                <p className="text-sm leading-relaxed text-ink/70">
                  <span className="font-mono text-ink/80">
                    {example.met} MET &times; {example.weightKg.toFixed(1)}{" "}
                    kg &times; {example.hours.toFixed(2)} hr
                  </span>{" "}
                  &asymp;{" "}
                  <span className="font-mono font-medium text-rust">
                    {example.calories.toFixed(0)} kcal
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-14 sm:py-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl uppercase tracking-wide text-forest sm:text-2xl">
              Why Pace Changes Everything
            </h2>
            <p className="leading-relaxed text-ink/70">
              Same body, same hour, very different burn. Below is one hour of
              walking at each pace for a {PACE_TABLE_WEIGHT_LB} lb adult,
              lightest bar to darkest as intensity climbs.
            </p>
            <div className="rounded-2xl border border-forest/10 p-5 sm:p-6">
              <PaceCalorieBars rows={paceTable} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl uppercase tracking-wide text-forest sm:text-2xl">
              Quick Reference by Weight
            </h2>
            <p className="leading-relaxed text-ink/70">
              At an average pace. Find your step count, then your weight
              column.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-rust/20">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-rust text-white">
                    <th className="px-4 py-3 font-display text-sm uppercase tracking-wide">
                      Steps
                    </th>
                    {REFERENCE_WEIGHTS_LB.map((lb) => (
                      <th
                        key={lb}
                        className="px-4 py-3 font-display text-sm uppercase tracking-wide"
                      >
                        {lb} lb
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weightTable.map((row, i) => (
                    <tr
                      key={row.steps}
                      className={i % 2 === 0 ? "bg-white" : "bg-rust/[0.04]"}
                    >
                      <td className="border-t border-rust/10 px-4 py-3 font-mono">
                        {row.steps.toLocaleString()}
                      </td>
                      {row.caloriesByWeight.map((kcal, j) => (
                        <td
                          key={REFERENCE_WEIGHTS_LB[j]}
                          className="border-t border-rust/10 px-4 py-3 font-mono text-ink/80"
                        >
                          {kcal.toFixed(0)} kcal
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl uppercase tracking-wide text-forest sm:text-2xl">
              How This Compares to Fitness Trackers
            </h2>
            <p className="leading-relaxed text-ink/70">
              If the number here doesn&apos;t match what your Fitbit, Apple
              Watch, or Garmin shows for the same walk, that&apos;s normal,
              and it doesn&apos;t mean either number is wrong. They&apos;re
              measuring the problem differently.
            </p>
            <p className="leading-relaxed text-ink/70">
              Wearables estimate calorie burn primarily from heart rate,
              sometimes combined with an accelerometer reading your movement
              pattern and a baseline resting metabolic rate calculated from
              your age, sex, height, and weight. That approach can pick up
              on things a step count alone can&apos;t, like an incline, a
              headwind, or genuine physical effort that doesn&apos;t
              necessarily add extra steps. It also means two people who take
              an identical walk can get different tracker readings if their
              heart rates respond differently, since heart rate varies with
              fitness level, stress, caffeine, and plenty of other things
              that have nothing to do with distance covered.
            </p>
            <p className="leading-relaxed text-ink/70">
              The calculator on this page works the opposite way. It starts
              from steps and pace, converts that to distance and time, then
              applies the standard MET formula physiologists use in
              research settings, calories equal MET times body weight in
              kilograms times hours. It&apos;s a well-established method,
              but it assumes a steady, consistent pace, and it can&apos;t
              see effort your heart rate would pick up on. A hilly walk and
              a flat walk of the same step count and duration will show the
              same calorie estimate here, even though your heart, and
              probably your tracker, would disagree.
            </p>
            <p className="leading-relaxed text-ink/70">
              Neither number is a lab measurement. The only way to get a
              truly precise calorie count is indirect calorimetry,
              measuring the oxygen you consume and carbon dioxide you
              produce, which isn&apos;t something any consumer device or web
              calculator does. Treat both this estimate and your
              wearable&apos;s as reasonable ballparks that are more useful
              for tracking trends over time than for treating any single
              number as exact.
            </p>
            <p className="leading-relaxed text-ink/70">
              If you&apos;re trying to decide which number to trust for a
              specific day, the honest answer is neither one in isolation.
              Use whichever method you can measure consistently, day after
              day, and pay attention to the direction it moves rather than
              the exact figure. A calculator like this one is most useful
              for planning ahead, working out roughly what a longer walk or
              a heavier pace will cost you, before you&apos;ve taken a
              single step.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl uppercase tracking-wide text-forest sm:text-2xl">
              Questions People Ask
            </h2>
            <FaqAccordion items={faqItems} />
          </div>

          <RelatedCalculators exclude="/steps-to-calories-converter" />
        </section>
      </main>
    </>
  );
}
