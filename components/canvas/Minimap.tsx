"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { zones, TRACK_VW } from "@/content/canvas";

type MinimapProps = {
  progress: MotionValue<number>;
  activeZone: number;
  goToZone: (index: number) => void;
};

/**
 * Where you are on the harbour, and a way to get somewhere else.
 *
 * The zone blocks are real buttons rather than decoration — this is one of the
 * three ways to reach zone three without a mouse.
 */
export function Minimap({ progress, activeZone, goToZone }: MinimapProps) {
  // The window covers one viewport width of a TRACK_VW-wide track.
  const viewportFraction = 1 / TRACK_VW;
  const left = useTransform(
    progress,
    (value) => `${value * (1 - viewportFraction) * 100}%`,
  );

  return (
    <aside
      className="pointer-events-auto fixed bottom-5 right-5 z-40 hidden w-64 border-2 border-ink bg-paper shadow-hard md:block"
      aria-label="Canvas minimap"
    >
      <p className="border-b-2 border-ink px-2.5 py-1.5 font-mono text-meta uppercase tracking-[0.18em]">
        Harbour chart
      </p>

      <div className="relative flex h-16 p-1.5">
        {zones.map((zone, index) => (
          <button
            key={zone.id}
            type="button"
            onClick={() => goToZone(index)}
            style={{ flexGrow: zone.width }}
            aria-current={activeZone === index ? "true" : undefined}
            className={`group relative mr-1 flex min-w-0 items-end border-2 border-ink px-1.5 py-1 text-left transition-colors last:mr-0 ${
              activeZone === index ? "bg-highlighter" : "bg-paper-off hover:bg-grid"
            }`}
          >
            <span className="truncate font-mono text-micro uppercase tracking-[0.12em]">
              {zone.label}
            </span>
          </button>
        ))}

        {/* The viewport, floating over the chart. */}
        <motion.div
          aria-hidden="true"
          style={{ left, width: `${viewportFraction * 100}%` }}
          className="pointer-events-none absolute inset-y-1.5 border-2 border-orange bg-orange/15"
        />
      </div>
    </aside>
  );
}
