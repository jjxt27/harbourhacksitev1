"use client";

import { Children, useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { zones } from "@/content/canvas";
import { useCanvasPan } from "@/hooks/useCanvasPan";
import { DeckProvider } from "@/components/deck/DeckContext";
import { Masthead } from "@/components/deck/Masthead";
import { Rail } from "@/components/deck/Rail";

/**
 * The deck: three chapters read left to right.
 *
 * Children are matched to `zones` in order — one per chapter — so the layout,
 * the rail and the navigation all stay driven by a single list in
 * content/canvas.ts.
 *
 * The pan hook is unchanged from the previous design and did not need to be.
 * Wheel to horizontal, drag, arrow keys, Home/End and Tab-follow are all
 * behaviour rather than styling, and the last of those is not decoration: the
 * registration form sits in chapter three and without focus dragging the deck
 * along with it, a keyboard reader cannot get there at all.
 */
export function Deck({ children }: { children: ReactNode }) {
  const { windowRef, trackRef, x, progress, activeZone, goToZone, pannable, grabbing } =
    useCanvasPan();

  const chapters = Children.toArray(children);
  const nav = useMemo(() => ({ goToZone, activeZone }), [goToZone, activeZone]);

  return (
    <DeckProvider value={nav}>
      <Masthead activeZone={activeZone} goToZone={goToZone} />

      <div
        ref={windowRef}
        className="deck-window"
        data-pannable={pannable && !grabbing}
        data-grabbing={grabbing}
      >
        <motion.div ref={trackRef} className="deck-track" style={{ x }}>
          {zones.map((zone, index) => (
            <section
              key={zone.id}
              id={zone.id}
              aria-label={`${zone.numeral} — ${zone.label}`}
              className="deck-chapter"
              style={{ width: `${zone.width * 100}vw` }}
            >
              {chapters[index]}
            </section>
          ))}
        </motion.div>
      </div>

      <Rail progress={progress} activeZone={activeZone} goToZone={goToZone} />
    </DeckProvider>
  );
}
