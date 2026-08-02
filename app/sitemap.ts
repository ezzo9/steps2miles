import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SITEMAP_MAX_STEPS, isCanonicalSelf } from "@/lib/canonicalSteps";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/miles-to-steps`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/steps-to-calories-converter`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/steps-to-carbon-calculator`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/embed`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // A page is only worth submitting for indexing if it's its own canonical,
  // otherwise it's telling Google "the real version is somewhere else,"
  // and listing it here too would contradict that. Driving this off
  // isCanonicalSelf (the same function that produces the <link
  // rel="canonical"> tag) means the sitemap can never drift out of sync
  // with what each page actually declares as canonical: it automatically
  // excludes 1-999 and 1,001-1,999 (consolidated onto 1,000/2,000),
  // 15,001-20,000 non-hundreds (consolidated onto the nearest hundred), and
  // 20,001-30,000 non-thousands (consolidated onto the nearest thousand).
  const slugPages: MetadataRoute.Sitemap = [];
  for (let steps = 1; steps <= SITEMAP_MAX_STEPS; steps++) {
    if (!isCanonicalSelf(steps)) continue;
    slugPages.push({
      url: `${SITE_URL}/${steps}-steps-to-miles`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // ~13,060 URLs plus 7 static pages, comfortably under the 50,000-URL
  // sitemap protocol limit, no need to chunk into a sitemap index yet.
  return [...staticPages, ...slugPages];
}
