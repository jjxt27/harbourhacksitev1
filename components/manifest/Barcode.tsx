import { barcodeBars } from "@/lib/manifest";

const HEIGHT = 34;
const GAP = 1;

/** Decorative bars, drawn as rects so they survive the PNG export. */
export function Barcode({ seed, className = "" }: { seed: string; className?: string }) {
  const bars = barcodeBars(seed);
  const width = bars.reduce((sum, bar) => sum + bar + GAP, 0);

  // Offsets computed rather than accumulated, so nothing is reassigned during
  // render. The bar count is small enough that the extra passes are free.
  const rects = bars.map((bar, index) => (
    <rect
      key={index}
      x={bars.slice(0, index).reduce((sum, b) => sum + b + GAP, 0)}
      y={0}
      width={bar}
      height={HEIGHT}
      fill="#08192e"
    />
  ));

  return (
    <svg
      viewBox={`0 0 ${width} ${HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      shapeRendering="crispEdges"
    >
      {rects}
    </svg>
  );
}
