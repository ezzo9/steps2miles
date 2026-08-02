import { ImageResponse } from "next/og";
import { KM_PER_MILE } from "@/lib/steps";

export const runtime = "edge";

const FOREST = "#1F3D2B";
const RUST = "#C1502E";
const CONTOUR = "#B8B2A4";
const INK = "#211D18";

const oswaldData = fetch(
  new URL("./fonts/Oswald-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const jetbrainsMonoData = fetch(
  new URL("./fonts/JetBrainsMono-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

function parseNumberParam(value: string | null): number | null {
  if (value === null) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steps = parseNumberParam(searchParams.get("steps"));

  if (steps === null || steps < 0) {
    return new Response(
      JSON.stringify({
        error: "A valid non-negative 'steps' query parameter is required.",
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const milesParam = parseNumberParam(searchParams.get("miles"));
  const miles = milesParam !== null ? milesParam : steps / 2000;
  const kmParam = parseNumberParam(searchParams.get("km"));
  const km = kmParam !== null ? kmParam : miles * KM_PER_MILE;

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
        {/* Faint topographic contour texture, top-right */}
        <svg
          width="620"
          height="620"
          viewBox="0 0 620 620"
          style={{ position: "absolute", top: "-90px", right: "-90px", opacity: 0.5 }}
        >
          <circle cx="310" cy="310" r="80" fill="none" stroke={CONTOUR} strokeWidth="3" />
          <circle cx="310" cy="310" r="140" fill="none" stroke={CONTOUR} strokeWidth="3" />
          <circle cx="310" cy="310" r="200" fill="none" stroke={CONTOUR} strokeWidth="3" />
          <circle cx="310" cy="310" r="260" fill="none" stroke={CONTOUR} strokeWidth="3" />
        </svg>

        {/* Rust signpost bar across the top */}
        <div style={{ display: "flex", width: "100%", height: "20px", backgroundColor: RUST }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "72px 88px 64px",
            position: "relative",
          }}
        >
          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: "30px",
                height: "30px",
                borderRadius: "15px",
                backgroundColor: FOREST,
              }}
            />
            <div
              style={{
                display: "flex",
                width: "30px",
                height: "30px",
                borderRadius: "15px",
                backgroundColor: RUST,
                marginLeft: "-10px",
              }}
            />
            <div
              style={{
                display: "flex",
                marginLeft: "16px",
                fontFamily: "Oswald",
                fontWeight: 600,
                fontSize: "30px",
                color: FOREST,
              }}
            >
              steps2miles<span style={{ color: RUST }}>.org</span>
            </div>
          </div>

          {/* Hero stat */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Oswald",
                fontWeight: 600,
                fontSize: "26px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: RUST,
              }}
            >
              Distance Covered
            </div>

            <div style={{ display: "flex", alignItems: "baseline", marginTop: "16px" }}>
              <div
                style={{
                  display: "flex",
                  fontFamily: "JetBrains Mono",
                  fontWeight: 700,
                  fontSize: "220px",
                  lineHeight: 1,
                  color: FOREST,
                }}
              >
                {miles.toFixed(2)}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Oswald",
                  fontWeight: 600,
                  fontSize: "56px",
                  color: FOREST,
                  marginLeft: "20px",
                }}
              >
                MI
              </div>
            </div>

            {/* Dashed trail divider with diamond marker */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginTop: "44px",
                marginBottom: "44px",
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
                  width: "16px",
                  height: "16px",
                  backgroundColor: RUST,
                  transform: "rotate(45deg)",
                  margin: "0 20px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  height: "0px",
                  borderTop: `3px dashed ${CONTOUR}`,
                }}
              />
            </div>

            {/* Stat chips */}
            <div style={{ display: "flex", gap: "24px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  border: `2px solid ${FOREST}1A`,
                  borderRadius: "20px",
                  padding: "24px 28px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Oswald",
                    fontWeight: 600,
                    fontSize: "22px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: `${INK}80`,
                  }}
                >
                  Steps Walked
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "JetBrains Mono",
                    fontWeight: 700,
                    fontSize: "44px",
                    color: INK,
                    marginTop: "6px",
                  }}
                >
                  {Math.round(steps).toLocaleString()}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  border: `2px solid ${FOREST}1A`,
                  borderRadius: "20px",
                  padding: "24px 28px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Oswald",
                    fontWeight: 600,
                    fontSize: "22px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: `${INK}80`,
                  }}
                >
                  Kilometers
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "JetBrains Mono",
                    fontWeight: 700,
                    fontSize: "44px",
                    color: INK,
                    marginTop: "6px",
                  }}
                >
                  {km.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Footer tagline */}
          <div
            style={{
              display: "flex",
              fontFamily: "Oswald",
              fontWeight: 600,
              fontSize: "24px",
              color: `${INK}66`,
            }}
          >
            The most accurate steps to miles converter
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
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
