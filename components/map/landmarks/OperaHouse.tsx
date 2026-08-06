import { operaHouse } from "@/content/geography";

/**
 * The Opera House on Bennelong Point.
 *
 * From above the shells are a fan of overlapping wedges stepping down the
 * point, each one narrower than the last, all pointing the same way. That
 * repetition and the taper is the read — nobody needs the ribs. The podium
 * underneath is the flat plinth the whole thing stands on, and it is what
 * anchors it to the land instead of leaving it floating.
 */
export function OperaHouse() {
  const { x, y, size } = operaHouse;

  /**
   * Each shell: a distance along the point, a width, and how far it leans.
   * Two clusters, the big hall and the small one, exactly as it is built.
   */
  const shells = [
    { t: -0.34, w: 0.52, lean: -0.1 },
    { t: -0.08, w: 0.62, lean: -0.04 },
    { t: 0.2, w: 0.54, lean: 0.03 },
    { t: 0.46, w: 0.4, lean: 0.09 },
    { t: 0.66, w: 0.26, lean: 0.14 },
  ];

  return (
    <g aria-hidden="true">
      {/* Podium. */}
      <path
        d={`M${x - size * 0.72} ${y + size * 0.86}
            L${x - size * 0.56} ${y - size * 0.72}
            L${x + size * 0.56} ${y - size * 0.72}
            L${x + size * 0.72} ${y + size * 0.86} Z`}
        fill="#e5e5e5"
        stroke="#0a0a0a"
        strokeWidth="12"
      />

      {shells.map((shell, index) => {
        const cy = y + shell.t * size;
        const w = shell.w * size;
        const h = size * 0.56;
        const lean = shell.lean * size;

        return (
          <g key={index}>
            {/* Hard shadow, offset the same direction as everything else. */}
            <path
              d={`M${x - w / 2 + 18} ${cy + h * 0.5 + 18}
                  Q ${x + lean + 18} ${cy - h * 0.62 + 18}, ${x + w / 2 + 18} ${cy + h * 0.5 + 18} Z`}
              fill="#0a0a0a"
              opacity="0.3"
            />
            <path
              d={`M${x - w / 2} ${cy + h * 0.5}
                  Q ${x + lean} ${cy - h * 0.62}, ${x + w / 2} ${cy + h * 0.5} Z`}
              fill="#ffffff"
              stroke="#0a0a0a"
              strokeWidth="11"
              strokeLinejoin="round"
            />
            {/* One rib per shell — the tile seam, not the whole roof. */}
            <path
              d={`M${x + lean * 0.5} ${cy - h * 0.34} L${x + lean * 0.5} ${cy + h * 0.5}`}
              stroke="#0a0a0a"
              strokeWidth="5"
              opacity="0.4"
            />
          </g>
        );
      })}
    </g>
  );
}
