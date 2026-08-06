"use client";

import { useRef } from "react";
import { useMotionValueEvent } from "framer-motion";
import { chartBounds, docks } from "@/content/map";
import { landPaths } from "@/content/geography";
import type { MapCamera } from "@/hooks/useMapCamera";

const BOX = { w: 184, h: 148 };
/** Water shown around the outermost docks, in world pixels. */
const MARGIN = 900;

const frame = {
  minX: chartBounds.minX - MARGIN,
  minY: chartBounds.minY - MARGIN,
  maxX: chartBounds.maxX + MARGIN,
  maxY: chartBounds.maxY + MARGIN,
};

/** One scale for both axes, so the chart is never stretched. */
const K = Math.min(
  BOX.w / (frame.maxX - frame.minX),
  BOX.h / (frame.maxY - frame.minY),
);

const toChart = (wx: number, wy: number) => ({
  left: (wx - frame.minX) * K,
  top: (wy - frame.minY) * K,
});

/**
 * The chart in the corner: where the docks are, and which part of the water you
 * are currently looking at.
 *
 * The viewport rectangle is written straight to the element's style on every
 * camera change rather than held in state. It updates on every animation frame
 * of a pan, and a React render per frame to move one box is the wrong trade.
 */
export function Chart({ camera }: { camera: MapCamera }) {
  const { x, y, scale, activeDock, goToDock } = camera;
  const viewRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(x, "change", () => {
    const el = viewRef.current;
    if (!el) return;
    const s = scale.get();
    if (!s) return;

    // The camera equation, solved for the world rectangle currently on screen.
    const { left, top } = toChart(-x.get() / s, -y.get() / s);
    el.style.transform = `translate(${left}px, ${top}px)`;
    el.style.width = `${(window.innerWidth / s) * K}px`;
    el.style.height = `${(window.innerHeight / s) * K}px`;
  });

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-40 hidden md:block">
      <div className="pointer-events-auto border-2 border-ink bg-paper shadow-hard">
        <p className="border-b-2 border-ink bg-ink px-2.5 py-1.5 font-mono text-micro uppercase tracking-[0.18em] text-highlighter">
          Port chart
        </p>

        <div
          className="relative overflow-hidden bg-harbour"
          style={{ width: BOX.w, height: BOX.h }}
        >
          {/* The same coastline as the world, at chart scale. Drawing it from
              the same paths is what makes this a chart of somewhere rather
              than three squares on a blue field. */}
          <svg
            aria-hidden="true"
            viewBox={`${frame.minX} ${frame.minY} ${frame.maxX - frame.minX} ${frame.maxY - frame.minY}`}
            className="absolute inset-0 size-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {landPaths.map((d, index) => (
              <path key={index} d={d} fill="#f5f5f5" stroke="#0a0a0a" strokeWidth="30" />
            ))}
          </svg>

          <div
            ref={viewRef}
            aria-hidden="true"
            className="absolute left-0 top-0 border-2 border-orange will-change-transform"
          />

          {docks.map((dock, index) => {
            const { left, top } = toChart(dock.x, dock.y);
            return (
              <button
                key={dock.id}
                type="button"
                onClick={() => goToDock(index)}
                aria-label={`Go to ${dock.label}`}
                aria-current={activeDock === index ? "true" : undefined}
                className={`absolute border-2 border-ink transition-colors ${
                  activeDock === index ? "bg-highlighter" : "bg-grid hover:bg-highlighter"
                }`}
                style={{
                  left,
                  top,
                  width: dock.width * K,
                  height: dock.height * K,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
