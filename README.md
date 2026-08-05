# HarbourHack — canvas branch

A boundless, pannable canvas for **HarbourHack 2026**, Sydney's go-to-market hackathon for university students. Part multiplayer whiteboard, part digital maritime chart, styled as Industrial Brutalism: stark white, 2px black borders, hard offset shadows, zero radius.

> This branch is a **separate design** from `main`, which holds the chat-thread site. They share nothing but the repo.

## Run it

```bash
npm install
```

```bash
npm run dev
```

## Progress

| Step | State |
|---|---|
| 1. Dependencies, Tailwind, fonts, tokens | Done |
| 2. Layout, grid + topographic ground, pan logic, mobile fallback, minimap | Done |
| 3. Industrial Brutalism component kit | Not started |
| 4. Zone 1 and Zone 2 content | Placeholder shells only |
| 5. Shipping Manifest card generator | Not started |
| 6. Liveblocks multiplayer cursors | Not started |

## The canvas

`components/canvas/Canvas.tsx` renders one child per zone, matched in order against `zones` in `content/canvas.ts`. That list is the single source of truth — the track width, the minimap proportions and the zone navigation all derive from it, so changing a width there moves everything together. The track is currently 4× viewport width.

`hooks/useCanvasPan.ts` does the movement:

- **Wheel → horizontal**, non-passive so the page cannot scroll underneath
- **Click-and-drag** panning via `@use-gesture/react`
- **Spring-smoothed** through Framer Motion, with the raw value used under `prefers-reduced-motion`
- **Keyboard**: arrows and PageUp/PageDown step between zones, Home/End jump to the ends, and typing in a field is never hijacked
- **Tab-follow**: focusing an off-screen control pans it into view — without this the registration form is unreachable without a mouse
- **Clamped** to the track, re-measured on resize via `ResizeObserver`

### Mobile

Below 768px the layout switch is **pure CSS**: the track becomes a normal block column and the pan transform is overridden to `none`. The hook detaches because `pannable` requires the desktop media query. There is no server/client layout branch, so no hydration fork and no flash.

### The ground

A fixed grid with a seamless topographic tile over it (`public/topo.svg`, generated so its contours meet at the tile edges). It drifts at a fraction of the canvas speed for parallax, and holds still under reduced motion.

## Colour, and one constraint

| Token | Value | Contrast on white |
|---|---|---|
| `ink` | `#0A0A0A` | 19.6:1 |
| `ferry` | `#008542` | 4.7:1 — fine for body text |
| `orange` | `#FF4F00` | **3.3:1 — fails AA for body text** |
| `highlighter` | `#E2FF31` | 17.5:1 with ink on top |

International Orange is for large display type, borders and fills with ink over them. Never paragraphs.

## Before launch

Dates, times, mentors, venue and prizes are all `TBC` in `content/canvas.ts` and render as visible TBC chips. Do not replace them with plausible-looking placeholders — fill them in when they are real.

## Checks

```bash
npm run lint
```

```bash
npx tsc --noEmit
```

```bash
npm run build
```
