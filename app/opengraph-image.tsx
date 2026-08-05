import { ImageResponse } from "next/og";
import { dates, site } from "@/content/site";

export const alt = `${site.name} - ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#05080d", color: "#e7ebf0", padding: "64px 72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 18, letterSpacing: 3, textTransform: "uppercase" }}>
          <span>{site.shortName} / {site.city}</span>
          <span style={{ color: "#7d8894" }}>Applications close {dates.applicationsClose.label}</span>
        </div>
        <div style={{ display: "flex", maxWidth: 1000, fontSize: 96, lineHeight: 1, letterSpacing: -5, fontWeight: 800, textTransform: "uppercase" }}>
          Get out<span style={{ color: "#2fe3bd" }}>.</span>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid rgba(231,235,240,0.2)", paddingTop: 24, fontSize: 24, color: "#b0b9c4" }}>
          A go-to-market hackathon. Build it, then go and get it in front of the people it is for.
        </div>
      </div>
    ),
    size,
  );
}
