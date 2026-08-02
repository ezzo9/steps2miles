import Link from "next/link";
import Logo from "./Logo";

const FOOTER_LINKS = [
  { label: "Steps to Miles Calculator", href: "/" },
  { label: "Steps to Calories Converter", href: "/steps-to-calories-converter" },
  { label: "Miles to Steps Calculator", href: "/miles-to-steps" },
  { label: "Steps to Carbon Calculator", href: "/steps-to-carbon-calculator" },
  { label: "Embed This Calculator", href: "/embed" },
  { label: "About Us", href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-forest/10 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="max-w-xs text-sm text-ink/60">
            Simple, free calculators for turning steps into miles, calories,
            and time, no sign-up required.
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-col gap-2 text-sm text-ink/70 sm:items-end"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-rust"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-forest/10 px-4 py-4 sm:px-6">
        <p className="mx-auto w-full max-w-6xl text-xs text-ink/40">
          &copy; {year} Steps2Miles.org
        </p>
      </div>
    </footer>
  );
}
