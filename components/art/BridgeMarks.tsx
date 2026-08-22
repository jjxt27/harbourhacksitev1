/*
 * HarbourHack — HH ⇄ Coathanger calligram studies.
 *
 * Eight marks that all answer the same question: how far can the letters HH be
 * pushed toward the Sydney Harbour Bridge before they stop being letters?
 *
 * The governing constraint is a proportion, and it is worth stating before any
 * of the geometry, because it kills the first idea everybody has.
 *
 * The Coathanger's arch spans 503m and rises 134m above its springing — a
 * rise-to-span ratio of about 0.27. Anything much above ~0.45 stops reading as
 * that bridge and starts reading as a rainbow. An `H` is roughly as tall as it
 * is wide, and its counter — the gap between the stems, above the crossbar —
 * is *taller* than it is wide. Fitting an arch inside one counter therefore
 * forces a ratio near 1.3. `CounterArchStudy` at the bottom of this file draws
 * that so nobody has to be talked out of it twice.
 *
 * The consequence runs through every mark here: the arch has to span *both*
 * letters, and the letterspace between them has to carry the span. The marks
 * differ in how much of the reading they give to the picture and how much to
 * the letters:
 *
 *   WideStanceMark  letters first  — normal HH, the bridge arcs over the top
 *   SpanMark        balanced       — the letterspace *is* the span
 *   CableFieldMark  picture first  — HH emerges from hanger density
 *
 * and three treatments of the balanced one: `TrussMark` (drawn in steel),
 * `PlateMark` (screen-printed on the grid `PixelHarbour` uses) and
 * `WaterlineMark` (with its reflection). `IconMark` is the square lockup.
 *
 * Nothing here is traced. Every arch is the same parabola, every hanger is
 * measured off it, so changing a span or a rise redraws a coherent bridge
 * rather than breaking a hand-placed one.
 *
 * All marks are single-ink by default. A logo that needs two plates to be
 * legible is a logo that fails on a fax, an embroidery, and a stamp; the
 * colour variants are the poster, not the mark.
 */

const INK = {
  ink: "#08192e",
  harbour: "#1a5da8",
  navy: "#0e3c72",
  ember: "#e2711d",
  apricot: "#f6be85",
  paper: "#fbead7",
} as const;

/* ------------------------------------------------------------------ shapes */

/** x, y, width, height. */
type Rect = readonly [number, number, number, number];
/** An inclusive-exclusive range on one axis. */
type Span = readonly [number, number];

const rect = ([x, y, w, h]: Rect) => `M${round(x)},${round(y)}h${round(w)}v${round(h)}h${round(-w)}z`;
const paths = (list: readonly Rect[]) => list.map(rect).join("");

/** Three decimals is past the resolution of any surface this prints on. */
const round = (n: number) => Math.round(n * 1000) / 1000;

/**
 * The arch, as a quadratic Bézier whose control point sits directly above the
 * midpoint of its springings.
 *
 * That choice is not cosmetic. With the control x exactly halfway, x becomes
 * *linear* in t, and the curve collapses to the parabola
 * `y = base − 4·rise·t(1−t)` — which means `archY` below can answer "how high
 * is the arch at this x" in closed form, with no root-finding. Every hanger
 * length in this file falls out of that one line.
 */
const archPath = (x0: number, x1: number, base: number, rise: number) =>
  `M${round(x0)},${round(base)}Q${round((x0 + x1) / 2)},${round(base - 2 * rise)} ${round(x1)},${round(base)}`;

const archY = (x: number, x0: number, x1: number, base: number, rise: number) => {
  const t = (x - x0) / (x1 - x0);
  return base - 4 * rise * t * (1 - t);
};

/* ---------------------------------------------------------------- the HHs */

/**
 * The letterform, as rectangles.
 *
 * `letter` is the full width of one H and `gap` the space between the two, so
 * `gap` is the dial that runs the whole spectrum: small and the mark reads
 * HH, large and the space between the letters becomes the span of a bridge.
 */
type HHSpec = {
  /** Left edge of the first H. */
  x: number;
  top: number;
  bottom: number;
  /** Stem width — the pylon. */
  stem: number;
  /** Full width of one H. */
  letter: number;
  /** Letterspace — the span. */
  gap: number;
  /** The crossbar, which is also the deck. */
  barTop: number;
  barBottom: number;
};

const hhLefts = (s: HHSpec) => [s.x, s.x + s.letter + s.gap];

/** The four stems, as x-ranges. Hangers have to dodge these. */
function hhStems(s: HHSpec): Span[] {
  return hhLefts(s).flatMap((left): Span[] => [
    [left, left + s.stem],
    [left + s.letter - s.stem, left + s.letter],
  ]);
}

function hhRects(s: HHSpec): Rect[] {
  const height = s.bottom - s.top;
  return hhLefts(s).flatMap((left): Rect[] => [
    [left, s.top, s.stem, height],
    [left + s.letter - s.stem, s.top, s.stem, height],
    [left + s.stem, s.barTop, s.letter - 2 * s.stem, s.barBottom - s.barTop],
  ]);
}

/**
 * The y-ranges the letterform covers at a given x — a stem's full height, or
 * the crossbar alone, or nothing. `CableFieldMark` uses this to decide which
 * part of each hanger is inked.
 */
function hhCoverage(s: HHSpec, x: number): Span[] {
  const out: Span[] = [];
  for (const left of hhLefts(s)) {
    const inStem =
      (x >= left && x < left + s.stem) ||
      (x >= left + s.letter - s.stem && x < left + s.letter);
    if (inStem) out.push([s.top, s.bottom]);
    else if (x >= left + s.stem && x < left + s.letter - s.stem) out.push([s.barTop, s.barBottom]);
  }
  return out;
}

/* --------------------------------------------------------------- hangers */

type HangerSpec = {
  /** Arch springings and geometry, so a hanger knows where its top is. */
  x0: number;
  x1: number;
  base: number;
  rise: number;
  /** Hangers land on the deck, not on the springing line. */
  deckTop: number;
  /** Laid out symmetrically about this x, so the mark stays even. */
  centre: number;
  pitch: number;
  width: number;
  /** Stem ranges to skip — a hanger inside a pylon is invisible anyway. */
  avoid?: readonly Span[];
  /** Anything shorter than this is a smudge rather than a cable. */
  min?: number;
};

/**
 * Hangers, laid out from the centre outwards rather than from the left edge.
 *
 * Stepping from the left is one line shorter and gives an asymmetric mark
 * whenever the span is not an exact multiple of the pitch — which reads as a
 * mistake at every size, because the arch either side of it is symmetric.
 */
function hangers(s: HangerSpec): Rect[] {
  const min = s.min ?? 4;
  const out: Rect[] = [];
  const offsets: number[] = [0];
  for (let d = s.pitch; d <= (s.x1 - s.x0) / 2 + s.pitch; d += s.pitch) offsets.push(d, -d);

  for (const x of offsets.map((d) => s.centre + d).sort((a, b) => a - b)) {
    if (x <= s.x0 || x >= s.x1) continue;
    const half = s.width / 2;
    if (s.avoid?.some(([from, to]) => x + half > from - 1 && x - half < to + 1)) continue;
    const top = archY(x, s.x0, s.x1, s.base, s.rise);
    if (s.deckTop - top < min) continue;
    out.push([x - half, top, s.width, s.deckTop - top]);
  }
  return out;
}

/* ------------------------------------------------------------------ frame */

type MarkProps = {
  className?: string;
  /**
   * Which way round the mark is printed. Single-ink marks take their colour
   * from `currentColor` and never need this; the two-ink ones do, because
   * "the dark part" and "the light part" swap rather than invert.
   */
  ground?: "paper" | "ink";
  /**
   * Given, the mark is announced as an image; withheld, it is decorative.
   * A mark repeated beside a live wordmark should be decorative — the name
   * being read out twice is worse than not being read out.
   */
  title?: string;
};

const label = (title?: string) =>
  title ? { role: "img" as const } : { "aria-hidden": true as const };

/* ================================================================ 1 of 8 ==
   WIDE STANCE — letters first.

   HH at ordinary letterspacing with the bridge thrown over the top of it: the
   arch springs from its own pylons outside the word and the deck runs past
   them as the approach spans. The letters win the first read; the bridge is an
   enclosure rather than a disguise.

   It still obeys the two rules `SpanMark` sets out — no hangers inside a
   counter, and a crossbar heavier than the roadway — because without them a
   letterspace this tight gives four evenly-spaced posts on a rail and the word
   disappears into a picket fence. Here that leaves only five hangers, which is
   the honest cost of putting the letters first: less of the span is cabled, so
   less of it reads as the bridge.

   The other limitation is the one that keeps it off the shortlist. Nothing
   here is a calligram. Take the arch away and you still have HH.             */

const WIDE: HHSpec = {
  x: 49, top: 40, bottom: 122, stem: 16, letter: 56, gap: 30, barTop: 70, barBottom: 90,
};
const WIDE_DECK: Rect = [10, 76, 220, 8];
/** The arch needs somewhere to land, and the letters are not it. */
const WIDE_PYLONS: readonly Rect[] = [
  [16, 58, 12, 50],
  [212, 58, 12, 50],
];
const WIDE_ARCH = { x0: 22, x1: 218, base: 84, rise: 70 };
const WIDE_COUNTERS: readonly Span[] = [
  [49 + 16, 49 + 56 - 16],
  [135 + 16, 135 + 56 - 16],
];
const WIDE_HANGERS = hangers({
  ...WIDE_ARCH,
  deckTop: 76,
  centre: 120,
  /* Nine, not thirteen: at thirteen the two hangers either side of the crown
     land a unit inside the inner stems and are dropped, leaving one lonely
     cable down the middle of the letterspace that reads as a crack. */
  pitch: 9,
  width: 3,
  avoid: [...hhStems(WIDE), ...WIDE_COUNTERS, [16, 28], [212, 224]],
});

export function WideStanceMark({ className = "", title }: MarkProps) {
  return (
    <svg viewBox="0 0 240 132" className={className} {...label(title)}>
      {title ? <title>{title}</title> : null}
      <path
        d={archPath(WIDE_ARCH.x0, WIDE_ARCH.x1, WIDE_ARCH.base, WIDE_ARCH.rise)}
        fill="none"
        stroke="currentColor"
        strokeWidth={10}
      />
      <path d={paths(WIDE_HANGERS)} fill="currentColor" />
      <path d={paths([WIDE_DECK, ...WIDE_PYLONS, ...hhRects(WIDE)])} fill="currentColor" />
    </svg>
  );
}

/* ================================================================ 2 of 8 ==
   THE SPAN — the calligram proper, and the one to beat.

   The letterspace is the span. Four stems become two pairs of pylons, the two
   crossbars run into one continuous deck that overhangs both ends as the
   approach spans, and the arch springs from the centre of each outer pylon at
   deck level.

   Two decisions do all the work of keeping HH readable at a letterspace this
   wide, and the first version of this mark got both wrong:

   1. No hangers inside a counter. Cables strung across the gap *inside* an H
      fill the one piece of white space that says "this is a letter", and the
      mark collapses into four posts and a fence. Hangers live in the span
      between the two letters, which is also where the real bridge keeps them —
      the stone between a pylon pair carries no cable.

   2. The crossbar is thicker than the roadway it joins. Sixteen units inside
      each letter against eight across the span, centred on the same line, so
      the deck visibly swells where it passes through a pylon pair. Without the
      step there is one bar of even weight through four stems and no grouping
      survives it. With it, the eye gets two chunky letters linked by a road.

   What is left holding the two halves apart is the ratio between the counter
   inside each H (29 units) and the space between them (86). Close that and the
   mark stops being HH again.

   The arch clips the top outside corner of each inner stem. That is left in
   deliberately — in one ink it reads as a gusset plate, and moving the arch
   clear of it costs either the rise or the letter height.                    */

const SPAN: HHSpec = {
  x: 18, top: 40, bottom: 122, stem: 15, letter: 59, gap: 86, barTop: 72, barBottom: 88,
};
/** The roadway between and beyond the letters: thinner than the crossbars. */
const SPAN_DECK: Rect = [8, 76, 224, 8];
const SPAN_ARCH = { x0: 25.5, x1: 214.5, base: 86, rise: 72 };
/** The counters, which hangers must stay out of along with the stems. */
const SPAN_COUNTERS: readonly Span[] = [
  [18 + 15, 18 + 59 - 15],
  [163 + 15, 163 + 59 - 15],
];
const SPAN_HANGERS = hangers({
  ...SPAN_ARCH,
  deckTop: 76,
  centre: 120,
  pitch: 12,
  width: 3,
  avoid: [...hhStems(SPAN), ...SPAN_COUNTERS],
});

export function SpanMark({ className = "", title }: MarkProps) {
  return (
    <svg viewBox="0 0 240 132" className={className} {...label(title)}>
      {title ? <title>{title}</title> : null}
      <path
        d={archPath(SPAN_ARCH.x0, SPAN_ARCH.x1, SPAN_ARCH.base, SPAN_ARCH.rise)}
        fill="none"
        stroke="currentColor"
        strokeWidth={10}
      />
      <path d={paths(SPAN_HANGERS)} fill="currentColor" />
      <path d={paths([SPAN_DECK, ...hhRects(SPAN)])} fill="currentColor" />
    </svg>
  );
}

/* ================================================================ 3 of 8 ==
   THE CABLE FIELD — picture first.

   One arch, one deck, and ninety-odd hangers between them. The letters are not
   drawn at all: a hanger that falls inside the letterform is inked and fat, a
   hanger outside it is hairline and blue, and HH appears as a change in
   density across the cable field rather than as a shape.

   That is the branch's own rule about tone applied to a logo — a value between
   two inks is one screened over the other, never a mix — and it is why this
   mark is the only one here that needs its second colour to work.

   The letterform is short and wide because it has to fit *under* the arch:
   there is only 46 of headroom above the deck between x=57 and x=183, and a
   letter that overruns that has hangers standing above the cable they hang
   from.                                                                      */

const CABLE_ARCH = { x0: 20, x1: 220, base: 92, rise: 76 };
const CABLE: HHSpec = {
  x: 57, top: 46, bottom: 92, stem: 13, letter: 51, gap: 24, barTop: 68, barBottom: 78,
};
const CABLE_DECK: Rect = [10, 92, 220, 7];

/** Every hanger, hairline. */
const CABLE_FIELD: Rect[] = hangers({
  ...CABLE_ARCH,
  deckTop: 92,
  centre: 120,
  pitch: 4,
  width: 1.5,
  min: 2,
});

/** The same field again, fattened and clipped to the letterform. */
const CABLE_LETTERS: Rect[] = hangers({
  ...CABLE_ARCH,
  deckTop: 92,
  centre: 120,
  pitch: 4,
  width: 5,
  min: 2,
}).flatMap(([x, top, w]): Rect[] =>
  hhCoverage(CABLE, x + w / 2)
    .map(([from, to]): Rect => [x, Math.max(from, top), w, to - Math.max(from, top)])
    .filter(([, , , h]) => h > 0),
);

export function CableFieldMark({ className = "", title, ground = "paper" }: MarkProps) {
  /*
    Reversing this one is not an inversion. The letters are whatever the ground
    is not, and the field has to stay a step away from *both* of them: harbour
    is 5.62:1 on cream and 1.7:1 on navy-black, so on ink the hairlines move to
    apricot rather than staying blue and vanishing.
  */
  const structure = ground === "ink" ? INK.paper : INK.ink;
  const field = ground === "ink" ? INK.apricot : INK.harbour;

  return (
    <svg viewBox="0 0 240 132" className={className} {...label(title)}>
      {title ? <title>{title}</title> : null}
      <path d={paths(CABLE_FIELD)} fill={field} />
      <path
        d={archPath(CABLE_ARCH.x0, CABLE_ARCH.x1, CABLE_ARCH.base, CABLE_ARCH.rise)}
        fill="none"
        stroke={structure}
        strokeWidth={5}
      />
      <path d={paths(CABLE_LETTERS)} fill={structure} />
      <path d={paths([CABLE_DECK])} fill={structure} />
    </svg>
  );
}

/* ================================================================ 4 of 8 ==
   THE TRUSS — The Span, drawn in steel.

   Same geometry, but the letters are hollow and packed with lattice, and the
   arch gets the two chords and the zigzag web it actually has. The mark stops
   being a silhouette of the bridge and becomes a close-up of it.

   The lower chord springs slightly inside the upper one so the truss closes to
   a point at each end rather than being cut off by the deck. It is deepest at
   the crown, which is the opposite of the real two-hinged arch — the real one
   is deepest near the quarter points — but the honest version reads as a
   drawing error at this size.

   `idPrefix` exists because two of these on one page would otherwise define
   the same pattern id twice.                                                 */

const TRUSS_DEPTH = 13;
const TRUSS_INSET = 26;

/** Alternating uprights and diagonals between the two chords. */
function trussWeb(): string {
  const { x0, x1, base, rise } = SPAN_ARCH;
  const lo = { x0: x0 + TRUSS_INSET, x1: x1 - TRUSS_INSET, base, rise: rise - TRUSS_DEPTH };
  const steps = 22;
  let out = "";
  for (let i = 0; i <= steps; i += 1) {
    const x = lo.x0 + ((lo.x1 - lo.x0) * i) / steps;
    const upper = archY(x, x0, x1, base, rise);
    const lower = archY(x, lo.x0, lo.x1, lo.base, lo.rise);
    // Where the chords converge the web becomes a knot rather than a truss.
    if (lower - upper < 7) continue;
    out += `M${round(x)},${round(upper)}L${round(x)},${round(lower)}`;
    // The diagonal that makes it a truss rather than a ladder.
    const next = lo.x0 + ((lo.x1 - lo.x0) * (i + 1)) / steps;
    if (i < steps) {
      const nextY = i % 2 === 0 ? archY(next, lo.x0, lo.x1, lo.base, lo.rise) : archY(next, x0, x1, base, rise);
      out += `M${round(x)},${round(i % 2 === 0 ? upper : lower)}L${round(next)},${round(nextY)}`;
    }
  }
  return out;
}

const TRUSS_WEB = trussWeb();

export function TrussMark({ className = "", title, idPrefix = "truss" }: MarkProps & { idPrefix?: string }) {
  const lattice = `${idPrefix}-lattice`;
  return (
    <svg viewBox="0 0 240 132" className={className} {...label(title)}>
      {title ? <title>{title}</title> : null}
      <defs>
        <pattern id={lattice} width="11" height="11" patternUnits="userSpaceOnUse">
          <path d="M0,0L11,11M11,0L0,11" stroke="currentColor" strokeWidth={2.4} fill="none" />
        </pattern>
      </defs>

      <path
        d={archPath(SPAN_ARCH.x0, SPAN_ARCH.x1, SPAN_ARCH.base, SPAN_ARCH.rise)}
        fill="none"
        stroke="currentColor"
        strokeWidth={4}
      />
      <path
        d={archPath(
          SPAN_ARCH.x0 + TRUSS_INSET,
          SPAN_ARCH.x1 - TRUSS_INSET,
          SPAN_ARCH.base,
          SPAN_ARCH.rise - TRUSS_DEPTH,
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth={4}
      />
      <path d={TRUSS_WEB} stroke="currentColor" strokeWidth={2} fill="none" />
      <path d={paths(SPAN_HANGERS)} fill="currentColor" />

      {/* Hollow letters, lattice inside, drawn last so the outline is clean. */}
      <path d={paths([SPAN_DECK, ...hhRects(SPAN)])} fill={`url(#${lattice})`} />
      <path
        d={paths([SPAN_DECK, ...hhRects(SPAN)])}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/* ================================================================ 5 of 8 ==
   THE PLATE — The Span, screen-printed.

   The same mark rasterised onto a coarse grid the way `PixelHarbour` does it,
   so the arch comes out as stair steps rather than a clean hypotenuse, then
   pulled twice: ember first, ink over the top and one cell off register. The
   misregistration is the point — it is what a two-plate riso actually does,
   and it is the only thing in the set that ties the logo to the drawing the
   site already opens on.

   Run-length encoded for the same reason `PixelHarbour` is: the naive version
   is one rect per cell and most of them are neighbours.                      */

const PLATE_COLS = 120;
const PLATE_ROWS = 66;

class Cells {
  private readonly set = new Set<number>();

  put(x: number, y: number) {
    const cx = Math.round(x);
    const cy = Math.round(y);
    if (cx < 0 || cx >= PLATE_COLS || cy < 0 || cy >= PLATE_ROWS) return;
    this.set.add(cy * PLATE_COLS + cx);
  }

  box(x: number, y: number, w: number, h: number) {
    for (let dy = 0; dy < h; dy += 1) for (let dx = 0; dx < w; dx += 1) this.put(x + dx, y + dy);
  }

  /** One run per stretch of adjacent inked cells on the same row. */
  path(): string {
    const keys = [...this.set].sort((a, b) => a - b);
    let out = "";
    let start = -1;
    let prev = -2;
    const flush = () => {
      if (start < 0) return;
      const w = prev - start + 1;
      out += `M${start % PLATE_COLS},${Math.floor(start / PLATE_COLS)}h${w}v1h-${w}z`;
    };
    for (const key of keys) {
      if (key !== prev + 1 || Math.floor(key / PLATE_COLS) !== Math.floor(prev / PLATE_COLS)) {
        flush();
        start = key;
      }
      prev = key;
    }
    flush();
    return out;
  }
}

function plateCells(): string {
  const cells = new Cells();
  const half = (n: number) => n / 2; // the 240-wide geometry, at grid scale

  /*
    The arch, stepped.

    Inking one cell per x-step leaves the legs as dashes rather than a line:
    near the springings the arch drops faster than one cell per column, so the
    steps do not touch. Each column is therefore filled from its own height to
    the next column's, which closes the gaps and — because the same rule runs
    both ways from the crown — keeps the two legs identical. The first version
    of this did not, and the asymmetry was the most visible thing in the mark.
  */
  const { x0, x1, base, rise } = SPAN_ARCH;
  for (let x = half(x0); x <= half(x1); x += 0.5) {
    const here = half(archY(x * 2, x0, x1, base, rise));
    const next = half(archY(Math.min(x + 0.5, half(x1)) * 2, x0, x1, base, rise));
    const top = Math.min(here, next);
    cells.box(x, top, 1, Math.abs(next - here) + 3);
  }
  for (const [x, y, w, h] of SPAN_HANGERS) cells.box(half(x), half(y), Math.max(1, half(w)), half(h));
  for (const [x, y, w, h] of [SPAN_DECK, ...hhRects(SPAN)]) {
    cells.box(half(x), half(y), half(w), half(h));
  }
  return cells.path();
}

const PLATE = plateCells();

export function PlateMark({
  className = "",
  title,
  ground = "paper",
  idPrefix = "plate",
}: MarkProps & { idPrefix?: string }) {
  const screen = `${idPrefix}-screen`;
  // Ember is the under-plate either way round; only the key plate swaps.
  const key = ground === "ink" ? INK.paper : INK.ink;
  return (
    <svg
      viewBox={`0 0 ${PLATE_COLS} ${PLATE_ROWS}`}
      className={className}
      shapeRendering="crispEdges"
      {...label(title)}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        {/* A half-tone checkerboard at the grid's own pitch. */}
        <pattern id={screen} width="2" height="2" patternUnits="userSpaceOnUse">
          <path d="M0,0h1v1h-1zM1,1h1v1h-1z" fill={key} />
        </pattern>
      </defs>
      {/* Ember plate, one cell out of register. */}
      <g transform="translate(1.5 1.5)">
        <path d={PLATE} fill={INK.ember} />
      </g>
      {/* Key plate, and the screen that turns the overlap into tone. */}
      <path d={PLATE} fill={key} />
      <g transform="translate(1.5 1.5)">
        <path d={PLATE} fill={`url(#${screen})`} opacity={0.55} />
      </g>
    </svg>
  );
}

/* ================================================================ 6 of 8 ==
   THE WATERLINE — The Span, with the harbour under it.

   The deck becomes the waterline and everything above it is mirrored below in
   apricot, broken by horizontal chop so the reflection reads as water rather
   than as a second bridge. Arch plus reflected arch closes into a lens, which
   is the shape the mark is really for: it gives the wordmark a container
   without anybody having to draw a badge around it.

   The chop is a *mask*, not a set of dashes painted in the ground colour. The
   painted version works on cream and fails everywhere else — on the ink plate
   it showed up as a field of pale dashes floating around a bridge, because
   cream dashes on navy are the most visible thing in the mark. Cut out of the
   reflection instead, the same chop works on any ground at all.

   The reflection is decorative and can be dropped whole — the mark above the
   waterline is `SpanMark` unchanged.                                         */

const MIRROR = 86; // the waterline: the underside of the deck

const REFLECTION_CHOP: Rect[] = (() => {
  const out: Rect[] = [];
  // Deterministic, so the server and the browser draw the same water.
  let seed = 20261023;
  const random = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let y = MIRROR + 5; y < MIRROR + 84; y += 4) {
    for (let x = 0; x < 240; x += 7) {
      if (random() < 0.55) out.push([x, y, 4 + random() * 7, 2.5]);
    }
  }
  return out;
})();

export function WaterlineMark({
  className = "",
  title,
  ground = "paper",
  idPrefix = "waterline",
}: MarkProps & { idPrefix?: string }) {
  const structure = ground === "ink" ? INK.paper : INK.ink;
  const chop = `${idPrefix}-chop`;

  return (
    <svg viewBox="0 0 240 176" className={className} {...label(title)}>
      {title ? <title>{title}</title> : null}
      <defs>
        <mask id={chop}>
          <path d={rect([0, 0, 240, 176])} fill="#fff" />
          <path d={paths(REFLECTION_CHOP)} fill="#000" />
        </mask>
      </defs>

      {/*
        The mask goes on an untransformed wrapper, not on the mirrored group.
        A mask resolves in the user space of the element that references it —
        which includes that element's own transform — so masking the flipped
        group flipped the chop with it and threw every dash up into the sky,
        where there is nothing to cut. The reflection came out solid.
      */}
      <g mask={`url(#${chop})`}>
        <g transform={`translate(0 ${2 * MIRROR}) scale(1 -1)`} opacity={0.85}>
          <path
            d={archPath(SPAN_ARCH.x0, SPAN_ARCH.x1, SPAN_ARCH.base, SPAN_ARCH.rise)}
            fill="none"
            stroke={INK.apricot}
            strokeWidth={10}
          />
          <path d={paths(SPAN_HANGERS)} fill={INK.apricot} />
          <path d={paths(hhRects(SPAN))} fill={INK.apricot} />
        </g>
      </g>

      <path
        d={archPath(SPAN_ARCH.x0, SPAN_ARCH.x1, SPAN_ARCH.base, SPAN_ARCH.rise)}
        fill="none"
        stroke={structure}
        strokeWidth={10}
      />
      <path d={paths(SPAN_HANGERS)} fill={structure} />
      <path d={paths([SPAN_DECK, ...hhRects(SPAN)])} fill={structure} />
    </svg>
  );
}

/* ================================================================ 7 of 8 ==
   THE ICON — the square lockup, and its small-size fallback.

   A 3:1 bridge does not fit a 1:1 tile, so the square version shortens the
   pylons rather than the span: the letters give up height above the deck until
   the arch apex meets their tops, which lands the crossbar close to optical
   centre and makes the H's rounder as a side effect. The arch keeps the ratio
   — 34 over 93, near enough the Coathanger's own — because that is the part
   that cannot be compromised without losing the bridge.

   Everything is measured against the ember rule rather than the tile, which is
   what the first pass got wrong: centred on 120 the mark sat behind the rule
   with its pylons clipped and a dead band of ink across the top. The drawing
   area ends at 106.

   Below about 48px the arch and the hangers silt up into a grey smear — 32px
   was already mush on inspection, which is why the switch is not at the 24px
   first guessed — so `size="small"` drops them, closes the letterspace (a gap
   tuned to carry a span is far too wide once the span is gone) and keeps what
   the current favicon already has: HH, the plate, the ember rule.            */

/** The tile, less the ember rule: everything below is centred on this. */
const ICON_FIELD = 106;
const ICON_RULE: Rect = [0, 106, 120, 14];

/* Sixteen units of margin on all four sides, measured against the field rather
   than the tile. The first pass ran the mark from 4 to 116 and the outer pylons
   touched the edges, which is fine on a sheet and wrong on an avatar — every
   surface that shows one crops or rounds it. */
const ICON: HHSpec = {
  x: 16, top: 29, bottom: 81, stem: 10, letter: 34, gap: 20, barTop: 46, barBottom: 58,
};
const ICON_DECK: Rect = [12, 49, 96, 6];
const ICON_ARCH = { x0: 21, x1: 99, base: 58, rise: 28 };
const ICON_COUNTERS: readonly Span[] = [
  [16 + 10, 16 + 34 - 10],
  [70 + 10, 70 + 34 - 10],
];
const ICON_HANGERS = hangers({
  ...ICON_ARCH,
  deckTop: 49,
  centre: 60,
  pitch: 6,
  width: 2.5,
  avoid: [...hhStems(ICON), ...ICON_COUNTERS],
  min: 3,
});

/** The same letters with the span taken out, on the same margins. */
const ICON_SMALL: HHSpec = {
  x: 16, top: 26, bottom: 80, stem: 12, letter: 38, gap: 12, barTop: 46, barBottom: 60,
};

export function IconMark({
  className = "",
  title,
  size = "large",
}: MarkProps & { size?: "large" | "small" }) {
  return (
    <svg viewBox="0 0 120 120" className={className} {...label(title)}>
      {title ? <title>{title}</title> : null}
      <path d={rect([0, 0, 120, ICON_FIELD])} fill={INK.ink} />

      {size === "large" ? (
        <>
          <path
            d={archPath(ICON_ARCH.x0, ICON_ARCH.x1, ICON_ARCH.base, ICON_ARCH.rise)}
            fill="none"
            stroke={INK.paper}
            strokeWidth={6}
          />
          <path d={paths(ICON_HANGERS)} fill={INK.paper} />
          <path d={paths([ICON_DECK, ...hhRects(ICON)])} fill={INK.paper} />
        </>
      ) : (
        <path d={paths(hhRects(ICON_SMALL))} fill={INK.paper} />
      )}

      <path d={rect(ICON_RULE)} fill={INK.ember} />
    </svg>
  );
}

/* ================================================================ 8 of 8 ==
   THE STUDY THAT DOES NOT WORK — an arch inside one counter.

   Drawn so it can be argued with rather than described, and drawn generously:
   this H is already 72 wide against 82 tall, wider than any H would normally
   be set, precisely so the arch gets the best case. Springing from stem centre
   to stem centre it still comes out at 0.54 — twice the Coathanger's 0.27, and
   a croquet hoop rather than a bridge. A normal-width H is worse.

   Getting to 0.27 from here needs the letter about twice as wide again, which
   is no longer an H. That is the whole argument for spanning both letters, and
   the drawing settles it faster than the paragraph does.                     */

/** One H on its own, so the study is not fighting the two-letter helper. */
const STUDY = {
  x: 84, top: 30, bottom: 112, stem: 16, letter: 72, barTop: 64, barBottom: 78,
} as const;

const STUDY_RECTS: readonly Rect[] = [
  [STUDY.x, STUDY.top, STUDY.stem, STUDY.bottom - STUDY.top],
  [STUDY.x + STUDY.letter - STUDY.stem, STUDY.top, STUDY.stem, STUDY.bottom - STUDY.top],
  [STUDY.x + STUDY.stem, STUDY.barTop, STUDY.letter - 2 * STUDY.stem, STUDY.barBottom - STUDY.barTop],
];

/** The counter, and the tallest arch that fits inside it. */
const STUDY_SPAN = STUDY.letter - STUDY.stem; // springing at each stem centre
const STUDY_RISE = STUDY.barTop - STUDY.top - 4;

export function CounterArchStudy({ className = "", title }: MarkProps) {
  return (
    <svg viewBox="0 0 240 132" className={className} {...label(title)}>
      {title ? <title>{title}</title> : null}
      <path
        d={archPath(
          STUDY.x + STUDY.stem / 2,
          STUDY.x + STUDY.letter - STUDY.stem / 2,
          STUDY.barTop,
          STUDY_RISE,
        )}
        fill="none"
        stroke={INK.ember}
        strokeWidth={9}
      />
      <path d={paths(STUDY_RECTS)} fill="currentColor" />
    </svg>
  );
}

/**
 * The number the study is about: rise over span for the arch above, against
 * the Coathanger's own. Rendered on the sheet rather than asserted in prose.
 */
export const COUNTER_ARCH_RATIO = Math.round((STUDY_RISE / STUDY_SPAN) * 100) / 100;
export const SPAN_MARK_RATIO =
  Math.round((SPAN_ARCH.rise / (SPAN_ARCH.x1 - SPAN_ARCH.x0)) * 100) / 100;
/** Sydney Harbour Bridge: 134m rise over a 503m span. */
export const COATHANGER_RATIO = Math.round((134 / 503) * 100) / 100;
