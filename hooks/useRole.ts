"use client";

import { useSyncExternalStore } from "react";
import { readRole, subscribeRole, writeRole } from "@/lib/role";

/**
 * The reader's cursor identity, or null until they pick one.
 *
 * Server snapshot is null, so the prompt is never server-rendered — it appears
 * after hydration for people who have not chosen, and not at all for people
 * who have.
 */
export function useRole() {
  const stored = useSyncExternalStore(subscribeRole, readRole, () => null);
  return { role: stored?.role ?? null, handle: stored?.handle ?? null, setRole: writeRole };
}
