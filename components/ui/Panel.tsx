import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  /** Stencilled onto the placard bolted across the top of the board. */
  label?: string;
  /** Right-hand side of the placard — a count, a time, a code. */
  meta?: ReactNode;
  className?: string;
};

/**
 * A yard board: a sheet of oxidised steel the containers stack against.
 *
 * This is the middle of a three-level read, and it only works because all three
 * levels are different. The dock is pale concrete, the board is dark rust, and
 * the containers are saturated paint — so a stack of cargo reads as objects on
 * a structure on the ground, rather than as boxes on boxes.
 *
 * Which is also why nothing dark is ever set on it. Paper on rust is 9.4:1 and
 * ink on rust is 2.0:1; this is a dark ground and it is treated like one.
 */
export function Panel({ children, label, meta, className = "" }: PanelProps) {
  return (
    <section className={`rusted relative border-2 border-ink shadow-hard ${className}`}>
      {/* Bolts along the top and bottom edges of the sheet. */}
      <span aria-hidden="true" className="bolted absolute inset-x-2 top-1.5 h-[7px]" />
      <span aria-hidden="true" className="bolted absolute inset-x-2 bottom-1.5 h-[7px]" />

      {label ? (
        <header className="relative mx-3 mt-5 flex items-baseline justify-between gap-3 border-2 border-ink bg-ink px-3 py-2 shadow-hard-sm">
          <h3 className="stencil font-display text-small font-black uppercase tracking-[0.1em] text-paper">
            {label}
          </h3>
          {meta ? (
            <span className="font-mono text-micro uppercase tracking-[0.14em] text-highlighter">
              {meta}
            </span>
          ) : null}
        </header>
      ) : null}

      <div className="relative px-3 pb-6 pt-4">{children}</div>
    </section>
  );
}
