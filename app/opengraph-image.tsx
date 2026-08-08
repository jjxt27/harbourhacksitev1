import { ImageResponse } from "next/og";
import { dates, site } from "@/content/canvas";

export const alt = `${site.name} ${site.year} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#fbead7",
          color: "#08192e",
          padding: 64,
          border: "16px solid #08192e",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 3, textTransform: "uppercase" }}>
          <span>{site.name} {site.year}</span>
          <span>{site.city}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 104, fontWeight: 800, lineHeight: 0.88, letterSpacing: -5, textTransform: "uppercase" }}>
          <span>Don&apos;t just build.</span>
          <span style={{ display: "flex" }}>
            <span style={{ background: "#f6be85", padding: "0 14px" }}>Ship.</span>
          </span>
        </div>
        {/* The dates earn their place on a share card — they are the one fact
            someone needs before they decide whether to keep reading. */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, borderTop: "4px solid #08192e", paddingTop: 22 }}>
          <span>Sydney&apos;s GTM hackathon for university students</span>
          <span style={{ background: "#1a5da8", color: "#fbead7", padding: "8px 14px", letterSpacing: 1 }}>
            {dates.short}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
