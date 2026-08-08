/** An inked rubber stamp. Decorative, so it never carries load-bearing copy. */
export function Stamp({
  children,
  rotate = -8,
  className = "",
}: {
  children: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ rotate: `${rotate}deg` }}
      className={`inline-block border-[3px] border-harbour px-3 py-1.5 font-display text-meta font-black uppercase tracking-[0.2em] text-harbour opacity-80 ${className}`}
    >
      <span className="block border-y border-harbour/60 py-0.5">{children}</span>
    </span>
  );
}

/**
 * A visibly unconfirmed value.
 *
 * Programme facts we cannot verify render as this rather than as a plausible
 * placeholder — a fake time on a hackathon site is worse than an honest gap.
 */
export function Tbc({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center border-2 border-dashed border-ink/45 px-1.5 py-0.5 font-mono text-meta uppercase tracking-[0.16em] text-ink/70 ${className}`}
    >
      TBC
    </span>
  );
}
