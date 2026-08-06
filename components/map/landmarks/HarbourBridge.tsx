import { bridge } from "@/content/geography";

/**
 * The Sydney Harbour Bridge, from above.
 *
 * Seen straight down, the arch is not an arch — it is two ribs bowing out
 * either side of the deck, widest at mid-span, and that lens shape plus four
 * corner pylons is the entire recognisable signature. Drawing the elevation
 * anyone would sketch from memory would read as a picture pasted onto a map;
 * this reads as a structure lying on water.
 *
 * Everything is derived from the four numbers in `content/geography.ts`, so the
 * crossing moves by moving the footings.
 */
export function HarbourBridge() {
  const { x, northY, southY, width } = bridge;
  const half = width / 2;
  /** How far the ribs bow past the deck at mid-span. */
  const bow = 132;
  const span = southY - northY;

  /** Deck hangers, evenly spaced down the span. */
  const hangers = Array.from({ length: 13 }, (_, i) => northY + (span / 14) * (i + 1));

  const rib = (side: 1 | -1) => {
    const inner = x + side * half;
    const outer = x + side * (half + bow);
    return `M${inner} ${northY} C ${outer} ${northY + span * 0.28}, ${outer} ${southY - span * 0.28}, ${inner} ${southY}`;
  };

  return (
    <g aria-hidden="true">
      {/* Shadow on the water. Offset, hard-edged, no blur — the shadow rule
          holds for the geography too. */}
      <rect
        x={x - half + 26}
        y={northY + 26}
        width={width}
        height={span}
        fill="#0a0a0a"
        opacity="0.35"
      />

      {/* The two ribs, bowing out to mid-span. */}
      <path d={rib(1)} fill="none" stroke="#0a0a0a" strokeWidth="30" strokeLinecap="round" />
      <path d={rib(-1)} fill="none" stroke="#0a0a0a" strokeWidth="30" strokeLinecap="round" />

      {/* Deck. */}
      <rect x={x - half} y={northY} width={width} height={span} fill="#6b6b6b" />
      <rect
        x={x - half}
        y={northY}
        width={width}
        height={span}
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="12"
      />

      {/* Hangers, tying the deck up to the ribs. */}
      {hangers.map((y) => (
        <line
          key={y}
          x1={x - half - bow * 0.72}
          x2={x + half + bow * 0.72}
          y1={y}
          y2={y}
          stroke="#0a0a0a"
          strokeWidth="7"
          opacity="0.75"
        />
      ))}

      {/* Roadway: eight lanes and a rail corridor, as one centre line and two
          lane divisions. Enough to read as a road at map scale. */}
      <line x1={x} x2={x} y1={northY} y2={southY} stroke="#e2ff31" strokeWidth="7" />
      <line
        x1={x - half * 0.5}
        x2={x - half * 0.5}
        y1={northY}
        y2={southY}
        stroke="#f5f5f5"
        strokeWidth="4"
        strokeDasharray="46 38"
      />
      <line
        x1={x + half * 0.5}
        x2={x + half * 0.5}
        y1={northY}
        y2={southY}
        stroke="#f5f5f5"
        strokeWidth="4"
        strokeDasharray="46 38"
      />

      {/* Four pylons, one at each corner of the span. */}
      {[northY, southY].map((endY) =>
        [-1, 1].map((side) => {
          const pw = 128;
          const ph = 196;
          const py = endY === northY ? endY - ph * 0.42 : endY - ph * 0.58;
          return (
            <g key={`${endY}-${side}`}>
              <rect
                x={x + side * (half + 6) - (side === 1 ? 0 : pw)}
                y={py}
                width={pw}
                height={ph}
                fill="#f5f5f5"
                stroke="#0a0a0a"
                strokeWidth="12"
              />
              <rect
                x={x + side * (half + 6) - (side === 1 ? 0 : pw) + 26}
                y={py + 30}
                width={pw - 52}
                height={26}
                fill="#0a0a0a"
                opacity="0.55"
              />
            </g>
          );
        }),
      )}
    </g>
  );
}
