"use client";

import { zones, site } from "@/content/canvas";

type ZoneNavProps = {
  activeZone: number;
  goToZone: (index: number) => void;
};

/**
 * Fixed chrome: the wordmark, and a jump control per zone.
 *
 * On mobile the canvas is a normal scrolling column, so the same buttons
 * become anchor scrolls instead of pans — handled by the caller.
 */
export function ZoneNav({ activeZone, goToZone }: ZoneNavProps) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-4 p-4 md:p-5">
      <a
        href="#dry-dock"
        onClick={(event) => {
          event.preventDefault();
          goToZone(0);
        }}
        className="press pointer-events-auto border-2 border-ink bg-ink px-3 py-2 font-display text-small font-black uppercase tracking-tight text-paper"
      >
        {site.name}
        <span className="ml-2 font-mono text-meta font-normal tracking-[0.14em] text-highlighter">
          {site.year}
        </span>
      </a>

      <nav aria-label="Canvas zones" className="pointer-events-auto hidden md:block">
        <ul className="flex border-2 border-ink bg-paper shadow-hard">
          {zones.map((zone, index) => (
            <li key={zone.id} className="border-r-2 border-ink last:border-r-0">
              <button
                type="button"
                onClick={() => goToZone(index)}
                aria-current={activeZone === index ? "true" : undefined}
                className={`px-3.5 py-2 font-mono text-meta uppercase tracking-[0.16em] transition-colors ${
                  activeZone === index ? "bg-ink text-paper" : "hover:bg-highlighter"
                }`}
              >
                <span className="mr-1.5 opacity-60">0{index + 1}</span>
                {zone.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
