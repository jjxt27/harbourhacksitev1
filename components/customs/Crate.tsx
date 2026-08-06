"use client";

import { motion } from "framer-motion";
import type { RefObject } from "react";
import type { Container } from "@/content/customs";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Contrast on the two container classes, both measured against their own fill:
 *   build  — ink on International Orange, 5.7:1
 *   market — paper on Ferry Green,        4.7:1
 * Swapping either foreground breaks AA, so the pair is fixed here rather than
 * left to the call site.
 */
const CLASS_FILL = {
  build: "bg-orange text-ink",
  market: "bg-ferry text-paper",
} as const;

type CrateProps = {
  container: Container;
  loaded: boolean;
  /** True when the barge is full and this crate is not already on it. */
  blocked: boolean;
  bargeRef: RefObject<HTMLElement | null>;
  onToggle: () => void;
  onDropOnBarge: () => void;
  onMissBarge: () => void;
};

/**
 * One shipping container.
 *
 * Draggable, and also a plain button. That is not belt-and-braces — drag is a
 * pointer-only gesture with no keyboard equivalent, and this control is the
 * only way to complete a registration, so shipping it drag-only would put the
 * form behind a WCAG 2.1.1 failure. Enter and Space load and unload it, and the
 * hit target is the same element either way.
 */
export function Crate({
  container,
  loaded,
  blocked,
  bargeRef,
  onToggle,
  onDropOnBarge,
  onMissBarge,
}: CrateProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.button
      type="button"
      data-no-pan=""
      aria-pressed={loaded}
      aria-disabled={blocked || undefined}
      onClick={onToggle}
      drag={!loaded && !blocked}
      dragSnapToOrigin
      dragElastic={0.22}
      dragMomentum={false}
      whileDrag={{ scale: 1.06, zIndex: 30, cursor: "grabbing" }}
      whileHover={reduced ? undefined : { y: -3 }}
      transition={{ type: "spring", stiffness: 520, damping: 34 }}
      onDragEnd={(event, info) => {
        const barge = bargeRef.current;
        if (!barge) return onMissBarge();

        // Viewport coordinates on both sides, so the map's pan and zoom cancel
        // out and this needs to know nothing about the camera.
        const pointer = event as PointerEvent;
        const px = Number.isFinite(pointer?.clientX) ? pointer.clientX : info.point.x;
        const py = Number.isFinite(pointer?.clientY) ? pointer.clientY : info.point.y;

        const box = barge.getBoundingClientRect();
        const inside = px >= box.left && px <= box.right && py >= box.top && py <= box.bottom;
        if (inside) onDropOnBarge();
        else onMissBarge();
      }}
      className={`corrugated relative w-[8.5rem] shrink-0 border-2 border-ink px-2.5 pb-2 pt-1.5 text-left shadow-hard touch-none ${
        CLASS_FILL[container.class]
      } ${loaded ? "opacity-35" : "cursor-grab"} ${
        blocked ? "cursor-not-allowed opacity-45" : ""
      }`}
    >
      <span className="block font-mono text-micro uppercase tracking-[0.18em] opacity-80">
        {container.code}
      </span>
      <span className="mt-0.5 block font-display text-body font-black uppercase leading-none tracking-tight">
        {container.label}
      </span>
      {/* Corner castings. */}
      <span aria-hidden="true" className="absolute -bottom-px -left-px size-1.5 bg-ink" />
      <span aria-hidden="true" className="absolute -bottom-px -right-px size-1.5 bg-ink" />
    </motion.button>
  );
}
