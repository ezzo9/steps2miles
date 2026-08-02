import type { SVGProps } from "react";

function base(props: SVGProps<SVGSVGElement>) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function FootprintsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M8.2 4.2c-1.5 0-2.4 1.5-2.4 3.3 0 1.2.5 1.9.5 3.1 0 1.6-1 2.4-1 4.1 0 1.4 1 2.5 2.3 2.5 1.6 0 2.1-1.4 2.1-3.5V7.9c0-2.1-.5-3.7-1.5-3.7Z" />
      <circle cx="8.5" cy="5.3" r="0.55" fill="currentColor" stroke="none" />
      <path d="M15.8 9.2c-1.5 0-2.4 1.5-2.4 3.3 0 1.2.5 1.9.5 3.1 0 1.6-1 2.4-1 4.1 0 1.1.8 2 1.9 2 1.6 0 2.5-1.2 2.5-3.3v-6.5c0-1.5-.4-2.7-1.5-2.7Z" />
      <circle cx="16.1" cy="10.3" r="0.55" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function RulerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="8.5" width="18" height="7" rx="1.2" />
      <path d="M7 8.5v3M10.5 8.5v3M14 8.5v2M17.5 8.5v3" />
    </svg>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.3" />
      <path d="M12 7.6V12l2.8 1.8" />
    </svg>
  );
}

export function PersonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="7.2" r="3.1" />
      <path d="M5.5 19.8c.8-3.7 3.3-5.8 6.5-5.8s5.7 2.1 6.5 5.8" />
    </svg>
  );
}

export function ScaleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="15" width="18" height="5.5" rx="1.2" />
      <path d="M7 15v-1.2A5 5 0 0 1 12 8.8a5 5 0 0 1 5 5V15" />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)} strokeWidth={2}>
      <path d="M5.5 9l6.5 6 6.5-6" />
    </svg>
  );
}

export function BoltIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M12.5 3 5 13.5h5.5L11 21l7.5-10.5H13Z" strokeLinejoin="round" />
    </svg>
  );
}

export function TagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M11.5 4H5a1 1 0 0 0-1 1v6.5a1 1 0 0 0 .3.7l8.5 8.5a1 1 0 0 0 1.4 0l6.5-6.5a1 1 0 0 0 0-1.4L12.2 4.3a1 1 0 0 0-.7-.3Z" />
      <circle cx="8.3" cy="7.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
      <path d="M10.5 18.3h3" />
    </svg>
  );
}

export function NoSignupIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3 10.8 14.5 15.5 9.8" />
    </svg>
  );
}

export function ShareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <circle cx="18" cy="5.5" r="2.3" />
      <circle cx="6" cy="12" r="2.3" />
      <circle cx="18" cy="18.5" r="2.3" />
      <path d="M8 10.8 16 6.2M8 13.2l8 4.6" />
    </svg>
  );
}

export function LinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5 12.7 4.8a3.3 3.3 0 0 1 4.7 4.7L15.7 11.2" />
      <path d="M13 17.5 11.3 19.2a3.3 3.3 0 0 1-4.7-4.7L8.3 12.8" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)} strokeWidth={2}>
      <path d="M5 12.5 9.5 17 19 6.5" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)} strokeWidth={2}>
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  );
}

export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M5 19c9 0 14-5 14-14-9 0-14 5-14 14Z" />
      <path d="M5 19c3-6 6-9 12-12" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)} strokeWidth={2}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M8.5 7 3.5 12l5 5" />
      <path d="M15.5 7l5 5-5 5" />
    </svg>
  );
}
