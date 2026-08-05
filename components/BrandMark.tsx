import { cn } from "@/lib/cn";

type BrandMarkProps = {
  className?: string;
  variant?: "full" | "mark";
};

/**
 * The HarbourHack identity: a drawn HH monogram, optionally locked up with the
 * typeset wordmark.
 *
 * The monogram is four stems and a waterline. The waterline replaces both H
 * crossbars and runs out past the right edge of the mark — the tide leaving the
 * harbour. It is the one piece of the identity that carries Tide colour, and it
 * must stay attached to the stems in both variants.
 *
 * Decorative by design: the SVG and the wordmark are both `aria-hidden`, so a
 * link that contains only the mark needs its own accessible name alongside.
 */
export function BrandMark({ className, variant = "full" }: BrandMarkProps) {
  const monogram = (
    <Monogram className={variant === "mark" ? cn("h-6 w-auto", className) : "h-6 w-auto shrink-0"} />
  );

  if (variant === "mark") return monogram;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {monogram}
      <span
        aria-hidden="true"
        className="font-display text-[0.95rem] font-extrabold uppercase leading-none tracking-[-0.02em]"
      >
        HarbourHack
      </span>
    </span>
  );
}

function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 24" aria-hidden="true" className={className} fill="none">
      {/* Stems */}
      <path fill="currentColor" d="M0 2h6v20H0V2Z" />
      <path fill="currentColor" d="M14 2h6v20h-6V2Z" />
      <path fill="currentColor" d="M24 2h6v20h-6V2Z" />
      <path fill="currentColor" d="M38 2h6v20h-6V2Z" />
      {/* Waterline */}
      <path fill="var(--color-tide, #2fe3bd)" d="M6 9h8v6H6V9Z" />
      <path fill="var(--color-tide, #2fe3bd)" d="M30 9h22v6H30V9Z" />
    </svg>
  );
}
