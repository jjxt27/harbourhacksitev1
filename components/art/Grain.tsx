/**
 * Paper tooth over the whole page.
 *
 * One fixed screenful of fractal noise on `overlay`, which lifts what is
 * already light and deepens what is already dark instead of greying everything
 * uniformly — the difference between paper texture and a dirty lens.
 *
 * Deliberately not animated. Noise that moves is film grain, and film grain on
 * a still page reads as a video artefact; noise that sits still reads as the
 * surface the thing is printed on.
 */
export function Grain() {
  return (
    <svg className="scene-grain" aria-hidden="true">
      <filter id="hh-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#hh-grain)" />
    </svg>
  );
}
