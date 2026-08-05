const COLS = 60;
const ROWS = 22;
const CELL = 7;

const DECK = 15;
const ARCH_START = 6;
const ARCH_END = 53;
const ARCH_RISE = 11;
const PYLONS: readonly [number, number][] = [
  [9, 12],
  [47, 50],
];

/**
 * The Coathanger, drawn on a grid.
 *
 * Generated rather than traced: the arch is a sine, the hangers hang off
 * wherever it lands, so changing COLS or ARCH_RISE re-draws a coherent bridge
 * instead of breaking a hand-placed one. Emitted as a single path so it stays
 * one DOM node rather than four hundred rects.
 */
function buildCells(): Set<string> {
  const cells = new Set<string>();
  const put = (x: number, y: number) => {
    if (x >= 0 && x < COLS && y >= 0 && y < ROWS) cells.add(`${x},${y}`);
  };

  const archAt = (x: number) => {
    const t = (x - ARCH_START) / (ARCH_END - ARCH_START);
    return Math.round(DECK + 1 - ARCH_RISE * Math.sin(Math.PI * t));
  };

  // Roadway, all the way across.
  for (let x = 0; x < COLS; x += 1) {
    put(x, DECK);
    put(x, DECK + 1);
  }

  // The arch, two cells thick.
  for (let x = ARCH_START; x <= ARCH_END; x += 1) {
    const y = archAt(x);
    put(x, y);
    put(x, y + 1);
  }

  // Hangers from the arch down to the deck.
  for (let x = ARCH_START + 3; x < ARCH_END - 2; x += 4) {
    for (let y = archAt(x) + 2; y < DECK; y += 1) put(x, y);
  }

  // Pylons straddling the deck.
  for (const [from, to] of PYLONS) {
    for (let x = from; x <= to; x += 1) {
      for (let y = 8; y <= DECK + 4; y += 1) put(x, y);
    }
  }

  // Water: broken dashes below.
  for (let x = 0; x < COLS; x += 1) {
    if (x % 5 < 3) put(x, DECK + 6);
    if ((x + 3) % 7 < 3) put(x, DECK + 7 <= ROWS - 1 ? DECK + 7 : ROWS - 1);
  }

  return cells;
}

const PATH = [...buildCells()]
  .map((key) => {
    const [x, y] = key.split(",").map(Number);
    return `M${x * CELL},${y * CELL}h${CELL}v${CELL}h-${CELL}z`;
  })
  .join("");

export function PixelBridge({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      aria-hidden="true"
      className={className}
      shapeRendering="crispEdges"
    >
      <path d={PATH} fill="#0a0a0a" />
    </svg>
  );
}
