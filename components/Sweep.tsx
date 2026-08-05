"use client";

import { useCallback, useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { site } from "@/content/site";

const RUN_MS = 1400;
const HOLD_MS = 120;
const MARK_MS = 420;
const LIFT_MS = 620;

/** Where the readout finishes. Counts up as the line travels. */
const TARGET = 100;

type Phase = "idle" | "running" | "mark" | "lifting";

/**
 * The signature intro: an accent rule sweeping up the screen with a readout
 * counting to 100, resolving into the HH monogram before the curtain lifts.
 *
 * Runs once per browser session and never under reduced motion — both gates
 * live in the inline script in `app/layout.tsx`, which adds the `booting` class
 * this component looks for. Without that class it renders nothing.
 */
export function Sweep() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(0);

  const release = useCallback(() => {
    document.documentElement.classList.remove("booting");
    try {
      sessionStorage.setItem("harbourhack-intro-seen", "1");
    } catch {
      // Storage can be disabled. The CSS failsafe still releases the page.
    }
  }, []);

  const liftOut = useCallback(() => {
    setPhase("lifting");
    release();
    window.setTimeout(() => setPhase("idle"), LIFT_MS + 100);
  }, [release]);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("booting")) return;

    let frame = 0;
    let markTimer = 0;
    let liftTimer = 0;
    const started = performance.now();

    const tick = (now: number) => {
      // The failsafe in layout.tsx clears `booting` on a timer, which keeps
      // winning in a background tab because animation frames are paused there.
      // If it got there first the page is already revealed, so drop the intro
      // rather than playing it over the top when the tab is focused again.
      if (!root.classList.contains("booting")) {
        setPhase("idle");
        return;
      }

      const progress = Math.min((now - started) / RUN_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setPhase("running");
      setCount(Math.round(eased * TARGET));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      markTimer = window.setTimeout(() => {
        setPhase("mark");
        liftTimer = window.setTimeout(liftOut, MARK_MS);
      }, HOLD_MS);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(markTimer);
      clearTimeout(liftTimer);
      release();
    };
  }, [liftOut, release]);

  if (phase === "idle") return null;

  return (
    <div className="sweep" data-phase={phase}>
      <div className="sweep-line" aria-hidden="true" />
      <div className="sweep-meta">
        <span>{site.name} / {site.city}</span>
        <span>Go to market</span>
      </div>
      <div className="sweep-stack" aria-hidden="true">
        <BrandMark variant="mark" className="sweep-mark" />
        <span className="sweep-readout">{count}</span>
      </div>
      <div className="sweep-footer">
        <div className="sweep-rule" aria-hidden="true"><span style={{ width: `${count}%` }} /></div>
        <button type="button" onClick={liftOut} className="sweep-skip">Skip intro</button>
      </div>
    </div>
  );
}
