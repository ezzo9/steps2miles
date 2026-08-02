import type { Metadata } from "next";
import CarbonCalculator from "@/components/CarbonCalculator";
import FaqAccordion from "@/components/FaqAccordion";
import RelatedCalculators from "@/components/RelatedCalculators";
import { LeafIcon } from "@/components/icons";
import { stepsToMiles } from "@/lib/steps";
import {
  AVERAGE_CAR_ANNUAL_FOOTPRINT_GRAMS,
  CO2_GRAMS_PER_MILE,
  buildCarbonFaq,
  buildCarbonReferenceTable,
  buildCarbonWorkedExample,
} from "@/lib/carbon";
import { buildOgMeta } from "@/lib/ogMeta";
import { buildBreadcrumbSchema } from "@/lib/breadcrumb";

const TITLE =
  "Steps to Carbon Calculator | CO2 Saved by Walking Instead of Driving";
const DESCRIPTION =
  "See how much CO2 you'd save walking your steps instead of driving them, using EPA national average vehicle emissions figures. Instant estimate, plus a yearly projection.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/steps-to-carbon-calculator",
  },
  ...buildOgMeta(TITLE, DESCRIPTION, "/steps-to-carbon-calculator"),
};

function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rust font-display text-sm text-white">
      {n}
    </span>
  );
}

export default function StepsToCarbonCalculatorPage() {
  const example = buildCarbonWorkedExample(stepsToMiles(10000));
  const referenceTable = buildCarbonReferenceTable();
  const faqItems = buildCarbonFaq();

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
    { name: "Steps to Carbon Calculator", path: "/steps-to-carbon-calculator" },
  ]);

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Asymmetric hero: narrative + quick facts on one side, calculator pinned on the other. */}
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-16 pt-3 sm:pb-20 sm:pt-4 lg:flex-row lg:items-start lg:gap-12">
        <div className="flex flex-col gap-5 lg:w-3/5">
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-rust/10 px-3 py-1 font-display text-[11px] uppercase tracking-wide text-rust">
            <LeafIcon className="h-3.5 w-3.5 shrink-0" />
            Carbon Calculator
          </span>
          <h1 className="font-display text-3xl uppercase leading-tight tracking-wide text-forest sm:text-4xl">
            Steps to Carbon Calculator: CO2 Saved by Walking Instead of
            Driving
          </h1>
          <p className="max-w-lg leading-relaxed text-ink/70">
            Every mile walked instead of driven is a mile of tailpipe
            emissions that never happened. Enter a step count for an instant
            estimate, then personalize it for your own stride.
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-lg border border-forest/10 bg-forest/[0.03] px-3 py-2 text-xs text-ink/70">
              <span className="font-mono font-medium text-rust">
                {CO2_GRAMS_PER_MILE}
              </span>{" "}
              g CO2 per mile, EPA national average
            </span>
            <span className="rounded-lg border border-forest/10 bg-forest/[0.03] px-3 py-2 text-xs text-ink/70">
              <span className="font-mono font-medium text-rust">
                {Math.round(example.daily.grams).toLocaleString()}
              </span>{" "}
              g saved for {example.steps.toLocaleString()} steps
            </span>
            <span className="rounded-lg border border-forest/10 bg-forest/[0.03] px-3 py-2 text-xs text-ink/70">
              Formula:{" "}
              <span className="font-mono font-medium text-rust">
                miles &times; 400g
              </span>
            </span>
          </div>
        </div>

        <div className="lg:w-2/5">
          <div className="lg:sticky lg:top-24">
            <CarbonCalculator />
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
              Worked example: {example.steps.toLocaleString()} steps, the
              standard 2,000-steps-per-mile conversion.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white p-5">
              <StepBadge n={1} />
              <p className="font-display text-sm uppercase tracking-wide text-forest">
                Get the distance
              </p>
              <p className="text-sm leading-relaxed text-ink/70">
                {example.steps.toLocaleString()} steps works out to{" "}
                <span className="font-mono text-ink/80">
                  {example.miles.toFixed(2)} mi
                </span>
                , the same conversion used across this site.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white p-5">
              <StepBadge n={2} />
              <p className="font-display text-sm uppercase tracking-wide text-forest">
                Apply the EPA figure
              </p>
              <p className="text-sm leading-relaxed text-ink/70">
                <span className="font-mono text-ink/80">
                  {example.miles.toFixed(2)} mi &times; {CO2_GRAMS_PER_MILE}g
                </span>{" "}
                &asymp;{" "}
                <span className="font-mono font-medium text-rust">
                  {Math.round(example.daily.grams).toLocaleString()}g CO2
                </span>{" "}
                saved, about {example.daily.lbs.toFixed(2)} lb.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white p-5">
              <StepBadge n={3} />
              <p className="font-display text-sm uppercase tracking-wide text-forest">
                Project it over a year
              </p>
              <p className="text-sm leading-relaxed text-ink/70">
                Every day for a year:{" "}
                <span className="font-mono font-medium text-rust">
                  {Math.round(example.annual.grams).toLocaleString()}g
                </span>{" "}
                (
                <span className="font-mono text-ink/80">
                  {Math.round(example.annual.kg).toLocaleString()} kg
                </span>
                ), about{" "}
                <span className="font-mono text-ink/80">
                  {example.annual.percentOfCarFootprint.toFixed(1)}%
                </span>{" "}
                of an average car&apos;s yearly footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-14 sm:py-16">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl uppercase tracking-wide text-forest sm:text-2xl">
            Where These Numbers Come From
          </h2>
          <p className="leading-relaxed text-ink/70">
            The 400 grams of CO2 per mile comes from the EPA fact sheet
            EPA-420-F-23-014, the 2023 update to their &ldquo;Greenhouse Gas
            Emissions from a Typical Passenger Vehicle&rdquo; report.
            It&apos;s a national average across the U.S. passenger vehicle
            fleet, not a measurement of any specific car, so a smaller,
            newer, or electric vehicle would emit less, while an older or
            larger one would emit more.
          </p>
          <p className="leading-relaxed text-ink/70">
            The{" "}
            {(AVERAGE_CAR_ANNUAL_FOOTPRINT_GRAMS / 1000).toLocaleString()} kg
            (4.6 metric ton) annual figure used for the &ldquo;percent of a
            car&apos;s year&rdquo; comparison comes from that same EPA
            report, so both numbers are internally consistent with each
            other, not pulled from two different sources with two different
            sets of assumptions.
          </p>
          <p className="leading-relaxed text-ink/70">
            This calculator answers a narrow question: if this exact
            distance had been driven instead of walked, using the national
            average car, about how much CO2 would that have produced. It
            doesn&apos;t know whether you&apos;d have actually driven that
            trip, what you actually drive, or anything else about your real
            habits. Treat it as a rough, honest estimate, not a personal
            carbon audit.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl uppercase tracking-wide text-forest sm:text-2xl">
            Quick Reference by Step Count
          </h2>
          <p className="leading-relaxed text-ink/70">
            At the standard 2,000-steps-per-mile conversion. Daily figures
            on the left, what that adds up to over a full year on the
            right.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-rust/20">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-rust text-white">
                  <th className="px-4 py-3 font-display text-sm uppercase tracking-wide">
                    Steps
                  </th>
                  <th className="px-4 py-3 font-display text-sm uppercase tracking-wide">
                    Daily CO2
                  </th>
                  <th className="px-4 py-3 font-display text-sm uppercase tracking-wide">
                    Yearly CO2
                  </th>
                  <th className="px-4 py-3 font-display text-sm uppercase tracking-wide">
                    % of a Car&apos;s Year
                  </th>
                </tr>
              </thead>
              <tbody>
                {referenceTable.map((row, i) => (
                  <tr
                    key={row.steps}
                    className={i % 2 === 0 ? "bg-white" : "bg-rust/[0.04]"}
                  >
                    <td className="border-t border-rust/10 px-4 py-3 font-mono">
                      {row.steps.toLocaleString()}
                    </td>
                    <td className="border-t border-rust/10 px-4 py-3 font-mono text-ink/80">
                      {Math.round(row.daily.grams).toLocaleString()} g
                    </td>
                    <td className="border-t border-rust/10 px-4 py-3 font-mono text-ink/80">
                      {Math.round(row.annual.kg).toLocaleString()} kg
                    </td>
                    <td className="border-t border-rust/10 px-4 py-3 font-mono text-ink/80">
                      {row.annual.percentOfCarFootprint.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl uppercase tracking-wide text-forest sm:text-2xl">
            Common Questions
          </h2>
          <FaqAccordion items={faqItems} />
        </div>

        <RelatedCalculators exclude="/steps-to-carbon-calculator" />
      </section>
    </main>
  );
}
