"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { dryDock } from "@/content/canvas";
import { StickyNote } from "@/components/ui/StickyNote";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { useSound } from "@/hooks/useSound";

/**
 * The three judging criteria, on notes you can peel off the wall.
 *
 * Draggable, with a little inertia, but constrained to the panel they came
 * from. These carry actual information — what the weekend is judged on — so
 * they are not allowed to be thrown somewhere the reader cannot get them back
 * from. `dragConstraints` keeps them on the board; `dragSnapToOrigin` is
 * deliberately not used, because a note that springs back the instant you let
 * go never feels like an object you moved.
 *
 * The list is a real `<ul>` and the notes stay in the accessibility tree — the
 * dragging is decoration on top of content, not a replacement for it.
 *
 * Desktop only, and the `touch-none` that makes dragging work is desktop only
 * with it. Once the docks stack, the page scrolls vertically and a note holding
 * `touch-action: none` would swallow the swipe that was trying to scroll past
 * it — the reader would hit the criteria and simply stop.
 */
export function CriteriaNotes() {
  const board = useRef<HTMLUListElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  const sound = useSound();

  return (
    <ul ref={board} className="grid gap-4 sm:grid-cols-3 md:gap-3.5">
      {dryDock.criteria.map((item) => (
        <li key={item.n}>
          <motion.div
            data-no-pan=""
            drag={isDesktop && !reduced}
            dragConstraints={board}
            dragElastic={0.18}
            dragMomentum={!reduced}
            dragTransition={{ power: 0.18, timeConstant: 200 }}
            whileDrag={{ scale: 1.04, zIndex: 20, cursor: "grabbing" }}
            onDragEnd={() => sound.play("crate")}
            className="h-full md:cursor-grab md:touch-none"
          >
            <StickyNote tone={item.tone} rotate={item.rotate} tag={item.n} className="h-full">
              <strong className="block font-display text-body font-black uppercase leading-tight tracking-tight">
                {item.title}
              </strong>
              <span className="mt-2 block text-body leading-snug">{item.note}</span>
            </StickyNote>
          </motion.div>
        </li>
      ))}
    </ul>
  );
}
