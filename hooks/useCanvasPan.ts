"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { zones } from "@/content/canvas";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const SPRING = { stiffness: 260, damping: 42, mass: 0.55 };
/** Keeps a Tab-focused element off the very edge of the window. */
const FOCUS_MARGIN = 96;

type CanvasPan = {
  windowRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  /** Bind to the track's transform. Already smoothed unless motion is reduced. */
  x: MotionValue<number>;
  /** 0 at the far left of the track, 1 at the far right. */
  progress: MotionValue<number>;
  activeZone: number;
  goToZone: (index: number) => void;
  pannable: boolean;
  grabbing: boolean;
};

/**
 * Turns a wide track into a horizontally pannable canvas.
 *
 * Wheel and drag are the primary input, but they are not the only input: arrow
 * keys, Home/End and the minimap all jump between zones, and Tab-focus drags
 * the canvas along with it. Without that last part the registration form in
 * zone three is literally unreachable without a mouse.
 *
 * Below the mobile breakpoint the hook detaches entirely and the CSS stacks
 * the zones into a normal scrolling column.
 */
export function useCanvasPan(): CanvasPan {
  const windowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();

  const target = useMotionValue(0);
  const smooth = useSpring(target, SPRING);
  // Reduced motion gets the raw value: the pan still happens, it just does not
  // ease or overshoot.
  const x = reduced ? target : smooth;

  const maxRef = useRef(0);
  const [maxX, setMaxX] = useState(0);
  const [activeZone, setActiveZone] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  const pannable = isDesktop && maxX > 0;

  const progress = useTransform(x, (value) =>
    maxRef.current > 0 ? Math.min(1, Math.max(0, -value / maxRef.current)) : 0,
  );

  const clamp = useCallback((value: number) => {
    if (value > 0) return 0;
    const min = -maxRef.current;
    return value < min ? min : value;
  }, []);

  const panTo = useCallback(
    (value: number) => {
      target.set(clamp(value));
    },
    [clamp, target],
  );

  const panBy = useCallback(
    (delta: number) => panTo(target.get() - delta),
    [panTo, target],
  );

  /** Left edge of a zone, in track pixels. */
  const zoneOffset = useCallback((index: number) => {
    const el = windowRef.current;
    if (!el) return 0;
    const unit = el.clientWidth;
    return zones.slice(0, index).reduce((sum, zone) => sum + zone.width * unit, 0);
  }, []);

  const goToZone = useCallback(
    (index: number) => {
      const bounded = Math.min(zones.length - 1, Math.max(0, index));
      panTo(-zoneOffset(bounded));
    },
    [panTo, zoneOffset],
  );

  // Measure the track. Zone widths are in vw, so this has to re-run on resize.
  useEffect(() => {
    const win = windowRef.current;
    const track = trackRef.current;
    if (!win || !track) return;

    const measure = () => {
      const next = Math.max(0, track.scrollWidth - win.clientWidth);
      maxRef.current = next;
      setMaxX(next);
      target.set(clamp(target.get()));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(win);
    observer.observe(track);
    return () => observer.disconnect();
  }, [clamp, target]);

  // Wheel → horizontal. Non-passive so the page cannot scroll underneath.
  useEffect(() => {
    const el = windowRef.current;
    if (!el || !pannable) return;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return; // leave pinch-zoom alone
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (delta === 0) return;
      event.preventDefault();
      panBy(delta);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [panBy, pannable]);

  // Arrow keys, Page keys and Home/End, as long as the reader is not typing.
  useEffect(() => {
    if (!pannable) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const node = event.target as HTMLElement | null;
      if (
        node &&
        (node.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(node.tagName))
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
        case "PageDown":
          event.preventDefault();
          goToZone(activeZone + 1);
          break;
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          goToZone(activeZone - 1);
          break;
        case "Home":
          event.preventDefault();
          goToZone(0);
          break;
        case "End":
          event.preventDefault();
          goToZone(zones.length - 1);
          break;
        default:
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeZone, goToZone, pannable]);

  // Tab-follow. Focus moving into an off-screen control pans it into view.
  useEffect(() => {
    const win = windowRef.current;
    if (!win || !pannable) return;

    const onFocusIn = (event: FocusEvent) => {
      const node = event.target as HTMLElement | null;
      if (!node || !win.contains(node)) return;

      const bounds = win.getBoundingClientRect();
      const rect = node.getBoundingClientRect();
      if (rect.left >= bounds.left + FOCUS_MARGIN && rect.right <= bounds.right - FOCUS_MARGIN) {
        return;
      }

      const current = target.get();
      const overshootRight = rect.right - (bounds.right - FOCUS_MARGIN);
      const overshootLeft = rect.left - (bounds.left + FOCUS_MARGIN);
      panTo(current - (overshootRight > 0 ? overshootRight : overshootLeft));
    };

    win.addEventListener("focusin", onFocusIn);
    return () => win.removeEventListener("focusin", onFocusIn);
  }, [panTo, pannable, target]);

  // Track which zone holds the middle of the window.
  useMotionValueEvent(x, "change", (value) => {
    const win = windowRef.current;
    if (!win) return;
    const unit = win.clientWidth;
    const centre = -value + unit / 2;

    let edge = 0;
    let next = 0;
    for (let i = 0; i < zones.length; i += 1) {
      edge += zones[i].width * unit;
      if (centre < edge) {
        next = i;
        break;
      }
      next = i;
    }
    setActiveZone((current) => (current === next ? current : next));
  });

  useDrag(
    ({ down, movement: [mx], memo = target.get(), tap }) => {
      if (!pannable || tap) return memo;
      setGrabbing(down);
      panTo(memo + mx);
      return memo;
    },
    {
      target: windowRef,
      axis: "x",
      filterTaps: true,
      pointer: { keys: false },
      // Anything the reader can interact with keeps its own pointer handling.
      eventOptions: { passive: false },
    },
  );

  return { windowRef, trackRef, x, progress, activeZone, goToZone, pannable, grabbing };
}
