import type { Metadata } from "next";
import CopyEmbedCode from "@/components/CopyEmbedCode";
import { SITE_URL } from "@/lib/site";
import { buildOgMeta } from "@/lib/ogMeta";
import { buildBreadcrumbSchema } from "@/lib/breadcrumb";

const TITLE = "Embed the Steps to Miles Calculator | Steps to Miles";
const DESCRIPTION =
  "Copy a small iframe snippet to embed a live steps-to-miles calculator on your own site, free.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/embed",
  },
  ...buildOgMeta(TITLE, DESCRIPTION, "/embed"),
};

const EMBED_SNIPPET = `<iframe src="${SITE_URL}/embed/calculator" width="410" height="270" style="border:none;max-width:100%;" title="Steps to Miles Calculator"></iframe>`;

export default function EmbedPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Embed This Calculator", path: "/embed" },
  ]);

  return (
    <main className="min-h-screen px-4 pb-16 pt-3 sm:pb-24 sm:pt-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <span className="h-1 w-10 rounded-full bg-rust" />
          <h1 className="font-display text-2xl uppercase tracking-wide text-forest sm:text-3xl">
            Embed This Calculator
          </h1>
          <p className="text-ink/70 leading-relaxed">
            Drop a live steps-to-miles calculator into your own site with
            one iframe. It&apos;s free, doesn&apos;t need an API key, and
            updates whenever we improve the underlying tool.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-forest/10 bg-white p-6 shadow-[0_2px_8px_rgba(33,29,24,0.04),0_16px_40px_rgba(33,29,24,0.08)]">
          <p className="self-start font-display text-xs uppercase tracking-wide text-forest">
            Live preview
          </p>
          <iframe
            src="/embed/calculator"
            width="410"
            height="270"
            style={{ border: "none", maxWidth: "100%" }}
            title="Steps to Miles Calculator"
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-display text-xs uppercase tracking-wide text-forest">
            Paste this into your page
          </p>
          <CopyEmbedCode snippet={EMBED_SNIPPET} />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-display text-lg text-forest">
            A few notes
          </h2>
          <p className="text-ink/80 leading-relaxed">
            The embed uses the standard 2,000 steps per mile default rather
            than the height-adjusted calculator on the homepage, since it
            doesn&apos;t collect any personal details. It carries a small
            &quot;Powered by Steps2Miles.org&quot; link at the bottom that
            points back here.
          </p>
        </div>
      </div>
    </main>
  );
}
