/**
 * Copy for the docks.
 *
 * Where the docks sit and how big they are lives in content/map.ts — this file
 * is only ever words. The two are joined by the dock ids, so a `dock:` value
 * here must match an `id` there.
 *
 * Unconfirmed programme facts stay visibly TBC. Never invent dates, times,
 * mentors, venues or prizes.
 */

export const site = {
  name: "HarbourHack",
  year: "2026",
  city: "Sydney",
  tagline: "Don't just build. Ship.",
  description:
    "HarbourHack 2026. Sydney's premier go-to-market hackathon for university students. Build it, then go and get real users.",
  url: "https://harbourhack.vercel.app",
} as const;

export const dryDock = {
  kicker: "Dock 01 — The Rocks",
  headline: ["Don't just", "build.", "Ship."],
  subtext: `HarbourHack ${site.year}. ${site.city}'s premier GTM hackathon for university students.`,
  scrollCue: "Drag the water to pan the harbour",
  criteriaLabel: "Judged on three things. That's it.",
  /** `rotate` scatters the notes; keep it under ~4° or it reads as broken. */
  criteria: [
    {
      n: "01",
      title: "Live Demo",
      note: "It has to actually run. In front of people.",
      tone: "yellow" as const,
      rotate: -2.5,
    },
    {
      n: "02",
      title: "Pitch Deck",
      note: "Who it's for, and why they'd switch.",
      tone: "paper" as const,
      rotate: 1.8,
    },
    {
      n: "03",
      title: "Real User Signups",
      note: "Actual humans. Not your group chat.",
      tone: "ferry" as const,
      rotate: -1.2,
    },
  ],
  cta: { label: "Clear customs", dock: "circular-quay" },
  secondary: { label: "See the weekend", dock: "cockatoo-island" },
} as const;

/**
 * The easter egg. A note nobody wants, and a bird that will take it.
 *
 * Decorative from end to end — the joke is the whole payload, so there is
 * nothing here a reader loses by never finding it.
 */
export const badIdea = {
  tag: "Bad idea",
  text: "Another to-do app. With AI.",
  hint: "drag it somewhere useful",
  eaten: "Gone. Thanks mate.",
} as const;

export const shipyard = {
  kicker: "Dock 02 — Cockatoo Island",
  headline: "The build weekend",
  subtext: "Three days, three columns, one thing shipped at the end of it.",
  /** Exact dates are unconfirmed and must render as TBC until verified. */
  dates: "TBC",
  venue: "TBC",
  columns: [
    {
      id: "friday",
      title: "Friday Night Hustle",
      time: "TBC",
      cards: [
        { title: "Doors + team forming", kind: "session", time: "TBC" },
        { title: "Cold Emailing 101", kind: "workshop", time: "TBC" },
        { title: "Pick your one user", kind: "session", time: "TBC" },
      ],
    },
    {
      id: "saturday",
      title: "Saturday Grind",
      time: "TBC",
      cards: [
        { title: "Figma Prototyping", kind: "workshop", time: "TBC" },
        { title: "Mentor floor walk", kind: "mentor", time: "TBC" },
        { title: "Ship v1 + start outreach", kind: "session", time: "TBC" },
        { title: "Landing pages that convert", kind: "workshop", time: "TBC" },
      ],
    },
    {
      id: "sunday",
      title: "Sunday Launch",
      time: "TBC",
      cards: [
        { title: "Signup push", kind: "session", time: "TBC" },
        { title: "Deck clinic", kind: "workshop", time: "TBC" },
        { title: "Demo + judging", kind: "session", time: "TBC" },
      ],
    },
  ],
  mentorsLabel: "Mentors",
  mentorsNote: "Being confirmed. Names go up as they sign on.",
  /** Populate with verified people only. Renders TBC slots while empty. */
  mentors: [] as readonly { name: string; role: string; company: string }[],
  mentorSlots: 6,
} as const;

/* The customs declaration — its fields, its cargo and its copy — lives in
   content/customs.ts, next to the form that reads it. */

export const cursorRoles = ["Tech", "Biz"] as const;
export type CursorRole = (typeof cursorRoles)[number];
