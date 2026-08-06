"use client";

import { motion, useAnimationControls, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { badIdea } from "@/content/canvas";
import { ibisSpot } from "@/content/map";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const STORE_KEY = "harbourhack-ibis";

/** Cycled on each poke. Keep them short — it is a sticker, not a character. */
const SQUAWKS = ["Bin chicken", "Shipped it", "Got any chips", "Sydney's finest"] as const;

/**
 * The Australian White Ibis, in a startup cap. Drag him anywhere, or feed him.
 *
 * Decorative and `aria-hidden`: he conveys nothing, and putting a drag-only
 * toy in the accessibility tree would add noise without adding a way to use it.
 *
 * Position is restored imperatively after mount rather than rendered from
 * storage, so the server and client agree on the first paint and there is no
 * hydration mismatch on a transform.
 *
 * Feeding arrives as a DOM event on this node rather than through props. He and
 * the note are unrelated subtrees that both happen to sit in the world, and a
 * `CustomEvent` costs less than threading a ref through the map to deliver a
 * gag.
 */
/**
 * His beat around the quay: a loop of small offsets with a turn in the middle.
 *
 * `scaleX` flipping at the far end is what sells it — a bird that slides back
 * to where it started is a tween, one that turns around and walks back is an
 * animal. Slow enough (22s) to be caught out of the corner of an eye rather
 * than to demand attention.
 */
// Annotated rather than `as const`: framer-motion's keyframe types are mutable
// arrays, and a readonly tuple will not assign to them.
const PATROL: {
  x: number[];
  y: number[];
  scaleX: number[];
  /** Shared by every layer of the beat, so the turn lands where he stops. */
  times: number[];
} = {
  x: [0, 58, 96, 74, 10, -34, 0],
  y: [0, -14, 8, 22, 16, -6, 0],
  scaleX: [1, 1, 1, -1, -1, -1, 1],
  times: [0, 0.16, 0.34, 0.5, 0.68, 0.85, 1],
};

export function BinChicken() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [squawk, setSquawk] = useState<number | null>(null);
  const [fed, setFed] = useState(false);
  const [held, setHeld] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  const gulp = useAnimationControls();
  const reduced = usePrefersReducedMotion();

  // The gulp: a duck of the head and a swallow, then back to bobbing.
  //
  // The listener is on the patrolling element rather than the drag root,
  // because that element is also the one carrying `data-ibis` — the note's hit
  // test reads its box, and a root that never moves would mean feeding him
  // wherever he started rather than wherever he is.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const onFed = () => {
      setFed(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setFed(false), 2400);
      if (reduced) return;
      void gulp.start({
        rotate: [0, 14, -6, 0],
        scaleY: [1, 0.86, 1.08, 1],
        transition: { duration: 0.62, times: [0, 0.28, 0.55, 1], ease: "easeInOut" },
      });
    };

    node.addEventListener("harbourhack:fed", onFed);
    return () => node.removeEventListener("harbourhack:fed", onFed);
  }, [gulp, reduced]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (!saved) return;
      const { dx, dy } = JSON.parse(saved) as { dx: number; dy: number };
      if (Number.isFinite(dx) && Number.isFinite(dy)) {
        x.set(dx);
        y.set(dy);
      }
    } catch {
      // He just starts where he was drawn.
    }
  }, [x, y]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const poke = () => {
    if (fed) return; // let him finish his meal
    setSquawk((current) => (current === null ? 0 : (current + 1) % SQUAWKS.length));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSquawk(null), 1900);
  };

  return (
    <motion.div
      aria-hidden="true"
      drag
      dragMomentum={false}
      dragElastic={0.12}
      whileDrag={{ scale: 1.06, rotate: -4, cursor: "grabbing" }}
      onDragEnd={() => {
        setHeld(false);
        try {
          // Honest coordinates: the patrol lives on a child, so the value saved
          // here is where he was put down, not where his beat happened to be.
          localStorage.setItem(STORE_KEY, JSON.stringify({ dx: x.get(), dy: y.get() }));
        } catch {
          // Position is per-session then. No loss worth handling.
        }
      }}
      onDragStart={() => setHeld(true)}
      onTap={poke}
      data-no-pan=""
      style={{ x, y, left: ibisSpot.x, top: ibisSpot.y }}
      // Desktop only. On the stacked mobile layout `touch-none` would swallow
      // the vertical swipe and trap scrolling wherever he happened to land.
      className="absolute z-20 hidden w-32 cursor-grab touch-none select-none md:block"
    >
      {/*
        Four layers, one job each. A motion element can hold exactly one
        `animate`, and this bird is doing four independent things at four
        different speeds, so they stack rather than fight:

          root   drag, and the position that gets saved
          patrol the 22s beat around the quay — and `data-ibis`, so the hit
                 test for feeding him follows him instead of staying put
          flip   the turn at the far end of the beat
          bob    the 3.4s idle
          gulp   the swallow, on demand

        The bubble hangs off `patrol` rather than the root so it travels with
        him, and outside `flip` so his turning never mirrors the text.
      */}
      <motion.div
        ref={rootRef}
        data-ibis=""
        animate={reduced || held ? { x: 0, y: 0 } : { x: PATROL.x, y: PATROL.y }}
        transition={
          reduced || held
            ? { duration: 0.35 }
            : { duration: 22, repeat: Infinity, ease: "easeInOut", times: PATROL.times }
        }
      >
        {fed || squawk !== null ? (
          <span className="absolute -top-9 left-6 whitespace-nowrap border-2 border-ink bg-highlighter px-2 py-1 font-hand text-base leading-none shadow-hard-sm">
            {fed ? badIdea.eaten : SQUAWKS[squawk ?? 0]}
          </span>
        ) : null}

        <motion.div
          animate={reduced || held ? { scaleX: 1 } : { scaleX: PATROL.scaleX }}
          transition={
            reduced || held
              ? { duration: 0.2 }
              : { duration: 22, repeat: Infinity, ease: "easeInOut", times: PATROL.times }
          }
        >
          <motion.div
            animate={reduced ? undefined : { y: [0, -6, 0] }}
            transition={
              reduced ? undefined : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <motion.div animate={gulp} style={{ originY: 1 }}>
              <svg viewBox="0 0 130 150" className="w-full drop-shadow-[3px_3px_0_#0a0a0a]">
                <g stroke="#0a0a0a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  {/* Legs */}
                  <path d="M63 110 58 134M79 110 84 134" fill="none" />
                  <path d="M50 134h14M76 134h14" fill="none" />

                  {/* Tail plumes */}
                  <path d="M100 76c12-4 22-8 27-3 4 5-6 12-18 16z" fill="#0a0a0a" />

                  {/* Body */}
                  <ellipse cx="70" cy="88" rx="36" ry="26" fill="#ffffff" />
                  {/* Wing */}
                  <path d="M52 82c14-8 34-8 44 2-10 12-32 14-44 4z" fill="#f9f9f9" />

                  {/* Neck and head — bare black skin, the bird's tell. */}
                  <path d="M50 74c-6-12-8-24-6-34" fill="none" strokeWidth="11" />
                  <circle cx="43" cy="34" r="10.5" fill="#0a0a0a" />

                  {/* The bill: long, downcurved, unmistakable. */}
                  <path d="M35 39c-8 6-15 17-20 30" fill="none" strokeWidth="6" />

                  {/* Startup cap */}
                  <path d="M31 28a12 9 0 0 1 24 0z" fill="#ff4f00" />
                  <path d="M31 28 15 31l1 5 16-3z" fill="#ff4f00" />
                  <circle cx="43" cy="18" r="2.5" fill="#ff4f00" />
                </g>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
