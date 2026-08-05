"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Sharpie } from "@/components/ui/Sharpie";
import { useCanvasNav } from "@/components/canvas/CanvasContext";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { zones } from "@/content/canvas";

/**
 * `orange` is the conversion action. `ink` is secondary. `paper` is tertiary.
 * Orange text on white would fail AA, so orange is only ever a fill here.
 */
type Variant = "orange" | "ink" | "paper";

const VARIANTS: Record<Variant, string> = {
  orange: "bg-orange text-paper",
  ink: "bg-ink text-paper",
  paper: "bg-paper text-ink",
};

const SIZES = {
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
} as const;

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: keyof typeof SIZES;
  /** External or in-page href. */
  href?: string;
  /** Pans to a zone by id. Falls back to an anchor jump on mobile. */
  toZone?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  /** Set false for buttons that sit inside dense UI, where the ring is noise. */
  sharpie?: boolean;
  className?: string;
};

export function Button({
  children,
  variant = "orange",
  size = "md",
  href,
  toZone,
  onClick,
  type = "button",
  disabled,
  sharpie = true,
  className = "",
}: ButtonProps) {
  const { goToZone } = useCanvasNav();
  const isDesktop = useIsDesktop();

  const shell = [
    "press inline-flex items-center gap-2.5 border-2 border-ink font-display font-black uppercase tracking-tight",
    VARIANTS[variant],
    SIZES[size],
    disabled ? "pointer-events-none opacity-50" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  let control: ReactNode;

  if (toZone) {
    const index = zones.findIndex((zone) => zone.id === toZone);
    control = (
      <Link
        href={`#${toZone}`}
        className={shell}
        onClick={(event) => {
          if (!isDesktop || index < 0) return;
          event.preventDefault();
          goToZone(index);
        }}
      >
        {children}
      </Link>
    );
  } else if (href) {
    control = href.startsWith("http") || href.startsWith("mailto:") ? (
      <a href={href} className={shell}>{children}</a>
    ) : (
      <Link href={href} className={shell}>{children}</Link>
    );
  } else {
    control = (
      <button type={type} onClick={onClick} disabled={disabled} className={shell}>
        {children}
      </button>
    );
  }

  return sharpie && !disabled ? <Sharpie>{control}</Sharpie> : control;
}
