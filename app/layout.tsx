import type { Metadata } from "next";
import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { buildOgMeta } from "@/lib/ogMeta";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

const DEFAULT_TITLE = "Steps to Miles Calculator | Convert Steps to Distance";
const DEFAULT_DESCRIPTION =
  "Convert any step count into miles, see common step conversions at a glance, and learn how the steps-to-miles math actually works.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  ...buildOgMeta(DEFAULT_TITLE, DEFAULT_DESCRIPTION, "/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans bg-white text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
