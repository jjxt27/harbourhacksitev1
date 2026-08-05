# HarbourHack — The Thread

Version 2.0

Last updated: 5 August 2026

This replaces everything before it. The previous identity is in git history and should not be referred to.

## 1. The idea

HarbourHack is a go-to-market hackathon. Most hackathons end when you ship, and shipping proves nothing on its own — the work this programme cares about starts once something exists: finding the people who have the problem, getting it into their hands, and changing it based on what they do.

Every go-to-market story starts the same way: **one message, to one stranger.**

So the site is that message. The whole thing is a thread, top to bottom, and the reader is the person it reached. That is not a theme laid over a website; it is the structure:

| Page | What it is |
|---|---|
| `/` | The outbound thread. We are messaging you. |
| `/faq` | The replies. What people wrote back, and what we said. |
| `/apply` | **Your reply.** The form is your side of the conversation. |

The last message on the homepage is *"This message reached you."* By the time it is read, the thing the programme teaches has already been demonstrated on the reader. Nothing else on the site is allowed to be cleverer than that.

### On the name

The harbour is Sydney. That is the whole of it. There is no maritime visual language — no tides, anchors, crews, cargo or charts. "Ship", "launch" and "land" are software verbs and are fine in copy.

## 2. The signature

**Read receipts.** Messages start dim and turn bone as you read them. A counter in the bar climbs, and a column of dots on the right fills in — one dot per message.

This is the only interactive idea on the site, and it must stay the only one. Its rules:

- **Receipt green marks being seen. Nothing else, ever.** Not buttons, not links, not hovers, not headings. The moment it decorates something, the signature is dead. The primary button is bone on slate for exactly this reason.
- **Both states must be legible.** Unread text is a contrast-checked colour (4.89:1), not a way of hiding content. Dimming is a shift in emphasis.
- **The count must be honest but never anticlimactic.** Messages count when they reach the reading band *or* when they scroll past it, so a fast reader still arrives at the closing line with a full count.
- **It degrades to nothing.** Without scripting the thread renders in full. Under reduced motion every message is seen on the first render.

## 3. Colour

Five values. There is no sixth.

| Token | Name | Value | Use |
|---|---|---|---|
| `--c-ground` | Slate | `#1C1F26` | The page. Warm enough not to read as UI black. |
| `--c-ground-deep` | Deep | `#14171D` | Recessed panels: the facts card, inbound questions, the footer. |
| `--c-bone` | Bone | `#F2EFE9` | Read text, and the primary button's fill. |
| `--c-dim` | Dim | `#868C99` | Unread text, timestamps, hints. |
| `--c-receipt` | Receipt | `#38E08C` | **Seen. Only ever seen.** Plus the focus ring. |
| `--c-alert` | Alert | `#FF6B5A` | Errors and unconfirmed facts. |
| `--c-rule` | Rule | `#333944` | Hairlines and unlit receipt dots. Never text. |

All text pairs clear WCAG AA; the focus ring clears SC 1.4.11 at 9.59:1. Re-check any new pair before shipping it.

## 4. Type

Two families. **Schibsted Grotesk** carries display and body — the same face at every size, because a thread is one voice. **DM Mono** carries timestamps, counts and labels only, never prose.

| Role | Size | Notes |
|---|---|---|
| Opening line | `clamp(3rem, 9vw, 8rem)` | Once per site. The arrival. |
| Lead | `clamp(2.6rem, 7vw, 6rem)` | At most two per page. |
| Message | `clamp(1.35rem, 2.5vw, 2.2rem)` | Far larger than normal web body — these are read one at a time. |
| Aside | `clamp(1rem, 1.35vw, 1.2rem)` | Quiet asides and hints. |
| Meta | `0.7rem`, mono, `0.14em` | Rail, counters, labels. |

Message measure is capped at `40ch`, leads at `15ch`. **Write to the measure**: if a line needs a comma splice or a second sentence to land, split it into two messages. The rhythm of short messages *is* the typography.

## 5. Layout

A hard left rail carries the time and the receipt mark; the messages sit in a column beside it. That grid is the same on every page — thread, replies, reply form — which is what makes three different page types feel like one document.

- Rail `6rem` desktop, `2.5rem` mobile
- Column `50rem` max
- The receipt dots sit in the right margin, and disappear below `68rem` rather than crowding the column

No cards, no bubbles, no avatars, no rounded rectangles beyond the button. The moment it looks like a messaging product it has failed — it is a transcript, not an interface.

## 6. Voice

Write messages, not marketing.

- Second person, present tense, plain verbs.
- One idea per message. If there are two, send two.
- Concrete over clever: "in a DM, in a group chat" beats "through your channels".
- Name the specific: "my flatmate who tutors on weekends" beats "students".
- Questions on `/apply` are asked the way a person would ask them out loud. "What should we call you?", never "Name".
- Unconfirmed facts stay visibly **TBC**. An unanswered question is more trustworthy than a placeholder that reads as real.

Avoid: superlatives, pitch-deck vocabulary, claims about traction that has not happened, and any maritime metaphor.

## 7. Where things live

| Item | Source |
|---|---|
| The homepage thread | [`content/thread.ts`](content/thread.ts) |
| Programme facts and dates | [`content/site.ts`](content/site.ts) |
| The reply form's questions | [`content/apply.ts`](content/apply.ts) |
| The replies | [`content/faq.ts`](content/faq.ts) |
| Colour, type, layout | [`app/globals.css`](app/globals.css) |
| The read-receipt mechanic | [`components/SeenContext.tsx`](components/SeenContext.tsx), [`components/Thread.tsx`](components/Thread.tsx) |

**All user-facing copy lives in `content/`.** Components hold no strings.

Colours are duplicated in [`app/icon.tsx`](app/icon.tsx) and [`app/opengraph-image.tsx`](app/opengraph-image.tsx), which render in a worker with no DOM and cannot read the tokens. Change those together with `globals.css`.

There is no Tailwind. The CSS is hand-written and the file is short enough to read start to finish — keep it that way.
