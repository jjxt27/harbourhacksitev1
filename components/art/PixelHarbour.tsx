/*
 * The harbour, screen-printed on a 240 × 135 grid.
 *
 * Generated, not traced. Every shape here is rasterised the way a low-res
 * sprite is: for each row of the grid, work out which cells the shape covers,
 * then emit one rect per run of adjacent cells. Diagonals come out as stair
 * steps rather than smooth edges, which is the whole point — an SVG polygon
 * with the same vertices would render a clean hypotenuse and lose the look.
 *
 * Run-length encoding is what keeps this affordable. The naive version of a
 * grid this size is 32,400 rects and a third of a megabyte of path data; here
 * the flat fields are a handful of rects and only the structures pay per cell.
 * Nothing is random without a seed, so the server and the client draw the same
 * picture and hydration has nothing to disagree about.
 *
 * Tone comes from dot density, not from mixing. There are six inks and no
 * blending mode: a value between cobalt and cream is cobalt dots over cream at
 * 25%, 50% or 75%, which is what the press it imitates would actually do. The
 * Bayer matrix below is the ordered-dither threshold map those densities come
 * from — the same one `Dither` uses on photographs, so a dropped-in photo and
 * this drawing screen identically.
 */

const COLS = 240;
const ROWS = 135;

/** Where the water starts, where it stops, and where the lawn takes over. */
const HORIZON = 76;
const RAIL_Y = 86;
const SHORE = 94;

const INK = {
  ink: "#08192e",
  navy: "#0e3c72",
  harbour: "#1a5da8",
  sky: "#4e8ac4",
  ember: "#e2711d",
  apricot: "#f6be85",
  paper: "#fbead7",
} as const;

type Ink = keyof typeof INK;

/* ------------------------------------------------------------ the dot screen */

/**
 * Ordered-dither thresholds. A cell is inked when its threshold is below the
 * requested density, so the 4 × 16 case scatters four dots on a diagonal
 * lattice and the 8 × 16 case lands on a clean checkerboard.
 */
const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

type Density = 4 | 8 | 12;

function screenPath(density: Density): string {
  let out = "";
  for (let y = 0; y < 4; y += 1) {
    for (let x = 0; x < 4; x += 1) {
      if (BAYER_4[y][x] < density) out += `M${x},${y}h1v1h-1z`;
    }
  }
  return out;
}

/** Only the (ink, density) pairs the drawing actually uses get a pattern. */
const SCREENS: readonly { id: string; ink: Ink; density: Density }[] = [
  { id: "s-navy-8", ink: "navy", density: 8 },
  { id: "s-navy-12", ink: "navy", density: 12 },
  { id: "s-harbour-8", ink: "harbour", density: 8 },
  { id: "s-harbour-12", ink: "harbour", density: 12 },
  { id: "s-sky-8", ink: "sky", density: 8 },
  { id: "s-sky-12", ink: "sky", density: 12 },
  { id: "s-apricot-4", ink: "apricot", density: 4 },
  { id: "s-apricot-8", ink: "apricot", density: 8 },
  { id: "s-apricot-12", ink: "apricot", density: 12 },
  { id: "s-paper-8", ink: "paper", density: 8 },
  { id: "s-paper-4", ink: "paper", density: 4 },
  { id: "s-ember-8", ink: "ember", density: 8 },
  { id: "s-ember-12", ink: "ember", density: 12 },
  { id: "s-ink-4", ink: "ink", density: 4 },
  { id: "s-ink-8", ink: "ink", density: 8 },
];

/* -------------------------------------------------------------- rasterising */

/** One run of inked cells: x, y, width. */
type Run = [number, number, number];

const runsToPath = (runs: readonly Run[]) =>
  runs.map(([x, y, w]) => `M${x},${y}h${w}v1h-${w}z`).join("");

/** Clip a row's span to the grid and drop it if nothing survives. */
function span(x0: number, x1: number, y: number, out: Run[]) {
  if (y < 0 || y >= ROWS) return;
  const from = Math.max(0, Math.round(x0));
  const to = Math.min(COLS, Math.round(x1));
  if (to > from) out.push([from, y, to - from]);
}

function band(y: number, height: number): Run[] {
  const out: Run[] = [];
  for (let row = y; row < y + height; row += 1) span(0, COLS, row, out);
  return out;
}

/**
 * A cloud: an ellipse whose radius is modulated by three sine terms, so it
 * billows instead of reading as a balloon. `lump` is how far the edge is
 * allowed to wander from the base radius.
 */
function cloud(cx: number, cy: number, rx: number, ry: number, lump: number, phase: number): Run[] {
  const out: Run[] = [];
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
    const t = (y - cy) / ry;
    if (Math.abs(t) > 1) continue;
    const half = Math.sqrt(1 - t * t);
    // Two frequencies against each other: one gives the big lobes, the other
    // breaks the symmetry so the left and right edges do not mirror.
    const wobble =
      1 + lump * (0.6 * Math.sin(phase + t * 2.3) + 0.4 * Math.sin(phase * 1.7 + t * 5.1));
    const w = rx * half * wobble;
    span(cx - w, cx + w, y, out);
  }
  return out;
}

function disc(cx: number, cy: number, rx: number, ry: number): Run[] {
  const out: Run[] = [];
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
    const t = (y - cy) / ry;
    if (Math.abs(t) > 1) continue;
    const w = rx * Math.sqrt(1 - t * t);
    span(cx - w, cx + w, y, out);
  }
  return out;
}

/* ----------------------------------------------------------------- structure */

/**
 * Cell sets, for the drawn objects. Runs are fine for solid fields, but a
 * bridge truss and a palm frond are thin and overlapping, so they are collected
 * as cells first and packed into runs afterwards.
 */
class Cells {
  private readonly set = new Set<number>();

  put(x: number, y: number) {
    const cx = Math.round(x);
    const cy = Math.round(y);
    if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) return;
    this.set.add(cy * COLS + cx);
  }

  box(x: number, y: number, w: number, h: number) {
    for (let dy = 0; dy < h; dy += 1) for (let dx = 0; dx < w; dx += 1) this.put(x + dx, y + dy);
  }

  /** Pack into one run per stretch of adjacent cells on the same row. */
  runs(): Run[] {
    const out: Run[] = [];
    const keys = [...this.set].sort((a, b) => a - b);
    let start = -1;
    let prev = -2;
    for (const key of keys) {
      if (key !== prev + 1 || Math.floor(key / COLS) !== Math.floor(prev / COLS)) {
        if (start >= 0) out.push([start % COLS, Math.floor(start / COLS), prev - start + 1]);
        start = key;
      }
      prev = key;
    }
    if (start >= 0) out.push([start % COLS, Math.floor(start / COLS), prev - start + 1]);
    return out;
  }
}

const BRIDGE = { from: -18, to: 112, deck: 58, rise: 30 } as const;

/**
 * The Coathanger. The arch is a sine between `from` and `to`, the hangers drop
 * from wherever it lands, and the truss chords follow it two cells down — so
 * changing the span or the rise redraws a coherent bridge rather than breaking
 * a hand-placed one. It runs off the left edge on purpose: the photograph it
 * comes from crops it there too.
 */
function bridge(cells: Cells) {
  const { from, to, deck, rise } = BRIDGE;
  const archAt = (x: number) => deck - rise * Math.sin((Math.PI * (x - from)) / (to - from));

  for (let x = from; x <= to; x += 1) {
    const y = archAt(x);
    // Upper chord, and a lower chord parallel to it four cells down.
    cells.box(x, y, 1, 2);
    cells.box(x, y + 4, 1, 2);
    // Diagonal web between the two chords, alternating direction.
    if (x % 4 === 0) for (let d = 0; d < 4; d += 1) cells.put(x + d, y + 2 + d);
    if (x % 4 === 2) for (let d = 0; d < 4; d += 1) cells.put(x + d, y + 5 - d);
  }

  // The deck, all the way across and out past the arch.
  for (let x = from - 10; x <= to + 24; x += 1) cells.box(x, deck, 1, 3);

  // Hangers from the lower chord down to the deck.
  for (let x = from + 8; x < to - 6; x += 6) {
    for (let y = archAt(x) + 6; y < deck; y += 1) cells.put(x, y);
  }

  // Pylons, straddling the deck and standing in the water.
  for (const x of [6, 88]) cells.box(x, deck - 14, 9, HORIZON - deck + 18);
}

/**
 * A palm. The trunk leans, the fronds radiate from its head and droop under
 * their own weight, and each frond carries leaflets along its spine — without
 * them a frond is just a line and the tree reads as an antenna.
 */
function palm(cells: Cells, baseX: number, baseY: number, height: number, lean: number, seed: number) {
  const headX = baseX + lean;
  const headY = baseY - height;

  // Trunk: a quadratic from base to head, thinning as it climbs, with a notch
  // every few cells for the frond scars.
  for (let t = 0; t <= 1; t += 0.004) {
    const x = baseX + lean * t * t;
    const y = baseY - height * t;
    const thickness = Math.max(1, Math.round(4 - 2.4 * t));
    cells.box(x - (thickness - 1) / 2, y, thickness, 1);
    if (Math.round(y) % 5 === 0) cells.put(x + thickness / 2, y);
  }

  const FRONDS = 9;
  for (let f = 0; f < FRONDS; f += 1) {
    // Fanned across the top half, nudged by the seed so no two trees match.
    const a = Math.PI + ((f + 0.5) / FRONDS) * Math.PI + Math.sin(seed + f) * 0.13;
    const len = height * (0.34 + 0.1 * Math.sin(seed * 2 + f * 1.9));
    const droop = len * 0.55;

    let lastLeaf = 0;
    for (let t = 0; t <= 1; t += 0.02) {
      const x = headX + Math.cos(a) * len * t;
      const y = headY + Math.sin(a) * len * t + droop * t * t;
      cells.put(x, y);
      if (t < 0.6) cells.put(x, y + 1);

      // Leaflets, perpendicular to the spine and shortening toward the tip.
      if (t - lastLeaf > 0.11 && t > 0.15) {
        lastLeaf = t;
        const leaf = Math.round(3 * (1 - t) + 1);
        for (let l = 1; l <= leaf; l += 1) {
          cells.put(x - Math.sin(a) * l * 0.4, y + Math.cos(a) * l * 0.4 + l * 0.5);
          cells.put(x + Math.sin(a) * l * 0.4, y - Math.cos(a) * l * 0.4 + l * 0.5);
        }
      }
    }
  }
}

/** Balustrade along the seawall: a top rail, a bottom rail, and balusters. */
function railing(cells: Cells, fromX: number) {
  for (let x = fromX; x < COLS; x += 1) {
    cells.box(x, RAIL_Y, 1, 2);
    cells.box(x, SHORE - 2, 1, 1);
  }
  for (let x = fromX + 2; x < COLS; x += 4) {
    for (let y = RAIL_Y + 2; y < SHORE - 2; y += 1) cells.put(x, y);
    // The turned bulge in the middle of each baluster.
    cells.box(x - 1, RAIL_Y + 3, 3, 2);
  }
}

/** A lamp on a post: globe, neck, standard. */
function lamp(cells: Cells, x: number, top: number, footY: number) {
  for (let y = top + 5; y <= footY; y += 1) cells.box(x - 1, y, 2, 1);
  cells.box(x - 3, top, 6, 5);
  cells.box(x - 2, top - 1, 4, 1);
  cells.box(x - 1, top - 2, 2, 1);
}

/** The 6.55am to Manly, at this size: a hull, a house, a funnel. */
function ferry(cells: Cells, x: number, y: number) {
  cells.box(x, y, 22, 3);
  cells.box(x + 1, y + 3, 20, 2);
  cells.box(x + 5, y - 4, 12, 4);
  cells.box(x + 9, y - 7, 4, 3);
}

/* -------------------------------------------------------- assembled drawing */

/** Deterministic noise, so the speckle is the same on the server and the client. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Chop on the water: broken horizontal dashes, denser near the shore. */
function chop(): Run[] {
  const random = rng(97);
  const out: Run[] = [];
  for (let y = HORIZON + 2; y < SHORE; y += 2) {
    const density = 0.1 + 0.5 * ((y - HORIZON) / (SHORE - HORIZON));
    for (let x = 0; x < COLS; x += 3) {
      if (random() < density) span(x, x + 1 + Math.round(random() * 2), y, out);
    }
  }
  return out;
}

/**
 * Tufts in the lawn: single cells and short dashes, thinning into the distance.
 *
 * Every second row, not every row. Scattered single cells are the most
 * expensive thing on the grid — one run each, none of them merging — and at
 * full density this one function was a fifth of the drawing's bytes for a
 * texture nobody can point at. Halved, it reads the same.
 */
function tufts(): Run[] {
  const random = rng(1806);
  const out: Run[] = [];
  for (let y = SHORE; y < ROWS; y += 2) {
    const density = 0.06 + 0.34 * ((y - SHORE) / (ROWS - SHORE));
    for (let x = 0; x < COLS; x += 3) {
      if (random() < density) span(x, x + 1 + (random() < 0.4 ? 1 : 0), y, out);
    }
  }
  return out;
}

/**
 * The long shadows the palms throw across the lawn. In the reference they are
 * the thing that puts the sun somewhere specific, so they are not decoration —
 * without them the foreground is a flat orange field.
 */
function shadows(): Run[] {
  const out: Run[] = [];
  for (const [x0, spread] of [
    [96, 26],
    [138, 34],
    [196, 44],
  ] as const) {
    for (let y = SHORE + 2; y < ROWS; y += 1) {
      const t = (y - SHORE) / (ROWS - SHORE);
      const cx = x0 - 40 * t;
      const w = spread * (0.25 + t) * 0.5;
      span(cx - w, cx + w, y, out);
    }
  }
  return out;
}

const structure = new Cells();
bridge(structure);
palm(structure, 100, 108, 46, -5, 1.2);
palm(structure, 139, 114, 62, 6, 3.4);
palm(structure, 197, 120, 78, -8, 5.9);
railing(structure, 58);
lamp(structure, 118, 78, RAIL_Y + 1);
lamp(structure, 161, 74, RAIL_Y + 1);
lamp(structure, 233, 70, RAIL_Y + 1);
ferry(structure, 205, HORIZON + 4);
const STRUCTURE = runsToPath(structure.runs());

/* Sky, top down: navy overhead breaking into cobalt, cobalt breaking into the
   mid tone, and the mid tone burning out to cream at the horizon. */
const SKY_TOP = runsToPath(band(0, 22));
const SKY_BREAK_1 = runsToPath(band(22, 10));
const SKY_BREAK_2 = runsToPath(band(32, 8));
const SKY_MID = runsToPath(band(40, 16));
const SKY_BREAK_3 = runsToPath(band(56, 10));
const SKY_GLOW = runsToPath(band(66, HORIZON - 66));

const CLOUD_A = runsToPath(cloud(112, 26, 62, 15, 0.3, 0.8));
const CLOUD_A_CORE = runsToPath(cloud(112, 25, 50, 10, 0.26, 0.8));
const CLOUD_B = runsToPath(cloud(176, 46, 54, 13, 0.34, 2.6));
const CLOUD_B_CORE = runsToPath(cloud(178, 45, 42, 8, 0.3, 2.6));
const SUN = runsToPath(disc(186, 72, 34, 12));

const WATER = runsToPath(band(HORIZON, SHORE - HORIZON));
const WATER_FAR = runsToPath(band(HORIZON, 5));
const CHOP = runsToPath(chop());

const LAWN = runsToPath(band(SHORE, ROWS - SHORE));
const LAWN_NEAR = runsToPath(band(SHORE + 22, ROWS - SHORE - 22));
const SHADOWS = runsToPath(shadows());
const TUFTS = runsToPath(tufts());

type PixelHarbourProps = {
  className?: string;
  /**
   * `full` is the printed plate. `silhouette` is the same structures in one
   * ink with no sky, water or lawn — for sitting behind live text, where a
   * six-ink field would compete with it.
   */
  variant?: "full" | "silhouette";
};

export function PixelHarbour({ className = "", variant = "full" }: PixelHarbourProps) {
  const silhouette = variant === "silhouette";

  return (
    <svg
      viewBox={`0 0 ${COLS} ${ROWS}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
      shapeRendering="crispEdges"
    >
      {!silhouette ? (
        <defs>
          {SCREENS.map(({ id, ink, density }) => (
            <pattern key={id} id={id} width="4" height="4" patternUnits="userSpaceOnUse">
              <path d={screenPath(density)} fill={INK[ink]} />
            </pattern>
          ))}
        </defs>
      ) : null}

      {silhouette ? (
        <path d={STRUCTURE} fill={INK.ink} />
      ) : (
        <>
          {/* Sky */}
          <path d={SKY_TOP} fill={INK.navy} />
          <path d={SKY_BREAK_1} fill={INK.harbour} />
          <path d={SKY_BREAK_1} fill="url(#s-navy-12)" />
          <path d={SKY_BREAK_2} fill={INK.harbour} />
          <path d={SKY_BREAK_2} fill="url(#s-navy-8)" />
          <path d={SKY_MID} fill={INK.harbour} />
          <path d={SKY_BREAK_3} fill={INK.harbour} />
          <path d={SKY_BREAK_3} fill="url(#s-sky-12)" />
          <path d={SKY_GLOW} fill={INK.sky} />
          <path d={SKY_GLOW} fill="url(#s-apricot-12)" />

          {/* Cloud, twice over: a screened skirt, then a solid core inside it.
              One shape with a dithered edge would need per-cell rects; two
              shapes get the same broken edge for a fraction of the bytes. */}
          <path d={CLOUD_A} fill="url(#s-apricot-8)" />
          <path d={CLOUD_A_CORE} fill={INK.apricot} />
          <path d={CLOUD_A_CORE} fill="url(#s-paper-8)" />
          <path d={CLOUD_B} fill="url(#s-apricot-8)" />
          <path d={CLOUD_B_CORE} fill={INK.apricot} />
          <path d={CLOUD_B_CORE} fill="url(#s-paper-4)" />

          {/* The sun sits behind the palms and in front of the sky. */}
          <path d={SUN} fill="url(#s-paper-8)" />

          {/* Water: cobalt, screened lighter where it meets the sky. */}
          <path d={WATER} fill={INK.harbour} />
          <path d={WATER} fill="url(#s-navy-8)" />
          <path d={WATER_FAR} fill="url(#s-apricot-8)" />
          <path d={CHOP} fill="url(#s-sky-12)" />

          {/* Lawn: ember, warmer and coarser as it comes forward. */}
          <path d={LAWN} fill={INK.ember} />
          <path d={LAWN} fill="url(#s-apricot-8)" />
          <path d={LAWN_NEAR} fill="url(#s-ember-12)" />
          <path d={SHADOWS} fill="url(#s-harbour-12)" />
          <path d={TUFTS} fill="url(#s-ink-8)" />

          {/* Structure last: it reads against everything behind it. */}
          <path d={STRUCTURE} fill={INK.ink} />
        </>
      )}
    </svg>
  );
}
