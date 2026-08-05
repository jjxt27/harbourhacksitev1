# HarbourHack

Site for **HarbourHack**, a go-to-market hackathon in Sydney for students, grads and other early-stage builders.

The whole site is one message thread, and the reader is the person it reached. `/` is the outbound thread, `/faq` is the replies, and `/apply` is your reply — the form is your side of the conversation. Read [`BRAND_GUIDELINES.md`](BRAND_GUIDELINES.md) before changing anything visual; it explains the one idea everything else serves.

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
| `content/thread.ts` | The homepage thread. The most important file here. |
| `content/site.ts` | Programme facts and dates. |
| `content/apply.ts` | The reply form's questions, in the voice of someone asking them. |
| `content/faq.ts` | Inbound questions and answers. |
| `app/globals.css` | The entire design system, hand-written. No Tailwind. |
| `components/SeenContext.tsx` | The read count, shared between the thread and the bar. |
| `components/Thread.tsx` | The thread and the read-receipt mechanic. |
| `lib/validateApplication.ts` | Validation shared by the form and the API route. |

## The read-receipt mechanic

Messages start dim and turn bone as they are marked seen; the bar counts them and a column of dots fills in. Three things about it are deliberate and easy to break:

- **Unread is a contrast-checked colour, not hidden text.** Dimming shifts emphasis; it never removes access to content.
- **The dim state lives behind a `.js` class** set before first paint in `app/layout.tsx`. Without scripting the thread renders in full, at full contrast — correct for a page whose entire content is text.
- **Messages count when they pass the reading band as well as when they enter it.** Without that, a fast scroll reaches the closing line — *"This message reached you"* — while the counter still says 20 of 22.

Under `prefers-reduced-motion` the whole thread is marked seen on the first client render. That preference is read with `useSyncExternalStore`, not an effect, so there is no fill-in to watch.

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
