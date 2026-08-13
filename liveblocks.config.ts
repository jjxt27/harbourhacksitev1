import type { CursorRole } from "@/content/canvas";

declare global {
  interface Liveblocks {
    Presence: {
      /**
       * Track coordinates, not viewport coordinates.
       *
       * The canvas pans, so two people looking at the same content are almost
       * never scrolled to the same place. Broadcasting viewport pixels would
       * put everyone's cursor over the wrong thing.
       */
      cursor: { x: number; y: number } | null;
      role: CursorRole;
      handle: string;
    };
  }
}

export {};
