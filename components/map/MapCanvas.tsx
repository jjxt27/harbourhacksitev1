"use client";

import { Children, useMemo, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionTemplate, useTransform } from "framer-motion";
import { WORLD, docks } from "@/content/map";
import { useMapCamera } from "@/hooks/useMapCamera";
import { MapProvider } from "@/components/map/MapContext";
import { Dock } from "@/components/map/Dock";
import { Harbour } from "@/components/map/Harbour";
import { Buoys } from "@/components/map/Buoys";
import { MapChrome } from "@/components/map/MapChrome";
import { Chart } from "@/components/map/Chart";
import { BinChicken } from "@/components/art/BinChicken";
import { BadIdeaNote } from "@/components/art/BadIdeaNote";
import { CursorLayer } from "@/components/live/CursorLayer";

/** Chart-grid pitch at 1x zoom, in world pixels. */
const GRID = 48;

/**
 * The harbour.
 *
 * Children are matched to `docks` in order — one child per dock — so the
 * layout, the chart and the navigation all stay driven by the single list in
 * content/map.ts.
 */
export function MapCanvas({ children }: { children: ReactNode }) {
  const camera = useMapCamera();
  const { viewportRef, x, y, scale, activeDock, goToDockId, pannable, grabbing } = camera;

  const panels = Children.toArray(children);
  const nav = useMemo(() => ({ goToDockId, activeDock }), [goToDockId, activeDock]);

  // The water is one viewport-sized layer whose grid is offset by the camera.
  // Same parallax as painting it across the whole world, a fraction of the cost.
  const oceanPosition = useMotionTemplate`${x}px ${y}px`;
  const oceanSize = useTransform(scale, (s) => `${GRID * s}px ${GRID * s}px`);

  return (
    <MapProvider value={nav}>
      {/* `--world` is declared here rather than on the world itself: custom
          properties inherit, and framer-motion's `style` prop is typed for
          transforms, not for arbitrary declarations. */}
      <div
        ref={viewportRef}
        className="map-viewport"
        data-pannable={pannable && !grabbing}
        data-grabbing={grabbing}
        style={{ "--world": `${WORLD}px` } as CSSProperties}
      >
        <motion.div
          aria-hidden="true"
          className="map-ocean"
          style={{ backgroundPosition: oceanPosition, backgroundSize: oceanSize }}
        />
        <div aria-hidden="true" className="map-swell" />

        <motion.div className="map-world" style={{ x, y, scale }}>
          {/* The ground. Everything below stands on this. */}
          <Harbour />
          <Buoys />

          {docks.map((dock, index) => (
            <Dock key={dock.id} dock={dock} index={index}>
              {panels[index]}
            </Dock>
          ))}

          {/* These live inside the world, so they travel with the harbour
              rather than sticking to the glass. */}
          <BadIdeaNote />
          <BinChicken />
          <CursorLayer />
        </motion.div>
      </div>

      <MapChrome camera={camera} />
      <Chart camera={camera} />
    </MapProvider>
  );
}
