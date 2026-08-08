import { Briefcase, Laptop } from "lucide-react";
import type { Ref } from "react";
import type { CursorRole } from "@/content/canvas";

/** Each colour carries its own foreground so labels never lose contrast. */
export const CURSOR_COLOURS = [
  // The two saturated inks want opposite foregrounds and neither is a guess:
  // paper on harbour is 5.62:1, paper on ember is 2.70:1 and fails, so ember
  // takes ink at 5.56:1 instead.
  { bg: "#1a5da8", fg: "#fbead7" },
  { bg: "#e2711d", fg: "#08192e" },
  { bg: "#08192e", fg: "#f6be85" },
  { bg: "#f6be85", fg: "#08192e" },
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
          stroke="#08192e"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>

      <span
        className="ml-4 -mt-1 inline-flex items-center gap-1.5 whitespace-nowrap border-2 border-ink px-1.5 py-0.5 font-mono text-meta uppercase tracking-[0.1em]"
        style={{ background: colour.bg, color: colour.fg }}
      >
        <Icon aria-hidden="true" className="size-3" strokeWidth={2.5} />
        {handle}
      </span>
    </div>
  );
}
