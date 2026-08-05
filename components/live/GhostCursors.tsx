"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { cursorRoles, type CursorRole } from "@/content/canvas";
import { Cursor, CURSOR_COLOURS } from "@/components/live/Cursor";

type Ghost = {
  handle: string;
  role: CursorRole;
  colour: (typeof CURSOR_COLOURS)[number];
};

type Motion = {
  fromX: number; fromY: number;
  toX: number; toY: number;
  start: number;
  duration: number;
  /** Timestamp to sit still until, so movement is not relentless. */
  restUntil: number;
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const between = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Simulated peers.
 *
 * These are ambience, not people: they only appear when the room is genuinely
 * empty, they carry generated handles rather than invented names, and they
 * stop entirely under reduced motion. The moment a real peer joins, the caller
 * drops them.
 *
 * Positions are written straight to the DOM inside one animation frame loop —
 * putting six moving cursors through React state would re-render the canvas
 * sixty times a second for decoration.
 */
export function GhostCursors({
  count,
  layerRef,
}: {
  count: number;
  layerRef: RefObject<HTMLDivElement | null>;
}) {
  const [ghosts] = useState<Ghost[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      handle: `Crew ${String(Math.floor(Math.random() * 89) + 10)}`,
      role: cursorRoles[i % cursorRoles.length],
      colour: CURSOR_COLOURS[i % CURSOR_COLOURS.length],
    })),
  );

  const nodes = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const bounds = () => ({
      w: Math.max(1, layer.clientWidth - 160),
      h: Math.max(1, layer.clientHeight - 90),
    });

    const { w, h } = bounds();
    const motions: Motion[] = ghosts.map(() => {
      const x = between(0, w);
      const y = between(0, h);
      return {
        fromX: x, fromY: y, toX: x, toY: y,
        start: performance.now(),
        duration: 1,
        restUntil: performance.now() + between(0, 1800),
      };
    });

    let frame = 0;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const area = bounds();

      for (let i = 0; i < motions.length; i += 1) {
        const node = nodes.current[i];
        const motion = motions[i];
        if (!node) continue;

        const progress = Math.min(1, (now - motion.start) / motion.duration);
        const eased = easeInOut(progress);
        const x = motion.fromX + (motion.toX - motion.fromX) * eased;
        const y = motion.fromY + (motion.toY - motion.fromY) * eased;
        node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;

        if (progress >= 1 && now >= motion.restUntil) {
          // Short hops most of the time, an occasional long traverse.
          const far = Math.random() < 0.25;
          motion.fromX = motion.toX;
          motion.fromY = motion.toY;
          motion.toX = Math.min(area.w, Math.max(0, motion.fromX + between(-1, 1) * (far ? area.w * 0.5 : 260)));
          motion.toY = Math.min(area.h, Math.max(0, motion.fromY + between(-1, 1) * (far ? area.h * 0.5 : 190)));
          motion.start = now;
          motion.duration = between(1400, 3200) * (far ? 1.6 : 1);
          motion.restUntil = now + motion.duration + between(400, 2600);
        }
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ghosts, layerRef]);

  return (
    <>
      {ghosts.map((ghost, index) => (
        <Cursor
          key={ghost.handle + index}
          ref={(node) => { nodes.current[index] = node; }}
          handle={ghost.handle}
          role={ghost.role}
          colour={ghost.colour}
        />
      ))}
    </>
  );
}
