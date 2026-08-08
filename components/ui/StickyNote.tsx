import type { ReactNode } from "react";

type Tone = "apricot" | "harbour" | "ember" | "paper";

const TONES: Record<Tone, string> = {
  // Each tone carries the foreground that clears AA on it, and the two
  // saturated inks disagree about which one that is: paper on harbour is
  // 5.62:1 while paper on ember is 2.70:1 and fails, so ember takes ink at
  // 5.56:1 instead. A note never picks its text colour by eye.
  apricot: "bg-apricot text-ink",
  harbour: "bg-harbour text-paper",
  ember: "bg-ember text-ink",
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
  tone = "apricot",
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
