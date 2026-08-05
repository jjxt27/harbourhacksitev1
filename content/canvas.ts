/**
 * Canvas layout and copy.
 *
 * Zone widths are in viewport widths and define the whole track — the pan
 * hook, the minimap and the zone navigation all read them from here, so
 * changing a width in this file moves everything in step.
 *
 * Unconfirmed programme facts stay visibly TBC. Never invent dates, times,
 * mentors, venues or prizes.
 */

export type Zone = {
  id: string;
  /** Shown in the minimap and the zone navigation. */
  label: string;
  /** Track width, in viewport widths. Mobile ignores this and stacks. */
  width: number;
};

export const zones: readonly Zone[] = [
  { id: "dry-dock", label: "The Dry Dock", width: 1.2 },
  { id: "shipyard", label: "The Shipyard", width: 1.65 },
  { id: "setting-sail", label: "Setting Sail", width: 1.15 },
];

/** Total track width in viewport widths. */
export const TRACK_VW = zones.reduce((sum, zone) => sum + zone.width, 0);

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
  kicker: "Zone 01 — The Dry Dock",
  headline: ["Don't just", "build.", "Ship."],
  subtext: `HarbourHack ${site.year}. ${site.city}'s premier GTM hackathon for university students.`,
  scrollCue: "Scroll to pan the harbour",
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
  cta: { label: "Get your manifest", zone: "setting-sail" },
  secondary: { label: "See the weekend", zone: "shipyard" },
} as const;

export const shipyard = {
  kicker: "Zone 02 — The Shipyard",
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

export const settingSail = {
  kicker: "Zone 03 — Setting Sail",
  headline: "Get your manifest",
  subtext:
    "Fill this in and we'll generate your crew card. Share it, find a team, board the ship.",
} as const;

export const roles = ["Tech", "Biz", "Design"] as const;
export type Role = (typeof roles)[number];

export const lookingFor = ["A Dev", "A Marketer", "A Designer", "Full Team"] as const;
export type LookingFor = (typeof lookingFor)[number];

/** Grouped so the picker reads as a board rather than one long list. */
export const skills = [
  "React",
  "Next.js",
  "Python",
  "Swift",
  "Figma",
  "Design systems",
  "Motion",
  "Cold outreach",
  "Sales",
  "SEO",
  "Paid ads",
  "Copywriting",
  "Video",
  "Data",
] as const;
export type Skill = (typeof skills)[number];

/** How many skills a manifest can carry. The card is laid out for exactly two. */
export const MAX_SKILLS = 2;

export const manifest = {
  formLabel: "Manifest details",
  cardLabel: "Live preview",
  fields: {
    name: { label: "Name", placeholder: "Who's boarding?" },
    role: { label: "Role", hint: "Pick the hat you'll wear most of the weekend." },
    skills: { label: "Top 2 skills", hint: `Choose up to ${MAX_SKILLS}.` },
    lookingFor: { label: "Looking for", hint: "Goes on the banner. Make it easy for people to find you." },
  },
  errors: {
    name: "Add a name before you board.",
    skills: "Pick at least one skill.",
  },
  action: "Generate & board",
  actionPending: "Stamping…",
  actionDone: "Downloaded",
  reset: "Start again",
  shareHint: "Downloads a PNG. Post it in the Discord or on LinkedIn to find a team.",
  card: {
    issuer: "HarbourHack",
    port: "Port of Sydney",
    stamp: "Cleared for boarding",
    manifestLabel: "Manifest no.",
    skillsLabel: "Cargo",
    roleLabel: "Class",
    bannerLabel: "Looking for",
    footnote: "Non-transferable. Present at the dock.",
  },
} as const;

export const cursorRoles = ["Tech", "Biz"] as const;
export type CursorRole = (typeof cursorRoles)[number];
