/**
 * The spatial layout of the harbour.
 *
 * Everything about where things are in the world lives here — the world size,
 * the dock rectangles, the zoom range and the spawn point. The camera hook, the
 * minimap, the dock navigation and the CSS all derive from this one file, so a
 * dock moves by changing a number here and nowhere else. Never hard-code a
 * coordinate or a size in a component.
 *
 * Two things about `docks` that are load-bearing:
 *
 *   1. DOM order is narrative order. Below the mobile breakpoint the docks stop
 *      being positioned and stack into a normal column in array order, and on
 *      desktop that same order is the Tab order. So the array reads
 *      Dry Dock → Shipyard → Customs, regardless of where they sit in (x, y).
 *   2. `x`/`y` are the top-left corner in world pixels. The camera centres on
 *      the middle of the rect, which it computes — don't store a centre.
 *
 * Unconfirmed programme facts stay visibly TBC. Never invent dates, times,
 * mentors, venues or prizes.
 */

/** The world is a square. 10,000px at 1x zoom. */
export const WORLD = 10000;

/** Where the camera opens. Dead centre of the world, on the Dry Dock. */
export const SPAWN = { x: WORLD / 2, y: WORLD / 2 } as const;

export const ZOOM = {
  min: 0.5,
  max: 2,
  /** Zoom on arrival. 1 = one world pixel per screen pixel. */
  start: 1,
  /** Multiplier per notch of wheel or per press of the +/- controls. */
  step: 1.12,
} as const;

export type Dock = {
  id: string;
  /** Shown in the dock navigation, the minimap and as the section label. */
  label: string;
  /** Chart-style bearing shown on the dock's edge plate. Decorative. */
  bearing: string;
  /** Top-left corner, in world pixels. */
  x: number;
  y: number;
  width: number;
  height: number;
};

export const docks: readonly Dock[] = [
  {
    id: "dry-dock",
    label: "The Dry Dock",
    bearing: "33°51'S 151°12'E",
    x: 4300,
    y: 4550,
    width: 1400,
    height: 900,
  },
  {
    id: "shipyard",
    label: "The Shipyard",
    bearing: "33°50'S 151°14'E",
    x: 6150,
    y: 3725,
    width: 1900,
    height: 1150,
  },
  {
    id: "customs",
    label: "The Customs Office",
    bearing: "33°52'S 151°13'E",
    x: 5350,
    y: 6150,
    // Wide and shallow on purpose. The declaration and the boarding pass sit
    // side by side, and a dock much taller than this cannot be framed at a
    // zoom where its own form is still readable.
    width: 1700,
    height: 1260,
  },
];

/** Centre of a dock, in world pixels. What the camera actually flies to. */
export function dockCentre(dock: Dock) {
  return { x: dock.x + dock.width / 2, y: dock.y + dock.height / 2 };
}

/** The bounding box of everything, used to frame the minimap. */
export const chartBounds = docks.reduce(
  (box, dock) => ({
    minX: Math.min(box.minX, dock.x),
    minY: Math.min(box.minY, dock.y),
    maxX: Math.max(box.maxX, dock.x + dock.width),
    maxY: Math.max(box.maxY, dock.y + dock.height),
  }),
  { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
);

/**
 * Where the ibis is loitering before anyone moves him. On the edge of the Dry
 * Dock, in world pixels — he lives inside the world, not on the glass, so he
 * has to be given a place in it.
 */
export const ibisSpot = { x: 5460, y: 5180 } as const;

/**
 * Floating decoration in the water between the docks. Purely atmospheric and
 * `aria-hidden`, so nothing here needs to be reachable or readable.
 */
export const buoys: readonly { id: string; x: number; y: number; kind: "cardinal" | "can" }[] = [
  { id: "b1", x: 5900, y: 5000, kind: "can" },
  { id: "b2", x: 4150, y: 6100, kind: "cardinal" },
  { id: "b3", x: 8250, y: 5400, kind: "can" },
  { id: "b4", x: 5100, y: 3550, kind: "cardinal" },
  { id: "b5", x: 7400, y: 7100, kind: "can" },
];
