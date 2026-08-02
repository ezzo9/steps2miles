import Link from "next/link";
import SectionHeading from "./SectionHeading";

const ALL_CALCULATORS = [
  {
    href: "/",
    label: "Steps to Miles Calculator",
    description:
      "Convert any step count into distance, adjusted to your real stride.",
  },
  {
    href: "/steps-to-calories-converter",
    label: "Steps to Calories Converter",
    description:
      "See how many calories that walk actually burned, personalized to your weight and pace.",
  },
  {
    href: "/miles-to-steps",
    label: "Miles to Steps Calculator",
    description:
      "Flip it around: turn a target distance into the steps you need to hit it.",
  },
  {
    href: "/steps-to-carbon-calculator",
    label: "Steps to Carbon Calculator",
    description:
      "See the CO2 saved walking instead of driving that same distance.",
  },
];

export default function RelatedCalculators({
  exclude,
}: {
  exclude: string;
}) {
  const items = ALL_CALCULATORS.filter((c) => c.href !== exclude);

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading>Related Calculators</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col gap-2 rounded-2xl border border-forest/10 bg-white p-5 transition-colors hover:border-rust/30 hover:bg-rust/[0.02]"
          >
            <p className="font-display text-sm uppercase tracking-wide text-forest">
              {item.label}
            </p>
            <p className="text-sm leading-relaxed text-ink/70">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
