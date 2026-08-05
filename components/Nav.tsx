"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { hero, nav, site } from "@/content/site";
import { BrandMark } from "@/components/BrandMark";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  const action = pathname === "/apply"
    ? { href: "/", label: "Back to program" }
    : hero.primaryCta;

  return (
    <>
      <header className="hh-header fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
        <nav aria-label="Primary" className="mx-auto flex w-full max-w-[94rem] items-center justify-between">
          <Link href="/" className="hh-brand text-ink transition-opacity hover:opacity-70">
            <BrandMark variant="mark" className="sm:hidden" />
            <BrandMark className="hidden sm:inline-flex" />
            <span className="sr-only">{site.name} home</span>
          </Link>

          <ul className="hh-nav-pill hidden items-center lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block px-6 py-3 text-body-sm text-ink-70 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href={action.href} className="hh-nav-action px-5 py-3 text-caption font-semibold tracking-[0.06em] text-ink transition-colors hover:border-signal hover:text-white sm:px-6">
              {action.label}
            </Link>
            <button ref={toggleRef} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)} className="hh-nav-action grid size-11 place-items-center text-ink lg:hidden">
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              {open ? <X aria-hidden="true" className="size-6" strokeWidth={1.5} /> : <Menu aria-hidden="true" className="size-6" strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </header>

      {open ? (
        <div id={panelId} className="fixed inset-0 z-40 bg-paper pt-24 lg:hidden">
          <ul className="flex h-full flex-col justify-center px-6 pb-24">
            {nav.map((item, index) => (
              <li key={item.href} className="menu-item-in border-t border-hairline-soft" style={{ animationDelay: `${index * 45}ms` }}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block py-5 font-display text-display-2 font-semibold uppercase text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
