"use client";

import { useRef } from "react";
import { GhostCursors } from "@/components/live/GhostCursors";
import { RealCursors } from "@/components/live/RealCursors";
import { HAS_LIVEBLOCKS } from "@/components/live/LiveRoom";
import { chartBounds } from "@/content/map";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/** Water either side of the docks that cursors are allowed to wander into. */
const MARGIN = 700;

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
