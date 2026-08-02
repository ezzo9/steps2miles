export default function TopographicPattern() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className="absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] text-contour opacity-40"
    >
      <path
        d="M200,146 C227,148 251,164 255,190 C259,218 242,244 214,250 C186,256 158,242 151,214 C144,186 160,158 188,150 C192,149 196,147 200,146 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M200,104 C240,107 274,130 281,168 C288,208 264,246 226,257 C188,268 148,250 134,214 C120,178 140,138 178,116 C185,112 192,108 200,104 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M198,62 C252,66 296,96 306,146 C316,198 284,248 232,264 C180,280 126,256 106,210 C86,164 110,114 158,86 C170,79 184,70 198,62 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M196,20 C266,24 316,62 328,122 C340,184 300,244 236,264 C172,284 104,254 80,200 C56,146 84,84 144,52 C160,44 178,32 196,20 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M195,-20 C280,-14 336,32 350,100 C364,170 316,238 244,262 C172,286 92,252 64,190 C36,128 66,58 132,20 C151,10 172,-6 195,-20 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="203" cy="197" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
