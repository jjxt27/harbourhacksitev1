/**
 * Programme facts and metadata.
 *
 * Unconfirmed facts stay visibly `TBC`. Do not invent dates, costs, prizes,
 * mentors, venues or numbers — an unanswered question is more trustworthy than
 * a placeholder that reads as real.
 */

export type ProgramDate = {
  label: string;
  iso: string | null;
};

const tbc = (): ProgramDate => ({ label: "TBC", iso: null });
const month = (label: string): ProgramDate => ({ label, iso: null });

export const site = {
  name: "HarbourHack",
  city: "Sydney",
  tagline: "Nobody is going to find it on their own.",
  description:
    "A go-to-market hackathon in Sydney. Pick one real person, build the smallest thing they could use, and go and put it in their hands.",
  url: "https://harbourhack.vercel.app",
  contactEmail: null as string | null,
  sponsorEmail: null as string | null,
} as const;

export const dates = {
  applicationsOpen: tbc(),
  applicationsClose: tbc(),
  programStart: month("October 2026"),
  demoDay: month("October 2026"),
} satisfies Record<string, ProgramDate>;

export type Fact = { key: string; value: string; date: ProgramDate | null };

/** Rendered as the attachment on the second message group. */
export const facts: readonly Fact[] = [
  { key: "Where", value: site.city, date: null },
  { key: "When", value: dates.programStart.label, date: dates.programStart },
  { key: "Applications", value: dates.applicationsClose.label, date: dates.applicationsClose },
];

export const keyDates = [
  { label: "Applications open", value: dates.applicationsOpen },
  { label: "Applications close", value: dates.applicationsClose },
  { label: "Programme starts", value: dates.programStart },
  { label: "Demo Day", value: dates.demoDay },
] as const;
