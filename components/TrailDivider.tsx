export default function TrailDivider() {
  return (
    <div
      aria-hidden="true"
      className="flex w-full max-w-2xl items-center gap-3"
    >
      <svg
        viewBox="0 0 300 12"
        preserveAspectRatio="none"
        className="h-3 flex-1 text-contour"
      >
        <line
          x1="0"
          y1="6"
          x2="300"
          y2="6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="16 7 5 7 24 7 5 7 16 7"
        />
      </svg>
      <span className="h-2.5 w-2.5 flex-shrink-0 rotate-45 bg-rust" />
      <svg
        viewBox="0 0 300 12"
        preserveAspectRatio="none"
        className="h-3 flex-1 text-contour"
      >
        <line
          x1="0"
          y1="6"
          x2="300"
          y2="6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="16 7 5 7 24 7 5 7 16 7"
        />
      </svg>
    </div>
  );
}
