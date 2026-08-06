"use client";

import { zones, site } from "@/content/canvas";

/**
 * Fixed chrome: the wordmark, and the chapter index.
 *
 * Set as a masthead rather than a navigation bar — no pill, no panel, no
 * backdrop. On a page this dark, type on its own is enough, and a floating
 * container would be the one piece of furniture in a room with none.
 *
 * The current chapter is marked by weight and a rule beneath it, never by a
 * filled block. Filled blocks are how the previous design shouted; this one
 * does not need to.
 */
export function Masthead({
  activeZone,
  goToZone,
}: {
  activeZone: number;
  goToZone: (index: number) => void;
}) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-8 px-6 py-6 sm:px-10 md:px-14 md:py-8">
      <a
        href="#brief"
        onClick={(event) => {
          event.preventDefault();
          goToZone(0);
        }}
        className="pointer-events-auto"
      >
        <span className="display block text-subhead leading-none text-ivory">{site.name}</span>
        <span className="mt-1.5 block font-sans text-micro font-medium uppercase tracking-[0.28em] text-ivory-faint">
          {site.city} · {site.year}
        </span>
      </a>

      <nav aria-label="Chapters" className="pointer-events-auto hidden md:block">
        <ul className="flex items-start gap-8">
          {zones.map((zone, index) => {
            const current = activeZone === index;
            return (
              <li key={zone.id}>
                <button
                  type="button"
                  onClick={() => goToZone(index)}
                  aria-current={current ? "true" : undefined}
                  className="group block text-right"
                >
                  <span
                    className={`block font-sans text-micro font-medium uppercase tracking-[0.28em] transition-colors ${
                      current ? "text-brass" : "text-ivory-faint"
                    }`}
                  >
                    {zone.numeral}
                  </span>
                  <span
                    className={`mt-1 block font-sans text-label transition-colors ${
                      current ? "font-medium text-ivory" : "text-ivory-dim group-hover:text-ivory"
                    }`}
                  >
                    {zone.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mt-2 block h-px origin-right transition-transform duration-500 ${
                      current ? "scale-x-100 bg-brass" : "scale-x-0 bg-ivory"
                    }`}
                    style={{ transitionTimingFunction: "var(--ease-out)" }}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
