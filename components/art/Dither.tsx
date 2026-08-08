"use client";

import { useEffect, useRef } from "react";

/*
 * A photograph, put through the same press as the drawing.
 *
 * Two steps, in this order, because the order is the whole effect: downsample
 * to a few hundred pixels wide, then quantise each of those pixels to one of
 * the six inks with an ordered dither. Quantising first and shrinking after
 * would let the browser average the inks back into colours that are not in the
 * palette, and the result would be a slightly posterised photo rather than a
 * screen print.
 *
 * Done on the client because it needs pixel access. `getImageData` on a canvas
 * that has drawn a cross-origin image throws, so the source has to be
 * same-origin — a file under /public, not a remote URL.
 */

const PALETTE: readonly [number, number, number][] = [
  [8, 25, 46], // ink      #08192e
  [14, 60, 114], // navy     #0e3c72
  [26, 93, 168], // harbour  #1a5da8
  [78, 138, 196], // sky      #4e8ac4
  [226, 113, 29], // ember    #e2711d
  [246, 190, 133], // apricot  #f6be85
  [251, 234, 215], // paper    #fbead7
];

/**
 * Bayer 8 × 8. A bigger matrix than the drawing's 4 × 4 because a photograph
 * has real gradients in it: at 4 × 4 the sky bands, and the banding reads as a
 * mistake rather than as a screen.
 */
const BAYER_8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

/**
 * How far a pixel is allowed to be nudged before the nearest ink is picked.
 * Too low and the dither does nothing; too high and the dots stop describing
 * the photograph and start describing the matrix.
 */
const SPREAD = 56;

function nearestInk(r: number, g: number, b: number): readonly [number, number, number] {
  let best = PALETTE[0];
  let bestDistance = Infinity;
  for (const ink of PALETTE) {
    // Weighted to roughly match perceived brightness, so a dark blue does not
    // get matched to ember just because the red channel happens to be close.
    const distance =
      2 * (r - ink[0]) ** 2 + 4 * (g - ink[1]) ** 2 + 3 * (b - ink[2]) ** 2;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = ink;
    }
  }
  return best;
}

type DitherProps = {
  /** Same-origin path, e.g. `/harbour.png`. */
  src: string;
  /** Width of the quantised grid, in pixels. The dot size follows from this. */
  cols?: number;
  className?: string;
};

export function Dither({ src, cols = 260, className = "" }: DitherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    const image = new Image();
    // Nothing is fetched cross-origin, but being explicit means a misconfigured
    // CDN in front of /public fails loudly here instead of at getImageData.
    image.crossOrigin = "anonymous";
    image.src = src;

    image.decode?.().catch(() => {});

    image.onload = () => {
      if (cancelled) return;

      const rows = Math.max(1, Math.round((cols * image.naturalHeight) / image.naturalWidth));
      canvas.width = cols;
      canvas.height = rows;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;

      context.imageSmoothingEnabled = true;
      context.drawImage(image, 0, 0, cols, rows);

      const frame = context.getImageData(0, 0, cols, rows);
      const { data } = frame;

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const i = (y * cols + x) * 4;
          // Centre the threshold on zero so the dither brightens and darkens
          // equally; a 0..1 offset would lift the whole image.
          const nudge = (BAYER_8[y % 8][x % 8] / 63 - 0.5) * SPREAD;
          const ink = nearestInk(data[i] + nudge, data[i + 1] + nudge, data[i + 2] + nudge);
          data[i] = ink[0];
          data[i + 1] = ink[1];
          data[i + 2] = ink[2];
          data[i + 3] = 255;
        }
      }

      context.putImageData(frame, 0, 0);
    };

    return () => {
      cancelled = true;
    };
  }, [src, cols]);

  /* The canvas is `cols` wide in real pixels and stretched by CSS, so the ink
     cells stay square and visible instead of being resampled smooth. */
  return <canvas ref={canvasRef} aria-hidden="true" className={`pixelated ${className}`} />;
}
