"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { MenuIcon, XIcon } from "./icons";

const DESKTOP_LINKS = [{ label: "About Us", href: "/about" }];

const MOBILE_LINKS = [
  { label: "Steps to Miles Calculator", href: "/" },
  { label: "Steps to Calories Converter", href: "/steps-to-calories-converter" },
  { label: "Miles to Steps Calculator", href: "/miles-to-steps" },
  { label: "Steps to Carbon Calculator", href: "/steps-to-carbon-calculator" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-contour/30 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0" onClick={() => setIsOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-x-5 text-sm font-medium sm:flex">
          {DESKTOP_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-ink/70 transition-colors hover:text-forest"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-forest sm:hidden"
        >
          {isOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {isOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="flex flex-col border-t border-contour/30 bg-white px-4 py-2 text-sm font-medium sm:hidden"
        >
          {MOBILE_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="border-b border-contour/10 py-3 text-ink/80 last:border-b-0 hover:text-forest"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
