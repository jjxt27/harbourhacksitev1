"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { WORLD, SPAWN, ZOOM, docks, dockCentre } from "@/content/map";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const SPRING = { stiffness: 240, damping: 40, mass: 0.6 };

/** Keeps a Tab-focused element off the very edge of the window. */
const FOCUS_MARGIN = 110;
/** Breathing room around a dock when the camera flies to it. */
const DOCK_PADDING = 100;
/**
 * Floor on the fly-to zoom.
 *
 * Framing a whole dock is only worth doing while the dock is still readable at
 * the zoom it takes. Below about 0.7 the body type on a dock lands under 12px
 * and "fit the dock" quietly becomes "show them something they cannot read", so
 * past that point the camera stops zooming out and lets them pan instead.
 */
const MIN_FIT = 0.7;
/** Arrow-key pan distance, in screen pixels. Shift multiplies it. */
const NUDGE = 140;
const NUDGE_FAST = 3;

export type MapCamera = {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  /** Bind these three to the world's transform, in this order: translate then scale. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  activeDock: number;
  goToDock: (index: number) => void;
  goToDockId: (id: string) => void;
  zoomBy: (factor: number) => void;
  resetView: () => void;
  /** False on mobile, where the docks stack into a scrolling column instead. */
  pannable: boolean;
  grabbing: boolean;
};

/**
 * The camera over the harbour.
 *
 * The world is a fixed {@link WORLD}px square and this hook decides which part
 * of it you are looking at, as `translate(x, y) scale(s)` with the origin at the
 * world's top-left corner. A world point maps to the screen as
 * `screen = camera + world * scale`, and every operation below is that one
 * equation rearranged.
 *
 * Why the camera is driven by hand rather than by `<motion.div drag>`:
 * zoom-to-cursor has to move `x`/`y` at the same moment `scale` changes, to keep
 * the point under the pointer pinned. `drag` owns `x`/`y` and cannot be told to
 * do that, and `dragConstraints` are measured in the parent's coordinate space,
 * so they read as the wrong size the moment the child is scaled. Three motion
 * values and the arithmetic is less code than fighting either.
 *
 * Pointer input is not the only input, and on this site that is not a nicety —
 * the registration form lives on a dock at (5550, 6150) and there is no scrollbar
 * to reach it with. Arrow keys pan, `1`–`3` fly to a dock, `+`/`-` zoom, Home
 * returns to the spawn point, and moving focus into an off-screen control pans
 * it into view. Below the mobile breakpoint the hook detaches entirely and CSS
 * stacks the docks into an ordinary scrolling column.
 */
export function useMapCamera(): MapCamera {
  const viewportRef = useRef<HTMLDivElement>(null);

  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();

  // Targets. The springs below chase these; everything reads and writes here.
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const ts = useMotionValue<number>(ZOOM.start);

  const sx = useSpring(tx, SPRING);
  const sy = useSpring(ty, SPRING);
  const ss = useSpring(ts, SPRING);

  // Reduced motion still pans and zooms — it just arrives without easing.
  const x = reduced ? tx : sx;
  const y = reduced ? ty : sy;
  const scale = reduced ? ts : ss;

  /** Viewport size, kept in a ref so the maths never waits on a render. */
  const size = useRef({ w: 0, h: 0 });
  const [activeDock, setActiveDock] = useState(0);
  const [grabbing, setGrabbing] = useState(false);
  const [ready, setReady] = useState(false);

  const pannable = isDesktop && ready;

  /**
   * Keep the world covering the viewport. When the world is smaller than the
   * viewport on an axis — possible at 0.5x on a very wide screen — centre it
   * rather than letting it drift into empty space.
   */
  const clampAxis = useCallback((value: number, extent: number, span: number) => {
    if (span <= extent) return (extent - span) / 2;
    return Math.min(0, Math.max(extent - span, value));
  }, []);

  const commit = useCallback(
    (nextX: number, nextY: number, nextScale: number) => {
      const s = Math.min(ZOOM.max, Math.max(ZOOM.min, nextScale));
      const span = WORLD * s;
      ts.set(s);
      tx.set(clampAxis(nextX, size.current.w, span));
      ty.set(clampAxis(nextY, size.current.h, span));
    },
    [clampAxis, ts, tx, ty],
  );

  /** Put a world point in the middle of the viewport. */
  const centreOn = useCallback(
    (wx: number, wy: number, nextScale = ts.get()) => {
      const s = Math.min(ZOOM.max, Math.max(ZOOM.min, nextScale));
      commit(size.current.w / 2 - wx * s, size.current.h / 2 - wy * s, s);
    },
    [commit, ts],
  );

  /**
   * Scale about a fixed screen point. Rearranged from `screen = cam + world * s`:
   * the world point under the pointer must not move, so the camera absorbs the
   * whole difference.
   */
  const zoomAt = useCallback(
    (px: number, py: number, factor: number) => {
      const from = ts.get();
      const to = Math.min(ZOOM.max, Math.max(ZOOM.min, from * factor));
      if (to === from) return;
      const ratio = to / from;
      commit(px - (px - tx.get()) * ratio, py - (py - ty.get()) * ratio, to);
    },
    [commit, ts, tx, ty],
  );

  /** Zoom about the middle of the viewport — for the +/- controls and keys. */
  const zoomBy = useCallback(
    (factor: number) => zoomAt(size.current.w / 2, size.current.h / 2, factor),
    [zoomAt],
  );

  const goToDock = useCallback(
    (index: number) => {
      const dock = docks[Math.min(docks.length - 1, Math.max(0, index))];
      if (!dock) return;
      const { w, h } = size.current;
      // Frame the whole dock where it fits, but never zoom past the range.
      const fit = Math.min(
        w / (dock.width + DOCK_PADDING * 2),
        h / (dock.height + DOCK_PADDING * 2),
      );
      const centre = dockCentre(dock);
      centreOn(centre.x, centre.y, Math.min(ZOOM.max, Math.max(MIN_FIT, fit)));
    },
    [centreOn],
  );

  const goToDockId = useCallback(
    (id: string) => {
      const index = docks.findIndex((dock) => dock.id === id);
      if (index >= 0) goToDock(index);
    },
    [goToDock],
  );

  const resetView = useCallback(
    () => centreOn(SPAWN.x, SPAWN.y, ZOOM.start),
    [centreOn],
  );

  // Measure, then spawn. The first centring has to wait for a real viewport
  // size or it lands on (0, 0) and snaps once the observer fires.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const measure = () => {
      const first = size.current.w === 0;
      size.current = { w: el.clientWidth, h: el.clientHeight };
      if (el.clientWidth === 0) return;

      if (first) {
        const s = ZOOM.start;
        ts.set(s);
        tx.set(clampAxis(el.clientWidth / 2 - SPAWN.x * s, el.clientWidth, WORLD * s));
        ty.set(clampAxis(el.clientHeight / 2 - SPAWN.y * s, el.clientHeight, WORLD * s));
        // The springs would otherwise fly in from wherever they started.
        sx.jump(tx.get());
        sy.jump(ty.get());
        ss.jump(s);
        setReady(true);
      } else {
        commit(tx.get(), ty.get(), ts.get());
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [clampAxis, commit, ss, sx, sy, ts, tx, ty]);

  // Wheel zooms about the pointer. Non-passive, so the document underneath
  // never scrolls out from behind the map.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !pannable) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      // Lines and pages, normalised to pixels, then to a smooth multiplier so a
      // trackpad's small continuous deltas and a mouse's coarse notches land in
      // the same place.
      const px =
        event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * 400 : event.deltaY;
      const factor = Math.exp(-Math.max(-240, Math.min(240, px)) * 0.0016);
      const rect = el.getBoundingClientRect();
      zoomAt(event.clientX - rect.left, event.clientY - rect.top, factor);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [pannable, zoomAt]);

  // Keys. Everything the pointer can do, without one.
  useEffect(() => {
    if (!pannable) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const node = event.target as HTMLElement | null;
      if (
        node &&
        (node.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(node.tagName))
      ) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const step = NUDGE * (event.shiftKey ? NUDGE_FAST : 1);
      const nudge = (dx: number, dy: number) => {
        event.preventDefault();
        commit(tx.get() + dx, ty.get() + dy, ts.get());
      };

      switch (event.key) {
        case "ArrowRight": return nudge(-step, 0);
        case "ArrowLeft": return nudge(step, 0);
        case "ArrowDown": return nudge(0, -step);
        case "ArrowUp": return nudge(0, step);
        case "PageDown": return nudge(0, -step * NUDGE_FAST);
        case "PageUp": return nudge(0, step * NUDGE_FAST);
        case "Home":
          event.preventDefault();
          return resetView();
        case "End":
          event.preventDefault();
          return goToDock(docks.length - 1);
        case "+":
        case "=":
          event.preventDefault();
          return zoomBy(ZOOM.step);
        case "-":
        case "_":
          event.preventDefault();
          return zoomBy(1 / ZOOM.step);
        case "0":
          event.preventDefault();
          return resetView();
        default:
      }

      // 1–9 fly to a dock. Cheap to learn, and it is how every map app works.
      const index = Number(event.key) - 1;
      if (Number.isInteger(index) && index >= 0 && index < docks.length) {
        event.preventDefault();
        goToDock(index);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commit, goToDock, pannable, resetView, ts, tx, ty, zoomBy]);

  // Tab-follow, on both axes. Without this, focus lands on a control that is
  // three thousand pixels off-screen and the reader sees nothing happen.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !pannable) return;

    const onFocusIn = (event: FocusEvent) => {
      const node = event.target as HTMLElement | null;
      if (!node || !el.contains(node)) return;

      const view = el.getBoundingClientRect();
      const rect = node.getBoundingClientRect();

      const overshoot = (near: number, far: number, min: number, max: number) => {
        if (near < min) return near - min;
        if (far > max) return far - max;
        return 0;
      };

      const dx = overshoot(
        rect.left, rect.right,
        view.left + FOCUS_MARGIN, view.right - FOCUS_MARGIN,
      );
      const dy = overshoot(
        rect.top, rect.bottom,
        view.top + FOCUS_MARGIN, view.bottom - FOCUS_MARGIN,
      );
      if (dx === 0 && dy === 0) return;

      commit(tx.get() - dx, ty.get() - dy, ts.get());
    };

    el.addEventListener("focusin", onFocusIn);
    return () => el.removeEventListener("focusin", onFocusIn);
  }, [commit, pannable, ts, tx, ty]);

  // Which dock is the reader looking at? Nearest centre to the middle of the
  // viewport, in world coordinates.
  useMotionValueEvent(x, "change", () => {
    const s = scale.get();
    if (s === 0) return;
    const wx = (size.current.w / 2 - x.get()) / s;
    const wy = (size.current.h / 2 - y.get()) / s;

    let nearest = 0;
    let best = Infinity;
    docks.forEach((dock, index) => {
      const centre = dockCentre(dock);
      const distance = (centre.x - wx) ** 2 + (centre.y - wy) ** 2;
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    setActiveDock((current) => (current === nearest ? current : nearest));
  });

  // Drag to pan. Anything marked `data-no-pan` — the form, a draggable crate —
  // keeps its own pointer handling and the camera stays put.
  useDrag(
    ({ down, movement: [mx, my], memo, first, event, tap, cancel }) => {
      if (!pannable || tap) return memo;
      if (first) {
        const origin = event?.target as HTMLElement | null;
        if (origin?.closest?.("[data-no-pan]")) {
          cancel();
          return memo;
        }
      }
      const from = (memo as [number, number]) ?? [tx.get(), ty.get()];
      setGrabbing(down);
      commit(from[0] + mx, from[1] + my, ts.get());
      return from;
    },
    {
      target: viewportRef,
      filterTaps: true,
      pointer: { keys: false },
      eventOptions: { passive: false },
    },
  );

  return {
    viewportRef,
    x,
    y,
    scale,
    activeDock,
    goToDock,
    goToDockId,
    zoomBy,
    resetView,
    pannable,
    grabbing,
  };
}
