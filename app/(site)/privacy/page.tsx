import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { buildOgMeta } from "@/lib/ogMeta";
import { buildBreadcrumbSchema } from "@/lib/breadcrumb";

const TITLE = "Privacy Policy | Steps to Miles Calculator";
const DESCRIPTION =
  "What this site does and doesn't collect: no accounts, no stored step data, no ads.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/privacy",
  },
  ...buildOgMeta(TITLE, DESCRIPTION, "/privacy"),
};

const LAST_UPDATED = "August 11, 2026";

export default function PrivacyPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Privacy Policy", path: "/privacy" },
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
            Privacy Policy
          </h1>
          <p className="text-ink/60 text-sm">Last updated: {LAST_UPDATED}</p>
          <p className="text-ink/70 leading-relaxed">
            This site is run by one person, not a company with a data team,
            so the short version is easy to state plainly: the calculators
            don&apos;t ask for an account, don&apos;t store what you type, and don&apos;t
            track your steps over time.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SectionHeading>Information You Enter</SectionHeading>
          <p className="text-ink/80 leading-relaxed">
            Step counts, height, weight, and pace settings you type into any
            calculator on this site are processed entirely in your browser
            to produce a result. None of it is sent to a server, saved to a
            database, or linked to you in any way. Close the tab, and it&apos;s
            gone. There&apos;s no account system to opt into, so there&apos;s nothing
            tied to an email address or login either.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SectionHeading>Server &amp; Hosting Logs</SectionHeading>
          <p className="text-ink/80 leading-relaxed">
            Like effectively every website, the hosting infrastructure this
            site runs on automatically logs standard technical
            information for each request, things like IP address, browser
            user agent, the page requested, and a timestamp. This is
            infrastructure-level logging used for security and reliability
            (catching outages, abuse, and errors), not something this site&apos;s
            code reads, stores long-term, or uses to build a profile of
            visitors.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SectionHeading>Analytics</SectionHeading>
          <p className="text-ink/80 leading-relaxed">
            There&apos;s no first-party analytics script installed on this site,
            no Google Analytics, no heatmaps, no session recording. Any
            aggregate traffic numbers come from the hosting provider&apos;s own
            infrastructure-level metrics, not from anything embedded in the
            pages themselves.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SectionHeading>Children&apos;s Privacy</SectionHeading>
          <p className="text-ink/80 leading-relaxed">
            This site doesn&apos;t knowingly collect personal information from
            anyone, of any age, for the reasons above, there&apos;s simply no
            data collection built into the calculators themselves. It isn&apos;t
            directed at children.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SectionHeading>Changes to This Policy</SectionHeading>
          <p className="text-ink/80 leading-relaxed">
            If anything about how this site handles data changes, this page
            will be updated and the date at the top will reflect it. Since
            this is a one-person project rather than a company, there&apos;s no
            separate legal notice process, this page is the source of truth.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SectionHeading>Contact</SectionHeading>
          <p className="text-ink/80 leading-relaxed">
            Questions about this policy or how the site works can go to{" "}
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
