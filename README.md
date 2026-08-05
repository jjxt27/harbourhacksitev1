# HarbourHack

Marketing and application site for **HarbourHack (HH)**, a go-to-market hackathon in Sydney for students, grads and other early-stage builders.

The proposition is deliberately narrow: plenty of hackathons end when you ship, and shipping proves nothing on its own. This one is about what happens after — getting a working thing into the hands of the people it is for, then changing course based on what comes back. Applicants do not need a company, funding, customers or a finished product.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Structure

| Path | What |
|---|---|
| `BRAND_GUIDELINES.md` | Brand strategy, mark usage, colour, typography, motion and voice rules. |
| `content/site.ts` | Main-page copy, dates and program facts. |
| `content/apply.ts` | Application labels, hints, errors and success copy. |
| `content/faq.ts` | FAQ questions and answers. |
| `app/globals.css` | Design tokens and the motion system. |
| `components/experience/` | The scroll experience: the route plot and the content laid over it. |
| `components/sections/` | The lower homepage bands. |
| `lib/validateApplication.ts` | Validation shared by the form and the API route. |

The visual system is a blue-cast near-black, one aqua accent (Signal) and one warm counterweight (Amber). The homepage is a single sticky plot of the distance between you and the people you are trying to reach, scrubbed by scrolling, with the hero and the three journey stages laid over it. Everything else is straight rules, strong typography and restrained viewport reveals.

### The plot

`components/experience/RouteChart.tsx` draws the route once, then measures it with `getPointAtLength` to place the three stage markers and to move the head. Position and bearing are written straight to SVG attributes inside an animation frame, so scrolling never re-renders the React tree. Moving the `ROUTE` constant moves the markers and the head with it — nothing else is hard-coded to those coordinates.

### Ambient motion

Three slow loops sit behind the route: two gradient layers and a drifting dot grid, all defined in the "ambient motion" block of `app/globals.css`. They animate transform only, on layers that are already composited, and every loop returns to its start state — which is what makes the reduced-motion freeze look correct rather than stuck mid-cycle. `BRAND_GUIDELINES.md` §7 has the rules for keeping them below the threshold of noticing.

## Application delivery

`/apply` posts to `app/api/apply/route.ts`, which sends the submission through Resend. Configure:

```text
RESEND_API_KEY
APPLY_FROM_EMAIL
APPLY_TO_EMAIL
```

Development and preview deployments log valid submissions when mail is not configured. Production returns an error instead of silently dropping an application.

## Before launch

These facts remain visibly marked `TBC` until confirmed:

- Application open and close dates in `content/site.ts`
- Exact program and Demo Day dates in October 2026
- Contact and sponsor email addresses
- Cost, equity and post-Demo-Day answers in `content/faq.ts`
- Organisers, mentors, judges and venue in the `trust` block of `content/site.ts` — the section stays unrendered until it holds real names

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
