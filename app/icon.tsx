import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * The monogram reduced to a single H, drawn rather than typeset — at 16px the
 * double-H lockup loses its channel and reads as a smear.
 *
 * The waterline keeps its overshoot past the right stem, which is the one
 * detail that makes the mark recognisably HarbourHack at this size. Colours
 * mirror `--color-paper` and `--color-tide` in globals.css; this renders in a
 * worker with no DOM, so they cannot reference the tokens and must be changed
 * in both places.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#05080d" }}>
        <div style={{ position: "absolute", left: 14, top: 16, width: 8, height: 32, background: "#e7ebf0" }} />
        <div style={{ position: "absolute", left: 42, top: 16, width: 8, height: 32, background: "#e7ebf0" }} />
        <div style={{ position: "absolute", left: 14, top: 28, width: 44, height: 8, background: "#2fe3bd" }} />
      </div>
    ),
    size,
  );
}
