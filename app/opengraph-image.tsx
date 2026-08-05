import { ImageResponse } from "next/og";
import { site, dates } from "@/content/site";
import { thread } from "@/content/thread";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card is the first message: same rail, same receipt dot, same line. */
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
          background: "#1c1f26",
          color: "#f2efe9",
          padding: "62px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 21, letterSpacing: 1 }}>
          <div style={{ width: 11, height: 11, borderRadius: 6, background: "#38e08c" }} />
          {site.name}
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 44 }}>
          <div style={{ display: "flex", color: "#868c99", fontSize: 20, paddingTop: 22 }}>
            {thread.groups[0].time}
          </div>
          <div style={{ display: "flex", maxWidth: 780, fontSize: 82, fontWeight: 500, lineHeight: 1.03, letterSpacing: -3.4 }}>
            {site.tagline}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 21, color: "#868c99", letterSpacing: 0.4 }}>
          <span>A go-to-market hackathon · {site.city}</span>
          <span>Applications {dates.applicationsClose.label}</span>
        </div>
      </div>
    ),
    size,
  );
}
