import type { CSSProperties, ReactNode } from "react";
import { crateCode } from "@/lib/manifest";
import { site } from "@/content/canvas";
import { FACE } from "@/content/iso";

/**
 * Fill and foreground travel together, because the pairing is not free:
 *   orange     ink on International Orange  5.7:1  (paper on it is 3.3:1 — no)
 *   industrial paper on Industrial Blue     5.5:1  (ink on it is 3.4:1 — no)
 *   cargo      paper on Cargo Green         8.2:1
 * A call site picks a colour, never a colour and a text colour.
 */
const FILLS = {
  orange: "bg-orange text-ink",
  industrial: "bg-industrial text-paper",
  cargo: "bg-cargo text-paper",
} as const;

export type ContainerFill = keyof typeof FILLS;

export const FILL_CYCLE: readonly ContainerFill[] = ["orange", "industrial", "cargo"];

/** Standard box, in world units. Length, depth, height. */
export const CRATE = { length: 300, depth: 120, height: 96 } as const;

/**
 * Deterministic lean, in degrees. A crane does not put boxes down square, but
 * it does put them down in the same place twice — and a container that jumps on
 * hydration reads as broken rather than as loose.
 */
export function lean(index: number): number {
  return [-2.4, 1.6, -1.1, 2.2, -1.8, 0.9][index % 6];
}

/**
 * A shipping container, as an actual box on the map.
 *
 * Three faces, because three is all the camera can see: the lid, the face at
 * the far edge of the depth axis, and the face at the near edge of the length
 * axis. Which two those are is not a choice — it falls out of the projection,
 * and the derivation lives next to the transforms in content/iso.ts.
 *
 * The serial is painted across the lid, where a crane driver would read it. The
 * label that a person needs to read is a separate billboarded plate, because
 * anything lying on the ground plane is sheared by the map and type does not
 * survive that.
 */
export function ShippingContainer({
  label,
  fill = "orange",
  meta,
  x,
  y,
  index = 0,
  children,
}: {
  /** Also the seed for the painted serial, so a box keeps its markings. */
  label: string;
  fill?: ContainerFill;
  meta?: ReactNode;
  /** Where it sits on its dock, in world units. */
  x: number;
  y: number;
  index?: number;
  children?: ReactNode;
}) {
  const code = crateCode(label);
  const { length: L, depth: D, height: H } = CRATE;

  return (
    <div
      className={`prism ${FILLS[fill]}`}
      style={{
        left: x,
        top: y,
        width: L,
        height: D,
        rotate: `${lean(index)}deg`,
      }}
    >
      {/* Lid. */}
      <div
        className="prism-face corrugated overflow-hidden"
        style={{ width: L, height: D, transform: FACE.lid(H) } as CSSProperties}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-3 top-1 select-none whitespace-nowrap font-display text-[3.4rem] font-black uppercase leading-none tracking-[-0.05em] opacity-[0.16]"
        >
          {site.name.slice(0, 4).toUpperCase()}-{site.year}
        </span>
        <p className="relative px-3 pt-2 font-mono text-[1.1rem] uppercase tracking-[0.22em] opacity-90">
          {code}
        </p>
        {children}
      </div>

      {/* Near-length face. */}
      <div
        className="prism-face corrugated"
        style={{ width: H, height: D, transform: FACE.left() } as CSSProperties}
      >
        <span aria-hidden="true" className="prism-shade-left absolute inset-0" />
      </div>

      {/* Far-depth face — the doors end. */}
      <div
        className="prism-face corrugated-end"
        style={{ width: L, height: H, transform: FACE.front(D) } as CSSProperties}
      >
        <span aria-hidden="true" className="prism-shade-front absolute inset-0" />
        <span className="relative block px-3 pt-2 font-mono text-[1.05rem] uppercase tracking-[0.18em] opacity-80">
          {meta}
        </span>
      </div>
    </div>
  );
}
