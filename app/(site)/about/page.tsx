import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { buildOgMeta } from "@/lib/ogMeta";
import { buildBreadcrumbSchema } from "@/lib/breadcrumb";

const TITLE = "About | Steps to Miles Calculator";
const DESCRIPTION =
  "The story of why this steps-to-miles calculator exists and who's behind it, a one-person side project, not a company.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/about",
  },
  ...buildOgMeta(TITLE, DESCRIPTION, "/about"),
};

export default function AboutPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "About", path: "/about" },
  ]);

  return (
    <main className="min-h-screen px-4 pb-16 pt-3 sm:pb-24 sm:pt-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <div className="flex flex-col gap-3">
          <span className="h-1 w-10 rounded-full bg-rust" />
          <h1 className="font-display text-2xl uppercase tracking-wide text-forest sm:text-3xl">
            About This Site
          </h1>
          <p className="text-ink/70 leading-relaxed">
            No team, no office, no company behind the name. Just one person
            who got annoyed at a bad number and decided to fix it.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-ink/80 leading-relaxed">
            This started with a physical therapist&apos;s instructions after a
            knee injury a few years back: walk 4,000 steps a day, no running,
            no skipping days, and track the distance so we could see the
            trend at the next appointment. Simple enough, except every app
            and every calculator I opened gave me a different number for the
            same walk. One assumed 2,000 steps to the mile, flat, no
            questions asked. Another asked for my stride length, which I had
            no idea how to measure without looking ridiculous pacing out my
            hallway with a tape measure.
          </p>
          <p className="text-ink/80 leading-relaxed">
            I&apos;m well over six feet tall. A flat 2,000-steps-per-mile average
            was built for someone shorter, and it was quietly overstating how
            far I&apos;d actually walked, which matters when a doctor is reading
            your numbers and deciding whether you&apos;re recovering on schedule.
            So one evening instead of icing my knee like I was supposed to, I
            opened a blank file and wrote the actual formula: stride length
            from height, distance from stride, calories from distance. It
            took maybe an hour. It was for me, exactly one user, running
            locally on my laptop.
          </p>
          <p className="text-ink/80 leading-relaxed">
            I showed it to a friend who was training for her first 10K and
            wanted to know what her daily step count actually meant in
            miles. Then to my mother, who has a step goal from her own
            doctor and zero patience for apps that want an account before
            they&apos;ll do basic math. Both asked if they could just have a link
            instead of the spreadsheet. That&apos;s the honest origin of this
            site: not a business plan, a handful of people who wanted the
            same small tool I&apos;d already built for myself.
          </p>
          <p className="text-ink/80 leading-relaxed">
            So I turned it into a real website, still nights and weekends,
            still just me writing the code, checking the math, and fixing
            what breaks. Every conversion on here runs on the same formulas
            from that first evening: stride length from height and sex,
            standard MET tables for calories, plain arithmetic for the unit
            conversions. Nothing here calls out to an AI to generate an
            answer, and nothing is guessing. If the number seems oddly
            specific, it&apos;s because it&apos;s actually computed, not looked up
            from a rounded chart.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SectionHeading>How It Stays Free</SectionHeading>
          <p className="text-ink/80 leading-relaxed">
            There&apos;s no account to make, no email to hand over, and no step
            history stored anywhere, what you type into a calculator stays in
            your browser and disappears when you close the tab. The site
            covers its own hosting through a small amount of advertising, the
            same way most free tools do. That&apos;s it, that&apos;s the whole
            business model: keep it useful, keep it free, keep the lights
            on.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SectionHeading>Say Hello</SectionHeading>
          <p className="text-ink/80 leading-relaxed">
            If a number looks wrong, a page is broken, or there&apos;s a
            conversion you wish existed, I&apos;d genuinely like to hear about it,
            it&apos;s a lot easier to fix something when someone tells me it&apos;s
            broken. Reach me at{" "}
            <a
              href="mailto:hello@steps2miles.org"
              className="text-rust hover:underline"
            >
              hello@steps2miles.org
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
