/**
 * Public copy and program facts. Keep unresolved facts explicit.
 *
 * On voice: the harbour is the city and the name, not a costume. Keep nautical
 * language to a light touch — see the "Avoid" list in BRAND_GUIDELINES.md.
 */

export type ProgramDate = {
  label: string;
  iso: string | null;
};

const tbd = (): ProgramDate => ({ label: "TBC", iso: null });
const month = (label: string): ProgramDate => ({ label, iso: null });

export const site = {
  name: "HarbourHack",
  shortName: "HH",
  city: "Sydney",
  tagline: "Get out.",
  description:
    "A go-to-market hackathon in Sydney. Build something small, then go and put it in front of the people it is actually for.",
  url: "https://harbourhack.vercel.app",
  parentOrg: null as string | null,
  contactEmail: null as string | null,
  sponsorEmail: null as string | null,
  socials: [] as readonly { label: string; href: string }[],
} as const;

export const dates = {
  applicationsOpen: tbd(),
  applicationsClose: tbd(),
  programStart: month("October 2026"),
  demoDay: month("October 2026"),
} satisfies Record<string, ProgramDate>;

/** `date` carries the machine-readable value so the hero can emit a <time>. */
export type HeroFact = { key: string; value: string; date: ProgramDate | null };

export const heroFacts: readonly HeroFact[] = [
  { key: "City", value: site.city, date: null },
  { key: "When", value: dates.programStart.label, date: dates.programStart },
  {
    key: "Applications close",
    value: dates.applicationsClose.label,
    date: dates.applicationsClose,
  },
];

export const hero = {
  headline: "Get out.",
  /**
   * Split so the hero can set the last clause in the editorial italic without
   * the component owning any copy. `emphasis` carries its own full stop.
   */
  subline: {
    lead: "Building it is the easy half.",
    rest: "HarbourHack is the other half — getting it in front of real people and coming back with something you",
    emphasis: "learned.",
  },
  primaryCta: { label: "Apply to HH", href: "/apply" },
  scrollCue: "Scroll to follow it",
} as const;

/**
 * The three stages are the spine of the site: the scroll experience, the
 * progress rail and the chart markers all index into this array.
 *
 * `title` is the heading's words only. The arrows between them and the closing
 * full stop are accented separately, so they stay in the component.
 */
export const journey = {
  title: ["Find", "Build", "Reach"],
  closingLine: "Whatever comes back is the real brief.",
  stages: [
    {
      id: "find",
      title: "Find who it is for",
      body: "Pick the problem and the people who have it.",
      note: "One specific audience beats a broad market every time.",
    },
    {
      id: "build",
      title: "Build the smallest thing",
      body: "Make the smallest version someone can actually use.",
      note: "Working beats polished. You can tidy it up later.",
    },
    {
      id: "reach",
      title: "Reach them",
      body: "Go and get them. Watch what they do. Change what you built.",
      note: "Distribution is not the afterthought. It is the other half.",
    },
  ],
} as const;

export const audience = {
  title: "Who turns up",
  lede: "Students, grads and early builders who would rather launch something small than plan something big.",
  points: [
    "Technical and non-technical builders. Both halves of the job matter.",
    "Apply solo or bring a team.",
    "No company, funding or traction required.",
    "You need an idea and the willingness to go and talk to strangers about it.",
  ],
} as const;

export const judging = {
  title: "What we measure",
  lede:
    "Not the demo. We look at how far the thing actually got: who you reached, what they did with it, how fast you moved and how you changed course once the signal came back.",
  criteria: [
    "Reach — how you got in front of people",
    "Evidence — what real users did, not what they said",
    "Speed — ground covered in the time you had",
    "Judgement — how you changed course on the signal",
  ],
} as const;

export const finalCta = {
  title: "Nothing is proven in the building.",
  lede: "No company. No funding. No launch plan. Bring an idea and take it out to the people it is for.",
  cta: { label: "Apply to HarbourHack", href: "/apply" },
} as const;

export type Sponsor = {
  name: string;
  logo: string | null;
  href?: string;
};

export type ProgramPerson = {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  href?: string;
};

/**
 * This section stays out of the rendered site until verified details are added.
 * It gives the launch team one safe place to publish trust-building specifics.
 */
export const trust = {
  organisers: [] as readonly ProgramPerson[],
  mentors: [] as readonly ProgramPerson[],
  judges: [] as readonly ProgramPerson[],
  venue: {
    name: null as string | null,
    address: null as string | null,
    image: null as string | null,
  },
  places: null as number | null,
  weeklyCommitment: null as string | null,
  selectionDate: tbd(),
} as const;

export const sponsors = {
  list: [] as readonly Sponsor[],
  cta: {
    label: "Become a sponsor",
    href: site.sponsorEmail ? `mailto:${site.sponsorEmail}` : null,
  },
} as const;

export const nav = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Who turns up", href: "/#who-turns-up" },
  { label: "FAQ", href: "/faq" },
] as const;
