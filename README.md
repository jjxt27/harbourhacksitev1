# HarbourHack — harbour-pixel branch

A boundless, pannable canvas for **HarbourHack 2026**, Sydney's go-to-market hackathon, open to anyone who wants to build. Part multiplayer whiteboard, part digital maritime chart, opening on a screen-printed plate of the harbour that counts itself in.

The look is risograph: six inks sampled from one photograph of the Coathanger at dusk, printed on cream, with tone carried by a visible dot screen rather than by mixing. The hard-edged rules from the brutalist branch survive intact — 2px borders, offset solid shadows, zero radius, nothing blurs.

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
| 2. Layout, screened ground, pan logic, mobile fallback, minimap | Done |
| 3. Industrial Brutalism component kit | Done |
| 4. Zone 1 and Zone 2 content | Done |
| 5. Shipping Manifest card generator | Done |
| 6. Liveblocks cursors + ghost fallback | Done |
| 7. Risograph palette, dot screen, intro plate | Done |

## The intro plate

`components/intro/IntroGate.tsx` holds a full-screen plate over the canvas and then gets out of the way. It is a count-in, not a splash: three figures the programme actually has — four days, two weeks, three things judged — arrive in sequence and count up to themselves, then the wordmark and a way in.

**It does not dismiss itself on a timer.** An intro that vanishes while someone is still reading cannot be argued with. Escape, the button, and a click anywhere all do the same thing.

Three things the gate has to get right, all of them keyboard problems:

- **The canvas is `inert` while the plate is up.** The plate is opaque and fixed, so without this Tab lands on controls three layers down and invisible. Inert takes the whole canvas out of the tab order *and* out of the accessibility tree until it is actually on screen.
- **Escape dismisses**, because the plate is the only thing between a keyboard visitor and the registration form.
- **A fragment in the URL skips it.** Arriving at `#setting-sail` means someone was sent to the form. That is read through `useHasHash` — the same external-store shape as a media query, so the server reports `false`, React hydrates against that, and re-renders once with the real answer.

Under `prefers-reduced-motion` the plate arrives finished: every row present, every figure at its final value. `CountUp` gets there by running its normal loop with a zero-length duration rather than branching, so there is only one code path to keep correct.

**Portrait inverts the backdrop.** Cropping a 16:9 drawing to fill a 375 × 812 window scales it by height and leaves about a quarter of its width on screen — the empty middle of the sky, with the bridge and the palms both cut away. So below 768px the plate stops being a backdrop and reorders itself into the column as a band at its own ratio, sitting above the notice instead of behind it. Pure CSS, like the rest of the mobile switch.

## The drawing

`components/art/PixelHarbour.tsx` generates the harbour on a 240 × 135 grid. Every shape is rasterised the way a sprite is: for each row, work out which cells the shape covers, then emit one rect per run of adjacent cells. An SVG polygon with the same vertices would render a clean hypotenuse; this gives stair steps, which is the point.

Run-length encoding is what makes it affordable. The naive version is 32,400 rects and a third of a megabyte; here the flat fields are a handful of rects and only the structures pay per cell. Two things follow from that:

- **Flat fields and gradients are `<pattern>` fills, not cells.** A value between cobalt and cream is cobalt dots over cream at 25%, 50% or 75%, from a Bayer 4 × 4 threshold map. Clouds are drawn twice — a screened skirt with a solid core inside it — which buys a broken dither edge for two shapes instead of per-cell rects.
- **Scattered single cells are the expensive thing**, because none of them merge. The lawn speckle runs every second row for that reason; at full density it was a fifth of the drawing's bytes for a texture nobody can point at.

Nothing is random without a seed, so the server and the client draw the same picture and hydration has nothing to disagree about. The `silhouette` variant is the same structures in one ink, used at 16% behind the canvas — the site sits on the drawing rather than next to it.

### The photograph

`intro.photo` points at `public/harbour.jpg`, and that is what the plate currently shows: the source image put through the same press by `components/art/Dither.tsx`. Point it somewhere else, or set it to `null`, and the generated drawing takes over — the drawing is the fallback, not a placeholder.

Two steps, in this order: downsample to 300 pixels wide, *then* ordered-dither to the palette. Order matters twice over. Quantising first would let the browser average the inks back into colours that are not in the palette, and the result would be a posterised photo rather than a screen print. And the source is itself a fine dot screen — it has to be averaged into smooth tone before being re-screened, or the two patterns fight and the picture turns to noise.

The file is 600px wide for the same reason: the dither throws away anything above 2× its grid, so a 3.6MB original buys nothing. It reads pixels back out of a canvas, so the source has to be same-origin — a file in `public/`, not a remote URL.

**The photograph is portrait and the plate is not.** On a wide window it covers and crops to about a third of its height, pulled up to 40% so the band lands on the arch and the palm crowns rather than the deck and the trunks. Below 768px the plate joins the column and takes whatever height the masthead and the notice leave, rather than a fixed slice of the viewport — a fixed 40vh fits an 812px phone and pushes the button off a 667px one.

## The canvas

`components/canvas/Canvas.tsx` renders one child per zone, matched in order against `zones` in `content/canvas.ts`. That list is the single source of truth — the track width, the minimap proportions and the zone navigation all derive from it, so changing a width there moves everything together. The track is currently 5.2× viewport width.

**A zone buys room sideways before it buys it downward** — zone one runs the argument across three columns, zone three puts the questions, the form, the card and the partner block on one line. Vertical space is a budget; the reader pans rather than scrolls.

### Zone layout is a container query, not a media query

**A rule inside a zone asks how wide the zone is, never how wide the window is.** The zone is a `container-type: inline-size` query container and its contents use Tailwind's `@6xl/zone:`-style variants.

This is not a preference. A zone is 1.5–2.1 windows wide, so the two questions have different answers, and a `md:`/`xl:` breakpoint inside a zone is asking about a box the content is not in. That mistake cost zone three every window between 768px and 1279px wide: `xl:` waited for a 1280px *window* while the zone had been 1152px wide since 768px, so the four columns stayed shut, collapsed into one stack about 2000px tall, and the zone clipped it. At 1024×768 that was 532px gone off each end, the registration form included, with no way to reach it.

The mobile switch stays a media query — that is genuinely a question about the window, because it decides whether the canvas pans at all. **Mode is a media query; layout is a container query.**

### When the budget runs out anyway

Three things in order, because no one of them is enough:

- **The rhythm tightens.** `--zone-pad-y` and `--zone-gap` step down at 860px and 700px of window height. Padding and gaps go first — they are the only things on the plate carrying no information.
- **`justify-content: safe center`.** Plain `center` splits an overrun between both ends, so a zone 80px too tall loses 40px off the *top*, which is where the kicker and the headline are. `safe center` falls back to flex-start the moment it stops fitting.
- **The zone scrolls.** At a 625px window the manifest form alone is taller than the space available, and no amount of gap-trimming changes that. A zone that overruns gets `overflow-y: auto` rather than making the shortfall unreachable.

The wheel handler yields to that scroll before panning: a zone with room left scrolls, and once it is against its end the wheel goes back to panning, so the canvas never traps the reader inside one zone. Focus does it for free — the browser scrolls a focused control into view, which is what keeps the form keyboard-reachable.

Nothing is unreachable at any size from 1920×1080 down to 1280×500, 768×1024 and 375×667.

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

A fixed chart grid, the dot screen over it, and the harbour silhouette pinned along the bottom. Two parallax rates, both slower than the content — the screen drifts a little and the skyline barely moves, so the ground reads as distance rather than as a second layer travelling with you. Both hold still under reduced motion.

The dot screen (`screen-dots`) is two radial-gradient fields at the same pitch, offset half a tile from each other and inked differently, which is what a two-colour press does when the plates are a fraction out of register. One field alone reads as a polka dot; two slightly-off fields read as print.

## The component kit

`components/ui/` holds the Industrial Brutalism primitives: `Button`, `StickyNote`, `Panel` (a shipping-container placard), `Stamp`, `Tbc`, and `Sharpie`.

**`Sharpie`** is the marker circle that appears around a button on hover or focus. Rough.js generates it from **fixed seeds**, so the same button always gets the same scribble — regenerating on every mouse-over reads as noise rather than as a drawing. It is decorative and `aria-hidden`; the child keeps its own focus ring.

`components/art/` holds the drawn pieces: `HandArrow` (a static path, so it server-renders and never shifts), `BinChicken`, `PixelHarbour` and `Dither`.

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

## Registration

The manifest form is the site's only conversion, and both briefs promise a
registrant "everything else — venue, times, mentors, prizes — as it's confirmed".
That is a commitment to write to people later, so **the email field is the point
of the form**; the boarding pass is what makes filling it in worth doing.

The flow is `POST /api/manifest` → validate → upsert into Airtable → send a
confirmation. Four decisions in it are load-bearing:

- **The card is never gated on the registration.** The POST goes first, because
  being on the list is the part only the server can do, but a store that is down
  is not a reason to withhold a PNG the browser can make on its own. The reader
  always ends up with the card and is told plainly whether we have them —
  `unsaved` is the one status the live region announces assertively.
- **The email never reaches the card.** `ManifestData` is what gets printed and
  shared; `Registration` is that plus the address. `ManifestCard` is handed only
  the four printed fields, so an address cannot leak into a PNG that someone
  posts publicly.
- **`lib/registration.ts` is the only validator**, run in the browser for the
  error messages and again in the route for the truth. Every enum is checked
  against its source list rather than coerced — a silently corrected
  registration is a wrong one.
- **An unconfigured store refuses with a 503.** With no credentials there is
  nowhere for a registration to go, and returning success would hand someone a
  boarding pass for a record that never existed.

Spam defence is a honeypot (`company`, clipped to 1px and untabbable — a filled
trap is answered `200`, because telling a script it was caught tells it what to
change) and a per-address rate limit. That limit lives in one server instance's
memory, so on a platform running several it is `LIMIT` attempts per instance
rather than overall; it stops a stuck retry loop, and the upsert on email is
what actually keeps the table clean.

`lib/store.ts` is the only Airtable-shaped file. Swapping it for a Sheet, or for
Postgres once someone wants constraints, means rewriting `storeRegistration` and
nothing else. The required columns and every key are documented in
`.env.example`.

**Not done yet:** there is no privacy page, and the contact for a correction or
a deletion renders as `TBC` beside the form because it genuinely is not decided.
That is the last thing standing between this and collecting personal information
properly under the Australian Privacy Act.

## Colour

Six inks, sampled from the photograph. Every ratio below is computed, not estimated — the script that produces them is the one thing to re-run if a value changes.

| Token | Value | On cream `#FBEAD7` | Notes |
|---|---|---|---|
| `paper` | `#FBEAD7` | — | The ground. Cream, not white. |
| `paper-off` | `#F5DCC2` | — | The chart ground behind the canvas. |
| `ink` | `#08192E` | 15.02:1 | Navy-black. There is no true black in the photo or here. |
| `navy` | `#0E3C72` | 9.36:1 | For the one card that outranks the others. |
| `harbour` | `#1A5DA8` | 5.62:1 | The text-safe accent: fills, borders, body copy. |
| `alert` | `#9C1B10` | 6.93:1 | Errors. Kept clearly apart from ember. |
| `slate` | `#5A5245` | 6.55:1 | Metadata. Passes on cream, cream-off *and* apricot. |
| `apricot` | `#F6BE85` | 1.41:1 | A field, not a text colour. Always carries ink on top (10.62:1). |
| `ember` | `#E2711D` | **2.70:1** | Display type and fills only. Never body text. |
| `sky` | `#4E8AC4` | — | Decorative. The mid-tone the screen resolves to. Never text. |

Three traps, all of them the inverse of an obvious guess:

1. **Anything `bg-harbour` or `bg-navy` takes `text-paper`**, never `text-ink` — ink on harbour is 2.67:1.
2. **Anything `bg-ember` takes `text-ink`**, never `text-paper` — paper on ember is 2.70:1. This is the opposite of the rule above, and it is why the sticky-note and cursor palettes both carry their foreground alongside their background rather than letting a caller pick by eye.
3. **`text-harbour` is fine on cream and fails on apricot** (3.98:1). On the apricot ground in zone three, metadata is `slate` or `navy`.

Ember inherits the rule the old International Orange had: one ink is allowed to shout, and it does it at display size with ink on top. What carries over unchanged is that the accent is a fill, never an edge — every outline is a 2px ink border, so no boundary depends on a colour.

## Content

The site's copy is the other half of `EOI_BRIEF.md`, which is the document that gets emailed to prospective entrants and partners. When a fact changes it changes in both.

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
