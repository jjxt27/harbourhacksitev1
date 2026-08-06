/**
 * Sydney Harbour, stylised.
 *
 * Every path here is in world coordinates on the {@link WORLD}px square, so the
 * coastline, the landmarks, the docks and the chart in the corner are all
 * describing the same place. Change a shoreline here and the minimap redraws
 * with it.
 *
 * The geography is deliberately wrong in the ways that do not matter and right
 * in the ways that do. Distances are compressed, the Parramatta River is a
 * stub, and Cockatoo Island is far larger than it has any right to be — but the
 * bridge crosses at the narrow point, the Opera House is east of it on its own
 * spit, Circular Quay is the bay between them, and Cockatoo is west up the
 * river. Those four relationships are what make it read as Sydney rather than
 * as a generic waterway, and they are the ones that survive.
 *
 * Water is the ground. Land is drawn on top of it; anywhere there is no land
 * path, the harbour shows through.
 */

/** Everything below assumes this. Kept in step with WORLD in content/map.ts. */
export const WORLD_SIZE = 10000;

/**
 * The north shore — Kirribilli and Milsons Point.
 *
 * The promontory reaching down to about y=4080 near x=5330 is the northern
 * headland the bridge lands on. It is the whole reason the bridge is where it
 * is, so it is the one part of this outline that is not free-hand.
 */
export const northShore = `
  M0 0 H10000 V3380
  C 9400 3300, 8900 3520, 8400 3460
  C 7900 3400, 7600 3180, 7150 3300
  C 6800 3390, 6520 3600, 6180 3520
  C 5940 3462, 5800 3700, 5680 3900
  C 5600 4030, 5480 4090, 5330 4080
  C 5180 4070, 5060 3960, 4900 3880
  C 4600 3730, 4300 3620, 4000 3700
  C 3700 3780, 3450 3900, 3150 3820
  C 2850 3740, 2600 3560, 2300 3620
  C 2000 3680, 1700 3800, 1350 3720
  C 1000 3640, 600 3480, 0 3560 Z
`;

/**
 * The south shore — Dawes Point, Circular Quay, Bennelong Point.
 *
 * Three features carry the identity: the headland at x≈5270 that the bridge
 * lands on, the bay scooped out between x 5580 and 7020 that is Circular Quay,
 * and the narrow spit spiking north at x≈7160 that the Opera House sits on.
 */
export const southShore = `
  M0 10000 V6180
  C 500 6100, 900 5940, 1400 6000
  C 1900 6060, 2300 5900, 2750 5930
  C 3200 5960, 3550 6080, 3900 5980
  C 4200 5895, 4400 5700, 4620 5560
  C 4850 5410, 5050 5330, 5270 5340
  C 5420 5347, 5520 5450, 5580 5580
  C 5650 5730, 5700 5850, 5900 5900
  C 6150 5962, 6420 5940, 6650 5860
  C 6850 5790, 6980 5620, 7020 5380
  C 7050 5200, 7090 5090, 7160 5080
  C 7230 5070, 7270 5180, 7290 5380
  C 7315 5620, 7420 5760, 7650 5820
  C 7950 5898, 8300 5800, 8700 5760
  C 9150 5715, 9600 5800, 10000 5760
  V10000 Z
`;

/** Cockatoo Island, up the river to the west. Big enough to hold a shipyard. */
export const cockatooIsland = `
  M1100 4620
  C 1140 4300, 1440 4000, 1880 3910
  C 2420 3800, 3080 3830, 3540 3960
  C 3880 4056, 4060 4300, 4050 4620
  C 4038 4990, 3880 5300, 3540 5450
  C 3160 5617, 2460 5640, 1930 5540
  C 1470 5453, 1120 5200, 1100 4620 Z
`;

/** Two rocks in the stream. Pure wayfinding — they break up open water. */
export const islets = [
  "M4530 4640 C 4640 4570, 4790 4590, 4830 4700 C 4870 4810, 4780 4900, 4650 4890 C 4530 4880, 4460 4760, 4530 4640 Z",
  "M6480 4560 C 6600 4470, 6790 4500, 6830 4630 C 6870 4760, 6760 4860, 6620 4840 C 6480 4820, 6400 4660, 6480 4560 Z",
] as const;

export const landPaths = [northShore, southShore, cockatooIsland, ...islets] as const;

/**
 * The bridge, as a rectangle it spans rather than as art.
 *
 * The component draws itself from these four numbers, so moving the crossing is
 * a matter of moving the footings and nothing else redraws by hand.
 */
export const bridge = {
  /** Deck centreline, north to south. */
  x: 5300,
  northY: 4040,
  southY: 5360,
  /** Deck width across the span. */
  width: 430,
} as const;

/** Bennelong Point. The shells cluster here. */
export const operaHouse = { x: 7165, y: 5215, size: 430 } as const;

/**
 * Place names painted on the ground.
 *
 * Sized in world units, so they hold their proportion at every zoom — this is
 * the layer that keeps the map legible when you pull back far enough that no
 * dock's own type can be read. `tone` picks the ground they sit on, because a
 * label painted on concrete and one painted on water are not the same colour.
 */
export const placeNames = [
  // Across the open water of the opening frame — this is the one that has to
  // land in the first shot, because at map scale it is the only type on screen
  // big enough to read.
  // Sized and placed to clear both landmarks: it starts east of the bridge's
  // outer rib and stops above the Opera House podium. Labels are drawn last, so
  // anything that overlaps a landmark paints over it and reads as a mistake.
  { text: "Sydney Harbour", x: 6480, y: 4820, size: 150, tone: "water" as const, rotate: -2 },

  // Each dock's name goes on open ground beside or below its slab. Painted
  // under a dock it would simply never be seen — the slab is opaque and sits
  // on top of this whole layer.
  { text: "The Rocks", x: 4880, y: 7320, size: 170, tone: "land" as const, rotate: 0 },
  { text: "Cockatoo Island", x: 2570, y: 5470, size: 110, tone: "land" as const, rotate: 0 },
  { text: "Circular Quay", x: 6740, y: 7700, size: 150, tone: "land" as const, rotate: 0 },
  { text: "Milsons Point", x: 5330, y: 3260, size: 110, tone: "land" as const, rotate: 0 },
  { text: "Parramatta River", x: 620, y: 4700, size: 92, tone: "water" as const, rotate: 0 },
] as const;

/** Depth soundings, the way a real chart marks them. Decorative. */
export const soundings = [
  { x: 4180, y: 4420, v: "12" },
  { x: 5900, y: 4180, v: "24" },
  { x: 6900, y: 4700, v: "18" },
  { x: 3300, y: 5760, v: "9" },
  { x: 8200, y: 4900, v: "31" },
  { x: 2000, y: 3960, v: "7" },
  { x: 7600, y: 4300, v: "26" },
] as const;
