import type { Metadata } from "next";
import Link from "next/link";
import StepsCalculator from "@/components/StepsCalculator";
import TrailDivider from "@/components/TrailDivider";
import TrustBadges from "@/components/TrustBadges";
import TopographicPattern from "@/components/TopographicPattern";
import SectionHeading from "@/components/SectionHeading";
import CaloriesTeaser from "@/components/CaloriesTeaser";
import {
  COMMON_STEP_COUNTS,
  DEFAULT_STEPS_PER_MILE,
  US_AVERAGE_DAILY_STEPS,
  stepsToMiles,
} from "@/lib/steps";
import { LIFE_EXPECTANCY_TABLE } from "@/lib/research";
import { faqItems } from "@/lib/faq";
import { buildOgMeta } from "@/lib/ogMeta";

const TITLE = "Steps to Miles Calculator | Convert Steps to Distance";
const DESCRIPTION =
  "Convert any step count into miles, see common step conversions at a glance, and learn how the steps-to-miles math actually works.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  ...buildOgMeta(TITLE, DESCRIPTION, "/"),
};

export default function Home() {
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex flex-col items-center gap-16 px-4 pt-3 pb-16 sm:gap-24 sm:pt-4 sm:pb-24">
        <section
          id="calculator"
          className="flex w-full scroll-mt-24 flex-col items-center gap-10"
        >
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
            <div className="flex flex-col gap-5 lg:w-3/5">
              <h1 className="font-display text-3xl uppercase leading-tight tracking-wide text-forest sm:text-4xl">
                Steps to Miles Calculator
              </h1>
              <p className="font-medium text-rust">
                The most accurate steps to miles converter, adjusted to your
                real stride.
              </p>
              <p className="max-w-lg leading-relaxed text-ink/70">
                Enter your step count and a bit about yourself to get
                distance, time, and calories, all adjusted to your own
                stride.
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-lg border border-forest/10 bg-forest/[0.03] px-3 py-2 text-xs text-ink/70">
                  <span className="font-mono font-medium text-rust">
                    {DEFAULT_STEPS_PER_MILE.toLocaleString()}
                  </span>{" "}
                  steps/mile, standard estimate
                </span>
                <span className="rounded-lg border border-forest/10 bg-forest/[0.03] px-3 py-2 text-xs text-ink/70">
                  10,000 steps &asymp;{" "}
                  <span className="font-mono font-medium text-rust">
                    {stepsToMiles(10000).toFixed(2)} mi
                  </span>
                </span>
                <span className="rounded-lg border border-forest/10 bg-forest/[0.03] px-3 py-2 text-xs text-ink/70">
                  Formula:{" "}
                  <span className="font-mono font-medium text-rust">
                    steps &divide; steps/mile
                  </span>
                </span>
              </div>

              <div className="mt-4 hidden lg:block">
                <TrustBadges align="start" />
              </div>
            </div>

            <div className="lg:w-2/5">
              <div className="lg:sticky lg:top-24">
                <StepsCalculator />
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <TrustBadges />
          </div>
        </section>

        <TrailDivider />

        <section className="flex w-full max-w-2xl flex-col items-center gap-4 text-center">
          <div className="flex flex-col items-center gap-2 max-w-xl">
            <h2 className="font-display text-xl uppercase tracking-wide text-forest sm:text-2xl">
              Steps Also Burn Calories
            </h2>
            <p className="text-ink/70 text-sm max-w-md sm:text-base">
              Try a quick estimate below, then get the full personalized
              breakdown with your weight and walking pace.
            </p>
          </div>

          <CaloriesTeaser />
        </section>

        <TrailDivider />

        <section className="w-full max-w-2xl flex flex-col gap-4">
          <SectionHeading>
            How Distance, Calories, and Time All Connect
          </SectionHeading>
          <p className="text-ink/80 leading-relaxed">
            Steps to miles, steps to calories, and steps to time aren&apos;t
            three separate calculations, they&apos;re the same underlying
            math applied three different ways. Once you know how far a step
            count carries you, most of the rest follows, which is also why
            you don&apos;t need three different tools that disagree with
            each other to get all three numbers.
          </p>
          <p className="text-ink/80 leading-relaxed">
            Start with distance: steps divided by steps per mile gives you
            miles. That&apos;s the calculator at the top of this page. From
            there, time is just distance divided by speed, if you&apos;re
            walking about 3 miles an hour, 5 miles takes about 1 hour 40
            minutes.
          </p>
          <p className="text-ink/80 leading-relaxed">
            Calories take one more input: your weight. The formula exercise
            physiologists use is MET (metabolic equivalent) multiplied by
            body weight in kilograms multiplied by time in hours. A brisk
            walk sits around 5.0 MET, an average walk closer to 3.5. Plug in
            your weight and the time you just calculated, and you get an
            estimate of energy burned, not from steps directly, but from the
            distance and duration those steps produced.
          </p>
          <p className="text-ink/80 leading-relaxed">
            That&apos;s why a flat &quot;0.04 calories per step&quot; rule
            only gets you so far. It skips weight and pace entirely, which
            are two of the three variables in the real formula. A 220 lb
            person walking briskly burns meaningfully more than a 120 lb
            person strolling the same number of steps, even though both
            counters read an identical number. Distance, on the other hand,
            doesn&apos;t care about weight at all, two people of very
            different sizes covering the same steps at the same stride
            length end up at the same number of miles.
          </p>
          <p className="text-ink/80 leading-relaxed">
            It&apos;s also why the numbers on this site stay consistent with
            each other. The same 2,000-steps-per-mile default that turns
            your step count into distance is what feeds the calorie and time
            estimates too, so if you check the same step count on the{" "}
            <Link
              href="/steps-to-calories-converter"
              className="text-forest hover:text-rust hover:underline"
            >
              steps to calories
            </Link>
            ,{" "}
            <Link
              href="/miles-to-steps"
              className="text-forest hover:text-rust hover:underline"
            >
              miles to steps
            </Link>
            , or{" "}
            <Link
              href="/steps-to-carbon-calculator"
              className="text-forest hover:text-rust hover:underline"
            >
              steps to carbon
            </Link>{" "}
            calculator, the underlying distance always lines up. Nothing
            here is calculated independently or estimated by a different
            method depending on which page you land on.
          </p>
        </section>

        <TrailDivider />

        <section className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-forest/10 bg-white">
          <TopographicPattern />
          <div className="relative flex flex-col gap-4 p-6 sm:p-8">
            <SectionHeading>How It&apos;s Calculated</SectionHeading>
            <p className="text-ink/80 leading-relaxed">
              The math here is simple: miles equal steps divided by steps per
              mile. Walk 10,000 steps and use the standard 2,000 steps per
              mile, and you get 5 miles. That&apos;s the whole calculation, no
              heart rate or calorie estimates involved, just distance.
            </p>
            <p className="text-ink/80 leading-relaxed">
              Why 2,000? It comes from an average stride length of about 2.5
              feet. A mile is 5,280 feet, so dividing that out actually lands
              closer to 2,100, but 2,000 became the common default because
              it&apos;s a round number and close enough for most people.
              Fitness trackers and pedometers use it for the same reason.
            </p>
            <p className="text-ink/80 leading-relaxed">
              Your real number depends on your height and stride. Taller
              people usually take fewer, longer steps to cover a mile,
              sometimes closer to 1,900. Shorter people often need more,
              sometimes over 2,200. If you&apos;ve measured your own stride
              with a tape measure or a fitness watch, plug that number into
              the calculator above instead of the default and you&apos;ll get
              a result that matches your body.
            </p>
            <p className="text-ink/80 leading-relaxed">
              The calculator above skips the guesswork by asking for your
              height and sex instead, then works out your stride from a
              formula pedometer makers have used for years. Punch in your
              steps once and you get a distance, a rough time to walk it, and
              calories burned, all from the same numbers.
            </p>
          </div>
        </section>

        <TrailDivider />

        <section className="w-full max-w-2xl flex flex-col gap-4">
          <SectionHeading>What the Research Actually Says</SectionHeading>
          <p className="text-ink/80 leading-relaxed">
            The average U.S. adult takes{" "}
            {US_AVERAGE_DAILY_STEPS.toLocaleString()} steps a day. That
            number comes from NHANES, the National Health and Nutrition
            Examination Survey, which measured steps with accelerometers
            (not self-reporting) in adults from 2011 to 2014.
          </p>
          <p className="text-ink/80 leading-relaxed">
            Research built on that same NHANES data has linked step count to
            mortality risk. For adults under 60, around 9,000 steps a day
            was tied to a meaningfully lower risk of dying during the study
            period. For adults 60 and older, that number was closer to
            7,000.
          </p>
          <p className="text-ink/80 leading-relaxed">
            A separate NHANES-based life table analysis went further and
            estimated life expectancy at age 40 by step count, compared with
            walking fewer than 4,000 steps a day:
          </p>
          <div className="overflow-x-auto rounded-xl border border-forest/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-rust text-white">
                  <th className="font-display uppercase tracking-wide text-sm px-4 py-3">
                    Steps per day
                  </th>
                  <th className="font-display uppercase tracking-wide text-sm px-4 py-3">
                    Life expectancy at 40
                  </th>
                </tr>
              </thead>
              <tbody>
                {LIFE_EXPECTANCY_TABLE.map((row, i) => (
                  <tr
                    key={row.stepsPerDay}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 border-t border-contour/30 font-mono">
                      {row.stepsPerDay}
                    </td>
                    <td className="px-4 py-3 border-t border-contour/30 font-mono text-ink/80">
                      {row.additionalYears}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-ink/80 leading-relaxed">
            Each additional 1,000 steps a day corresponded to roughly a
            1.4-year difference in life expectancy at 40.
          </p>
          <p className="text-ink/80 leading-relaxed">
            So where did the 10,000-step target actually come from? Not a
            study. It&apos;s widely reported to trace back to a pedometer
            sold in Japan in the 1960s, ahead of the 1964 Tokyo Olympics,
            called manpo-kei, which translates to &quot;10,000-steps
            meter.&quot; The number stuck as a marketing figure long before
            researchers had data like the above to test it against.
          </p>
          <p className="text-xs text-ink/50">
            Sources: NHANES 2011–2014 (National Health and Nutrition
            Examination Survey) accelerometer data, and NHANES-based
            research on step count, mortality risk, and life expectancy.
          </p>
        </section>

        <TrailDivider />

        <section
          id="conversions"
          className="w-full max-w-2xl scroll-mt-24 flex flex-col gap-4"
        >
          <SectionHeading>Common Steps to Miles Conversions</SectionHeading>
          <div className="overflow-x-auto rounded-2xl border border-forest/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-rust text-white">
                  <th className="font-display uppercase tracking-wide text-sm px-4 py-3">
                    Steps
                  </th>
                  <th className="font-display uppercase tracking-wide text-sm px-4 py-3">
                    Miles
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMMON_STEP_COUNTS.map((count, i) => (
                  <tr
                    key={count}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 border-t border-contour/30 font-mono">
                      <Link
                        href={`/${count}-steps-to-miles`}
                        className="text-ink hover:text-rust hover:underline"
                      >
                        {count.toLocaleString()} steps
                      </Link>
                    </td>
                    <td className="px-4 py-3 border-t border-contour/30 font-mono text-ink/80">
                      {stepsToMiles(count).toFixed(2)} mi
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <TrailDivider />

        <section className="w-full max-w-2xl flex flex-col gap-6">
          <SectionHeading>Frequently Asked Questions</SectionHeading>
          {faqItems.map((item) => (
            <div key={item.question} className="flex flex-col gap-2">
              <h3 className="font-display text-lg text-forest">
                {item.question}
              </h3>
              <p className="text-ink/80 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
