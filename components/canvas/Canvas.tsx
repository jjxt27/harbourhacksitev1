"use client";

import { Children, useMemo, type ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import { zones } from "@/content/canvas";
import { useCanvasPan } from "@/hooks/useCanvasPan";
import { Minimap } from "@/components/canvas/Minimap";
import { ZoneNav } from "@/components/canvas/ZoneNav";
import { CanvasProvider } from "@/components/canvas/CanvasContext";
import { CursorLayer } from "@/components/live/CursorLayer";
import { BinChicken } from "@/components/art/BinChicken";

/**
 * The pannable harbour.
 *
 * Children are matched to `zones` in order — one child per zone — so the
 * layout, the minimap and the navigation all stay driven by a single list in
 * content/canvas.ts.
 */
export function Canvas({ children }: { children: ReactNode }) {
  const { windowRef, trackRef, x, progress, activeZone, goToZone, pannable, grabbing } =
    useCanvasPan();

  const panels = Children.toArray(children);
  // The ground drifts at a fraction of the canvas speed, so the chart reads as
  // being further away than the content sitting on it.
  const topoX = useTransform(progress, [0, 1], [0, -220]);
  const nav = useMemo(() => ({ goToZone, activeZone }), [goToZone, activeZone]);

  return (
    <CanvasProvider value={nav}>
      <div className="ground" aria-hidden="true">
        <motion.div className="ground-topo" style={{ x: topoX }} />
      </div>

      <ZoneNav activeZone={activeZone} goToZone={goToZone} />

      <div
        ref={windowRef}
        className="canvas-window"
        data-pannable={pannable && !grabbing}
        data-grabbing={grabbing}
      >
        <motion.div ref={trackRef} className="canvas-track" style={{ x }}>
          {zones.map((zone, index) => (
            <section
              key={zone.id}
              id={zone.id}
              aria-label={zone.label}
              className="canvas-zone"
              style={{ width: `${zone.width * 100}vw` }}
            >
              {panels[index]}
            </section>
          ))}

          {/* Both live inside the track, so they pan with the content. */}
          <BinChicken />
          <CursorLayer />
        </motion.div>
      </div>

      <Minimap progress={progress} activeZone={activeZone} goToZone={goToZone} />
    </CanvasProvider>
  );
}
