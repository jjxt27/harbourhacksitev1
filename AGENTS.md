<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# HarbourHack

A go-to-market hackathon site built as a single message thread. Read `BRAND_GUIDELINES.md` before changing anything visual, and `README.md` for how the pieces fit.

Four rules that are easy to break by accident:

- **Copy lives in `content/`.** Components hold no user-facing strings. If a line needs special treatment, split the content into parts rather than moving words into JSX.
- **Receipt green means "seen" and nothing else.** It is not a button colour, a link colour or an accent. The primary action is bone on slate deliberately.
- **Unconfirmed facts stay visibly `TBC`.** Never invent dates, costs, prizes, mentors, venues or numbers.
- **There is no Tailwind.** `app/globals.css` is hand-written and meant to stay readable start to finish. Do not reintroduce a utility framework.
