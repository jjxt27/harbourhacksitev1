"use client";

import { useRef } from "react";
import { GhostCursors } from "@/components/live/GhostCursors";
import { RealCursors } from "@/components/live/RealCursors";
import { HAS_LIVEBLOCKS } from "@/components/live/LiveRoom";
import { chartBounds } from "@/content/map";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Water either side of the docks that cursors are allowed to wander into.
 *
 * Kept tight. This layer is sized in world pixels, so every extra hundred of
 * margin is another few million pixels of surface for a plane that only ever
 * holds six small markers.
 */
const MARGIN = 260;

/**
 * The cursor plane.
 *
 * Lives inside the world, so cursors travel with the content rather than
 * sticking to the glass. Never rendered on touch, where there is no pointer to
 * mirror, and never under reduced motion, where six drifting cursors are
 * exactly the ambient movement the reader asked not to have.
 *
 * It covers the docks and a margin of water rather than all 10,000px: ghosts
 * spread over the whole world would spend almost all of their time in empty
 * ocean nobody is looking at.
 *
 * Whether a room exists is a build-time constant, so the branch below is
 * settled before render — no room hook is ever called without a provider
 * above it.
 */
export function CursorLayer() {
  const layerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();

  if (!isDesktop || reduced) return null;

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      // No `preserve-3d` here: `overflow: hidden` forces the used value back to
      // flat regardless, so declaring it would only imply a 3D context that
      // cannot exist. Cursors are flat markers on the ground and want that.
      className="pointer-events-none absolute z-30 overflow-hidden"
      style={{
        left: chartBounds.minX - MARGIN,
        top: chartBounds.minY - MARGIN,
        width: chartBounds.maxX - chartBounds.minX + MARGIN * 2,
        height: chartBounds.maxY - chartBounds.minY + MARGIN * 2,
      }}
    >
      {HAS_LIVEBLOCKS ? (
        <RealCursors layerRef={layerRef} showGhosts />
      ) : (
        <GhostCursors count={6} layerRef={layerRef} />
      )}
    </div>
  );
}
