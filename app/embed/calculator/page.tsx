import type { Metadata } from "next";
import EmbedCalculator from "@/components/EmbedCalculator";

export const metadata: Metadata = {
  title: "Steps to Miles Calculator (Embed)",
  robots: { index: false, follow: false },
};

export default function EmbedCalculatorPage() {
  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-white p-3">
      <EmbedCalculator />
    </div>
  );
}
