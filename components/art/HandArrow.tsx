/**
 * A big marker arrow pointing right, drawn by hand rather than generated — a
 * static path means it renders on the server and never shifts between loads.
 * The double stroke is what sells it as marker rather than vector.
 */
export function HandArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 120"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="#0a0a0a"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Shaft: deliberately uneven, with a slight dip in the middle. */}
      <path d="M8 66C74 58 138 74 206 63 274 52 330 66 392 57" />
      {/* Head: two strokes that overshoot the join, the way a marker would. */}
      <path d="M344 22C360 36 378 48 398 56" />
      <path d="M348 92C366 80 382 68 396 55" />
      {/* Second, lighter pass — the ghost of a first attempt. */}
      <path
        d="M14 76C80 68 140 84 208 73 276 62 334 76 390 67"
        strokeWidth="3"
        opacity="0.35"
      />
    </svg>
  );
}
