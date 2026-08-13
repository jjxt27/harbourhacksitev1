"use client";

import { Briefcase, Laptop } from "lucide-react";
import { useEffect, useRef } from "react";
import { cursorRoles } from "@/content/canvas";
import { useRole } from "@/hooks/useRole";
import { useIsDesktop } from "@/hooks/useMediaQuery";

const GLYPH = { Tech: Laptop, Biz: Briefcase } as const;
const BLURB = {
  Tech: "You build the thing.",
  Biz: "You get it in front of people.",
} as const;

/**
 * Asks which cursor the reader carries.
 *
 * Only shown where it means something: a pointer device, and only until they
 * choose. Escape dismisses without picking rather than trapping anyone — the
 * canvas is perfectly usable with no cursor identity at all, so this is never
 * a gate on the content.
 */
export function RolePrompt() {
  const { role, setRole } = useRole();
  const isDesktop = useIsDesktop();
  const firstRef = useRef<HTMLButtonElement>(null);
  const open = isDesktop && role === null;

  useEffect(() => {
    if (!open) return;
    firstRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRole("Tech");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setRole]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-prompt-title"
        className="w-full max-w-md border-2 border-ink bg-paper p-7 shadow-hard-lg"
      >
        <p className="font-mono text-meta uppercase tracking-[0.2em] text-slate">
          Before you board
        </p>
        <h2
          id="role-prompt-title"
          className="mt-3 font-display text-heading font-black uppercase leading-[0.92] tracking-[-0.04em]"
        >
          Are you Tech or Biz?
        </h2>
        <p className="mt-3 text-body leading-snug">
          It sets the badge on your cursor so everyone on the canvas can see what you bring.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {cursorRoles.map((option, index) => {
            const Icon = GLYPH[option];
            return (
              <button
                key={option}
                ref={index === 0 ? firstRef : undefined}
                type="button"
                onClick={() => setRole(option)}
                className="press grid gap-2 border-2 border-ink bg-paper px-4 py-4 text-left hover:bg-apricot"
              >
                <Icon aria-hidden="true" className="size-6" strokeWidth={2.5} />
                <span className="font-display text-lead font-black uppercase tracking-tight">
                  {option}
                </span>
                <span className="text-small leading-snug text-slate">{BLURB[option]}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setRole("Tech")}
          className="mt-5 border-b-2 border-ink pb-0.5 font-mono text-meta uppercase tracking-[0.14em] text-slate"
        >
          Skip — I&apos;ll decide later
        </button>
      </div>
    </div>
  );
}
