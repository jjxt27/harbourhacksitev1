/**
 * Canvas layout and copy.
 *
 * Zone widths are in viewport widths and define the whole track — the pan
 * hook, the minimap and the zone navigation all read them from here, so
 * changing a width in this file moves everything in step.
 *
 * On voice: written the way an operator talks, not the way a prospectus does.
 * Short sentences, concrete nouns, and a point of view. "Judged on three
 * things" rather than "three criteria, weighted equally" — the second is more
 * precise and nobody has ever said it out loud.
 *
 * The line it does not cross is overselling. No exclamation marks, no
 * superlatives, no invented numbers. Confidence comes from being specific.
 *
 * This file is the site's half of EOI_BRIEF.md. When a fact moves, it moves in
 * both — the brief is what gets emailed and this is what gets read.
 *
 * Unconfirmed programme facts stay visibly TBC. Never invent times, mentors,
 * venues or prizes. The dates below are confirmed; nothing else about the
 * schedule is.
 */

export type Zone = {
  id: string;
  /** Shown in the minimap and the zone navigation. */
  label: string;
  /** Track width, in viewport widths. Mobile ignores this and stacks. */
  width: number;
};

export const zones: readonly Zone[] = [
  { id: "dry-dock", label: "The Dry Dock", width: 1.6 },
  { id: "shipyard", label: "The Shipyard", width: 2.1 },
  { id: "setting-sail", label: "Setting Sail", width: 1.5 },
];

/** Total track width in viewport widths. */
export const TRACK_VW = zones.reduce((sum, zone) => sum + zone.width, 0);

export const site = {
  name: "HarbourHack",
  year: "2026",
  city: "Sydney",
  tagline: "Don't just build. Ship.",
  description:
    "HarbourHack 2026. Sydney's go-to-market hackathon, open to anyone who wants to build. Ship it across 23–25 October, then go and get real users before pitch night on the 30th.",
  url: "https://harbourhack.com",
} as const;

/**
 * The confirmed dates. Four days across two weeks — three of them consecutive
 * and the fourth a week later, which is the whole point of the format and the
 * one thing about it that needs saying twice.
 */
export const dates = {
  short: "23–25 + 30 Oct 2026",
  long: "23, 24, 25 and 30 October 2026",
  buildWeekend: "23–25 October",
  pitchNight: "Friday 30 October",
} as const;

export const dryDock = {
  kicker: "Zone 01 — The Dry Dock",
  headline: ["Don't just", "build.", "Ship."],
  /** No dates here — they are stamped in the kicker row directly above. */
  subtext: `${site.city}'s go-to-market hackathon. Open to anyone who wants to build.`,
  /** The argument, in the fewest words it survives in. */
  hook: {
    heading: "Every hackathon ends the same way",
    body: "Forty hours, a demo that works on the second attempt, a prize. On Monday the repo goes quiet and nobody opens it again. The part that would have made it real — finding someone who actually wants it — never got scored, so nobody did it.",
    turn: "So we scored it.",
  },
  scrollCue: "Scroll to pan the harbour",
  criteriaLabel: "Judged on three things. That's it.",
  /** `rotate` scatters the notes; keep it under ~4° or it reads as broken. */
  criteria: [
    {
      n: "01",
      title: "Live demo",
      note: "It has to actually run. In front of the room, no video.",
      tone: "apricot" as const,
      rotate: -2.5,
    },
    {
      n: "02",
      title: "Commercial case",
      note: "Who it's for, what they do today, and why they'd switch.",
      tone: "paper" as const,
      rotate: 1.8,
    },
    {
      n: "03",
      title: "Verified signups",
      note: "Real users who opted in. Not your group chat.",
      tone: "ember" as const,
      rotate: -1.2,
    },
  ],
  criteriaNote: "Two of the three have nothing to do with how well you code. That's deliberate.",
  cta: { label: "Get your manifest", zone: "setting-sail" },
  secondary: { label: "See the weekend", zone: "shipyard" },
} as const;

/**
 * Day cards.
 *
 * `gapAfter` marks the week between the build weekend and pitch night. It is a
 * real hole in the programme rather than a spacing decision, so the board draws
 * it instead of closing it up.
 */
export const shipyard = {
  kicker: "Zone 02 — The Shipyard",
  headline: "Four days, two weeks",
  subtext:
    "A build weekend, a week to keep selling, then a pitch night in front of the room.",
  dates: dates.long,
  /** Venue is unconfirmed and must render as TBC until it isn't. */
  venue: "TBC",
  columns: [
    {
      id: "friday",
      day: "Day one",
      title: "Kickoff",
      date: "Fri 23 Oct",
      time: "TBC",
      gapAfter: false,
      cards: [
        { title: "Doors + team forming", kind: "session", time: "TBC" },
        { title: "Cold emailing 101", kind: "workshop", time: "TBC" },
        { title: "Pick your one user", kind: "session", time: "TBC" },
      ],
    },
    {
      id: "saturday",
      day: "Day two",
      title: "Build session one",
      date: "Sat 24 Oct",
      time: "TBC",
      gapAfter: false,
      cards: [
        { title: "Figma prototyping", kind: "workshop", time: "TBC" },
        { title: "Mentor floor walk", kind: "mentor", time: "TBC" },
        { title: "Ship v1 + start outreach", kind: "session", time: "TBC" },
      ],
    },
    {
      id: "sunday",
      day: "Day three",
      title: "Build session two",
      date: "Sun 25 Oct",
      time: "TBC",
      gapAfter: true,
      cards: [
        { title: "Landing pages that convert", kind: "workshop", time: "TBC" },
        { title: "Signup push", kind: "session", time: "TBC" },
        { title: "Deck clinic", kind: "workshop", time: "TBC" },
      ],
    },
    {
      id: "pitch",
      day: "Day four",
      title: "Pitch night",
      date: "Fri 30 Oct",
      time: "TBC",
      gapAfter: false,
      cards: [
        { title: "Live demonstrations", kind: "session", time: "TBC" },
        { title: "Judging + results", kind: "session", time: "TBC" },
      ],
    },
  ],
  gapLabel: "The week between",
  gapNote: {
    heading: "The gap is the point",
    body: "A team that has only ever shown its product to a judging panel hasn't shipped anything — it has performed. Put a week between v1 and the stage and the only way to walk in with signups is to go out and get them.",
  },
  takeawaysLabel: "What you walk out with",
  takeaways: [
    "A product that runs. Not a mockup with a fake login.",
    "A case you can defend to someone who isn't your friend.",
    "Users who said yes because you asked them properly.",
    "Four workshops of the stuff nobody sits you down and teaches.",
    "A team, if you arrived without one.",
  ],
  mentorsLabel: "Mentors",
  mentorsNote: "Being confirmed. Names go up as they sign on.",
  /** Populate with verified people only. Renders TBC slots while empty. */
  mentors: [] as readonly { name: string; role: string; company: string }[],
  mentorSlots: 6,
} as const;

export const settingSail = {
  kicker: "Zone 03 — Setting Sail",
  headline: "Put your name down",
  subtext:
    "Expressions of interest are open. A name, an email, and where you're coming from — that's the whole form.",
  /**
   * The zone's job is now to hand over to `/eoi` rather than to hold the form
   * itself. A canvas you pan through is the wrong place for the one thing that
   * needs a URL somebody can paste into an email.
   */
  cta: {
    label: "Register your interest",
    href: "/eoi",
    note: "Takes a minute. You'll get the venue, times and mentors as they're confirmed.",
  },
  /** The objections, answered where someone can act on the answer. */
  questionsLabel: "Reasonable questions",
  questions: [
    {
      q: "I've never shipped anything.",
      a: "Good — that's the gap this closes. You'll ship in the first thirty-six hours whether it's ready or not, because you can't get signups for a thing nobody can use.",
    },
    {
      q: "I don't have an idea.",
      a: "Most people don't, and the ones who arrive with a precious one usually do worse. Friday night is for narrowing to a single user.",
    },
    {
      q: "I'm not technical.",
      a: "Two of the three criteria are yours. A team that can build but can't sell loses to a team that can do both.",
    },
    {
      q: "Do I need a team?",
      a: "No. Register alone, say what you're strong at, and your card goes out so people can find you before the doors open.",
    },
  ],
} as const;

/**
 * The partner block.
 *
 * A callout, not a pitch — builders are the audience on this canvas, and the
 * full argument lives in EOI_BRIEF.md, which is what gets sent to anyone who
 * asks. No audience numbers here: this is the first HarbourHack, so any figure
 * would be invented.
 */
export const partners = {
  label: "Partners",
  heading: "Early enough to shape it",
  body: "The programme isn't fixed yet, which is the useful part of coming in now. Five places a partner fits:",
  slots: [
    "Workshop slot",
    "Mentor floor",
    "Judging panel",
    "Prize category",
    "Venue",
  ],
  note: "We're not quoting attendance numbers for a first-year event. Ask and we'll walk you through the projection and the reasoning behind it.",
  /** No contact address is confirmed yet. Renders as TBC rather than a guess. */
  contact: "TBC",
  action: "Get the brief",
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
    /**
     * The one field the programme's promise depends on.
     *
     * Both briefs say a registrant gets "everything else — venue, times,
     * mentors, prizes — as it's confirmed". That is a commitment to write to
     * them later, and it cannot be kept from a name alone. It is deliberately
     * the second field rather than the last: asking for it after the playful
     * part reads as a toll on the way out.
     */
    email: {
      label: "Email",
      placeholder: "you@example.com",
      hint: "So we can send the venue, times and mentors as they're confirmed.",
    },
    role: { label: "Role", hint: "Pick the hat you'll wear most of the weekend." },
    skills: { label: "Top 2 skills", hint: `Choose up to ${MAX_SKILLS}.` },
    lookingFor: { label: "Looking for", hint: "Goes on the banner. Make it easy for people to find you." },
  },
  errors: {
    name: "Add a name before you board.",
    email: "Add an email so we can reach you.",
    emailInvalid: "That doesn't look like an email address.",
    skills: "Pick at least one skill.",
  },
  action: "Generate & board",
  actionPending: "Stamping…",
  actionDone: "Downloaded",
  reset: "Start again",
  shareHint: "Downloads a PNG. Post it in the Discord or on LinkedIn to find a team.",
  /**
   * What happens to the address, said where it is asked for rather than only in
   * a policy nobody opens. The contact for a correction or a deletion is not
   * confirmed yet, so it renders as TBC like every other unconfirmed fact.
   */
  privacy: {
    line: "We'll only email you about HarbourHack, and you can unsubscribe from any of it. Your email is never shown on your boarding pass.",
    contactLabel: "Questions about your data",
  },
  /** Registered and stored. */
  registered: "You're on the manifest.",
  /**
   * The card downloaded but the registration did not reach us. Said plainly:
   * the reader is holding a boarding pass that we have no record of, and only
   * they can act on that.
   */
  registerFailed:
    "Card downloaded, but we couldn't save your registration. Check your connection and press the button again.",
  duplicate: "You were already on the manifest — we've updated your details.",
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

/**
 * The expression of interest.
 *
 * Three fields, on a page of its own. The `manifest` object above is the fuller
 * form it will become — role, skills, looking-for and the boarding pass — held
 * back until there is a team-forming round for it to serve. Neither is a draft
 * of the other; this one collects the address, that one collects the crew.
 *
 * Keeping them apart is why the copy is duplicated rather than shared. An EOI
 * asks a stranger for a minute of their time and the manifest asks a committed
 * entrant for five, and a sentence written to do both would do neither.
 */
export const eoi = {
  kicker: "Expression of interest",
  headline: ["Get on", "the list."],
  standfirst:
    "Expressions of interest are open for HarbourHack 2026. It takes a minute, and it's not a commitment — it puts you on the list for the venue, the times, the mentors and the prizes as they're confirmed.",
  formLabel: "Your details",
  fields: {
    name: { label: "Name", placeholder: "Who's coming?" },
    email: {
      label: "Email",
      placeholder: "you@example.com",
      hint: "The only way we can send you anything. We'll confirm it straight away.",
    },
    /**
     * Not everyone answering this has an employer, and the ones who don't are
     * exactly the people the event was just opened up to. The hint says so
     * outright rather than leaving a blank box to be interpreted.
     */
    company: {
      label: "Company",
      placeholder: "Where you're coming from",
      hint: "Put “Student” if you're studying, or your own project if you're building something.",
    },
  },
  errors: {
    name: "Add a name so we know who you are.",
    email: "Add an email so we can reach you.",
    emailInvalid: "That doesn't look like an email address.",
    company: "Put something here — “Student” is a fine answer.",
  },
  action: "Register interest",
  actionPending: "Sending…",
  /** Stored. */
  done: "You're on the list.",
  doneNote: "Check your inbox — we've sent a confirmation. You'll hear from us as things are confirmed.",
  /**
   * Stored, but the confirmation did not send — a body under the same heading
   * as `doneNote`, so it does not repeat "you're on the list" back at someone
   * who has just been told that. Never blamed on the reader, and never claiming
   * an inbox we did not write to.
   */
  doneNoEmail:
    "We couldn't send your confirmation email just now — that's on us, and your place is saved regardless. You'll hear from us as things are confirmed.",
  duplicate: "You were already on the list — we've updated your details.",
  /** Nothing was saved. The only status the reader has to act on. */
  failed: "That didn't save. Check your connection and press the button again.",
  privacy: {
    line: "We'll only email you about HarbourHack, and you can unsubscribe from any of it. We don't share it with anyone, partners included.",
    contactLabel: "Questions about your data",
  },
  back: "Back to the harbour",
} as const;

export const cursorRoles = ["Tech", "Biz"] as const;
export type CursorRole = (typeof cursorRoles)[number];
