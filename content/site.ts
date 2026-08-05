/** Public copy and program facts. Keep unresolved facts explicit. */

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
  tagline: "Ship out.",
  description:
    "A go-to-market hackathon in Sydney. Build something small, put it in the water and go find the people who will actually use it.",
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
  { key: "Port", value: site.city, date: null },
  { key: "Sails", value: dates.programStart.label, date: dates.programStart },
  {
    key: "Applications close",
    value: dates.applicationsClose.label,
    date: dates.applicationsClose,
  },
];

export const hero = {
  headline: "Ship out.",
  /**
   * Split so the hero can set the last clause in the editorial italic without
   * the component owning any copy. `emphasis` carries its own full stop.
   */
  subline: {
    lead: "Building it is half the crossing.",
    rest: "HarbourHack is the other half — getting it in front of real people and coming back with something you",
    emphasis: "learned.",
  },
  primaryCta: { label: "Apply to HH", href: "/apply" },
  scrollCue: "Scroll to cast off",
} as const;

/**
 * The three stages are the spine of the site: the scroll experience, the
 * progress rail and the chart markers all index into this array.
 *
 * `title` is the heading's words only. The arrows between them and the closing
 * full stop are accented separately, so they stay in the component.
 */
export const journey = {
  title: ["Chart", "Launch", "Land"],
  closingLine: "Whatever comes back is the real brief.",
  stages: [
    {
      id: "chart",
      title: "Chart the route",
      body: "Pick the problem and the people who have it.",
      note: "One specific audience beats a broad market every time.",
    },
    {
      id: "launch",
      title: "Put it in the water",
      body: "Build the smallest version someone can actually use.",
      note: "Working beats polished. You can sand it down later.",
    },
    {
      id: "land",
      title: "Land the first users",
      body: "Go and get them. Watch what they do. Steer from there.",
      note: "Distribution is not the afterthought. It is the other half.",
    },
  ],
} as const;

export const audience = {
  title: "Who ships out",
  lede: "Students, grads and early builders who would rather launch something small than plan something big.",
  points: [
    "Technical and non-technical builders. Both halves of a crossing matter.",
    "Apply solo or bring a crew.",
    "No company, funding or traction required.",
    "You need an idea and the willingness to go and talk to strangers about it.",
  ],
} as const;

export const judging = {
  title: "What we measure",
  lede:
    "Not the demo. We look at how far the thing actually travelled: who you reached, what they did with it, how fast you moved and how you steered once the signal came back.",
  criteria: [
    "Reach — how you got in front of people",
    "Evidence — what real users did, not what they said",
    "Speed — distance covered in the time you had",
    "Judgement — how you steered on the signal",
  ],
} as const;

export const finalCta = {
  title: "Nothing is proven inside the harbour.",
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
  { label: "The route", href: "/#how-it-works" },
  { label: "Who ships out", href: "/#who-ships-out" },
  { label: "FAQ", href: "/faq" },
] as const;
