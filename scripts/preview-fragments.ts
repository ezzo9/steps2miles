// Sanity-check script: assembles the real page text for step counts 1-50
// using the exact same functions the [slug] page calls, and prints it so
// the fragment variety can be eyeballed before trusting it for 20,000 pages.
// Not part of the build, run manually with `npx tsx scripts/preview-fragments.ts`.

import {
  buildSlugPageData,
  getMetaVariant,
  getParagraphVariant,
} from "../lib/slugContent";

const lines: string[] = [];

for (let steps = 1; steps <= 50; steps++) {
  const data = buildSlugPageData(steps);
  const paragraph = getParagraphVariant(data);
  const meta = getMetaVariant(data);

  lines.push(`--- ${steps} steps ---`);
  lines.push(`Title: ${meta.title}`);
  lines.push(`Description: ${meta.description}`);
  lines.push(`Paragraph: ${paragraph}`);
  lines.push("");
}

console.log(lines.join("\n"));
