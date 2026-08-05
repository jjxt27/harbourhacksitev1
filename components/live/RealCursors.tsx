"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useOthers, useUpdateMyPresence } from "@liveblocks/react";
import { Cursor, CURSOR_COLOURS } from "@/components/live/Cursor";
import { GhostCursors } from "@/components/live/GhostCursors";
import { useRole } from "@/hooks/useRole";

/** Reading layout on every pointer move would jank the pan; 60ms is plenty. */
const RECT_TTL = 60;

/**
 * Everyone else in the room, plus ghosts while it is empty.
 *
 * Cursor positions travel as track coordinates, so a peer panned to zone three
 * still sees this cursor over the thing it is actually pointing at.
 */
export function RealCursors({
  layerRef,
  showGhosts,
}: {
  layerRef: RefObject<HTMLDivElement | null>;
  showGhosts: boolean;
}) {
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();
  const { role, handle } = useRole();

  // Keep presence in step with the role the reader picked.
  useEffect(() => {
    if (!role || !handle) return;
    updateMyPresence({ role, handle });
  }, [role, handle, updateMyPresence]);

  const rect = useRef<{ left: number; top: number; at: number } | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      if (!rect.current || now - rect.current.at > RECT_TTL) {
        const box = layer.getBoundingClientRect();
        rect.current = { left: box.left, top: box.top, at: now };
      }
      updateMyPresence({
        cursor: {
          x: Math.round(event.clientX - rect.current.left),
          y: Math.round(event.clientY - rect.current.top),
        },
      });
    };

    const onLeave = () => updateMyPresence({ cursor: null });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [layerRef, updateMyPresence]);

  const live = others.filter((other) => other.presence.cursor);

  return (
    <>
      {live.map((other) => (
        <Cursor
          key={other.connectionId}
          x={other.presence.cursor!.x}
          y={other.presence.cursor!.y}
          role={other.presence.role ?? "Tech"}
          handle={other.presence.handle ?? "Crew"}
          colour={CURSOR_COLOURS[other.connectionId % CURSOR_COLOURS.length]}
        />
      ))}

      {/* Ghosts stand down the moment anyone real is on the canvas. */}
      {showGhosts && live.length === 0 ? <GhostCursors count={6} layerRef={layerRef} /> : null}
    </>
  );
}
