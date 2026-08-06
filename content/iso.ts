/**
 * The isometric projection.
 *
 * The map is a flat 10,000px square laid down and tilted back:
 *
 *     rotateX(60deg) rotateZ(-45deg)
 *
 * Every piece of geometry on this site — where the camera centres, how far it
 * may pan, where a drop test lands — is that one transform, so the arithmetic
 * lives here once rather than being re-derived in four components.
 *
 * Working it through, with the transform origin at the map's top-left corner:
 *
 *   rotateZ(-45°)   x₁ = cos45·(X + Y)
 *                   y₁ = cos45·(Y − X)
 *   rotateX(60°)    screenX = x₁
 *                   screenY = y₁·cos60
 *                   z       = y₁·sin60
 *
 * which collapses to {@link project} below. The z term is not used for layout
 * but it is the reason the perspective note further down matters.
 */

export const ISO = {
  /** Tilt back from flat. 60° is the classic 2:1 game view. */
  tiltDeg: 60,
  /** Spin around the vertical axis. */
  turnDeg: -45,
} as const;

const COS45 = Math.SQRT1_2; // 0.7071…
const COS60 = 0.5;

/** Horizontal scale factor: a world axis is √½ as wide on screen. */
export const ISO_X = COS45; // 0.70710678
/** Vertical scale factor: halved again by the tilt. */
export const ISO_Y = COS45 * COS60; // 0.35355339

/** World point → screen offset from the map's origin corner, before camera. */
export function project(x: number, y: number): { x: number; y: number } {
  return { x: ISO_X * (x + y), y: ISO_Y * (y - x) };
}

/**
 * Screen offset → world point. The inverse of {@link project}.
 *
 * Needed wherever a pointer has to become a place: dropping a container on a
 * dock, testing whether a note landed on the ibis, working out which dock is
 * under the middle of the viewport.
 */
export function unproject(sx: number, sy: number): { x: number; y: number } {
  const sum = sx / ISO_X; //  X + Y
  const diff = sy / ISO_Y; //  Y − X
  return { x: (sum - diff) / 2, y: (sum + diff) / 2 };
}

/**
 * The projected footprint of a `size × size` map.
 *
 * A square laid out this way is a diamond: √2 as wide as the map, half that
 * tall, and reaching above the origin corner as well as below it — which is
 * why the vertical bound is signed. The camera clamp reads these, and getting
 * the negative half wrong is what lets a reader pan off the top of the world.
 */
export function projectedBounds(size: number) {
  return {
    minX: 0,
    maxX: ISO_X * 2 * size, // √2 · size
    minY: -ISO_Y * size,
    maxY: ISO_Y * size,
  };
}

/**
 * Local offset that reads as "straight down the screen" once projected.
 *
 * A box-shadow is applied before the map's transform, so the obvious
 * `20px 20px` extrusion does not fall towards the viewer — it slides along a
 * map axis and comes out horizontal. Solving `project(dx, dy).x = 0` gives
 * dx = −dy, so an extrusion that pushes a slab down into the water offsets
 * negative on x and positive on y.
 */
export const EXTRUDE_STEP = { x: -1, y: 1 } as const;

/**
 * Cancels the map transform, so a thing stands up and faces the camera.
 *
 * The inverse of two rotations is the two inverses applied in the opposite
 * order, which is why the turn is undone before the tilt.
 */
export const BILLBOARD = `rotateZ(${-ISO.turnDeg}deg) rotateX(${-ISO.tiltDeg}deg)`;

/**
 * Distance from the eye to the z=0 plane.
 *
 * The directive asked for 2000px and that value cannot work here. With the
 * origin at the map corner, a world point's depth after the tilt is
 *
 *     z = sin60 · cos45 · (Y − X)     →     ±6124px across a 10,000px map
 *
 * and anything with z greater than the perspective distance is behind the eye:
 * it inverts, smears through the vanishing point, and disappears. At 2000px the
 * break starts 2310px along the map — inside the harbour, not at its edge.
 *
 * Isometric projection is parallel by definition, so the correct answer is a
 * perspective large enough that convergence is a hint rather than a lens. This
 * keeps the wrapper the directive asked for and a value that survives the map.
 * Drop it to 2000 in one place if you want to see the failure.
 */
export const PERSPECTIVE = 24000;
