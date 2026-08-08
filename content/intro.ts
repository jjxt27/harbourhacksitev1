import { dates, site } from "@/content/canvas";

/**
 * The intro plate.
 *
 * A count-in, not a splash screen. Everything it counts is a fact the site
 * already states somewhere else — four days, two weeks, three criteria — and
 * the figures are derived from `dates` and the criteria list rather than typed
 * again here. If the programme changes shape, this counts the new shape.
 *
 * The rule from content/canvas.ts holds: nothing unconfirmed appears. There is
 * no countdown clock, no attendance figure and no prize total, because none of
 * those are settled and a number on a plate this size reads as a promise.
 */

export type Tally = {
  /** Counted up to. */
  value: number;
  /** Digits to pad to, so the row does not change width as it counts. */
  pad: number;
  label: string;
  note: string;
};

export const intro = {
  /**
   * The plate.
   *
   * A path under /public is quantised to the six inks and screened in the
   * browser, so the photograph comes out printed on the same press as
   * everything else rather than sitting on top of it — see
   * components/art/Dither.tsx. Set to null, the plate falls back to the
   * generated drawing in components/art/PixelHarbour.tsx.
   *
   * The file is 600px wide on purpose. The dither downsamples to 300 before it
   * quantises, so anything larger is thrown away — and the source is itself a
   * fine dot screen, which has to be averaged into smooth tone before being
   * re-screened or the two patterns fight each other.
   */
  photo: "/harbour.jpg" as string | null,

  port: "Port of Sydney",
  dateStamp: dates.short,
  manifestLabel: "Sailing notice",

  tallies: [
    { value: 4, pad: 2, label: "Days", note: dates.long },
    {
      value: 2,
      pad: 2,
      label: "Weeks",
      note: "A build weekend, then a week to go and get real users.",
    },
    {
      value: 3,
      pad: 2,
      label: "Things judged",
      note: "Live demo. Commercial case. Verified signups.",
    },
  ] as readonly Tally[],

  wordmark: site.name,
  year: site.year,
  tagline: site.tagline,
  standfirst: `${site.city}'s go-to-market hackathon for university students.`,

  enter: "Enter the harbour",
  dismissHint: "Click anywhere, or press Escape",
} as const;

/** Row cadence, in ms. Each row arrives, then its figure runs. */
export const INTRO_STEP = 460;
export const INTRO_COUNT = 820;
