import type { Metadata } from "next";
import { SITE_NAME } from "./site";

/**
 * Open Graph + Twitter Card fields for a page, built from the same
 * title/description every page already has, plus a link to the dedicated
 * 1200x630 /api/og-card image (not the square /api/og route, which is a
 * separate "share your result" download feature). Paths are resolved
 * against metadataBase (set once in the root layout), so these can stay
 * relative.
 */
export function buildOgMeta(
  title: string,
  description: string,
  path: string = "/"
): Pick<Metadata, "openGraph" | "twitter"> {
  const image = `/api/og-card?${new URLSearchParams({
    title,
    subtitle: description,
  }).toString()}`;

  return {
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
