"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import { badIdea } from "@/content/canvas";
import { ibisSpot } from "@/content/map";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { useSound } from "@/hooks/useSound";

/** Where the note starts, in world pixels — just along the deck from the bird. */
const SPOT = { x: ibisSpot.x - 250, y: ibisSpot.y + 40 };

/**
 * A bad idea on a sticky note. Feed it to the ibis.
 *
 * The bird is found by selector at drop time rather than through a ref or a
 * context. Both of them live inside the world, both are decorative, and neither
 * needs to know the other exists until a note lands on one — plumbing a ref
 * across two unrelated subtrees to deliver a gag is a worse trade than one
 * `querySelector`.
 *
 * Decorative and `aria-hidden`, same as the bird. It is drag-only with no
 * keyboard path, which is only acceptable because there is nothing behind it:
 * the joke is the entire content, and nobody who never finds it has missed
 * anything the site was supposed to tell them.
 */
export function BadIdeaNote() {
  const [eaten, setEaten] = useState(false);
  const reduced = usePrefersReducedMotion();
  const sound = useSound();

  return (
    // Positioned on the map, then stood upright. The billboard has to be a
    // plain element rather than the motion one: `drag` writes `transform`
    // inline, which would overwrite the transform doing the standing up.
    <div
      className="iso-entity billboard hidden md:block"
      style={{ "--wx": `${SPOT.x}px`, "--wy": `${SPOT.y}px` } as CSSProperties}
    >
    <AnimatePresence>
      {eaten ? null : (
        <motion.div
          aria-hidden="true"
          data-no-pan=""
          drag
          dragMomentum={false}
          dragElastic={0.15}
          // Above the bird while it is in hand, so it reads as being carried
          // to him rather than sliding underneath him.
          whileDrag={{ scale: 1.07, rotate: 3, zIndex: 30, cursor: "grabbing" }}
          exit={
            reduced
              ? { opacity: 0 }
              : // Down the hatch: shrink towards the bill rather than fade.
                { scale: 0, rotate: -25, y: -14, opacity: 0 }
          }
          transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
          onDragEnd={(event, info) => {
            const bird = document.querySelector("[data-ibis]");
            if (!bird) return;

            // Viewport coordinates on both sides, so the camera's pan and zoom
            // cancel out and this needs to know nothing about either.
            const pointer = event as PointerEvent;
            const px = Number.isFinite(pointer?.clientX) ? pointer.clientX : info.point.x;
            const py = Number.isFinite(pointer?.clientY) ? pointer.clientY : info.point.y;

            const box = bird.getBoundingClientRect();
            const hit = px >= box.left && px <= box.right && py >= box.top && py <= box.bottom;
            if (!hit) return;

            bird.dispatchEvent(new CustomEvent("harbourhack:fed", { bubbles: false }));
            sound.play("drop");
            setEaten(true);
          }}
          // Desktop only, for the same reason the bird is: on the stacked mobile
          // layout `touch-none` would swallow the vertical swipe and trap
          // scrolling wherever the note happened to land.
          className="relative z-20 w-44 -rotate-2 cursor-grab touch-none select-none border-2 border-ink bg-paper p-3 shadow-hard"
        >
          <p className="border-b-2 border-ink/25 pb-1.5 font-mono text-micro uppercase tracking-[0.18em] text-alert">
            {badIdea.tag}
          </p>
          <p className="mt-2 font-hand text-body leading-tight">{badIdea.text}</p>
          <p className="mt-2 font-mono text-micro lowercase tracking-[0.1em] text-slate">
            {badIdea.hint}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
}
