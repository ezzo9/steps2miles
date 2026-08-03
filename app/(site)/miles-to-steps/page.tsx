import type { Metadata } from "next";
import MilesToStepsCalculator from "@/components/MilesToStepsCalculator";
import StrideHeightExplorer from "@/components/StrideHeightExplorer";
import WeeklyMileageConverter from "@/components/WeeklyMileageConverter";
import RelatedCalculators from "@/components/RelatedCalculators";
import { ChevronDownIcon } from "@/components/icons";
import {
  buildFormulaExample,
  buildMilesToStepsFaq,
  buildReferenceDistances,
  buildStrideComparison,
} from "@/lib/milesToStepsContent";
import { buildOgMeta } from "@/lib/ogMeta";
import { buildBreadcrumbSchema } from "@/lib/breadcrumb";

const TITLE = "Miles to Steps Calculator | Convert Distance to Step Count";
const DESCRIPTION =
  "Turn a target distance into the steps you need to hit it. Instant conversion at the standard stride, or pick a stride length for a more precise number.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/miles-to-steps",
  },
  ...buildOgMeta(TITLE, DESCRIPTION, "/miles-to-steps"),
};

export default function MilesToStepsPage() {
  const distances = buildReferenceDistances();
  const stride = buildStrideComparison();
  const faqItems = buildMilesToStepsFaq();
  const formulaExample = buildFormulaExample();

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
    { name: "Miles to Steps Calculator", path: "/miles-to-steps" },
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
        <div className="border-b border-forest/10 px-4 pb-6 pt-3 sm:pb-8 sm:pt-4">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1.5">
            <span className="w-fit rounded-full bg-forest/10 px-3 py-1 font-display text-xs uppercase tracking-wide text-forest">
              Distance &rarr; Steps
            </span>
            <h1 className="font-display text-2xl uppercase tracking-wide text-forest sm:text-3xl">
              Miles to Steps Calculator
            </h1>
            <p className="max-w-xl text-sm text-ink/70 sm:text-base">
              Give it a distance and it hands back the step count, adjusted
              for whatever stride you pick.
            </p>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[360px_1fr] lg:gap-14 lg:py-16">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <MilesToStepsCalculator />
          </aside>

          <div className="flex flex-col gap-14">
            <section className="flex flex-col gap-4">
              <h2 className="font-display text-lg uppercase tracking-wide text-forest">
                Common Distances, Converted
              </h2>
              <p className="leading-relaxed text-ink/70">
                Steps at the standard 2,000-steps-per-mile rate. Training for
                one of these? Punch the exact distance into the calculator
                for a stride-adjusted number.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {distances.map((d) => (
                  <div
                    key={d.label}
                    className="flex flex-col gap-1 rounded-xl border border-forest/10 px-4 py-3"
                  >
                    <p className="font-display text-xs uppercase tracking-wide text-forest/70">
                      {d.label}
                    </p>
                    <p className="font-mono text-xl font-medium text-rust">
                      {d.steps.toLocaleString()}
                    </p>
                    <p className="text-xs text-ink/50">
                      {d.miles} mi &middot; steps
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-display text-lg uppercase tracking-wide text-forest">
                When You&apos;d Actually Use This
              </h2>
              <p className="leading-relaxed text-ink/70">
                Converting miles to steps comes up more often than it seems,
                usually because the number you&apos;re starting with
                wasn&apos;t set by you. A few common situations:
              </p>
              <p className="leading-relaxed text-ink/70">
                Training plans almost always specify mileage: a
                couch-to-5K program might ask for a 2-mile walk-run on a
                given day, a marathon training block might call for a 6-mile
                long run. If your daily motivation comes from a step goal on
                your phone or watch rather than a distance number,
                converting that mileage target into steps first makes it
                something you can actually track as you go, rather than
                needing to stop and check your GPS distance mid-walk.
              </p>
              <p className="leading-relaxed text-ink/70">
                Doctors and physical therapists also tend to prescribe
                distance, not steps: &quot;walk half a mile twice a
                day&quot; is a common recommendation after surgery or for
                cardiovascular health, and most people have a much better
                intuitive sense of how many steps that is than how many
                miles they&apos;ve covered by feel alone. Turning that
                instruction into a step count also makes it easier to build
                into a daily routine, since it&apos;s the same unit your
                phone or watch is already tracking in the background.
              </p>
              <p className="leading-relaxed text-ink/70">
                Hiking is another one. Trail descriptions are published in
                miles, but a step count gives you a rough sense of how long
                you&apos;ll be on your feet and how it&apos;ll compare to a
                normal day, useful for deciding whether a &quot;moderate,
                8-mile&quot; trail is a quick outing or a genuinely
                demanding day, especially if you&apos;re used to thinking in
                steps from a fitness tracker.
              </p>
              <p className="leading-relaxed text-ink/70">
                And sometimes it&apos;s just curiosity about a round number:
                how many steps is a 5K, how many is a marathon, how many is
                the distance between two points on a map. The calculator
                above handles all of these the same way, distance in, a
                stride-adjusted step count out, so the number reflects your
                actual body instead of a generic average.
              </p>
              <p className="leading-relaxed text-ink/70">
                Whatever the source of the distance, the conversion itself
                doesn&apos;t change. The only thing that shifts the answer
                is stride length, which is exactly what the presets on the
                calculator above are for, so a doctor&apos;s half-mile
                recommendation and a marathon training block both get the
                same stride-adjusted treatment.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-display text-lg uppercase tracking-wide text-forest">
                Stride Length Changes the Answer
              </h2>
              <p className="leading-relaxed text-ink/70">
                The 2,000 figure is an average. Here&apos;s how many steps
                one mile actually takes across a range of heights.
              </p>
              <div className="grid grid-cols-1 divide-y divide-forest/10 rounded-xl border border-forest/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {stride.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col gap-1 px-5 py-4 text-center"
                  >
                    <p className="text-xs text-ink/50">{row.heightLabel}</p>
                    <p className="font-mono text-2xl font-medium text-forest">
                      {row.stepsPerMile.toLocaleString()}
                    </p>
                    <p className="font-display text-xs uppercase tracking-wide text-ink/60">
                      {row.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-display text-lg uppercase tracking-wide text-forest">
                Try It: Steps Per Mile By Height
              </h2>
              <p className="leading-relaxed text-ink/70">
                Drag the slider to your own height and watch the number move
                along the same curve the calculator uses.
              </p>
              <StrideHeightExplorer />
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-display text-lg uppercase tracking-wide text-forest">
                Where the Formula Comes From
              </h2>
              <p className="leading-relaxed text-ink/70">
                The stride-length math here isn&apos;t a clinical study,
                it&apos;s the same height-to-stride formula pedometer makers
                have used for years, popularized by Omron and the American
                Council on Exercise: stride length in inches equals height
                times 0.413 for women, or 0.415 for men. Multiply that stride
                by the number of strides in a mile (5,280 feet) and you get
                steps per mile.
              </p>
              <p className="leading-relaxed text-ink/70">
                Plugged in at {formulaExample.heightLabel}, that works out to{" "}
                <span className="font-mono text-ink/80">
                  {formulaExample.femaleStepsPerMile.toLocaleString()}
                </span>{" "}
                steps per mile for a woman and{" "}
                <span className="font-mono text-ink/80">
                  {formulaExample.maleStepsPerMile.toLocaleString()}
                </span>{" "}
                for a man. That small gap is the 0.413-versus-0.415
                multiplier at work, not a rounding error.
              </p>
              <p className="leading-relaxed text-ink/70">
                One honest limitation: this formula assumes a fixed stride
                regardless of pace. Gait research shows people naturally
                lengthen their stride and quicken their cadence as they speed
                up, so it&apos;s most accurate for a normal walking pace.
                Running the same distance will take noticeably fewer steps
                than this page suggests.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-display text-lg uppercase tracking-wide text-forest">
                Converting a Training Plan
              </h2>
              <p className="leading-relaxed text-ink/70">
                Most training plans are written in weekly mileage. If your
                tracker or daily goal is set in steps, here&apos;s what that
                mileage adds up to.
              </p>
              <WeeklyMileageConverter />
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-display text-lg uppercase tracking-wide text-forest">
                Questions People Ask
              </h2>
              <div className="flex flex-col divide-y divide-forest/10 rounded-xl border border-forest/10">
                {faqItems.map((item) => (
                  <details key={item.question} className="group px-5 py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm uppercase tracking-wide text-forest [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <ChevronDownIcon className="h-4 w-4 shrink-0 text-rust transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 leading-relaxed text-ink/80">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            <RelatedCalculators exclude="/miles-to-steps" />
          </div>
        </div>
      </main>
    </>
  );
}
