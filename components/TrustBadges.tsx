import { BoltIcon, NoSignupIcon, PhoneIcon, TagIcon } from "./icons";
import type { SVGProps } from "react";

const BADGES: {
  label: string;
  icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
  accent: "forest" | "rust";
}[] = [
  { label: "Instant Results", icon: BoltIcon, accent: "rust" },
  { label: "100% Free", icon: TagIcon, accent: "forest" },
  { label: "Mobile Friendly", icon: PhoneIcon, accent: "forest" },
  { label: "No Sign-up Needed", icon: NoSignupIcon, accent: "rust" },
];

export default function TrustBadges({
  align = "center",
}: {
  align?: "center" | "start";
}) {
  return (
    // Mobile: a strict 4-column grid, so all four badges always share one
    // row regardless of screen width, sized to fit rather than wrapping.
    // sm+ (tablet/desktop): back to the original flex-wrap layout at full size.
    <div
      className={`grid grid-cols-4 items-start gap-x-2 gap-y-6 sm:flex sm:flex-wrap sm:gap-x-10 ${
        align === "start" ? "sm:justify-start" : "sm:justify-center"
      }`}
    >
      {BADGES.map(({ label, icon: Icon, accent }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 sm:w-20 sm:gap-2"
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full sm:h-11 sm:w-11 ${
              accent === "forest"
                ? "bg-forest/10 text-forest"
                : "bg-rust/10 text-rust"
            }`}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <span className="text-center text-[10px] font-medium leading-tight text-ink/60 sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
