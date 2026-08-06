import type { CSSProperties, ReactNode } from "react";
import type { Dock as DockRect } from "@/content/map";

/**
 * One concrete slab floating in the harbour.
 *
 * The rect arrives as custom properties rather than as inline `left`/`top`,
 * because the mobile media query has to be able to throw the positioning away
 * and let the slab fall back into normal flow. An inline style would win over
 * the media query; a custom property loses to it cleanly.
 */
export function Dock({
  dock,
  index,
  children,
}: {
  dock: DockRect;
  index: number;
  children: ReactNode;
}) {
  return (
    <section
      id={dock.id}
      aria-label={dock.label}
      className="dock"
      style={
        {
          "--dock-x": `${dock.x}px`,
          "--dock-y": `${dock.y}px`,
          "--dock-w": `${dock.width}px`,
          "--dock-h": `${dock.height}px`,
        } as CSSProperties
      }
    >
      <div className="dock-deck flex flex-col overflow-hidden md:overflow-hidden">
        <div aria-hidden="true" className="hazard h-3.5 shrink-0" />

        <header className="flex shrink-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-2 border-ink bg-ink px-5 py-2 text-paper">
          <p className="font-display text-small font-black uppercase tracking-tight">
            <span className="mr-2 text-highlighter">
              {String(index + 1).padStart(2, "0")}
            </span>
            {dock.label}
          </p>
          <p className="font-mono text-micro uppercase tracking-[0.18em] text-highlighter">
            {dock.bearing}
          </p>
        </header>

        <div className="min-h-0 flex-1">{children}</div>

        <div aria-hidden="true" className="hazard h-3.5 shrink-0" />
      </div>
    </section>
  );
}
