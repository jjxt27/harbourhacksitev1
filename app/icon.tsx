import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * The sender's initials with the delivered dot.
 *
 * Colours mirror --c-ground, --c-bone and --c-receipt in globals.css. This
 * renders in a worker with no DOM, so it cannot read the tokens — change both
 * places together.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          background: "#1c1f26",
          color: "#f2efe9",
          fontSize: 27,
          fontWeight: 600,
          letterSpacing: -1.5,
        }}
      >
        HH
        <div style={{ position: "absolute", top: 13, right: 13, width: 8, height: 8, borderRadius: 4, background: "#38e08c" }} />
      </div>
    ),
    size,
  );
}
