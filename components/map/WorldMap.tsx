"use client";

import { Children, useMemo, type CSSProperties, type ReactNode } from "react";
import { motion } from "framer-motion";
import { WORLD, docks } from "@/content/map";
import { waterBand } from "@/content/geography";
import { PERSPECTIVE } from "@/content/iso";

const WATER: CSSProperties = {
  left: waterBand.x,
  top: waterBand.y,
  width: waterBand.width,
  height: waterBand.height,
};
import { useMapCamera } from "@/hooks/useMapCamera";
import { MapProvider } from "@/components/map/MapContext";
import { IsoDock } from "@/components/map/IsoDock";
import { Harbour } from "@/components/map/Harbour";
import { Buoys } from "@/components/map/Buoys";
import { MapChrome } from "@/components/map/MapChrome";
import { Chart } from "@/components/map/Chart";
import { BinChicken } from "@/components/art/BinChicken";
import { BadIdeaNote } from "@/components/art/BadIdeaNote";
import { CursorLayer } from "@/components/live/CursorLayer";

/**
 * Sydney Harbour, as an isometric map.
 *
 * Three nested elements, each with exactly one job, and the order matters:
 *
 *   viewport  holds the perspective and clips. Fixed to the glass.
 *   camera    pans and zooms, in screen space.
 *   world     the 10,000px map, laid flat and tilted back.
 *
 * The camera sits *outside* the tilt on purpose. Put the translation inside the
 * rotated space and a drag to the right sends the view off along a map axis
 * instead of to the right, and every gesture, every fly-to and every clamp then
 * needs the inverse projection applied before it means anything. Outside, the
 * pan is ordinary screen arithmetic and only the *bounds* need projecting —
 * which content/iso.ts does once.
 *
 * Nothing here lays anything out. There is no column, no grid and no flow: the
 * docks, the buoys, the bird and the note are all absolute world entities that
 * know their own coordinates, and the map is simply the space they are in.
 */
export function WorldMap({ children }: { children: ReactNode }) {
  const camera = useMapCamera();
  const { viewportRef, x, y, scale, activeDock, goToDockId, pannable, grabbing } = camera;

  const panels = Children.toArray(children);
  const nav = useMemo(() => ({ goToDockId, activeDock }), [goToDockId, activeDock]);

  return (
    <MapProvider value={nav}>
      <div
        ref={viewportRef}
        className="iso-viewport"
        data-pannable={pannable && !grabbing}
        data-grabbing={grabbing}
        style={
          {
            "--iso-perspective": `${PERSPECTIVE}px`,
            "--world": `${WORLD}px`,
          } as CSSProperties
        }
      >
        <motion.div className="iso-camera" style={{ x, y, scale }}>
          <div className="iso-world">
            {/* Ground, bottom to top: water, then the coastline drawn on it.
                Bounded to the strip between the shores — see waterBand. The
                viewport's own harbour blue covers everything beyond it, which
                land is sitting on anyway. */}
            <div aria-hidden="true" className="iso-water" style={WATER} />
            <div aria-hidden="true" className="iso-swell" style={WATER} />
            <Harbour />

            {docks.map((dock, index) => (
              <IsoDock key={dock.id} dock={dock} index={index}>
                {panels[index]}
              </IsoDock>
            ))}

            <Buoys />
            <BadIdeaNote />
            <BinChicken />
            <CursorLayer />
          </div>
        </motion.div>
      </div>

      <MapChrome camera={camera} />
      <Chart camera={camera} />
    </MapProvider>
  );
}
