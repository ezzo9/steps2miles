import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFoundContent from "@/components/NotFoundContent";

// Next.js already emits <meta name="robots" content="noindex"> automatically
// for any not-found boundary, so this only needs to override the title.
export const metadata: Metadata = {
  title: "Page Not Found | Steps to Miles Calculator",
};

// Root-level fallback: only reached for paths that don't match any route at
// all (so the (site) route group's own not-found.tsx never got a chance to
// render), which means the (site) layout's Navbar/Footer never mounted
// either. Wired in by hand here so a truly unmatched URL still looks like
// this site, not a bare error screen.
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <NotFoundContent />
      <Footer />
    </div>
  );
}
