# HarbourHack — The Conversation

Version 3.0

Last updated: 5 August 2026

This replaces everything before it. Earlier identities are in git history and should not be referred to.

## 1. The idea

HarbourHack is a go-to-market hackathon. Most hackathons end when you ship, and shipping proves nothing on its own — the work this programme cares about starts once something exists: finding the people who have the problem, getting it into their hands, and changing it based on what they do.

Every go-to-market story starts the same way: **one message, to one stranger.**

So the site is that message. The whole thing is one conversation, and the reader is the person on the other end of it:

| Page | What it is |
|---|---|
| `/` | The chat. It plays out live, in front of you. |
| `/faq` | The replies. What people wrote back, and what we said. |
| `/apply` | **Your reply.** The form is your side of the conversation. |

The last message is *"this message reached you"*, followed by the card that asks you to register. By that point the thing the programme teaches has already been done to the reader. Nothing else on the site is allowed to be cleverer than that.

### On the name

The harbour is Sydney. That is the whole of it. No maritime visual language — no tides, anchors, crews, cargo or charts. "Ship", "launch" and "land" are software verbs and are fine in copy.

## 2. The signature

**A live one-to-one chat.** Typing indicator, bubbles landing one at a time, per-message timestamps, a day divider, a composer at the bottom. It runs about 18 seconds end to end.

The illusion is the product. It only holds if all of these hold:

- **You cannot scroll ahead.** Undelivered messages render server-side and are hidden behind `.js`, so there is nothing below the latest bubble to scroll to. This is why the sequence is un-skippable *by scrolling* without any scroll hijacking. Scrolling **up** to re-read is always free.
- **It is always skippable deliberately.** Timing content out is a WCAG 2.2.1 failure otherwise. The header carries a skip control until the conversation ends, and the composer links to the form from the first second — nobody is trapped.
- **Reduced motion gets everything at once.** No typing, no waiting, no skip control needed.
- **Without scripting the whole conversation renders.** The hidden state only exists when there is script to clear it.
- **A short conversation sits on the composer, not the top of the screen.** Messages grow upward, the way a real client behaves.
- **Never yank a reader who has scrolled up.** Auto-follow only applies when they are already near the bottom; otherwise show the jump control.

## 3. Colour

| Token | Name | Value | Use |
|---|---|---|---|
| `--c-ground` | Slate | `#1C1F26` | The page. Warm enough not to read as UI black. |
| `--c-ground-deep` | Deep | `#14171D` | Chat header, composer, cards, footer. |
| `--c-ground-raised` | Raised | `#262B35` | Message bubbles. |
| `--c-bone` | Bone | `#F2EFE9` | Message text. |
| `--c-dim` | Dim | `#9199A6` | Timestamps, status, hints. Tuned to clear AA on the bubble surface, which is the tightest pairing on the site. |
| `--c-receipt` | Receipt | `#38E08C` | The sender and the reply: avatar, typing status, send button, card link, focus ring. |
| `--c-alert` | Alert | `#FF6B5A` | Errors and unconfirmed facts. |
| `--c-rule` | Rule | `#333944` | Hairlines. Never text. |

Receipt green marks **presence and the reply** — who is typing, and how you answer. It never decorates. Outbound question bubbles on `/faq` use `#2F3A35`, a green-tinted slate, so the two sides of the conversation read apart without a second accent.

All text pairs clear WCAG AA; the focus ring clears SC 1.4.11 at 9.59:1. Re-check any new pair before shipping it.

## 4. Type

Two families. **Schibsted Grotesk** for everything spoken — one face, because it is one voice. **DM Mono** for timestamps, status and labels only, never prose.

| Role | Size | Notes |
|---|---|---|
| Message | `1.02rem` | Real chat size. Resist making it "designed" — a bubble that reads as a headline stops reading as a message. |
| Page heading | `clamp(2.4rem, 6vw, 4.5rem)` | Inner pages only. The chat has no headings. |
| Form question | `clamp(1.1rem, 1.8vw, 1.4rem)` | Spoken, not labelled. |
| Meta | `0.7rem`, mono, `0.12em` | Status, rails, labels. |
| Timestamp | `0.6rem`, mono | Floated so it settles onto the last line of a bubble. |

Bubbles cap at `min(30rem, 82%)`. Write to that measure.

## 5. Layout

The chat is a fixed `100dvh` frame: header, scrolling log, composer. Nothing on the homepage scrolls the document — only the log scrolls, which is what makes it feel like an app rather than a page.

- Log column `46rem` max, centred
- Header and composer align their contents to the same column, so the frame reads as designed on wide screens rather than as a stretched app
- Bubble tails mark the first message of a burst; messages sharing a minute group together

Inner pages reuse the bubble language: `/faq` is a genuine two-sided thread, and `/apply` is a single flowing set of questions rather than a stepped form, because a conversation does not have steps.

## 6. Voice

Write messages, not marketing. This is the highest-risk part of the design — the moment a bubble sounds written rather than typed, the illusion goes.

- Short lines, one thought each. If a message needs a comma splice, send two messages.
- Second person, present tense, plain verbs. Contractions are correct here.
- Concrete over clever: "in a DM, in a group chat" beats "through your channels".
- Name the specific: "my flatmate who tutors on weekends" beats "students".
- Questions on `/apply` are asked the way a person would ask them out loud. "What should we call you?", never "Name".
- Unconfirmed facts stay visibly **TBC**. An unanswered question is more trustworthy than a placeholder that reads as real.

Avoid: superlatives, pitch-deck vocabulary, claims about traction that has not happened, and any maritime metaphor.

## 7. Where things live

| Item | Source |
|---|---|
| The conversation, and its pacing | [`content/thread.ts`](content/thread.ts) |
| Programme facts and dates | [`content/site.ts`](content/site.ts) |
| The reply form's questions | [`content/apply.ts`](content/apply.ts) |
| The replies | [`content/faq.ts`](content/faq.ts) |
| Colour, type, layout | [`app/globals.css`](app/globals.css) |
| Delivery, scroll behaviour, skip | [`components/Chat.tsx`](components/Chat.tsx) |

**All user-facing copy lives in `content/`.** Components hold no strings. Pacing is authored per message (`pause`, `typing`) — tune the rhythm there, not in the component.

Colours are duplicated in [`app/icon.tsx`](app/icon.tsx) and [`app/opengraph-image.tsx`](app/opengraph-image.tsx), which render in a worker with no DOM and cannot read the tokens. Change those together with `globals.css`.

There is no Tailwind. The CSS is hand-written and short enough to read start to finish — keep it that way.
