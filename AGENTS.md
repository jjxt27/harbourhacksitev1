<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# HarbourHack

A go-to-market hackathon site built as one live chat. Read `BRAND_GUIDELINES.md` before changing anything visual, and `README.md` for how the live delivery works.

Six rules that are easy to break by accident:

- **Copy lives in `content/`.** Components hold no user-facing strings. Message pacing is authored there too.
- **Every message must render server-side.** Undelivered ones are hidden with CSS, never omitted — that is what stops readers scrolling ahead, keeps the page indexable, and makes it work without scripting.
- **The sequence must stay skippable**, and reduced motion must deliver everything at once. Timed content is a WCAG 2.2.1 failure otherwise.
- **Receipt green marks the sender and the reply.** It is not a decoration colour.
- **Unconfirmed facts stay visibly `TBC`.** Never invent dates, costs, prizes, mentors, venues or numbers.
- **There is no Tailwind.** `app/globals.css` is hand-written and meant to stay readable start to finish.
