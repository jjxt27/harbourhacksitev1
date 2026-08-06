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

/**
 * Where the camera opens.
 *
 * Not on a dock. You arrive over the water between the bridge and the Opera
 * House, at a zoom where both are in frame and no dock's own type is readable
 * yet — which is the point. The first thing the site says should be "this is a
 * harbour and you are above it", and only then "here is where to go". The place
 * names painted on the ground are what carry that first frame; the docks take
 * over once you fly to one.
 */
export const SPAWN = { x: 6270, y: 5430 } as const;

export const ZOOM = {
  /** Far enough out to hold the whole harbour from Cockatoo to the Heads. */
  min: 0.32,
  max: 2,
  /**
   * Map scale, not reading scale.
   *
   * Framed so the opening shot holds the bridge, the Opera House and the top
   * edge of both south-shore docks at once. No dock's own type is legible here
   * and that is correct — the painted place names carry this zoom, the dock
   * index in the corner says where to go, and flying to a dock is what takes
   * you to a zoom you can read at.
   */
  start: 0.6,
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

/**
 * Each dock is a real place, and its rect is cut to sit inside the coastline in
 * content/geography.ts. Move a shoreline there and these have to move with it —
 * a slab hanging over the water is the one thing that breaks the illusion
 * outright.
 */
export const docks: readonly Dock[] = [
  {
    id: "the-rocks",
    label: "The Rocks",
    bearing: "33°51'S 151°12'E",
    // South shore, in under the bridge's southern footing.
    x: 4200,
    y: 6000,
    width: 1400,
    height: 900,
  },
  {
    id: "cockatoo-island",
    label: "Cockatoo Island",
    bearing: "33°51'S 151°10'E",
    // West, up the river. The island is drawn around this rect.
    x: 1780,
    y: 4150,
    width: 1900,
    height: 1150,
  },
  {
    id: "circular-quay",
    label: "Circular Quay",
    bearing: "33°51'S 151°12'E",
    // The bay between the bridge and Bennelong Point.
    x: 5900,
    y: 6050,
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
 * Where the ibis is loitering before anyone moves him: the eastern end of the
 * Circular Quay terminal, which is exactly where you would meet one. In world
 * pixels — he lives inside the world, not on the glass, so he has to be given a
 * place in it.
 */
export const ibisSpot = { x: 7620, y: 6220 } as const;

/**
 * Floating decoration in the water between the docks. Purely atmospheric and
 * `aria-hidden`, so nothing here needs to be reachable or readable.
 */
export const buoys: readonly { id: string; x: number; y: number; kind: "cardinal" | "can" }[] = [
  // All five sit in open water. A buoy on land reads as a bug, not decoration.
  { id: "b1", x: 5850, y: 4880, kind: "can" },
  { id: "b2", x: 4420, y: 5140, kind: "cardinal" },
  { id: "b3", x: 8300, y: 4780, kind: "can" },
  { id: "b4", x: 6320, y: 4200, kind: "cardinal" },
  { id: "b5", x: 3260, y: 5720, kind: "can" },
];
