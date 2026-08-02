import { SITE_URL } from "./site";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

/**
 * BreadcrumbList JSON-LD, shared by every page below the homepage so Google
 * can render a breadcrumb trail in search results instead of a raw URL.
 * Always starts from Home, callers only pass the page(s) after it.
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  const allItems: BreadcrumbItem[] = [{ name: "Home", path: "/" }, ...items];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
