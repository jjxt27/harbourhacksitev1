import type { CSSProperties, ReactNode } from "react";

/**
 * A panel standing upright on a dock, facing the camera.
 *
 * The one concession the art direction has to make, and it is worth being
 * precise about why. Everything lying in the ground plane is sheared by the
 * map — which is right for concrete, paint and cargo, and fatal for anything
 * anyone has to read or type into. A form on the ground plane is not styled
 * badly, it is unusable.
 *
 * So text that carries meaning stands up. It is not a web page floating over
 * the map: it is bolted to a coordinate on a dock, it moves and scales with the
 * harbour, and it disappears behind things the camera puts in front of it. It
 * is a sign in the world, not chrome on the glass.
 *
 * `width` is in world units, so a panel keeps its size relative to the dock it
 * is standing on rather than to the screen.
 */
export function DeckPanel({
  x,
  y,
  width,
  children,
  className = "",
}: {
  x: number;
  y: number;
  width: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className="iso-entity billboard"
      style={{ "--wx": `${x}px`, "--wy": `${y}px` } as CSSProperties}
    >
      <div
        // `data-no-pan` covers the whole panel: selecting text in an input must
        // not drag the harbour out from under it.
        data-no-pan=""
        className={`deck-panel border-2 border-ink bg-paper shadow-hard-xl ${className}`}
        style={{ width }}
      >
        {children}
      </div>
    </div>
  );
}
