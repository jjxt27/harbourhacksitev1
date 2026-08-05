import type { CursorRole } from "@/content/canvas";

const KEY = "harbourhack-cursor-role";
const HANDLE_KEY = "harbourhack-handle";

type Stored = { role: CursorRole; handle: string } | null;

let cached: Stored | undefined;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

/**
 * Reads once and caches.
 *
 * Backed by a module-level store rather than component state so the value can
 * be read with `useSyncExternalStore` — the first client render then already
 * knows the answer instead of setting it from an effect and flashing the
 * prompt at someone who has already chosen.
 */
export function readRole(): Stored {
  if (cached !== undefined) return cached;
  try {
    const role = localStorage.getItem(KEY);
    const handle = localStorage.getItem(HANDLE_KEY);
    cached = role === "Tech" || role === "Biz" ? { role, handle: handle ?? makeHandle() } : null;
  } catch {
    // Private browsing and blocked storage both land here. The prompt simply
    // asks again next visit.
    cached = null;
  }
  return cached;
}

export function writeRole(role: CursorRole): Stored {
  const handle = cached?.handle ?? makeHandle();
  cached = { role, handle };
  try {
    localStorage.setItem(KEY, role);
    localStorage.setItem(HANDLE_KEY, handle);
  } catch {
    // Choice still applies for this session.
  }
  notify();
  return cached;
}

export function subscribeRole(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Neutral by design — a generated display name, never a person's. */
function makeHandle(): string {
  return `Crew ${String(Math.floor(Math.random() * 89) + 10)}`;
}
