"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { zones, TRACK_VW } from "@/content/canvas";

/**
 * The progress rail.
 *
 * A single hairline across the foot of the window, divided in proportion to the
 * chapters, with a brass marker riding it. It replaces the previous design's
 * minimap, and the difference is the point: a minimap is a game control that
 * says "there is a world here"; a rule with a marker on it is a page edge that
 * says "you are a third of the way through".
 *
 * Each segment is also a target, because on a surface with no scrollbar the
 * rail is the only thing that shows how much is left — and something that
 * communicates position should let you change it.
 */
export function Rail({
  progress,
  activeZone,
  goToZone,
}: {
  /** 0 at the start of the deck, 1 at the end. */
  progress: MotionValue<number>;
  activeZone: number;
  goToZone: (index: number) => void;
}) {
  const left = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden px-6 pb-6 sm:px-10 md:block md:px-14 md:pb-8">
      <div className="pointer-events-auto relative">
        <div className="flex items-end gap-0">
          {zones.map((zone, index) => (
            <button
              key={zone.id}
              type="button"
              onClick={() => goToZone(index)}
              aria-current={activeZone === index ? "true" : undefined}
              aria-label={`Go to chapter ${zone.numeral}, ${zone.label}`}
              className="group relative pb-3"
              style={{ width: `${(zone.width / TRACK_VW) * 100}%` }}
            >
              <span
                className={`block text-left font-sans text-micro font-medium uppercase tracking-[0.28em] transition-colors ${
                  activeZone === index ? "text-ivory" : "text-ivory-faint group-hover:text-ivory-dim"
                }`}
              >
                {zone.numeral}
              </span>
            </button>
          ))}
        </div>

        <div className="hairline relative">
          {/* The marker: a measurement tick, not a dot. It rides on a
              transform rather than `left`, so it is composited and never
              reflows the rule underneath it. */}
          <motion.span
            aria-hidden="true"
            className="absolute top-1/2 block h-2.5 w-px bg-brass"
            style={{ left, x: "-50%", y: "-50%" }}
          />
        </div>
      </div>
    </div>
  );
}
