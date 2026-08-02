export default function Logo() {
  return (
    <span className="flex items-center gap-2">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6 flex-shrink-0"
      >
        <line
          x1="12"
          y1="3.5"
          x2="12"
          y2="20.5"
          stroke="#1F3D2B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="9"
          y1="21"
          x2="15"
          y2="21"
          stroke="#1F3D2B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M12,7 L5,7 L3,9 L5,11 L12,11 Z" fill="#1F3D2B" />
        <path d="M12,12.5 L19,12.5 L21,14.5 L19,16.5 L12,16.5 Z" fill="#C1502E" />
      </svg>
      <span className="font-display text-lg font-semibold lowercase tracking-tight text-forest">
        steps2miles<span className="text-rust">.org</span>
      </span>
    </span>
  );
}
