import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  /** Placard across the top, stencilled like a container marking. */
  label?: string;
  /** Right-hand side of the placard — a count, a time, a code. */
  meta?: ReactNode;
  tone?: "paper" | "off" | "ink";
  className?: string;
};

const TONES = {
  paper: "bg-paper",
  off: "bg-paper-off",
  ink: "bg-ink text-paper",
} as const;

/** A shipping container placard: 2px frame, stencil header, hard shadow. */
export function Panel({ children, label, meta, tone = "paper", className = "" }: PanelProps) {
  return (
    <section className={`border-2 border-ink shadow-hard ${TONES[tone]} ${className}`}>
      {label ? (
        <header
          className={`flex items-baseline justify-between gap-3 border-b-2 border-ink px-3.5 py-2 ${
            tone === "ink" ? "bg-ink" : "bg-ink text-paper"
          }`}
        >
          <h3 className="font-display text-xs font-black uppercase tracking-[0.14em]">{label}</h3>
          {meta ? <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-80">{meta}</span> : null}
        </header>
      ) : null}
      <div className="p-3.5">{children}</div>
    </section>
  );
}
