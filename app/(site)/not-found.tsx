import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

// Next.js already emits <meta name="robots" content="noindex"> automatically
// for any not-found boundary, so this only needs to override the title.
export const metadata: Metadata = {
  title: "Page Not Found | Steps to Miles Calculator",
};

export default function NotFound() {
  return <NotFoundContent />;
}
