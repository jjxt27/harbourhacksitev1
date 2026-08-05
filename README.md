# HarbourHack

Site for **HarbourHack**, a go-to-market hackathon in Sydney for students, grads and other early-stage builders.

The homepage is a one-to-one chat that plays out live in front of the visitor — typing indicator, bubbles landing one at a time, timestamps, the lot. `/faq` is what people wrote back and `/apply` is your reply, so the whole site is one conversation. Read [`BRAND_GUIDELINES.md`](BRAND_GUIDELINES.md) before changing anything visual.

## Run it

```bash
npm install
```

```bash
npm run dev
```

## Structure

| Path | What |
|---|---|
| `content/thread.ts` | The conversation and its pacing. The most important file here. |
| `content/site.ts` | Programme facts and dates. |
| `content/apply.ts` | The reply form's questions, in the voice of someone asking them. |
| `content/faq.ts` | Inbound questions and answers. |
| `app/globals.css` | The entire design system, hand-written. No Tailwind. |
| `components/Chat.tsx` | Delivery, scroll behaviour, skip. |
| `lib/validateApplication.ts` | Validation shared by the form and the API route. |

## How the live delivery works

Every message renders server-side. Once scripting runs, `.js` hides the ones that have not been delivered yet, and the delivery chain reveals them one at a time behind a typing indicator.

That single decision does four jobs at once, and they are all easy to break:

- **Nothing to scroll ahead to.** The reader cannot skip the sequence by scrolling, because undelivered bubbles are not in the layout. No scroll hijacking is involved — scrolling *up* to re-read stays completely free.
- **No layout shift.** Bubbles do not push the page around as they arrive.
- **Works without scripting.** The whole conversation is in the HTML, which also means it is indexable.
- **Skippable on purpose.** Gating content behind a timer fails WCAG 2.2.1, so the header carries a skip control until the end, and the composer links to the form from the first second. Anyone who has asked for reduced motion gets the entire conversation immediately.

Pacing is authored per message in `content/thread.ts` (`pause` before typing starts, `typing` to override the length-derived duration). Tune the rhythm there, not in the component. It currently runs about 18 seconds.

Two smaller details that matter: a short conversation sits on the composer and grows upward, and auto-follow only applies when the reader is already near the bottom — otherwise they get a "jump to latest" control instead of being yanked mid-sentence.

## Application delivery

`/apply` posts to `app/api/apply/route.ts`, which sends through Resend. Configure:

```text
RESEND_API_KEY
APPLY_FROM_EMAIL
APPLY_TO_EMAIL
```

Development and preview deployments log valid submissions when mail is not configured. Production returns an error rather than silently dropping a reply.

## Before launch

These stay visibly `TBC` until confirmed — do not invent them:

- Application open and close dates, in `content/site.ts`
- Exact programme and Demo Day dates
- Cost, equity, and what happens after Demo Day, in `content/faq.ts`
- Contact and sponsor email addresses

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
