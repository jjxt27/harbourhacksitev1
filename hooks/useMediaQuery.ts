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

/**
 * Whether the page was opened at a fragment.
 *
 * Read through the same external-store shape as a media query, and for the same
 * reason: the server cannot see the fragment, so it reports `false`, React
 * hydrates against that, and then re-renders once with the real answer. An
 * effect that set state instead would do the same work with an extra render and
 * a lint rule to argue with.
 */
export function useHasHash(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("hashchange", onChange);
      return () => window.removeEventListener("hashchange", onChange);
    },
    () => window.location.hash.length > 1,
    () => false,
  );
}
