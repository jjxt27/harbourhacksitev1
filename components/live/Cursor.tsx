import { Briefcase, Laptop } from "lucide-react";
import type { Ref } from "react";
import type { CursorRole } from "@/content/canvas";

/** Each colour carries its own foreground so labels never lose contrast. */
export const CURSOR_COLOURS = [
  { bg: "#ff4f00", fg: "#0a0a0a" },
  { bg: "#008542", fg: "#ffffff" },
  { bg: "#0a0a0a", fg: "#e2ff31" },
  { bg: "#e2ff31", fg: "#0a0a0a" },
] as const;

type CursorProps = {
  handle: string;
  role: CursorRole;
  colour: (typeof CURSOR_COLOURS)[number];
  /** Track coordinates. Omitted for ghosts, which are positioned via the ref. */
  x?: number;
  y?: number;
  ref?: Ref<HTMLDivElement>;
};

/**
 * One remote cursor: the pointer, then a badge carrying the role glyph and a
 * handle. Purely decorative — the whole layer is `aria-hidden` and never
 * intercepts pointer events.
 */
export function Cursor({ handle, role, colour, x, y, ref }: CursorProps) {
  const Icon = role === "Tech" ? Laptop : Briefcase;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute left-0 top-0 will-change-transform"
      style={x !== undefined ? { transform: `translate3d(${x}px, ${y}px, 0)` } : undefined}
    >
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
        <path
          d="M5 3l14 8.5-6.2 1.6L10.6 20 5 3z"
          fill={colour.bg}
          stroke="#0a0a0a"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>

      <span
        className="ml-4 -mt-1 inline-flex items-center gap-1.5 whitespace-nowrap border-2 border-ink px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]"
        style={{ background: colour.bg, color: colour.fg }}
      >
        <Icon aria-hidden="true" className="size-3" strokeWidth={2.5} />
        {handle}
      </span>
    </div>
  );
}
