import type { ReactNode } from "react";

type Tone = "yellow" | "harbour" | "ferry" | "paper";

const TONES: Record<Tone, string> = {
  // Each tone carries the foreground that clears AA on it: ink on the light
  // grounds at 17.5:1 and up, paper on the two saturated ones at 5.9:1 and
  // 4.7:1. A note never picks its text colour by eye.
  yellow: "bg-highlighter text-ink",
  harbour: "bg-harbour text-paper",
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
        <p className="mb-2 border-b-2 border-ink/25 pb-1.5 font-mono text-meta uppercase tracking-[0.18em]">
          {tag}
        </p>
      ) : null}
      <div className="font-hand text-lead leading-tight">{children}</div>
    </div>
  );
}
