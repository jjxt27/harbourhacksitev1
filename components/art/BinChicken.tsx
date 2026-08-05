"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const STORE_KEY = "harbourhack-ibis";

/** Cycled on each poke. Keep them short — it is a sticker, not a character. */
const SQUAWKS = ["Bin chicken", "Shipped it", "Got any chips", "Sydney's finest"] as const;

/**
 * The Australian White Ibis, in a startup cap. Drag him anywhere.
 *
 * Decorative and `aria-hidden`: he conveys nothing, and putting a drag-only
 * toy in the accessibility tree would add noise without adding a way to use it.
 *
 * Position is restored imperatively after mount rather than rendered from
 * storage, so the server and client agree on the first paint and there is no
 * hydration mismatch on a transform.
 */
export function BinChicken() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [squawk, setSquawk] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reduced = usePrefersReducedMotion();

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
        try {
          localStorage.setItem(STORE_KEY, JSON.stringify({ dx: x.get(), dy: y.get() }));
        } catch {
          // Position is per-session then. No loss worth handling.
        }
      }}
      onTap={poke}
      style={{ x, y, left: "calc(100vw - 7rem)", top: "52vh" }}
      // Desktop only. On the stacked mobile layout `touch-none` would swallow
      // the vertical swipe and trap scrolling wherever he happened to land.
      className="absolute z-20 hidden w-32 cursor-grab touch-none select-none md:block"
      animate={reduced ? undefined : { y: [0, -6, 0] }}
      transition={
        reduced ? undefined : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {squawk !== null ? (
        <span className="absolute -top-9 left-6 whitespace-nowrap border-2 border-ink bg-highlighter px-2 py-1 font-hand text-base leading-none shadow-hard-sm">
          {SQUAWKS[squawk]}
        </span>
      ) : null}

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
  );
}
