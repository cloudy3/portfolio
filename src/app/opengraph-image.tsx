import { ImageResponse } from "next/og";

export const alt = "Jing Feng — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated share card. Mirrors the site's tokens: cream page, near-black
 * text, one cyan accent rule. Kept to system fonts so the build stays
 * network-free.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#faf8f5",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#6b6b76",
          }}
        >
          Portfolio
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: "96px",
              height: "4px",
              backgroundColor: "#06b6d4",
              marginBottom: "40px",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#1a1a1c",
              lineHeight: 1.05,
            }}
          >
            Jing Feng
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              color: "#4a4a52",
              marginTop: "20px",
            }}
          >
            Software Engineer
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#4a4a52",
          }}
        >
          Flutter · Python · Google Cloud
        </div>
      </div>
    ),
    size
  );
}
