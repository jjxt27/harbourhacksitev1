/**
 * Chapter widths and copy.
 *
 * Widths are in viewport widths and define the whole deck — the pan hook, the
 * rail and the chapter navigation all read them from here, so changing a width
 * in this file moves everything in step.
 *
 * On register: this reads like a prospectus, not a flyer. Declarative
 * sentences, no exclamation, no slang, nothing oversold. The one place it is
 * allowed to be blunt is the tagline, because that is the promise.
 *
 * Unconfirmed programme facts stay visibly TBC. Never invent dates, times,
 * mentors, venues or prizes.
 */

export type Zone = {
  id: string;
  /** Roman numeral shown in the rail and the chapter navigation. */
  numeral: string;
  label: string;
  /** Deck width, in viewport widths. Mobile ignores this and stacks. */
  width: number;
};

export const zones: readonly Zone[] = [
  { id: "brief", numeral: "I", label: "The Brief", width: 1.35 },
  { id: "weekend", numeral: "II", label: "The Weekend", width: 1.75 },
  { id: "register", numeral: "III", label: "The Manifest", width: 1.3 },
];

/** Total deck width in viewport widths. */
export const TRACK_VW = zones.reduce((sum, zone) => sum + zone.width, 0);

export const site = {
  name: "HarbourHack",
  year: "2026",
  city: "Sydney",
  tagline: "Don't just build. Ship.",
  description:
    "HarbourHack 2026. Sydney's go-to-market hackathon for university students. Build it, then go and find the people who need it.",
  url: "https://harbourhack.com",
} as const;

export const brief = {
  numeral: "I",
  label: "The Brief",
  headline: ["Don't just", "build.", "Ship."],
  standfirst:
    "A three-day go-to-market hackathon for university students in Sydney. Teams leave with something running, a case for it, and users who have actually signed up.",
  premise: {
    label: "The premise",
    body: "Most student hackathons end at the demo. This one ends at distribution. You will spend as much of the weekend talking to people who might use the thing as you spend building it.",
  },
  criteriaLabel: "Judged on three criteria",
  criteriaNote: "Weighted equally. Nothing else is scored.",
  criteria: [
    {
      n: "01",
      title: "Live demonstration",
      note: "The product runs, in front of the room, without a video.",
    },
    {
      n: "02",
      title: "Commercial case",
      note: "Who it is for, what they do today, and why they would switch.",
    },
    {
      n: "03",
      title: "Verified signups",
      note: "Real users who opted in during the weekend. Not your group chat.",
    },
  ],
  cta: { label: "Register your interest", zone: "register" },
  secondary: { label: "Read the programme", zone: "weekend" },
  panHint: "Scroll to move along the deck",
} as const;

export const weekend = {
  numeral: "II",
  label: "The Weekend",
  headline: "Three days, one thing shipped",
  standfirst:
    "Friday evening to Sunday afternoon. The schedule is built so that by Saturday lunchtime you are already in front of users.",
  /** Exact dates are unconfirmed and must render as TBC until verified. */
  dates: "TBC",
  venue: "TBC",
  columns: [
    {
      id: "friday",
      day: "Day one",
      title: "Friday",
      summary: "Teams form. Scope narrows.",
      cards: [
        { title: "Doors, registration, team forming", kind: "session", time: "TBC" },
        { title: "Workshop — Cold outreach that gets replies", kind: "workshop", time: "TBC" },
        { title: "Pick one user and write them down", kind: "session", time: "TBC" },
      ],
    },
    {
      id: "saturday",
      day: "Day two",
      title: "Saturday",
      summary: "Build in the morning. Sell from lunchtime.",
      cards: [
        { title: "Workshop — Prototyping in Figma", kind: "workshop", time: "TBC" },
        { title: "Mentor floor walk", kind: "mentor", time: "TBC" },
        { title: "Ship v1 and begin outreach", kind: "session", time: "TBC" },
        { title: "Workshop — Landing pages that convert", kind: "workshop", time: "TBC" },
      ],
    },
    {
      id: "sunday",
      day: "Day three",
      title: "Sunday",
      summary: "Close the loop. Present the evidence.",
      cards: [
        { title: "Signup push", kind: "session", time: "TBC" },
        { title: "Deck clinic", kind: "workshop", time: "TBC" },
        { title: "Demonstrations and judging", kind: "session", time: "TBC" },
      ],
    },
  ],
  mentorsLabel: "Mentors",
  mentorsNote: "Operators and founders from the Sydney ecosystem. Names are published as each confirms.",
  /** Populate with verified people only. Renders TBC slots while empty. */
  mentors: [] as readonly { name: string; role: string; company: string }[],
  mentorSlots: 6,
} as const;

export const register = {
  numeral: "III",
  label: "The Manifest",
  headline: "Register your interest",
  standfirst:
    "Expressions of interest are open. Complete the manifest and we will send you a boarding pass to share, and everything else as it is confirmed.",
} as const;

export const roles = ["Tech", "Biz", "Design"] as const;
export type Role = (typeof roles)[number];

export const lookingFor = ["A developer", "A marketer", "A designer", "A full team"] as const;
export type LookingFor = (typeof lookingFor)[number];

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

/** How many skills a manifest can carry. The pass is laid out for exactly two. */
export const MAX_SKILLS = 2;

export const manifest = {
  formLabel: "Manifest details",
  cardLabel: "Your boarding pass",
  fields: {
    name: { label: "Full name", placeholder: "As you would like it printed" },
    role: { label: "Discipline", hint: "The hat you will wear for most of the weekend." },
    skills: { label: "Strengths", hint: `Select up to ${MAX_SKILLS}.` },
    lookingFor: { label: "Seeking", hint: "Printed on the pass, so teams can find you." },
  },
  errors: {
    name: "A name is required for the manifest.",
    skills: "Select at least one strength.",
  },
  action: "Issue boarding pass",
  actionPending: "Issuing",
  actionDone: "Issued",
  reset: "Start again",
  shareHint: "Downloads a PNG. Post it to find a team before the weekend.",
  card: {
    issuer: "HarbourHack",
    port: "Port of Sydney",
    stamp: "Cleared for boarding",
    manifestLabel: "Manifest no.",
    skillsLabel: "Strengths",
    roleLabel: "Discipline",
    bannerLabel: "Seeking",
    footnote: "Non-transferable. Present on arrival.",
  },
} as const;

export const cursorRoles = ["Tech", "Biz"] as const;
export type CursorRole = (typeof cursorRoles)[number];
