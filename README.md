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
| 3. Industrial Brutalism component kit | Done |
| 4. Zone 1 and Zone 2 content | Done |
| 5. Shipping Manifest card generator | Done |
| 6. Liveblocks cursors + ghost fallback | Done |

## The canvas

`components/canvas/Canvas.tsx` renders one child per zone, matched in order against `zones` in `content/canvas.ts`. That list is the single source of truth — the track width, the minimap proportions and the zone navigation all derive from it, so changing a width there moves everything together. The track is currently 5.2× viewport width.

**A zone is exactly one screen tall and clips what does not fit**, so vertical space inside one is a fixed budget rather than something a reader can scroll into. When a zone gains content it buys the room sideways — zone one runs the argument across three columns, zone three puts the questions, the form, the card and the partner block on one line. All three fit with nothing clipped from 1280×800 up; below about 700px of viewport height the last 50–60px of zones two and three are cut off.

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

## The component kit

`components/ui/` holds the Industrial Brutalism primitives: `Button`, `StickyNote`, `Panel` (a shipping-container placard), `Stamp`, `Tbc`, and `Sharpie`.

**`Sharpie`** is the marker circle that appears around a button on hover or focus. Rough.js generates it from **fixed seeds**, so the same button always gets the same scribble — regenerating on every mouse-over reads as noise rather than as a drawing. It is decorative and `aria-hidden`; the child keeps its own focus ring.

`components/art/` holds the two drawn pieces. `HandArrow` is a static path, so it server-renders and never shifts. `PixelBridge` is generated: the arch is a sine, the hangers hang off wherever it lands, and the whole thing is emitted as one path rather than 400 rects. Changing `COLS` or `ARCH_RISE` re-draws a coherent bridge.

## Cursors

Two systems behind one layer. `components/live/CursorLayer.tsx` picks between them at build time — whether a Liveblocks key exists is a compile-time constant, so a room hook is never called without a provider above it.

**Real cursors** come from Liveblocks presence. Positions travel as **track coordinates, not viewport coordinates**: the canvas pans, so two people are almost never scrolled to the same place, and broadcasting viewport pixels would put everyone's cursor over the wrong thing. The layer lives inside the panning track, so cursors move with the content they point at.

**Ghost cursors** fill the room when nobody else is in it. They are ambience, not people, and they are built to stay honest about that:

- They appear **only when the room is genuinely empty**, and stand down the moment a real peer connects
- They carry generated handles (`Crew 41`), never invented names
- They do not render under `prefers-reduced-motion`, or on touch devices where there is no pointer to mirror

Ghost positions are written straight to the DOM inside one animation frame loop. Six moving cursors through React state would re-render the canvas sixty times a second for decoration.

The **Tech / Biz prompt** appears once, on pointer devices, and stores the choice in `localStorage`. Escape dismisses it — the canvas works fine with no cursor identity, so it is never a gate on the content.

### The key is public, by design

`NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` is inlined into the client bundle and readable by anyone who opens the page. That is what a `pk_` key is for. The secret `sk_` key must never be given a `NEXT_PUBLIC_` prefix.

## Colour

| Token | Value | Contrast on white |
|---|---|---|
| `ink` | `#0A0A0A` | 19.6:1 |
| `navy` | `#061E3C` | 15.8:1 |
| `harbour` | `#0B5FD0` | 5.9:1 — fine for body text |
| `alert` | `#C63200` | 5.4:1 — error text |
| `ferry` | `#008542` | 4.7:1 — fine for body text |
| `highlighter` | `#E2FF31` | 17.5:1 with ink on top |

Harbour blue replaced International Orange, which was 3.3:1 and could never carry text. Nothing in this palette now fails AA on a ground it is actually used on. The one rule that carries over is that the accent is a fill, never an edge — every component's outline is a 2px ink border, so no boundary depends on the accent.

The one trap: **ink on harbour blue is 3.4:1 and fails.** Anything filled `bg-harbour` takes `text-paper`, not `text-ink` — the reverse of the old orange rule.

## Content

The site's copy is the other half of `EOI_BRIEF.md`, which is the document that gets emailed to students and prospective partners. When a fact changes it changes in both.

**Confirmed:** the dates — 23, 24 and 25 October 2026 for the build weekend, then pitch night on Friday 30 October. They live in `dates` in `content/canvas.ts` and everything else derives from that one object.

**Still `TBC`:** times, venue, mentors, prizes, and the partner contact address. These render as visible TBC chips. Do not replace them with plausible-looking placeholders — fill them in when they are real.

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
