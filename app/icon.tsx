import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Container-stencil HH on navy-black, with the ember rule under it. */
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
          background: "#08192e",
          color: "#fbead7",
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: -2,
        }}
      >
        HH
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 64, height: 7, background: "#e2711d" }} />
      </div>
    ),
    size,
  );
}
