"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * The harbour at night, painted rather than drawn.
 *
 * All vector, no raster asset — but the brief was "painted texture", and clean
 * SVG paths are the opposite of that. Three filters do the work, and each is
 * imitating something a brush actually does:
 *
 *   `wash`    fractal noise displacing the edges, so a shape's outline wanders
 *             the way a loaded brush does instead of running dead straight.
 *   `bleed`   the same, coarser and stronger, for the water — closer to how
 *             wet pigment creeps along paper.
 *   `grain`   fine noise over everything, for the tooth of the paper itself.
 *
 * The other half of "painted" is not a filter at all. Nothing here is one flat
 * shape: every mass is two or three translucent washes at slightly different
 * sizes, so the overlaps darken the way layered gouache does and no edge is
 * ever a single hard step.
 *
 * Filters are expensive, so they are applied to whole groups rather than per
 * path, and nothing that carries one is animated — the parallax moves plain
 * transforms on the groups above them.
 */
export function HarbourScene() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Distance travelled is the depth cue: the sky barely moves, the water in
  // the foreground moves most. Small numbers — this is a backdrop, not a ride.
  const sky = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const far = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const bridge = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const water = useTransform(scrollYProgress, [0, 1], ["0%", "32%"]);

  const still = { y: "0%" };

  return (
    <div className="scene" aria-hidden="true">
      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        className="size-full"
      >
        <defs>
          {/* A brush edge: low-frequency noise, displacing gently. */}
          <filter id="wash" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Wet pigment creeping: coarser, and further. */}
          <filter id="bleed" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.016" numOctaves="4" seed="19" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Sky: a wash that lifts towards the water, not a flat fill. */}
          <linearGradient id="sky" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#030f20" />
            <stop offset="58%" stopColor="#061e3c" />
            <stop offset="100%" stopColor="#0b2b52" />
          </linearGradient>

          {/* The glow the city throws up behind the headland. */}
          <radialGradient id="glow" cx="0.62" cy="0.72" r="0.55">
            <stop offset="0%" stopColor="#c8a24a" stopOpacity="0.3" />
            <stop offset="45%" stopColor="#8a6b25" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#061e3c" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b2b52" />
            <stop offset="45%" stopColor="#071f3f" />
            <stop offset="100%" stopColor="#030f20" />
          </linearGradient>
        </defs>

        {/* ---------------------------------------------------------- sky -- */}
        <motion.g style={reduced ? still : { y: sky }}>
          <rect width="1600" height="1000" fill="url(#sky)" />
          <ellipse cx="990" cy="700" rx="760" ry="420" fill="url(#glow)" />
        </motion.g>

        {/* ------------------------------------------------- far headland -- */}
        <motion.g style={reduced ? still : { y: far }} filter="url(#wash)">
          <path
            d="M-40 612 C 180 592, 300 604, 470 586 C 640 568, 760 592, 900 578
               C 1060 562, 1200 588, 1360 572 C 1480 560, 1560 574, 1640 566
               L1640 700 L-40 700 Z"
            fill="#0a2547"
            opacity="0.9"
          />
          {/* A second, smaller wash sitting inside the first — the overlap is
              what reads as a loaded brush going over the same ground twice. */}
          <path
            d="M-40 626 C 220 606, 360 620, 520 600 C 700 578, 820 602, 980 590
               C 1140 578, 1280 600, 1440 586 L1640 580 L1640 700 L-40 700 Z"
            fill="#0d2e56"
            opacity="0.75"
          />
        </motion.g>

        {/* ----------------------------------------------------- the city -- */}
        <motion.g style={reduced ? still : { y: far }} filter="url(#wash)">
          {CITY.map((b, i) => (
            <rect
              key={i}
              x={b[0]}
              y={b[1]}
              width={b[2]}
              height={640 - b[1]}
              fill="#08213f"
              opacity={0.92}
            />
          ))}
          {/* Lit windows: a sparse scatter, warm, never a grid. */}
          {WINDOWS.map((w, i) => (
            <rect key={i} x={w[0]} y={w[1]} width="3" height="5" fill="#c8a24a" opacity={w[2]} />
          ))}
        </motion.g>

        {/* --------------------------------------------------- the bridge -- */}
        <motion.g style={reduced ? still : { y: bridge }} filter="url(#wash)">
          {/* Arch, drawn twice: a heavy underpainting and a lighter pass on
              top, offset a couple of pixels. */}
          <path
            d="M300 604 C 520 424, 1080 424, 1300 604"
            fill="none"
            stroke="#02101f"
            strokeWidth="26"
            strokeLinecap="round"
          />
          <path
            d="M302 601 C 522 424, 1078 424, 1298 601"
            fill="none"
            stroke="#123a68"
            strokeWidth="13"
            strokeLinecap="round"
          />

          {/* Deck. */}
          <rect x="252" y="600" width="1096" height="15" fill="#02101f" />
          <rect x="252" y="600" width="1096" height="5" fill="#16406f" opacity="0.85" />

          {/* Hangers, thinning towards the crown the way the real ones do. */}
          {HANGERS.map((h, i) => (
            <line key={i} x1={h[0]} x2={h[0]} y1={h[1]} y2="600" stroke="#02101f" strokeWidth="3.5" opacity="0.9" />
          ))}

          {/* The two near pylons. Sandstone, so they take the brass. */}
          {[[286, 540], [1282, 540]].map(([x, y], i) => (
            <g key={i}>
              <rect x={x} y={y} width="34" height="118" fill="#12325a" />
              <rect x={x} y={y} width="34" height="118" fill="#c8a24a" opacity="0.1" />
              <rect x={x + 5} y={y + 16} width="24" height="7" fill="#02101f" opacity="0.6" />
            </g>
          ))}
        </motion.g>

        {/* ---------------------------------------------------- the water -- */}
        <motion.g style={reduced ? still : { y: water }}>
          <rect y="658" width="1600" height="342" fill="url(#water)" />

          {/* Reflections: broken horizontal strokes under the lit things,
              bleeding sideways. Never a mirror — a harbour at night is chop. */}
          <g filter="url(#bleed)" opacity="0.5">
            {REFLECTIONS.map((r, i) => (
              <rect key={i} x={r[0]} y={r[1]} width={r[2]} height="2.5" fill="#c8a24a" opacity={r[3]} />
            ))}
          </g>

          {/* Swell: long, flat, uneven strokes of a lighter navy. */}
          <g filter="url(#bleed)" opacity="0.55">
            {SWELL.map((s, i) => (
              <rect key={i} x={s[0]} y={s[1]} width={s[2]} height="2" fill="#16406f" />
            ))}
          </g>
        </motion.g>
      </svg>
    </div>
  );
}

/** Skyline: [x, top, width]. Hand-placed — a generated skyline reads as a bar chart. */
const CITY: [number, number, number][] = [
  [980, 508, 34], [1020, 470, 26], [1052, 524, 40], [1098, 452, 30],
  [1134, 500, 46], [1186, 478, 28], [1220, 530, 52], [1278, 496, 34],
  [1318, 462, 24], [1348, 516, 44], [1398, 486, 30], [1434, 528, 58],
  [1498, 504, 36], [1540, 474, 28], [1574, 520, 40],
];

/** Lit windows: [x, y, opacity]. Sparse and irregular on purpose. */
const WINDOWS: [number, number, number][] = [
  [988, 522, 0.8], [1026, 486, 0.55], [1060, 540, 0.7], [1104, 470, 0.9],
  [1142, 516, 0.5], [1192, 494, 0.75], [1228, 546, 0.6], [1286, 512, 0.85],
  [1324, 478, 0.5], [1356, 532, 0.7], [1404, 502, 0.6], [1442, 544, 0.8],
  [1506, 520, 0.55], [1546, 490, 0.7], [1582, 536, 0.6],
  [996, 548, 0.45], [1068, 566, 0.6], [1240, 572, 0.5], [1452, 570, 0.65],
];

/** Bridge hangers: [x, top]. Follows the arch, so it is not evenly spaced. */
const HANGERS: [number, number][] = [
  [360, 520], [420, 484], [480, 460], [540, 444], [600, 434], [660, 428],
  [720, 426], [780, 426], [840, 428], [900, 434], [960, 444], [1020, 460],
  [1080, 484], [1140, 520], [1200, 552],
];

/** Reflections: [x, y, width, opacity]. Under the city and the pylons. */
const REFLECTIONS: [number, number, number, number][] = [
  [1080, 690, 90, 0.5], [1180, 706, 140, 0.35], [1040, 722, 70, 0.45],
  [1260, 700, 110, 0.3], [1340, 730, 90, 0.4], [1420, 712, 130, 0.28],
  [1120, 748, 60, 0.35], [1300, 764, 100, 0.22], [1480, 744, 80, 0.3],
  [286, 700, 40, 0.25], [1282, 700, 40, 0.25],
];

/** Swell: [x, y, width]. Long strokes, uneven, thinning with distance. */
const SWELL: [number, number, number][] = [
  [60, 686, 220], [340, 694, 160], [560, 682, 260], [880, 698, 190],
  [1140, 688, 150], [1380, 700, 200],
  [0, 730, 180], [260, 742, 240], [600, 734, 170], [900, 748, 210], [1240, 738, 260],
  [120, 790, 300], [500, 802, 220], [860, 794, 280], [1220, 806, 240],
  [40, 862, 260], [420, 874, 320], [820, 866, 240], [1180, 878, 300],
  [200, 936, 340], [660, 944, 280], [1080, 934, 360],
];
