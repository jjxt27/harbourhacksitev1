import type { CSSProperties, ReactNode } from "react";
import type { Dock as DockRect } from "@/content/map";

/**
 * A concrete slab, placed by coordinate and pushed down into the harbour.
 *
 * The deck and the cargo are siblings, not parent and child, and that is
 * load-bearing rather than tidy: the deck clips its own edging with
 * `overflow: hidden`, and any clipping element forces `transform-style` back to
 * flat for everything inside it. Put a container prism in there and its three
 * faces collapse into one. So the slab is the ground, the cargo stands beside
 * it in the same coordinate space, and only the dock itself carries the 3D
 * context.
 *
 * Children are positioned in dock-local world units — `.iso-entity` resolves
 * `--wx`/`--wy` against whatever it is inside, which here is this.
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
      className="iso-entity [transform-style:preserve-3d]"
      style={
        {
          "--wx": `${dock.x}px`,
          "--wy": `${dock.y}px`,
          width: dock.width,
          height: dock.height,
        } as CSSProperties
      }
    >
      <div className="slab absolute inset-0">
        <div className="dock-deck size-full overflow-hidden">
          <div aria-hidden="true" className="hazard h-3.5" />
          <div className="flex-1" />
          <div aria-hidden="true" className="hazard h-3.5" />
        </div>
      </div>

      {/* Painted onto the concrete: the dock's number and name, lying flat in
          the ground plane where a sign painter would have put it. */}
      <p
        aria-hidden="true"
        className="ground-paint stencil absolute left-14 top-10 whitespace-nowrap font-display font-black uppercase leading-none tracking-[0.04em] text-ink opacity-20"
        style={{ fontSize: 148 }}
      >
        {String(index + 1).padStart(2, "0")} {dock.label}
      </p>
      <p
        aria-hidden="true"
        className="ground-paint absolute left-14 top-52 font-mono uppercase tracking-[0.3em] text-ink opacity-25"
        style={{ fontSize: 46 }}
      >
        {dock.bearing}
      </p>

      {children}
    </div>
  );
}
