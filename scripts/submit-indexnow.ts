// Submits every canonical URL on the site to IndexNow (Bing, and any other
// participating search engine) in one bulk POST. Run manually with
// `npx tsx scripts/submit-indexnow.ts` after a deploy that adds or changes
// pages worth reindexing. The key file living at /public must stay in sync
// with INDEXNOW_KEY below, that's what proves domain ownership.
import { SITE_URL } from "../lib/site";
import { SITEMAP_MAX_STEPS, isCanonicalSelf } from "../lib/canonicalSteps";

const INDEXNOW_KEY = "9b00b0c075e34a6a8a49c522f4e6bda1";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

const host = new URL(SITE_URL).host;

const staticPaths = [
  "/",
  "/miles-to-steps",
  "/steps-to-calories-converter",
  "/steps-to-carbon-calculator",
  "/embed",
  "/about",
  "/privacy",
];

const slugPaths: string[] = [];
for (let steps = 1; steps <= SITEMAP_MAX_STEPS; steps++) {
  if (!isCanonicalSelf(steps)) continue;
  slugPaths.push(`/${steps}-steps-to-miles`);
}

const urlList = [...staticPaths, ...slugPaths].map((path) => `${SITE_URL}${path}`);

// IndexNow accepts up to 10,000 URLs per request, so chunk the ~13k list.
const BATCH_SIZE = 10000;

async function submitBatch(batch: string[]) {
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: batch,
    }),
  });
  console.log(`Submitted ${batch.length} URLs: HTTP ${res.status}`);
  if (!res.ok) {
    console.error(await res.text());
  }
}

for (let i = 0; i < urlList.length; i += BATCH_SIZE) {
  await submitBatch(urlList.slice(i, i + BATCH_SIZE));
}

console.log(`Done. ${urlList.length} total URLs submitted to IndexNow.`);
