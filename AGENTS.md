<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# HarbourHack — `harbour-pixel` branch

A pannable "multiplayer whiteboard meets maritime chart" for a Sydney GTM hackathon, opening on a screen-printed harbour plate that counts itself in. **This branch is a separate design from `main`**, which holds the chat-thread site. Do not mix conventions between them — `main` has no Tailwind, this branch does.

Read `README.md` for how the canvas, the intro plate and the dot screen work. The palette lives in `app/globals.css` with every contrast ratio computed in a comment beside it.

Rules that are easy to break by accident:

- **Zone widths live in `content/canvas.ts`.** The track, the minimap and the zone navigation all derive from that one list. Never hard-code a width in a component.
- **Inside a zone, layout is a container query — `@6xl/zone:`, never `md:` or `xl:`.** A zone is 1.5–2.1 windows wide, so a viewport breakpoint inside one is measuring a box the content is not in. The mobile switch stays a media query because it decides whether the canvas pans at all: mode is a media query, layout is a container query.
- **The canvas must stay navigable without a mouse.** Arrow keys, Home/End, the minimap buttons and Tab-follow are not optional extras — without them the registration form in zone three is unreachable. Wheel-hijacking alone is a WCAG failure.
- **The intro plate makes the canvas `inert` while it is up**, or Tab walks into a form nobody can see. Escape must always dismiss it, and a URL with a fragment must skip it entirely.
- **Mobile is a CSS switch, not a JS branch.** Below 768px the track becomes a normal column via media query and the pan hook detaches; the intro plate reorders itself into the column the same way. Do not introduce a server/client layout fork.
- **Unconfirmed facts stay visibly `TBC`.** Never invent dates, times, mentors, venues or prizes. The intro counts only figures the programme actually has.
- **Six inks, and the two saturated ones take opposite foregrounds.** `bg-harbour` and `bg-navy` take `text-paper`; `bg-ember` takes `text-ink`. Ember is 2.70:1 on cream and can never carry body text — display type, borders and fills only. `text-harbour` is fine on cream and fails on apricot.
- **Tone comes from dot density, never from mixing.** A value between two inks is one screened over the other at 25/50/75%. Do not introduce a seventh colour to fill a gap.
- **Hard shadows only.** `box-shadow: 4px 4px 0` and friends. No blur, no soft shadows, no border-radius.
