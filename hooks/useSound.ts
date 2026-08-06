"use client";

import { useCallback, useSyncExternalStore } from "react";
import { playClank, type Clank } from "@/lib/clank";

const KEY = "harbourhack:sound";

/**
 * Sound is off until asked for, and stays off across visits until it is.
 *
 * Not a preference so much as a rule: a site that makes a noise at someone who
 * did not ask for one has already lost them. The toggle is the gesture that
 * both opts in and unlocks the AudioContext, which is why there is no attempt
 * to play anything before it.
 */

let enabled = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

let hydrated = false;

function read(): boolean {
  // Deferred rather than read at module scope: this file is imported during
  // SSR, where localStorage does not exist.
  if (!hydrated) {
    hydrated = true;
    try {
      enabled = window.localStorage.getItem(KEY) === "on";
    } catch {
      enabled = false;
    }
  }
  return enabled;
}

export function useSound() {
  const on = useSyncExternalStore(subscribe, read, () => false);

  const toggle = useCallback(() => {
    enabled = !enabled;
    try {
      window.localStorage.setItem(KEY, enabled ? "on" : "off");
    } catch {
      // Private mode. The preference just does not survive the session.
    }
    emit();
    // Confirm the choice with the thing being switched on.
    if (enabled) playClank("crate");
  }, []);

  const play = useCallback(
    (kind: Clank) => {
      if (on) playClank(kind);
    },
    [on],
  );

  return { on, toggle, play };
}
