import type { ReactNode } from "react";
import { crateCode } from "@/lib/manifest";
import { site } from "@/content/canvas";

/**
 * Fill and foreground travel together, because the pairing is not free:
 *   orange     ink on International Orange  5.7:1  (paper on it is 3.3:1 — no)
 *   industrial paper on Industrial Blue     5.5:1  (ink on it is 3.4:1 — no)
 *   cargo      paper on Cargo Green         8.2:1
 * A call site picks a colour, never a colour and a text colour.
 */
const FILLS = {
  orange: { body: "bg-orange text-ink", castings: "bg-ink", decal: "text-ink" },
  industrial: { body: "bg-industrial text-paper", castings: "bg-ink", decal: "text-paper" },
  cargo: { body: "bg-cargo text-paper", castings: "bg-ink", decal: "text-paper" },
} as const;

export type ContainerFill = keyof typeof FILLS;

/** Cycled so a row of containers is never all one colour. */
export const FILL_CYCLE: readonly ContainerFill[] = ["orange", "industrial", "cargo"];

/**
 * Deterministic lean, in degrees.
 *
 * A crane does not put boxes down square, but it does put them down in the same
 * place twice. Derived from the index rather than random so the yard looks
 * identical on the server and the client and does not reshuffle on every
 * render — a container that jumps on hydration reads as broken, not as loose.
 */
export function lean(index: number): number {
  return [-2.4, 1.6, -1.1, 2.2, -1.8, 0.9][index % 6];
}

/**
 * A shipping container, seen from above.
 *
 * The read is built from four things and none of them is a border-radius: the
 * corrugated fold across the body, the door panel at one end, the serial
 * painted big enough to be read from a crane cab, and the corner castings. It
 * is a box, so it casts a hard offset shadow and it sits slightly askew.
 */
export function ShippingContainer({
  label,
  fill = "orange",
  meta,
  glyph,
  children,
  index = 0,
  className = "",
}: {
  /** Also the seed for the painted serial, so a box keeps its markings. */
  label: string;
  fill?: ContainerFill;
  meta?: ReactNode;
  glyph?: ReactNode;
  children?: ReactNode;
  /** Position in the yard. Drives the lean and nothing else. */
  index?: number;
  className?: string;
}) {
  const skin = FILLS[fill];
  const code = crateCode(label);

  return (
    <div
      style={{ rotate: `${lean(index)}deg` }}
      className={`relative flex overflow-hidden border-2 border-ink shadow-hard transition-transform duration-150 hover:rotate-0 ${skin.body} ${className}`}
    >
      {/* The doors, at the left end. */}
      <div
        aria-hidden="true"
        className="corrugated-end w-5 shrink-0 border-r-2 border-ink/50"
      />

      <div className="corrugated relative min-w-0 flex-1 px-3 py-2.5">
        {/* Painted markings. Big, flat, and never read aloud — the same
            information is in the mono line below, set to be read. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-2 top-0 select-none whitespace-nowrap font-display text-heading font-black uppercase leading-none tracking-[-0.04em] opacity-[0.13] ${skin.decal}`}
        >
          {site.name.slice(0, 4).toUpperCase()}-{site.year}
        </span>

        <div className="relative flex items-start justify-between gap-3">
          <p className="font-display text-small font-bold uppercase leading-tight tracking-tight">
            {label}
          </p>
          {glyph}
        </div>

        {children}

        <p className="relative mt-2 flex flex-wrap items-center gap-x-2 font-mono text-micro uppercase tracking-[0.16em] opacity-80">
          <span className="tracking-[0.2em]">{code}</span>
          {meta ? (
            <>
              <span aria-hidden="true">·</span>
              {meta}
            </>
          ) : null}
        </p>
      </div>

      {/* Corner castings. */}
      <span aria-hidden="true" className={`absolute left-0 top-0 size-2 ${skin.castings}`} />
      <span aria-hidden="true" className={`absolute right-0 top-0 size-2 ${skin.castings}`} />
      <span aria-hidden="true" className={`absolute bottom-0 left-0 size-2 ${skin.castings}`} />
      <span aria-hidden="true" className={`absolute bottom-0 right-0 size-2 ${skin.castings}`} />
    </div>
  );
}
