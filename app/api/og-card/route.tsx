import { ImageResponse } from "next/og";

export const runtime = "edge";

// Standard link-preview aspect ratio (1.91:1), what Facebook/X/Slack/iMessage
// actually crop to. The square /api/og route is a separate, deliberately
// square "share your result" download image, this route is only for
// og:image / twitter:image and is never linked to from the UI directly.

const FOREST = "#1F3D2B";
const RUST = "#C1502E";
const CONTOUR = "#B8B2A4";
const INK = "#211D18";

const DEFAULT_TITLE = "Steps to Miles Calculator";
const DEFAULT_SUBTITLE =
  "The most accurate steps to miles converter, adjusted to your real stride.";

const oswaldData = fetch(
  new URL("../og/fonts/Oswald-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const jetbrainsMonoData = fetch(
  new URL("../og/fonts/JetBrainsMono-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = truncate(searchParams.get("title") ?? DEFAULT_TITLE, 60);
  const subtitle = truncate(
    searchParams.get("subtitle") ?? DEFAULT_SUBTITLE,
    90
  );

  const [oswald, jetbrainsMono] = await Promise.all([
    oswaldData,
    jetbrainsMonoData,
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FFFFFF",
          position: "relative",
        }}
      >
        <svg
          width="520"
          height="520"
          viewBox="0 0 520 520"
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            opacity: 0.5,
          }}
        >
          <circle cx="260" cy="260" r="70" fill="none" stroke={CONTOUR} strokeWidth="3" />
          <circle cx="260" cy="260" r="120" fill="none" stroke={CONTOUR} strokeWidth="3" />
          <circle cx="260" cy="260" r="170" fill="none" stroke={CONTOUR} strokeWidth="3" />
          <circle cx="260" cy="260" r="220" fill="none" stroke={CONTOUR} strokeWidth="3" />
        </svg>

        <div style={{ display: "flex", width: "100%", height: "14px", backgroundColor: RUST }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "56px 72px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: "26px",
                height: "26px",
                borderRadius: "13px",
                backgroundColor: FOREST,
              }}
            />
            <div
              style={{
                display: "flex",
                width: "26px",
                height: "26px",
                borderRadius: "13px",
                backgroundColor: RUST,
                marginLeft: "-9px",
              }}
            />
            <div
              style={{
                display: "flex",
                marginLeft: "14px",
                fontFamily: "Oswald",
                fontWeight: 600,
                fontSize: "26px",
                color: FOREST,
              }}
            >
              steps2miles<span style={{ color: RUST }}>.org</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
              maxWidth: "920px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "JetBrains Mono",
                fontWeight: 700,
                fontSize: "64px",
                lineHeight: 1.15,
                color: FOREST,
                textTransform: "uppercase",
                letterSpacing: "-1px",
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: "flex",
                marginTop: "28px",
                fontFamily: "Oswald",
                fontWeight: 500,
                fontSize: "30px",
                lineHeight: 1.4,
                color: `${INK}99`,
              }}
            >
              {subtitle}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flex: 1,
                height: "0px",
                borderTop: `3px dashed ${CONTOUR}`,
              }}
            />
            <div
              style={{
                display: "flex",
                width: "14px",
                height: "14px",
                backgroundColor: RUST,
                transform: "rotate(45deg)",
                margin: "0 18px",
              }}
            />
            <div
              style={{
                display: "flex",
                fontFamily: "Oswald",
                fontWeight: 500,
                fontSize: "22px",
                color: `${INK}66`,
                whiteSpace: "nowrap",
              }}
            >
              Free, no sign-up
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Oswald", data: oswald, weight: 600, style: "normal" },
        {
          name: "JetBrains Mono",
          data: jetbrainsMono,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
