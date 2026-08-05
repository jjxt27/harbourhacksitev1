"use client";

import type { ReactNode } from "react";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import { useRole } from "@/hooks/useRole";

/**
 * Inlined at build time by Next, so this is a constant the bundler can fold —
 * which is what lets the cursor layer branch without ever calling a room hook
 * outside a provider.
 */
export const HAS_LIVEBLOCKS = Boolean(process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY);

const KEY = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY ?? "";
const ROOM = process.env.NEXT_PUBLIC_LIVEBLOCKS_ROOM ?? "harbourhack-canvas";

/**
 * Joins the shared room, when there is one to join.
 *
 * With no key configured this renders its children untouched and the canvas
 * falls back to ghost cursors — cloning the repo without credentials gives a
 * working site, not a crash.
 */
export function LiveRoom({ children }: { children: ReactNode }) {
  const { role, handle } = useRole();

  if (!HAS_LIVEBLOCKS) return <>{children}</>;

  return (
    <LiveblocksProvider publicApiKey={KEY} throttle={80}>
      <RoomProvider
        id={ROOM}
        initialPresence={{
          cursor: null,
          role: role ?? "Tech",
          handle: handle ?? "Crew",
        }}
      >
        {children}
      </RoomProvider>
    </LiveblocksProvider>
  );
}
