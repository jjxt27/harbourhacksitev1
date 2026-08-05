<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# HarbourHack

Go-to-market hackathon site. Read `BRAND_GUIDELINES.md` before changing anything visual, and `README.md` for how the pieces fit together.

Two rules that are easy to break by accident:

- **Copy lives in `content/`.** Components should not hold user-facing strings. If a heading needs special treatment (an accented full stop, an editorial italic clause), split the content into parts rather than moving the words into JSX.
- **Unconfirmed facts stay visibly `TBC`.** Do not invent dates, costs, prizes, mentors, venues or numbers. The `trust` block in `content/site.ts` renders nothing until it holds real names, and that is deliberate.
