import Link from "next/link";
import QuickJumpCalculator from "./QuickJumpCalculator";
import { FootprintsIcon } from "./icons";

const QUICK_LINKS = [
  { label: "Steps to Miles Calculator", href: "/" },
  { label: "Steps to Calories Converter", href: "/steps-to-calories-converter" },
  { label: "Miles to Steps Calculator", href: "/miles-to-steps" },
];

export default function NotFoundContent() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-4 pb-16 pt-10 sm:pb-24 sm:pt-14">
      <div className="flex w-full max-w-lg flex-col items-center gap-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rust/10 text-rust">
          <FootprintsIcon className="h-7 w-7" />
        </span>
        <p className="font-mono text-sm uppercase tracking-wide text-rust">
          404
        </p>
        <h1 className="font-display text-2xl uppercase tracking-wide text-forest sm:text-3xl">
          This Trail Doesn&apos;t Exist
        </h1>
        <p className="max-w-md text-ink/70 leading-relaxed">
          The page you&apos;re looking for isn&apos;t here, maybe the step
          count was mistyped, or the link is out of date. Try jumping
          straight to a step count instead.
        </p>
      </div>

      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-forest/10 shadow-[0_2px_8px_rgba(33,29,24,0.04),0_16px_40px_rgba(33,29,24,0.08)]">
        <div className="flex flex-col gap-3 bg-rust px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-display text-sm uppercase tracking-wide text-white">
            Jump to a Step Count
          </p>
          <div className="sm:w-52">
            <QuickJumpCalculator defaultSteps={10000} />
          </div>
        </div>
        <nav
          aria-label="Popular pages"
          className="flex flex-col gap-2 bg-white px-5 py-4 text-sm sm:px-6"
        >
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-forest hover:text-rust hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
