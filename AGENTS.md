<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# HarbourHack — `canvas` branch

A pannable "multiplayer whiteboard meets maritime chart" for a Sydney GTM hackathon. **This branch is a separate design from `main`**, which holds the chat-thread site. Do not mix conventions between them — `main` has no Tailwind, this branch does.

Read `BRAND_GUIDELINES.md` for the Industrial Brutalism rules and `README.md` for how the canvas works.

Rules that are easy to break by accident:

- **Zone widths live in `content/canvas.ts`.** The track, the minimap and the zone navigation all derive from that one list. Never hard-code a width in a component.
- **The canvas must stay navigable without a mouse.** Arrow keys, Home/End, the minimap buttons and Tab-follow are not optional extras — without them the registration form in zone three is unreachable. Wheel-hijacking alone is a WCAG failure.
- **Mobile is a CSS switch, not a JS branch.** Below 768px the track becomes a normal column via media query; the pan hook simply detaches. Do not introduce a server/client layout fork.
- **Unconfirmed facts stay visibly `TBC`.** Never invent dates, times, mentors, venues or prizes.
- **International Orange fails AA for body text** (3.3:1 on white). Use it for large display type, borders and fills with ink on top — never for paragraphs.
- **Hard shadows only.** `box-shadow: 4px 4px 0` and friends. No blur, no soft shadows, no border-radius.
