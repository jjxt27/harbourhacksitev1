"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type CountUpProps = {
  value: number;
  /** Zero-padding. The figure is tabular, so the row never changes width. */
  pad?: number;
  duration?: number;
  /** Starts at zero and waits. The parent decides when the row's turn comes. */
  run?: boolean;
  className?: string;
};

/**
 * A figure that counts up to itself.
 *
 * It starts at zero on the server and on the first client render either way,
 * which is what keeps hydration quiet: reading the reduced-motion query during
 * render would let the client start at the final value while the server had
 * already committed to zero.
 *
 * Reduced motion runs the same loop with a zero-length duration, so the figure
 * arrives on the first frame. That is deliberately not a separate branch —
 * a second code path for the same result is a second thing to keep correct.
 *
 * The digits are `aria-hidden` with the final value beside them, so a screen
 * reader is told "4" once rather than read every number on the way there.
 */
export function CountUp({ value, pad = 2, duration = 820, run = true, className = "" }: CountUpProps) {
  const reduced = usePrefersReducedMotion();
  const [counted, setCounted] = useState(0);

  useEffect(() => {
    if (!run) return;

    const ms = reduced ? 0 : duration;
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = ms > 0 ? Math.min(1, (now - start) / ms) : 1;
      // Cubic ease-out: the figure lands rather than stopping dead.
      setCounted(Math.round(value * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, run, reduced]);

  // Derived rather than reset in an effect: a row that has not had its turn
  // reads zero without anything having to write zero.
  const shown = run ? counted : 0;

  return (
    <span className={`tally ${className}`}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{String(shown).padStart(pad, "0")}</span>
    </span>
  );
}
