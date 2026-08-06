import type { ElementType, ReactNode } from "react";

/**
 * Type sprayed onto the concrete.
 *
 * No background, no plate, no card — it is paint on the ground, so it sits in
 * the same plane as the dock it is written on. The bars punched through the
 * glyphs come from the `stencil` mask in globals.css.
 *
 * On opacity. The brief's 0.6 is right for the big ground markings and wrong
 * for anything smaller: ink at 60% over concrete is about 3.6:1, which clears
 * AA for large text and fails it for body. So `faded` is available only where
 * the type is genuinely large, and the default is 0.82 — still obviously
 * painted rather than printed, and legible at any size.
 */
export function Stencil({
  children,
  as: Tag = "h2",
  /** Only for display type. Fails AA below ~24px, so it is not the default. */
  faded = false,
  id,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  faded?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <Tag
      id={id}
      className={`stencil font-display font-black uppercase ${
        faded ? "opacity-60" : "opacity-[0.82]"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * A painted deck marking: solid block, stencilled text knocked out of it.
 *
 * This exists because International Orange sprayed straight onto concrete is
 * 2.6:1 — it fails even the large-text bar, so orange paint can never be the
 * word itself. As a filled block with ink on top it is 5.7:1, and it reads more
 * like a real yard marking anyway.
 */
export function PaintedBlock({
  children,
  tone = "orange",
  className = "",
}: {
  children: ReactNode;
  tone?: "orange" | "highlighter";
  className?: string;
}) {
  return (
    <span
      className={`inline-block px-3 pb-1 pt-0.5 text-ink ${
        tone === "orange" ? "bg-orange" : "bg-highlighter"
      } ${className}`}
    >
      <span className="stencil block">{children}</span>
    </span>
  );
}
