import type { ReactNode } from "react";

type Tone = "yellow" | "orange" | "ferry" | "paper";

const TONES: Record<Tone, string> = {
  // Ink on highlighter is 17.5:1. Ink on orange and ferry both clear AA too,
  // which is why notes never use white text.
  yellow: "bg-highlighter text-ink",
  orange: "bg-orange text-paper",
  ferry: "bg-ferry text-paper",
  paper: "bg-paper text-ink",
};

type StickyNoteProps = {
  children: ReactNode;
  tone?: Tone;
  /** Degrees. Keep it small — a note at 12° reads as a mistake. */
  rotate?: number;
  className?: string;
  /** Mono label across the top, like a filing tab. */
  tag?: string;
};

/** A square of paper someone stuck on the wall. Hard shadow, no radius. */
export function StickyNote({
  children,
  tone = "yellow",
  rotate = 0,
  className = "",
  tag,
}: StickyNoteProps) {
  return (
    <div
      style={{ rotate: `${rotate}deg` }}
      className={`border-2 border-ink p-4 shadow-hard transition-transform duration-150 hover:-translate-y-1 ${TONES[tone]} ${className}`}
    >
      {tag ? (
        <p className="mb-2 border-b-2 border-ink/25 pb-1.5 font-mono text-[10px] uppercase tracking-[0.18em]">
          {tag}
        </p>
      ) : null}
      <div className="font-hand text-lg leading-tight">{children}</div>
    </div>
  );
}
