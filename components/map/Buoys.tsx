"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { buoys } from "@/content/map";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Navigation marks floating between the docks.
 *
 * Draggable and throwable — they are the cheapest possible signal that this is
 * a surface you can touch rather than a page you read. `data-no-pan` stops the
 * camera taking the gesture; `dragMomentum` gives them the bit of drift that
 * makes them feel like objects.
 *
 * Entirely decorative, so the whole layer is hidden from assistive technology
 * and none of it is reachable by keyboard. Nothing is lost by not having it.
 */
export function Buoys() {
  const reduced = usePrefersReducedMotion();

  return (
    // No wrapper. A grouping div here would be a full-world element — a hundred
    // million pixels of backing store, and a 3D rendering context between the
    // world and every billboard inside it, which flattens them unless it also
    // carries `preserve-3d`. Buoys are siblings of the docks instead.
    <>
      {buoys.map((buoy, index) => (
        // A buoy is a vertical object, so it stands rather than lies. The
        // billboard wraps the draggable element rather than being on it —
        // `drag` writes `transform` inline and would overwrite it.
        <div
          key={buoy.id}
          aria-hidden="true"
          className="iso-entity billboard z-10 hidden md:block"
          style={{ "--wx": `${buoy.x}px`, "--wy": `${buoy.y}px` } as CSSProperties}
        >
        <motion.div
          data-no-pan=""
          drag
          dragElastic={0.35}
          dragMomentum={!reduced}
          dragTransition={{ power: 0.22, timeConstant: 260 }}
          whileDrag={{ scale: 1.12 }}
          animate={reduced ? undefined : { y: [0, -9, 0] }}
          transition={
            reduced
              ? undefined
              : {
                  duration: 4.6 + index * 0.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="pointer-events-auto relative cursor-grab touch-none active:cursor-grabbing"
        >
          {buoy.kind === "can" ? <CanBuoy /> : <CardinalBuoy />}
        </motion.div>
        </div>
      ))}
    </>
  );
}

function CanBuoy() {
  return (
    <svg width="44" height="60" viewBox="0 0 44 60" fill="none">
      <path d="M8 30h28v20a14 14 0 0 1-28 0z" fill="#ff4f00" stroke="#0a0a0a" strokeWidth="2.5" />
      <rect x="8" y="30" width="28" height="7" fill="#0a0a0a" />
      <rect x="18" y="6" width="8" height="26" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2.5" />
      <circle cx="22" cy="6" r="5" fill="#e2ff31" stroke="#0a0a0a" strokeWidth="2.5" />
    </svg>
  );
}

function CardinalBuoy() {
  return (
    <svg width="40" height="66" viewBox="0 0 40 66" fill="none">
      <path d="M6 36h28v18a14 14 0 0 1-28 0z" fill="#0a0a0a" />
      <path d="M6 36h28v-8H6z" fill="#e2ff31" stroke="#0a0a0a" strokeWidth="2.5" />
      <rect x="16" y="10" width="8" height="20" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2.5" />
      <path d="M20 2l7 9H13z" fill="#0a0a0a" />
    </svg>
  );
}
