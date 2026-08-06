"use client";

import { useCallback, useEffect, useState } from "react";
import { site } from "@/content/canvas";

/** 0 → 10, on a cubic ease-out. Fast enough to feel like a machine settling. */
const COUNT_MS = 720;
const HOLD_MS = 140;
const MARK_MS = 360;
const LIFT_MS = 560;

type Phase = "idle" | "counting" | "mark" | "lifting";

/**
 * The intro gate.
 *
 * Counts in, shows the wordmark, then lifts away to reveal the harbour. The
 * page underneath is already rendered and already scrolled to the top — this is
 * a curtain, not a loading screen, and it never pretends to be waiting on
 * anything.
 *
 * Three properties make it safe rather than merely brief:
 *
 *   It only ever runs if the inline script in the layout put `.booting` on the
 *   document, which it does before first paint and never on a reader who has
 *   already seen it this session or who has asked for reduced motion.
 *
 *   It releases the page in a cleanup, so an unmount for any reason — an error
 *   boundary, a fast navigation — unlocks scrolling on the way out.
 *
 *   It has a visible, focusable skip. A timed gate with no exit is a WCAG 2.2.1
 *   failure, and the fact that it is short is not a defence.
 */
export function Boot() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(0);

  const release = useCallback(() => {
    const root = document.documentElement;
    root.classList.remove("booting");
    root.removeAttribute("data-boot");
    try {
      sessionStorage.setItem("hh-intro-seen", "1");
    } catch {
      // Storage disabled. The timeout in the layout still releases the page.
    }
  }, []);

  const liftOut = useCallback(() => {
    setPhase("lifting");
    release();
    window.setTimeout(() => setPhase("idle"), LIFT_MS + 80);
  }, [release]);

  useEffect(() => {
    // The attribute, not the class: the class is the scroll lock and has a
    // timeout on it, so on a slow first load it can already be gone by the time
    // this mounts. The decision to play has no such deadline.
    const root = document.documentElement;
    if (root.getAttribute("data-boot") !== "1") return;

    // Nobody is watching a hidden tab, and `requestAnimationFrame` does not run
    // in one — so the curtain would sit there, unseen, holding the scroll lock
    // until the failsafe expired. Skip it and hand the page over.
    if (document.hidden) {
      release();
      return;
    }

    let frame = 0;
    let markTimer = 0;
    let liftTimer = 0;
    const started = performance.now();

    const advance = () => {
      const progress = Math.min((performance.now() - started) / COUNT_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setPhase("counting");
      setCount(Math.round(eased * 10));

      if (progress < 1) {
        // rAF for smoothness, a timer so a throttled tab still finishes. Both
        // read the clock rather than counting frames, so whichever wins the
        // race the animation runs for the same length of time.
        frame = requestAnimationFrame(advance);
        markTimer = window.setTimeout(advance, 100);
        return;
      }

      markTimer = window.setTimeout(() => {
        setPhase("mark");
        liftTimer = window.setTimeout(liftOut, MARK_MS);
      }, HOLD_MS);
    };

    advance();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(markTimer);
      clearTimeout(liftTimer);
      release();
    };
  }, [liftOut, release]);

  if (phase === "idle") return null;

  return (
    <div className="boot" data-phase={phase}>
      <p className="eyebrow text-ivory-faint">
        {site.city} · {site.year}
      </p>

      <div className="boot-stack" aria-hidden="true">
        <span className="boot-count display text-hero tabular-nums text-ivory">
          {count}
        </span>
        <span className="boot-mark display text-display text-ivory">{site.name}</span>
      </div>

      <div className="grid grid-cols-[1fr_auto] items-center gap-6">
        <div className="boot-rule" aria-hidden="true">
          <span style={{ width: `${count * 10}%` }} />
        </div>
        <button type="button" onClick={liftOut} className="eyebrow text-ivory-faint">
          Skip
        </button>
      </div>
    </div>
  );
}
