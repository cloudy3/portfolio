import { ImageResponse } from "next/og";

export const alt = "Jing Feng - Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated share card. Mirrors the site's tokens: cool sumi paper, ink text,
 * one shu-iro accent rule, and the lane rails from the hero.
 *
 * Values are literals rather than custom properties because Satori resolves no
 * cascade. Kept to system fonts so the build stays network-free, which is why
 * this is the one surface not set in Zen Kaku Gothic New.
 */
const PAPER = "#ecedf0";
const INK = "#16181c";
const INK_SOFT = "#494d56";
const SHU = "#d33c22";
const RULE = "rgba(22, 24, 28, 0.10)";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: PAPER,
        }}
      >
        {/* Lane rails, on the same eight-lane grid as the site. */}
        {[1, 2, 3, 4, 5, 6, 7].map((lane) => (
          <div
            key={lane}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${(lane * 100) / 8}%`,
              width: "1px",
              backgroundColor: RULE,
            }}
          />
        ))}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "72px",
              height: "3px",
              backgroundColor: SHU,
              marginBottom: "44px",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 900,
              letterSpacing: "-0.035em",
              color: INK,
              lineHeight: 1.02,
            }}
          >
            Jing Feng
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 38,
              fontWeight: 300,
              color: INK_SOFT,
              marginTop: "18px",
            }}
          >
            Software Engineer
          </div>
          <div
            style={{
              display: "flex",
              gap: "28px",
              fontSize: 26,
              color: INK_SOFT,
              marginTop: "52px",
            }}
          >
            <span>Flutter</span>
            <span>Python</span>
            <span>Google Cloud</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
