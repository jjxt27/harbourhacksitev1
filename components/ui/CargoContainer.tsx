import type { ReactNode } from "react";
import { crateCode } from "@/lib/manifest";

/**
 * Contrast, all measured against the fill:
 *   yellow — ink on highlighter, 17.5:1
 *   orange — ink on International Orange, 5.7:1 (never paper: 3.3:1)
 *   paper  — ink on white, 19.6:1
 * The foreground travels with the fill so a call site cannot pair them wrongly.
 */
const FILLS = {
  yellow: "bg-highlighter text-ink",
  orange: "bg-orange text-ink",
  paper: "bg-paper text-ink",
} as const;

export type CargoFill = keyof typeof FILLS;

/**
 * A shipping container, seen side-on.
 *
 * Corrugated ribs, a hard offset shadow, corner castings and the serial painted
 * across the back of the box. The serial is a real graphic device rather than a
 * caption: it is set large, `aria-hidden`, and sits behind the content at low
 * enough contrast to read as paint on steel instead of as another line of text
 * competing with the one that matters.
 */
export function CargoContainer({
  label,
  fill = "paper",
  meta,
  glyph,
  children,
  className = "",
}: {
  /** Also the seed for the painted serial, so a card keeps its markings. */
  label: string;
  fill?: CargoFill;
  meta?: ReactNode;
  glyph?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const code = crateCode(label);

  return (
    <div
      className={`corrugated relative overflow-hidden border-2 border-ink px-3 py-2.5 shadow-hard-sm ${FILLS[fill]} ${className}`}
    >
      {/* Paint. Sits under everything and is never read aloud.

          On the type scale rather than off it, even though it is a graphic:
          `text-heading` on a card this size is already unmistakably paint, and
          an ad-hoc 2.4rem would have added a ninth step to an eight-step scale
          for no gain anyone could see. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-1 -top-1 select-none font-display text-heading font-black uppercase leading-none tracking-[-0.05em] opacity-[0.11]"
      >
        {code.slice(-3)}
      </span>

      <div className="relative flex items-start justify-between gap-3">
        <p className="font-display text-small font-bold uppercase leading-tight tracking-tight">
          {label}
        </p>
        {glyph}
      </div>

      {children}

      <p className="relative mt-2 flex items-center gap-2 font-mono text-micro uppercase tracking-[0.16em] opacity-75">
        <span className="tracking-[0.2em]">{code}</span>
        {meta ? (
          <>
            <span aria-hidden="true">·</span>
            {meta}
          </>
        ) : null}
      </p>

      {/* Corner castings. */}
      <span aria-hidden="true" className="absolute bottom-0 left-0 size-1.5 bg-ink" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 size-1.5 bg-ink" />
    </div>
  );
}
