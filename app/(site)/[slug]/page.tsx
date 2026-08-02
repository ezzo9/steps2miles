import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TrailDivider from "@/components/TrailDivider";
import TopographicPattern from "@/components/TopographicPattern";
import DistanceQuiz from "@/components/DistanceQuiz";
import QuickJumpCalculator from "@/components/QuickJumpCalculator";
import SectionHeading from "@/components/SectionHeading";
import {
  BoltIcon,
  CheckIcon,
  ClockIcon,
  LeafIcon,
  PersonIcon,
} from "@/components/icons";
import { stepsToCalories } from "@/lib/steps";
import { buildCarbonResult } from "@/lib/carbon";
import { getCanonicalSteps } from "@/lib/canonicalSteps";
import {
  MAX_SLUG_STEPS,
  MIN_SLUG_STEPS,
  buildMilestoneGaps,
  getClosestMilestone,
  getHundredNeighbors,
  getNearbySteps,
} from "@/lib/milestones";
import {
  buildKeepItUpTable,
  buildSlugFaq,
  buildSlugPageData,
  getMetaVariant,
  getParagraphVariant,
  getRoundNumberBonusParagraph,
} from "@/lib/slugContent";
import { ACTIVITY_LEVELS, getActivityLevel } from "@/lib/activityLevels";
import { selectQuizComparison } from "@/lib/quizContent";
import { selectTrivia } from "@/lib/trivia";
import { buildStrideDistanceTable } from "@/lib/stridePresets";
import { buildOgMeta } from "@/lib/ogMeta";
import { buildBreadcrumbSchema } from "@/lib/breadcrumb";

// Red/orange/green severity bucket per activity level, low step counts read
// as a health concern (red), the middle band as room to improve (orange),
// and the two higher tiers as meeting or beating the common daily target
// (green).
const ACTIVITY_LEVEL_COLORS: Record<
  string,
  { text: string; rowTint: string; dot: string }
> = {
  sedentary: {
    text: "text-red-600",
    rowTint: "bg-red-50",
    dot: "bg-red-600",
  },
  "low-active": {
    text: "text-orange-600",
    rowTint: "bg-orange-50",
    dot: "bg-orange-600",
  },
  "somewhat-active": {
    text: "text-orange-600",
    rowTint: "bg-orange-50",
    dot: "bg-orange-600",
  },
  active: {
    text: "text-green-600",
    rowTint: "bg-green-50",
    dot: "bg-green-600",
  },
  "highly-active": {
    text: "text-green-600",
    rowTint: "bg-green-50",
    dot: "bg-green-600",
  },
};

function ResultStat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  label: string;
  value: string;
  accent: "forest" | "rust";
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-forest/10 bg-white px-2 py-4 text-center">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          accent === "forest"
            ? "bg-forest/10 text-forest"
            : "bg-rust/10 text-rust"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[10px] uppercase tracking-wide text-ink/50">
          {label}
        </p>
        <p className="font-mono text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}

function parseStepsSlug(slug: string): number | null {
  const match = slug.match(/^(\d+(?:\.\d+)?)-steps-to-miles$/);
  if (!match) return null;
  const steps = Number(match[1]);
  if (!Number.isFinite(steps) || !Number.isInteger(steps)) return null;
  if (steps < MIN_SLUG_STEPS || steps > MAX_SLUG_STEPS) return null;
  return steps;
}

// Pre-build every round-number page (the ones most likely to get direct
// search traffic) at build time. Everything else in the 1-30000 range
// renders on first request and is cached from then on (dynamicParams below).
export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (let steps = 500; steps <= MAX_SLUG_STEPS; steps += 500) {
    params.push({ slug: `${steps}-steps-to-miles` });
  }
  return params;
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const steps = parseStepsSlug(params.slug);
  if (steps === null) return {};

  const data = buildSlugPageData(steps);
  const meta = getMetaVariant(data);
  const canonicalSteps = getCanonicalSteps(steps);
  const canonicalPath = `/${canonicalSteps}-steps-to-miles`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalPath,
    },
    ...buildOgMeta(meta.title, meta.description, canonicalPath),
  };
}

export default function StepsToMilesSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const steps = parseStepsSlug(params.slug);

  if (steps === null) {
    notFound();
  }

  const data = buildSlugPageData(steps);
  const paragraph = getParagraphVariant(data);
  const bonusParagraph = data.isRound
    ? getRoundNumberBonusParagraph(data)
    : null;
  const faqItems = buildSlugFaq(data);
  const { previous: previousHundred, next: nextHundred } =
    getHundredNeighbors(steps);
  const closestMilestone = getClosestMilestone(steps);
  const nearbySteps = getNearbySteps(steps);
  const activityLevel = getActivityLevel(steps);
  const quizComparison = selectQuizComparison(steps, data.miles);
  const trivia = selectTrivia(steps);
  const calories = stepsToCalories(steps);
  const carbon = buildCarbonResult(data.miles);
  const milestoneGaps = buildMilestoneGaps(steps);
  const strideTable = buildStrideDistanceTable(steps);
  const keepItUpTable = buildKeepItUpTable(data);

  // Progress ring: how far into the current mile this step count reaches
  // (e.g. 7.37 mi is 37% of the way to mile 8). Real data, not decoration.
  const ringRadius = 88;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const milesFraction = data.miles % 1;
  const ringOffset = ringCircumference * (1 - milesFraction);

  // The nearby-links module: previous/next hundred (for pages above the
  // consolidation threshold, "next hundred" is always that page's own
  // canonical target too, see lib/canonicalSteps.ts), the closest milestone
  // page, then a couple of ± 500 pages for browsing. Deduped against the
  // current page and against each other so nothing links to itself or
  // repeats.
  const usedSteps = new Set<number>([steps]);
  const nearbyLinks: { steps: number; label: string }[] = [];
  function addNearbyLink(
    candidate: number | null,
    label: (candidateSteps: number) => string
  ) {
    if (candidate === null || usedSteps.has(candidate)) return;
    usedSteps.add(candidate);
    nearbyLinks.push({ steps: candidate, label: label(candidate) });
  }
  addNearbyLink(
    previousHundred,
    (s) => `${s.toLocaleString()} steps to miles`
  );
  addNearbyLink(nextHundred, (s) => `${s.toLocaleString()} steps to miles`);
  addNearbyLink(
    closestMilestone.steps,
    () => `${closestMilestone.label} in steps`
  );
  nearbySteps.forEach((s) =>
    addNearbyLink(s, (v) => `${v.toLocaleString()} steps to miles`)
  );

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

  const stepsLabel = steps.toLocaleString();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: `${stepsLabel} Steps to Miles`, path: `/${steps}-steps-to-miles` },
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

      <main className="flex flex-col items-center gap-14 bg-white px-4 pb-16 pt-4 sm:gap-20 sm:pb-24 sm:pt-6">
        <div className="flex w-full max-w-2xl flex-col items-center gap-5">
          <h1 className="w-full text-center font-display text-3xl uppercase leading-tight tracking-wide text-forest sm:text-4xl">
            {stepsLabel} Steps to Miles
          </h1>

          <div className="flex w-full flex-col gap-4 text-left">
            <p className="text-ink/80 leading-relaxed">{paragraph}</p>
            {bonusParagraph && (
              <p className="text-ink/80 leading-relaxed">{bonusParagraph}</p>
            )}
          </div>

          <section className="w-full overflow-hidden rounded-[2rem] border border-forest/10 bg-white p-5 shadow-[0_2px_8px_rgba(33,29,24,0.05),0_20px_48px_rgba(33,29,24,0.08)] sm:p-6">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="relative flex h-36 w-36 shrink-0 items-center justify-center sm:h-40 sm:w-40">
                <svg
                  viewBox="0 0 200 200"
                  className="h-full w-full -rotate-90"
                  aria-hidden="true"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r={ringRadius}
                    fill="none"
                    stroke="#C1502E"
                    strokeOpacity="0.12"
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r={ringRadius}
                    fill="none"
                    stroke="#C1502E"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                  />
                </svg>
                <div className="absolute flex flex-col items-center gap-1 text-center">
                  <p className="font-display text-[10px] uppercase tracking-[0.2em] text-forest/60">
                    Distance
                  </p>
                  <span className="font-mono text-4xl font-bold leading-none text-rust sm:text-5xl">
                    {data.miles.toFixed(2)}
                  </span>
                  <span className="font-display text-[10px] uppercase tracking-wide text-forest/70">
                    Miles
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 text-center sm:text-left">
                <div className="flex flex-col items-center gap-2 sm:items-start">
                  <p className="text-sm leading-relaxed text-ink/70">
                    &asymp; {data.landmarks[0].name}
                  </p>
                  {data.matchingMilestone && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rust/10 px-3 py-1 text-xs font-medium text-rust">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rotate-45 bg-rust"
                        aria-hidden="true"
                      />
                      Within 5% of {data.matchingMilestone.label}
                    </span>
                  )}
                </div>

                {/* Mobile: one compact divided row instead of three padded
                    cards, same numbers, far less vertical space. */}
                <div className="grid grid-cols-3 divide-x divide-forest/10 rounded-xl border border-forest/10 bg-white sm:hidden">
                  <div className="flex flex-col items-center gap-0.5 px-1 py-2.5">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3.5 w-3.5 shrink-0 text-forest" />
                      <span className="font-mono text-sm font-semibold text-ink">
                        {data.averagePaceDuration}
                      </span>
                    </span>
                    <span className="text-[9px] uppercase tracking-wide text-ink/50">
                      Walk Time
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 px-1 py-2.5">
                    <span className="flex items-center gap-1">
                      <BoltIcon className="h-3.5 w-3.5 shrink-0 text-rust" />
                      <span className="font-mono text-sm font-semibold text-ink">
                        {Math.round(calories)} kcal
                      </span>
                    </span>
                    <span className="text-[9px] uppercase tracking-wide text-ink/50">
                      Calories
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 px-1 py-2.5">
                    <span className="flex items-center gap-1">
                      <PersonIcon className="h-3.5 w-3.5 shrink-0 text-forest" />
                      <span className="font-mono text-sm font-semibold text-ink">
                        {data.percent}%
                      </span>
                    </span>
                    <span className="text-[9px] uppercase tracking-wide text-ink/50">
                      vs. US Avg
                    </span>
                  </div>
                </div>

                <div className="hidden grid-cols-3 gap-3 sm:grid">
                  <ResultStat
                    icon={ClockIcon}
                    label="Walk Time"
                    value={data.averagePaceDuration}
                    accent="forest"
                  />
                  <ResultStat
                    icon={BoltIcon}
                    label="Calories"
                    value={`${Math.round(calories)} kcal`}
                    accent="rust"
                  />
                  <ResultStat
                    icon={PersonIcon}
                    label="vs. US Avg"
                    value={`${data.percent}%`}
                    accent="forest"
                  />
                </div>
            </div>
          </div>
          </section>

          <section className="w-full max-w-2xl flex flex-col gap-4">
            <SectionHeading>Steps to Your Next Goal</SectionHeading>
            <p className="text-ink/80 leading-relaxed">
              How {stepsLabel} steps stacks up against a few common step and
              distance goals.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {milestoneGaps.map((m) => (
                <div
                  key={m.key}
                  className="flex flex-col gap-1.5 rounded-2xl border border-forest/10 bg-white p-4"
                >
                  <p className="font-display text-xs uppercase tracking-wide text-forest">
                    {m.title}
                  </p>
                  {m.reached ? (
                    <p className="flex items-center gap-1.5 text-sm font-medium text-forest">
                      <CheckIcon className="h-4 w-4 shrink-0" />
                      Cleared by {m.gap.toLocaleString()}
                    </p>
                  ) : (
                    <p className="font-mono text-lg font-semibold text-rust">
                      {m.gap.toLocaleString()}
                      <span className="ml-1.5 font-sans text-xs font-normal text-ink/50">
                        more steps
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="flex w-full flex-col items-center justify-between gap-2 rounded-xl border border-forest/10 bg-forest/[0.03] px-4 py-3 text-sm sm:flex-row">
            <p className="text-center text-ink/70 sm:text-left">
              <LeafIcon className="mr-1.5 inline h-4 w-4 shrink-0 align-[-3px] text-forest" />
              Walking this instead of driving saves about{" "}
              <span className="font-mono font-medium text-rust">
                {Math.round(carbon.grams).toLocaleString()}g CO2
              </span>{" "}
              ({carbon.lbs.toFixed(2)} lb).
            </p>
            <Link
              href="/steps-to-carbon-calculator"
              className="shrink-0 whitespace-nowrap font-medium text-forest hover:text-rust hover:underline"
            >
              Full breakdown &rarr;
            </Link>
          </div>

          <div className="flex w-full flex-col items-center justify-between gap-2 rounded-xl border border-forest/10 bg-forest/[0.03] px-4 py-3 text-sm sm:flex-row">
            <p className="text-center text-ink/70 sm:text-left">
              <BoltIcon className="mr-1.5 inline h-4 w-4 shrink-0 align-[-3px] text-rust" />
              That {Math.round(calories)} kcal is the flat estimate. Your
              real number changes with weight and pace.
            </p>
            <Link
              href="/steps-to-calories-converter"
              className="shrink-0 whitespace-nowrap font-medium text-forest hover:text-rust hover:underline"
            >
              Personalized breakdown &rarr;
            </Link>
          </div>

          <section className="w-full overflow-hidden rounded-2xl border border-forest/10 shadow-[0_2px_8px_rgba(33,29,24,0.04),0_16px_40px_rgba(33,29,24,0.08)]">
            <div className="flex flex-col gap-3 bg-rust px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="font-display text-sm uppercase tracking-wide text-white">
                Jump to Another Step Count
              </p>
              <div className="sm:w-52">
                <QuickJumpCalculator defaultSteps={steps} />
              </div>
            </div>
            <nav
              aria-label="Related step counts"
              className="flex flex-col gap-2 bg-white px-5 py-4 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-2 sm:px-6"
            >
              {nearbyLinks.map((link) => (
                <Link
                  key={link.steps}
                  href={`/${link.steps}-steps-to-miles`}
                  className="text-forest hover:text-rust hover:underline"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#calculator"
                className="text-forest hover:text-rust hover:underline"
              >
                Full calculator
              </Link>
            </nav>
          </section>
        </div>

        <TrailDivider />

        <section className="flex w-full max-w-2xl flex-col gap-8">
          <div className="relative w-full overflow-hidden rounded-2xl border border-forest/10 border-l-4 border-l-rust bg-white">
            <TopographicPattern />
            <div className="relative flex flex-col gap-3 p-6 sm:p-8">
              <SectionHeading>Distance Snapshot</SectionHeading>
              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-2 leading-relaxed text-ink/80">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-rust"
                    aria-hidden="true"
                  />
                  <span>&asymp; {data.landmarks[0].name}</span>
                </li>
                {data.landmarks[1] && (
                  <li className="flex items-start gap-2 leading-relaxed text-ink/80">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-rust"
                      aria-hidden="true"
                    />
                    <span>Also in range: {data.landmarks[1].name}</span>
                  </li>
                )}
                {data.matchingMilestone && (
                  <li className="flex items-start gap-2 leading-relaxed text-ink/80">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-rust"
                      aria-hidden="true"
                    />
                    <span>Within 5% of {data.matchingMilestone.label}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <DistanceQuiz
            stepsLabel={stepsLabel}
            pageMiles={data.miles}
            comparisonName={quizComparison.name}
            comparisonMiles={quizComparison.miles}
          />
        </section>

        <TrailDivider />

        <section className="w-full max-w-2xl flex flex-col gap-4">
          <SectionHeading>{stepsLabel} Steps to Miles, By Height</SectionHeading>
          <p className="text-ink/80 leading-relaxed">
            The 2,000-steps-per-mile figure above is a flat average. Stride
            length actually scales with height, so the same {stepsLabel}{" "}
            steps covers a different distance depending on how tall the
            walker is.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-forest/20">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-rust text-white">
                  <th className="px-4 py-3 font-display text-sm uppercase tracking-wide">
                    Height
                  </th>
                  <th className="px-4 py-3 font-display text-sm uppercase tracking-wide">
                    Distance
                  </th>
                </tr>
              </thead>
              <tbody>
                {strideTable.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border-t border-contour/30 px-4 py-3 text-ink">
                      {row.label}
                    </td>
                    <td className="border-t border-contour/30 px-4 py-3 font-mono text-ink/80">
                      {row.miles.toFixed(2)} mi
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <TrailDivider />

        <section className="w-full max-w-2xl flex flex-col gap-4">
          <SectionHeading>Keep This Up</SectionHeading>
          <p className="text-ink/80 leading-relaxed">
            If {stepsLabel} steps became a daily habit instead of a one-time
            count, here&apos;s what it adds up to over time.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-forest/20">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-rust text-white">
                  <th className="px-4 py-3 font-display text-sm uppercase tracking-wide">
                    Period
                  </th>
                  <th className="px-4 py-3 font-display text-sm uppercase tracking-wide">
                    Steps
                  </th>
                  <th className="px-4 py-3 font-display text-sm uppercase tracking-wide">
                    Distance
                  </th>
                  <th className="px-4 py-3 font-display text-sm uppercase tracking-wide">
                    Calories
                  </th>
                </tr>
              </thead>
              <tbody>
                {keepItUpTable.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border-t border-contour/30 px-4 py-3 text-ink">
                      {row.label}
                    </td>
                    <td className="border-t border-contour/30 px-4 py-3 font-mono text-ink/80">
                      {row.steps.toLocaleString()}
                    </td>
                    <td className="border-t border-contour/30 px-4 py-3 font-mono text-ink/80">
                      {row.miles.toLocaleString(undefined, {
                        maximumFractionDigits: 1,
                      })}{" "}
                      mi
                    </td>
                    <td className="border-t border-contour/30 px-4 py-3 font-mono text-ink/80">
                      {Math.round(row.calories).toLocaleString()} kcal
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <TrailDivider />

        <section className="w-full max-w-2xl flex flex-col gap-4">
          <SectionHeading>Where {stepsLabel} Steps Ranks</SectionHeading>
          <p className="text-ink/80 leading-relaxed">
            Activity levels are commonly grouped by daily step count.
            Here&apos;s where {stepsLabel} steps falls.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-forest/20">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-rust text-white">
                  <th className="px-4 py-3 font-display text-sm uppercase tracking-wide">
                    Activity Level
                  </th>
                  <th className="px-4 py-3 font-display text-sm uppercase tracking-wide">
                    Daily Steps
                  </th>
                </tr>
              </thead>
              <tbody>
                {ACTIVITY_LEVELS.map((level, i) => {
                  const isMatch = level.key === activityLevel.key;
                  const colors =
                    ACTIVITY_LEVEL_COLORS[level.key] ??
                    ACTIVITY_LEVEL_COLORS.sedentary;
                  return (
                    <tr
                      key={level.key}
                      className={
                        isMatch
                          ? colors.rowTint
                          : i % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50"
                      }
                    >
                      <td
                        className={`border-t border-contour/30 px-4 py-3 ${
                          isMatch ? `font-semibold ${colors.text}` : colors.text
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 shrink-0 ${
                              isMatch ? "rotate-45" : "rounded-full"
                            } ${colors.dot}`}
                            aria-hidden="true"
                          />
                          {level.label}
                        </span>
                      </td>
                      <td
                        className={`border-t border-contour/30 px-4 py-3 font-mono ${
                          isMatch ? `font-semibold ${colors.text}` : "text-ink/80"
                        }`}
                      >
                        {level.rangeLabel}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <TrailDivider />

        <section className="w-full max-w-2xl flex flex-col gap-4">
          <SectionHeading>Did You Know?</SectionHeading>
          <div className="flex flex-col gap-4">
            {trivia.map((fact, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-forest/10 bg-forest/[0.03] p-4 sm:p-5"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rust/10 font-display text-xs font-semibold text-rust">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-ink/80">
                  {fact.text}
                </p>
              </div>
            ))}
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
