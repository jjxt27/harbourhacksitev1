"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { INTRO_STEP } from "@/content/intro";
import { IntroFeed, INTRO_STEPS } from "@/components/intro/IntroFeed";
import { useHasHash, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/** How long the plate takes to lift. Must match `.intro` in globals.css. */
const LIFT = 520;

type Phase = "playing" | "leaving" | "done";

/**
 * Holds the intro over the canvas, then gets out of the way.
 *
 * Three things this has to get right, all of them keyboard problems:
 *
 * 1. **The canvas is `inert` while the plate is up.** Without it, Tab walks
 *    into a form nobody can see — the plate is opaque and fixed, so focus
 *    would land on controls three layers down and invisible. Marking the
 *    subtree inert takes the whole canvas out of the tab order and out of the
 *    accessibility tree until it is actually on screen.
 * 2. **Escape dismisses.** The plate is the only thing between a keyboard
 *    visitor and the registration form.
 * 3. **A deep link skips it.** Arriving at `#setting-sail` means someone was
 *    sent to the form, and making them dismiss a plate first is a bad joke.
 *
 * The plate is up in the server markup as well as on the client, so there is no
 * flash of canvas before the intro claims the screen.
 */
export function IntroGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("playing");
  const [ticks, setTicks] = useState(0);
  const reduced = usePrefersReducedMotion();
  const deepLinked = useHasHash();

  const dismiss = useCallback(() => {
    setPhase((current) => (current === "playing" ? "leaving" : current));
  }, []);

  const up = phase !== "done" && !deepLinked;

  /*
    Reduced motion gets the finished plate: every row present and every figure
    at its final value. Derived rather than written, so there is no branch that
    has to remember to fast-forward the counter.
  */
  const step = reduced ? INTRO_STEPS : ticks;

  useEffect(() => {
    if (reduced || phase !== "playing") return;

    const timer = setInterval(() => {
      setTicks((current) => {
        if (current >= INTRO_STEPS) {
          clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, INTRO_STEP);

    return () => clearInterval(timer);
  }, [reduced, phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = setTimeout(() => setPhase("done"), reduced ? 0 : LIFT);
    return () => clearTimeout(timer);
  }, [phase, reduced]);

  useEffect(() => {
    if (!up) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKeyDown);

    // The plate owns the screen while it is up, so the document must not scroll
    // behind it — which it otherwise would on mobile, where the zones are a
    // normal column rather than a fixed-height track.
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previous;
    };
  }, [up, dismiss]);

  return (
    <>
      <div inert={up}>{children}</div>
      {up ? <IntroFeed step={step} onDismiss={dismiss} leaving={phase === "leaving"} /> : null}
    </>
  );
}
