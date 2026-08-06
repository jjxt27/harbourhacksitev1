import type { CSSProperties, ReactNode } from "react";
import type { Dock as DockRect } from "@/content/map";

/**
 * A concrete slab, placed by coordinate and pushed down into the harbour.
 *
 * An absolute world entity and nothing else: no wrapper, no column, no flow.
 * The rect comes from content/map.ts and arrives as four custom properties,
 * because the mobile media query has to be able to throw the positioning away
 * and let the slab fall back into normal flow — a custom property loses to a
 * media query cleanly, an inline `left` does not.
 *
 * `role="region"` rather than `<section>`: identical semantics for a screen
 * reader — a named landmark — while keeping the element a plain div.
 */
export function IsoDock({
  dock,
  index,
  children,
}: {
  dock: DockRect;
  index: number;
  children: ReactNode;
}) {
  return (
    <div
      id={dock.id}
      role="region"
      aria-label={dock.label}
      className="iso-entity"
      style={
        {
          "--wx": `${dock.x}px`,
          "--wy": `${dock.y}px`,
          width: dock.width,
          height: dock.height,
        } as CSSProperties
      }
    >
      <div className="slab size-full">
        <div className="dock-deck size-full overflow-hidden">
          <div aria-hidden="true" className="hazard h-3.5" />

          <div className="flex items-baseline justify-between gap-x-4 border-b-2 border-ink bg-ink px-5 py-2 text-paper">
            <p className="font-display text-small font-black uppercase tracking-tight">
              <span className="mr-2 text-highlighter">
                {String(index + 1).padStart(2, "0")}
              </span>
              {dock.label}
            </p>
            <p className="font-mono text-micro uppercase tracking-[0.18em] text-highlighter">
              {dock.bearing}
            </p>
          </div>

          <div className="h-[calc(100%-4.6rem)]">{children}</div>

          <div aria-hidden="true" className="hazard h-3.5" />
        </div>
      </div>
    </div>
  );
}
