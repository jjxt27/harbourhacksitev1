"use client";

import { useRef } from "react";
import { GhostCursors } from "@/components/live/GhostCursors";
import { RealCursors } from "@/components/live/RealCursors";
import { HAS_LIVEBLOCKS } from "@/components/live/LiveRoom";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * The cursor plane.
 *
 * Lives inside the panning track, so cursors travel with the content rather
 * than sticking to the viewport. Never rendered on touch, where there is no
 * pointer to mirror, and never under reduced motion, where six drifting
 * cursors are exactly the ambient movement the reader asked not to have.
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
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
    >
      {HAS_LIVEBLOCKS ? (
        <RealCursors layerRef={layerRef} showGhosts />
      ) : (
        <GhostCursors count={6} layerRef={layerRef} />
      )}
    </div>
  );
}
