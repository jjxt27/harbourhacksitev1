import { WORLD } from "@/content/map";
import { landPaths, placeNames, soundings } from "@/content/geography";
import { HarbourBridge } from "@/components/map/landmarks/HarbourBridge";
import { OperaHouse } from "@/components/map/landmarks/OperaHouse";

/**
 * The ground the whole site stands on.
 *
 * One SVG at world scale, under the docks and over the water. Vector rather
 * than raster on purpose: a 10,000px square of texture is a hundred million
 * pixels the compositor has to hold, whereas this is a dozen paths that stay
 * crisp at 2x zoom and cost nothing to redraw.
 *
 * Layer order is the whole trick, and it runs bottom to top:
 *
 *   the harbour  — painted on the viewport behind this, so it shows through
 *                  anywhere no land is drawn. Water is the default state of
 *                  the world, not a shape someone has to remember to fill.
 *   land         — concrete, with a grid ruled across it and clipped to the
 *                  coastline, so the survey grid stops at the water's edge.
 *   landmarks    — the bridge and the Opera House.
 *   paint        — place names and soundings, sized in world units so they
 *                  hold at every zoom.
 *
 * Then the docks sit on top, in the DOM, as real HTML.
 */
export function Harbour() {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${WORLD} ${WORLD}`}
      width={WORLD}
      height={WORLD}
      className="pointer-events-none absolute inset-0 z-0 hidden md:block"
    >
      <defs>
        {/* The survey grid, ruled across the concrete. */}
        <pattern id="hh-land-grid" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M120 0H0V120" fill="none" stroke="#0a0a0a" strokeWidth="2" opacity="0.09" />
        </pattern>

        {/* Contour rings just off the shore, the way a chart marks shallows. */}
        <pattern id="hh-shallows" width="90" height="90" patternUnits="userSpaceOnUse">
          <circle cx="45" cy="45" r="30" fill="none" stroke="#16304d" strokeWidth="3" />
        </pattern>

        {/* Every landmass at once, so the grid and the shoreline can both be
            clipped to exactly the same outline. */}
        <clipPath id="hh-land-clip">
          {landPaths.map((d, index) => (
            <path key={index} d={d} />
          ))}
        </clipPath>
      </defs>

      {/* Shallows: a band of contour rings sitting just outside the coast,
          drawn under the land so only the overhang shows. */}
      <g opacity="0.55">
        {landPaths.map((d, index) => (
          <path
            key={index}
            d={d}
            fill="none"
            stroke="url(#hh-shallows)"
            strokeWidth="150"
          />
        ))}
      </g>

      {/* Land. Hard shadow first, then the slab, then the ruled grid on top. */}
      <g>
        {landPaths.map((d, index) => (
          <path key={`shadow-${index}`} d={d} fill="#0a0a0a" opacity="0.4" transform="translate(20 20)" />
        ))}
        {landPaths.map((d, index) => (
          <path key={`fill-${index}`} d={d} fill="#f5f5f5" />
        ))}
        <rect
          width={WORLD}
          height={WORLD}
          fill="url(#hh-land-grid)"
          clipPath="url(#hh-land-clip)"
        />
        {landPaths.map((d, index) => (
          <path
            key={`edge-${index}`}
            d={d}
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="14"
          />
        ))}
      </g>

      <HarbourBridge />
      <OperaHouse />

      {/* Soundings. */}
      <g fill="#f5f5f5" opacity="0.4" fontSize="52" fontWeight="700">
        {soundings.map((mark) => (
          <text key={`${mark.x}-${mark.y}`} x={mark.x} y={mark.y} textAnchor="middle">
            {mark.v}
          </text>
        ))}
      </g>

      {placeNames.map((place) => (
        <Stencil key={place.text} {...place} />
      ))}
    </svg>
  );
}

/**
 * A place name sprayed through a stencil.
 *
 * The gaps are real: two horizontal bars are masked out of the glyphs, which is
 * exactly what the bridges in a stencil plate do and what stops the counters of
 * an O or an A falling out. Doing it with a mask rather than a stencil webfont
 * means no extra family in the bundle and no picking a typeface on the client's
 * behalf — and it works on any text we ever paint on this ground.
 */
function Stencil({
  text,
  x,
  y,
  size,
  tone,
  rotate = 0,
}: {
  text: string;
  x: number;
  y: number;
  size: number;
  /** Which ground it is painted on. Water and concrete need opposite paint. */
  tone: "land" | "water";
  rotate?: number;
}) {
  const id = `hh-stencil-${text.replace(/\W+/g, "-").toLowerCase()}`;
  const bar = size * 0.085;

  return (
    <g transform={`rotate(${rotate} ${x} ${y})`}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={x - size * 8} y={y - size} width={size * 16} height={size * 2}>
          <rect x={x - size * 8} y={y - size} width={size * 16} height={size * 2} fill="#fff" />
          <rect x={x - size * 8} y={y - size * 0.52} width={size * 16} height={bar} fill="#000" />
          <rect x={x - size * 8} y={y - size * 0.12} width={size * 16} height={bar} fill="#000" />
        </mask>
      </defs>
      <text
        x={x}
        y={y}
        mask={`url(#${id})`}
        textAnchor="middle"
        fontSize={size}
        fontWeight="900"
        letterSpacing={size * 0.1}
        // Paint on concrete is ink; paint on water is the chart's own hand.
        fill={tone === "land" ? "#0a0a0a" : "#f5f5f5"}
        opacity={tone === "land" ? 0.16 : 0.3}
        style={{ textTransform: "uppercase" }}
      >
        {text.toUpperCase()}
      </text>
    </g>
  );
}
