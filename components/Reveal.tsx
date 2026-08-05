"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Tags a reveal may render as, so lists and tables keep valid semantics. */
type RevealTag = "div" | "li" | "section" | "article" | "p" | "figure";

/**
 * Which motion the reveal runs. Each is tied to a kind of content rather than
 * chosen for variety — see the variant block in globals.css.
 *
 * `up` lift · `rise` bigger lift for statements · `clip` baseline wipe for
 * headings · `fade` no movement for supporting copy.
 */
type RevealVariant = "up" | "rise" | "clip" | "fade";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger, in ms. Applied as transition-delay, not a timer. */
  delay?: number;
  as?: RevealTag;
  variant?: RevealVariant;
};

/**
 * Fades and lifts its children in as they enter the viewport.
 *
 * IntersectionObserver only — no scroll listeners. The hidden state lives in
 * CSS behind `.js`, so this component is inert without scripting and the
 * content renders visible. Unobserves after the first reveal.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  variant = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Every allowed tag is an HTMLElement and we only touch `dataset`, so one
  // element type stands in for the union.
  const Tag = as as "div";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Honour reduced motion by revealing immediately and never observing.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.shown = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.shown = "true";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      // `up` stays the empty attribute the base rule matches, so the default
      // motion needs no extra selector.
      data-reveal={variant === "up" ? "" : variant}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
