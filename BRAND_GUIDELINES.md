# HarbourHack brand guidelines

Version 1.2

Last updated: 5 August 2026

This document is the practical source of truth for HarbourHack brand work. It reflects the current website and should be used for web pages, applications, social posts, event materials and partner assets.

## 1. Brand idea

HarbourHack is a go-to-market hackathon. It exists because most hackathons end when you ship, and shipping proves nothing on its own. The work HarbourHack cares about starts once something works: finding the people who have the problem, getting the thing into their hands, and changing course based on what they actually do with it.

### On the name

The harbour is Sydney. That is the whole of it.

**The nautical scene is not the brand.** HarbourHack is a place name, not a theme. Anchors, tides, crews, cargo, casting off, running aground and smooth sailing are all off the table — they make a serious program about distribution sound like a party.

**"Ship" is the exception, and it is not really an exception.** Ship, launch and land are the software industry's own verbs, and they arrive here from that direction, not from the water. A builder reads "ship it" as releasing something, and that is exactly the meaning intended. Use them freely.

The test is simple: would this word appear in an engineering standup? *Ship, launch, land* pass. *Cargo, crew, aground, cast off* do not.

### Core proposition

> Ship out.

Two readings, both intended: get it out the door, and get yourself out to the people who might use it.

### Supporting message

Ship it, then go and get it in front of the people it is for.

### Operating loop

> Find → Ship → Land → Change → Repeat

Every HarbourHack story has to reach real users. "We built it" is not an outcome. Neither is "we would have launched with more time."

### Brand characteristics

- Direct, not corporate
- Practical, not theoretical
- Ambitious, not inflated
- Specific, not sweeping
- Distinctive, not decorative
- Honest about what has not happened yet

## 2. Naming

Use **HarbourHack** as the primary public name. Use **HH** only where space is limited or the audience already knows the brand.

| Context | Use |
|---|---|
| Headlines, body copy and formal references | HarbourHack |
| Compact lockups, favicon and short internal labels | HH |
| Legal or organising entity | Use the verified entity name once confirmed |

Do not write `Harbour Hack`, `Harbourhack`, `HARBOUR-HACK` or `H H` in prose. Uppercase `HARBOURHACK` belongs to display treatments and the wordmark only. Australian spelling: **harbour**, never `harbor`.

## 3. Mark system

The identity is a **drawn HH monogram** locked up with a **typeset wordmark**. The master implementation is [`components/BrandMark.tsx`](components/BrandMark.tsx).

### The monogram

Four stems and a rule. The rule replaces both H crossbars and runs out past the right edge of the mark — the thing you made, leaving. It is the only element in the identity that carries Signal colour.

- The rule must stay attached to the stems and at crossbar height.
- Keep the overshoot past the right stem. It is the detail that makes the mark recognisable.
- Do not add a second rule or apply Signal to the stems.

### The wordmark

`HarbourHack` set in Inter, 800 weight, uppercase, tracking `-0.02em`. Unlike the monogram it *is* typeset, and that is deliberate — it should be reproducible in any tool without redrawing.

### Variants

| Variant | Use |
|---|---|
| `full` — monogram plus wordmark | Desktop and tablet navigation, footers, signage, presentation covers, partner lockups |
| `mark` — monogram only | Mobile navigation, the intro sequence, favicons, avatars, small merchandise |

Do not use the `mark` variant merely as decoration when the full lockup fits.

### Colour versions

| Background | Stems and wordmark | Rule |
|---|---|---|
| Harbour Black | Ink | Signal |
| Sea Fog or white | Harbour Black | Signal |
| Photograph | Black or white, whichever holds contrast | Signal, if legible |
| One-colour production | One approved solid colour | Same solid colour |

Do not place the full-colour mark over a busy photograph without a clear, quiet area behind it.

### Clear space and minimum size

Keep clear space equal to at least the height of one crossbar on every side.

| Variant | Digital minimum | Print minimum |
|---|---:|---:|
| Full lockup | 140 px wide | 34 mm wide |
| Monogram | 44 px wide | 12 mm wide |

Below the monogram minimum, use the dedicated favicon in [`app/icon.tsx`](app/icon.tsx), which drops to a single H so the counters do not close up.

### Misuse

Never stretch, condense, skew or rotate the mark; change the spacing between stems; detach, recolour or duplicate the rule; add outlines, shadows, bevels, gradients or glow; place the mark inside an arbitrary badge; or set it alongside wave, anchor, ship-wheel, rope or compass-rose motifs.

### Website usage

```tsx
// Full lockup
<BrandMark />

// Monogram only
<BrandMark variant="mark" />

// Current responsive navigation pattern
<BrandMark variant="mark" className="sm:hidden" />
<BrandMark className="hidden sm:inline-flex" />
```

Both the SVG and the wordmark are `aria-hidden`. A link containing only the mark needs its own accessible name alongside.

## 4. Colour

### Core palette

| Token | Name | Value | Primary use |
|---|---|---|---|
| `paper` | Harbour Black | `#05080D` | Primary background, navigation, dark surfaces |
| `paper-raised` | Raised Black | `#0C1119` | Inputs and subtly elevated dark surfaces |
| `ink` | Ink | `#E7EBF0` | Primary text and marks on dark surfaces |
| `ink-70` | Soft Ink | `#B0B9C4` | Supporting copy on dark surfaces |
| `ink-muted` | Muted Grey | `#7D8894` | Labels and low-priority metadata |
| `signal` / `accent` | Signal | `#2FE3BD` | Primary actions, progress, focus, the mark's rule, the signature full stop |
| `amber` | Amber | `#FFC15E` | The second voice: the people being reached, the judging panel, warm counterpoint |
| `danger` | Alert Red | `#FF5F57` | Errors, invalid states and unconfirmed warnings |

Signal and Alert are deliberately far apart in hue. Signal never means failure, and Alert never means progress.

### Light-ground palette

| Token | Name | Value | Primary use |
|---|---|---|---|
| `paper` | Sea Fog | `#EEF1F3` | Application, FAQ and explanatory sections |
| `paper-raised` | White | `#FFFFFF` | Raised content on Sea Fog |
| `ink` | Harbour Black | `#0B1016` | Primary text and marks |
| `ink-70` | Soft Black | `#3F4750` | Supporting copy |
| `ink-muted` | Warm Grey | `#5B636D` | Labels and metadata |

Applied with the `ground-light` utility, which reassigns the tokens rather than introducing a second set of class names.

### Colour principles

- Harbour Black and Sea Fog carry most of the composition.
- Signal identifies action and progress. It is never a large background fill.
- Amber represents *the people you are trying to reach* — the far side of the plot, the second column, the judging voice. It is never a button.
- Harbour Black text on Signal buttons. Never Ink on Signal.
- Do not use Signal for body text on a light ground.
- Reach for a hairline before reaching for another surface colour.

Hairlines are Ink at 20% or 10% on dark surfaces, and Harbour Black at 25% or 12% on light surfaces.

## 5. Typography

### Font families

| Role | Typeface | Fallback | Typical weight |
|---|---|---|---:|
| Display headings | Inter | Arial, sans-serif | 650–800 |
| Body and interface | Inter | Arial, sans-serif | 400–700 |
| Labels and metadata | Geist Mono | UI monospace, monospace | 400–500 |
| Editorial accent | Newsreader Italic | Georgia, serif | 400 |
| Wordmark | Inter | — | 800 |

All three are loaded through `next/font/google` in [`app/layout.tsx`](app/layout.tsx). Do not add another face without a clear new role.

### The editorial accent

Newsreader Italic is the counter-voice to the bold uppercase Inter. It appears in exactly three places: the second half of the hero title, the emphasised clause in a lead paragraph, and the closing line of the scroll journey. It is always lowercase or sentence case, never uppercase, and never used for more than a clause.

If a fourth use appears, one of the four is wrong.

### Digital type scale

| Style | Size | Line height | Tracking | Use |
|---|---|---:|---:|---|
| Hero | `clamp(3rem, 8vw, 7.2rem)` | `0.90` | `-0.065em` | Homepage statement only |
| Display 1 | `clamp(2.7rem, 6.4vw, 6.8rem)` | `0.94` | `-0.055em` | Major section or page headings |
| Display 2 | `clamp(2rem, 4.2vw, 4.2rem)` | `0.98` | `-0.04em` | Section headings |
| Display 3 | `clamp(1.35rem, 2vw, 1.75rem)` | `1.10` | Default | Card and FAQ headings |
| Lead | `clamp(1.1rem, 1.6vw, 1.35rem)` | `1.50` | Default | Introductions and key explanations |
| Body | `1rem` | `1.60` | Default | Standard copy |
| Body small | `0.875rem` | `1.55` | Default | Hints and secondary copy |
| Caption | `0.75rem` | `1.40` | Default | Compact UI text |
| Label | `0.6875rem` | `1.40` | `0.16em` | Uppercase metadata |

### Typography principles

- Bold uppercase Inter for short display statements.
- Sentence case and comfortable measures for paragraphs; keep body copy near 45–65 characters per line.
- Geist Mono for labels, dates, stage numbers and secondary links — not for paragraphs.
- Tight tracking belongs to large display type only.
- Avoid long all-caps sentences.

### The signature full stop

Display headings end in a Signal full stop: `Ship out.` `Who ships.` `What we measure.` It is the typographic equivalent of the mark's rule — a small, consistent detail that says the sentence has landed.

Use it on display headings only. Not on body copy, not on labels, not more than once in a heading.

## 6. Layout and UI

### Grid and spacing

- Maximum content width: `86rem`
- Page gutters: `20px` mobile, `32px` small screens, `48px` large screens
- Section spacing: usually `80px` mobile and `112px` desktop
- Straight rules and aligned edges create structure.
- Prefer open compositions over stacks of rounded cards.

### Components

**Primary action** — Signal fill, Harbour Black text, uppercase Inter, bold. Reserved for the main conversion action.

**Secondary action** — uppercase Geist Mono with a thin Signal underline, for navigation deeper into the story.

**Forms** — square fields, quiet raised surfaces, persistent labels, plain-language validation. Do not turn every field into a rounded card.

**Rules** — one-pixel hairlines separate information. They are part of the system, not decoration.

### Shape language

Predominantly square and linear. The exceptions are deliberate and few: the primary action's soft radius, the plot's concentric rings and stage markers, and the round reach indicator. Do not spread glass panels or soft cards across the interface.

## 7. Motion

Motion reinforces the idea that things travel: from you to them, from idea to used.

### Signature motion

Three moments carry the brand, and no more should be added.

**The intro sweep.** An accent rule travels up the screen with a readout counting to 100, resolving into the monogram before the curtain lifts. Runs once per browser session, never under reduced motion, always with a visible skip control. See [`components/Sweep.tsx`](components/Sweep.tsx).

**The route.** The homepage plot is scrubbed by scroll: the head advances along the route, the run behind it draws in Signal, and each stage marker lights as it becomes active. Driven entirely by scroll position — nothing on the plot advances on its own.

**The ambient background.** Two slow gradient layers and a drifting dot grid sit behind the route. They exist to keep the dark ground from reading as flat, and nothing else. See the "ambient motion" block in [`app/globals.css`](app/globals.css).

### Ambient motion rules

This is the easiest part of the system to ruin. Ambient motion must stay below the threshold where a reader can tell it is moving without staring at it.

- Cycles run **45 seconds or longer**. Anything faster reads as an animation rather than atmosphere.
- Translation stays under ~3% of the layer, scale under ~10%.
- Transform only. Never animate colour, opacity, blur, filters or `background-position` on a full-viewport layer.
- Overlapping layers get durations that do not divide into each other, so they never resolve into a visible shared beat.
- Every loop returns to its starting state, so freezing it at any keyframe looks correct. This is what makes reduced-motion degradation safe.
- Ambient motion belongs behind content, never behind text that is being read at small sizes.

### Timing

| Motion | Current timing |
|---|---:|
| Intro sweep | 1400 ms |
| Intro mark reveal | 420 ms |
| Intro curtain lift | 620 ms |
| Content reveal | 700 ms |
| Stage transition | 520 ms |
| Mobile menu entrance | 500 ms |
| Ambient drift / sway / pan | 44–67 s |
| Reach indicator ring | 180 s |

Use the fluid easing curve `cubic-bezier(0.32, 0.72, 0, 1)` for expressive transitions.

### Motion principles

- One purposeful transition beats several competing effects.
- Animate opacity and transforms where possible.
- Scroll-linked motion must never trap or fight the scroll.
- Support `prefers-reduced-motion` and keep all content available without animation.

## 8. Illustration, photography and texture

### The plot

The route plot is the house illustration style: thin consistent strokes, dashed paths, concentric rings, mono labels, no fill. New diagrams should look like they came off the same drawing. They must explain something — a route, a sequence, a relationship — not fill space.

It is a diagram of reach, not a nautical chart. No compass roses, depth soundings, coastlines or sea monsters.

### Photography

When real photography is available, favour builders talking to actual users, honest workshop and Demo Day moments, the real venue and organising team, natural contrast and restrained grading.

Avoid generic startup stock, staged laptop circles, harbour postcard shots, and any image implying traction or facilities HarbourHack cannot verify.

### Generated imagery and data graphics

No AI-looking product renders, fake dashboards or decorative graphs. A data visual must communicate verified information more clearly than copy would.

### Texture

The site grain sits at roughly 3% opacity. Texture must never reduce text clarity or resolve into a visible pattern.

## 9. Voice and copy

### Voice rules

- Lead with a verb or an outcome.
- Short sentences, concrete words.
- Address the participant directly.
- Name the specific over the general — "students who tutor on the side", not "students".
- Treat building and distribution as one job, not two phases.
- Describe value as what a real person can use or respond to.
- Be honest about what is not yet confirmed.

### Preferred language

- Ship out.
- Ship it, then go and get it in front of the people it is for.
- One specific audience beats a broad market.
- Working beats polished.
- Distribution is the other half.
- Whatever comes back is the real brief.
- Shipping is not the finish line.

### Avoid

- **The maritime scene.** No tides, anchors, harbours-as-metaphor, crews, cargo, ports, docks, casting off, running aground, smooth sailing, all hands, charting new waters, or being on the manifest. The name is a place. Leave it there. (Ship, launch and land are software verbs and are welcome — see §1.)
- "Revolutionary", "world-changing" or unsupported superlatives
- "Leverage", "synergy", "ecosystem", "growth hacking" and pitch-deck vocabulary
- Claims about traction, customers or outcomes that have not happened
- Assuming every participant is building a venture-backed startup
- Copy that sounds like a pitch instead of an invitation

## 10. Accessibility

Accessibility is part of the identity: direct design must also be easy to use.

- Every text colour in this document meets WCAG AA against its intended ground. Verify new combinations before release.
- Signal two-pixel focus ring with a four-pixel offset.
- Interactive targets at least 44 by 44 CSS pixels where practical.
- Never communicate status by colour alone — the stage markers change fill *and* label colour, and the progress rail carries a number.
- The plot is decorative and carries a single descriptive `role="img"` label; all of its meaning also exists as text in the stage copy.
- Preserve logical heading order and keyboard operation.
- Respect reduced-motion preferences. Ambient loops must return to their start state so freezing them is visually correct.
- Do not hide essential content behind hover, animation or JavaScript. The scroll experience must remain readable with scripting disabled.

## 11. Social, partner and event applications

- Full lockup when the layout is wider than it is tall; monogram for square avatars and very small placements.
- Keep partner logos optically balanced and separated by at least the mark's clear space.
- Never recolour a partner logo to Signal.
- Use the dark palette for the default social card; Sea Fog only when a light campaign treatment is intentional.
- Do not publish dates, prizes, mentors, partners or venue claims until verified.

The social card is generated in [`app/opengraph-image.tsx`](app/opengraph-image.tsx) and the favicon in [`app/icon.tsx`](app/icon.tsx).

## 12. Governance and source files

| Item | Source of truth |
|---|---|
| Mark geometry and lockup | [`components/BrandMark.tsx`](components/BrandMark.tsx) |
| Colour, typography and motion tokens | [`app/globals.css`](app/globals.css) |
| Font loading and metadata | [`app/layout.tsx`](app/layout.tsx) |
| Public name, proposition and program facts | [`content/site.ts`](content/site.ts) |
| Application voice | [`content/apply.ts`](content/apply.ts) |
| FAQ voice | [`content/faq.ts`](content/faq.ts) |

When changing a core colour, check the hard-coded render surfaces as well as the CSS tokens: `BrandMark.tsx`, `app/icon.tsx` and `app/opengraph-image.tsx` all render outside the DOM or outside the cascade and cannot read the token values.

Changes to the mark, core palette, typefaces or brand proposition should be reviewed by the HarbourHack brand owner before release. Content updates that fill in verified program facts can be made through the files in `content/` without redesigning components.
