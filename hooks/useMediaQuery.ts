"use client";

import { useSyncExternalStore } from "react";

/**
 * Reads a media query without an effect, so the first client render already
 * knows the answer instead of flashing the wrong branch and correcting it.
 *
 * The server snapshot is always `false`: layout switching is done in CSS, and
 * this only gates behaviour, so guessing "not matching" on the server is safe.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useIsDesktop = () => useMediaQuery("(min-width: 768px)");
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
