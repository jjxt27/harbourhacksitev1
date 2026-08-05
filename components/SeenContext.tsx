"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { thread } from "@/content/thread";

/** Every message in the thread. Constant, so nothing has to report it upward. */
export const TOTAL = thread.groups.reduce((sum, group) => sum + group.messages.length, 0);

const REDUCED = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

type SeenValue = {
  /** How many messages have been read. Reads as complete under reduced motion. */
  count: number;
  total: number;
  reduced: boolean;
  isSeen: (key: string) => boolean;
  mark: (keys: readonly string[]) => void;
};

const SeenContext = createContext<SeenValue>({
  count: 0,
  total: TOTAL,
  reduced: false,
  isSeen: () => false,
  mark: () => {},
});

/**
 * Holds the read count, which the thread writes and the bar displays. The two
 * live on opposite sides of the layout/page boundary and cannot see each other
 * any other way.
 *
 * The reduced-motion preference is read through `useSyncExternalStore` rather
 * than an effect, so a reader who has opted out gets the whole thread on the
 * first client render instead of watching it fill in.
 */
export function SeenProvider({ children }: { children: ReactNode }) {
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set());

  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );

  const mark = useCallback((keys: readonly string[]) => {
    if (!keys.length) return;
    setSeen((current) => {
      const missing = keys.filter((key) => !current.has(key));
      if (!missing.length) return current;
      const next = new Set(current);
      for (const key of missing) next.add(key);
      return next;
    });
  }, []);

  const isSeen = useCallback(
    (key: string) => reduced || seen.has(key),
    [reduced, seen],
  );

  const value = useMemo<SeenValue>(
    () => ({ count: reduced ? TOTAL : seen.size, total: TOTAL, reduced, isSeen, mark }),
    [reduced, seen, isSeen, mark],
  );

  return <SeenContext.Provider value={value}>{children}</SeenContext.Provider>;
}

export const useSeen = () => useContext(SeenContext);
