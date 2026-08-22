import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { site } from "@/content/canvas";
import {
  CableFieldMark,
  COATHANGER_RATIO,
  COUNTER_ARCH_RATIO,
  CounterArchStudy,
  IconMark,
  PlateMark,
  SPAN_MARK_RATIO,
  SpanMark,
  TrussMark,
  WaterlineMark,
  WideStanceMark,
} from "@/components/art/BridgeMarks";

export const metadata: Metadata = {
  title: "Logo studies",
  description: "HH as the Coathanger — eight calligram studies.",
  // A working sheet, not a page of the site. It should never turn up in a
  // search result for the event.
  robots: { index: false, follow: false },
};

/*
 * The copy lives here rather than in `content/canvas.ts` on purpose: that file
 * is the canvas's half of EOI_BRIEF.md and everything in it is a fact about
 * the programme that has to stay in step with the brief. None of this is —
 * it is notes on a drawing, and it belongs beside the drawing.
 */

type Study = {
  n: string;
  name: string;
  reads: string;
  mark: React.ReactNode;
  /** The same mark, small, for the size ladder. */
  small: React.ReactNode;
  /**
   * The mark on an ink ground. Single-ink marks reverse by inheriting
   * `currentColor`; the two-ink ones need their inks swapped rather than
   * inverted, so they hand back a different node.
   */
  reversed: React.ReactNode;
  /** Aspect of the mark's viewBox, so the ladder does not distort it. */
  ratio: number;
  note: string;
  works: string;
  costs: string;
};

const studies: readonly Study[] = [
  {
    n: "01",
    name: "Wide Stance",
    reads: "Letters first",
    mark: <WideStanceMark className="w-full" />,
    small: <WideStanceMark className="w-full" />,
    reversed: <WideStanceMark className="w-full" />,
    ratio: 240 / 132,
    note: "HH at ordinary letterspacing with the bridge thrown over the top of it. The arch springs from its own pylons outside the word and the deck runs past them as the approach spans.",
    works: "The letters survive at any size, and it is the only one here that can sit beside the written wordmark without competing with it.",
    costs: "Not really a calligram — take the arch away and HH is untouched. The tight letterspace also leaves room for only five hangers, so less of the span reads as bridge.",
  },
  {
    n: "02",
    name: "The Span",
    reads: "Balanced — the one to beat",
    mark: <SpanMark className="w-full" />,
    small: <SpanMark className="w-full" />,
    reversed: <SpanMark className="w-full" />,
    ratio: 240 / 132,
    note: "The letterspace is the span. Four stems become two pairs of pylons, the crossbars run into one continuous deck, and the arch springs from the centre of each outer pylon at deck level.",
    works: "Bridge on the first look, HH on the second — which is the whole job. Two rules keep the letters alive: no hangers inside a counter, and a crossbar heavier than the roadway it joins, so the deck visibly swells at each pylon pair. The first draft had neither and read as a fence.",
    costs: "It rests on one ratio — the 29-unit counter against the 86-unit letterspace. Close that and the grouping goes. A wide mark that will always want a wide slot.",
  },
  {
    n: "03",
    name: "The Cable Field",
    reads: "Picture first",
    mark: <CableFieldMark className="w-full" />,
    small: <CableFieldMark className="w-full" />,
    reversed: <CableFieldMark className="w-full" ground="ink" />,
    ratio: 240 / 132,
    note: "The letters are not drawn at all. A hanger that falls inside the letterform is inked and fat, one outside it is hairline and blue, and HH appears as a change in density across the cable field.",
    works: "It is the branch's own rule about tone — a value between two inks is one screened over the other — applied to a logo rather than to a picture.",
    costs: "Needs both inks to say anything at all, so it will not emboss, engrave or fax. Reversing it is not an inversion either: on ink the hairlines have to move from harbour to apricot, because harbour on navy-black is 1.7:1.",
  },
  {
    n: "04",
    name: "The Truss",
    reads: "Balanced, close up",
    mark: <TrussMark className="w-full" idPrefix="sheet-truss" />,
    small: <TrussMark className="w-full" idPrefix="sheet-truss-sm" />,
    reversed: <TrussMark className="w-full" idPrefix="sheet-truss-rev" />,
    ratio: 240 / 132,
    note: "The Span again, but the letters are hollow and packed with lattice and the arch gets the two chords and the zigzag web it actually has. A close-up of the bridge rather than a silhouette of it.",
    works: "Gives the mark something to do at poster size — a t-shirt back, the stage banner, the 2000px header.",
    costs: "Silts up into grey below about 120px. It is a display lock-up, not the mark.",
  },
  {
    n: "05",
    name: "The Plate",
    reads: "Balanced, printed",
    mark: <PlateMark className="w-full" idPrefix="sheet-plate" />,
    small: <PlateMark className="w-full" idPrefix="sheet-plate-sm" />,
    reversed: <PlateMark className="w-full" idPrefix="sheet-plate-rev" ground="ink" />,
    ratio: 120 / 66,
    note: "The Span rasterised onto the same coarse grid the intro drawing uses, then pulled twice — ember first, ink over the top and a cell off register.",
    works: "The only one that ties the logo to the plate the site already opens on. The misregistration is what a two-plate riso actually does.",
    costs: "Two plates, and the key plate has to swap rather than invert when it reverses. The stair steps also fight anything that resamples them, so it wants exact pixel sizes.",
  },
  {
    n: "06",
    name: "The Waterline",
    reads: "Balanced, with the harbour",
    mark: <WaterlineMark className="w-full" idPrefix="sheet-water" />,
    small: <WaterlineMark className="w-full" idPrefix="sheet-water-sm" />,
    reversed: <WaterlineMark className="w-full" idPrefix="sheet-water-rev" ground="ink" />,
    ratio: 240 / 176,
    note: "The deck becomes the waterline and everything above it is mirrored below in apricot, broken by chop so the reflection reads as water rather than as a second bridge.",
    works: "Arch plus reflected arch closes into a lens, which gives the wordmark a container without anyone drawing a badge around it.",
    costs: "Nearly square, so it is a different shape from the rest of the family. The reflection is decorative and drops whole.",
  },
];

function Ladder({ children, ratio }: { children: React.ReactNode; ratio: number }) {
  return (
    <div className="flex flex-wrap items-end gap-5 border-t-2 border-ink bg-paper-off px-5 py-4">
      {[96, 48, 24, 16].map((height) => (
        <div key={height} className="flex flex-col items-center gap-2">
          <div style={{ width: height * ratio, height }} className="text-ink">
            {children}
          </div>
          <span className="tally text-micro uppercase tracking-[0.14em] text-slate">{height}px</span>
        </div>
      ))}
    </div>
  );
}

function Card({ study }: { study: Study }) {
  return (
    <section className="border-2 border-ink bg-paper shadow-hard-lg">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-ink bg-ink px-5 py-3">
        <h2 className="font-display text-heading font-black uppercase leading-none tracking-tight text-paper">
          <span className="tally mr-3 text-meta font-normal tracking-[0.2em] text-apricot">
            {study.n}
          </span>
          {study.name}
        </h2>
        <p className="font-mono text-meta uppercase tracking-[0.2em] text-apricot">{study.reads}</p>
      </header>

      <div className="px-5 py-8 text-ink sm:px-10 sm:py-10">
        <div className="mx-auto max-w-[34rem]">{study.mark}</div>
      </div>

      <Ladder ratio={study.ratio}>{study.small}</Ladder>

      {/* Reversed. A mark that only works one way round is half a mark. */}
      <div className="flex items-center justify-center border-t-2 border-ink bg-ink px-5 py-8 text-paper">
        <div className="w-full max-w-[22rem]">{study.reversed}</div>
      </div>

      <dl className="grid gap-x-8 gap-y-4 border-t-2 border-ink px-5 py-6 sm:grid-cols-3 sm:px-10">
        <div className="sm:col-span-3">
          <dt className="font-mono text-micro uppercase tracking-[0.18em] text-slate">What it is</dt>
          <dd className="mt-1.5 max-w-[70ch] text-body leading-snug">{study.note}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-mono text-micro uppercase tracking-[0.18em] text-harbour">Works</dt>
          <dd className="mt-1.5 text-small leading-snug">{study.works}</dd>
        </div>
        <div>
          <dt className="font-mono text-micro uppercase tracking-[0.18em] text-alert">Costs</dt>
          <dd className="mt-1.5 text-small leading-snug">{study.costs}</dd>
        </div>
      </dl>
    </section>
  );
}

export default function LogoPage() {
  return (
    <>
      <div className="ground" aria-hidden="true">
        <div className="ground-screen screen-dots" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-[64rem] flex-col px-5 py-10 sm:px-8 sm:py-14">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="press inline-flex items-center border-2 border-ink bg-ink px-3 py-2 font-display text-small font-black uppercase tracking-tight text-paper"
          >
            {site.name}
            <span className="ml-2 font-mono text-meta font-normal tracking-[0.14em] text-apricot">
              {site.year}
            </span>
          </Link>
          <p className="font-mono text-meta uppercase tracking-[0.2em] text-slate">
            Logo studies · not for release
          </p>
        </header>

        <div className="mt-12 sm:mt-16">
          <p className="font-mono text-meta uppercase tracking-[0.2em] text-slate">
            HH ⇄ the Coathanger
          </p>
          <h1 className="mt-3 font-display text-title font-black uppercase leading-[0.88] tracking-[-0.045em]">
            <span className="block">Six marks,</span>
            <span className="block">one argument</span>
          </h1>
          <p className="mt-5 max-w-[58ch] text-lead leading-snug">
            How far can HH be pushed toward the bridge before it stops being letters? Every mark
            below answers that differently. They are ordered from letters-first to picture-first,
            and the second one is the one to beat.
          </p>
        </div>

        {/* The constraint first. It decides the shape of everything after it. */}
        <section className="mt-12 border-2 border-ink bg-apricot shadow-hard-lg sm:mt-16">
          <header className="border-b-2 border-ink px-5 py-3 sm:px-10">
            <h2 className="font-display text-heading font-black uppercase leading-none tracking-tight text-ink">
              The proportion that decides it
            </h2>
          </header>
          <div className="grid gap-8 px-5 py-8 sm:grid-cols-[1fr_auto] sm:items-center sm:px-10">
            <div>
              <p className="max-w-[60ch] text-body leading-snug text-ink">
                The Coathanger&rsquo;s arch rises 134m over a 503m span — a ratio of{" "}
                <strong className="tally">{COATHANGER_RATIO}</strong>. Push much past 0.45 and it
                stops reading as that bridge and starts reading as a rainbow.
              </p>
              <p className="mt-4 max-w-[60ch] text-body leading-snug text-ink">
                An <strong>H</strong> is about as tall as it is wide, and its counter is taller than
                it is wide. Fit an arch inside one counter — the first idea everybody has, drawn to
                the right — and the ratio comes out at{" "}
                <strong className="tally">{COUNTER_ARCH_RATIO}</strong>. A croquet hoop. Widen the H
                until the ratio is right and the letter is three times as wide as it is tall, which
                is no longer an H either.
              </p>
              <p className="mt-4 max-w-[60ch] text-body leading-snug text-ink">
                So the arch has to span <em>both</em> letters, and the letterspace has to carry it.
                Every mark below is a consequence of that. The Span comes out at{" "}
                <strong className="tally">{SPAN_MARK_RATIO}</strong>.
              </p>
            </div>
            <figure className="w-full max-w-[16rem] justify-self-center text-ink">
              <CounterArchStudy className="w-full" />
              <figcaption className="mt-2 border-t-2 border-ink pt-2 text-center font-mono text-micro uppercase tracking-[0.16em] text-ink/70">
                Rejected · ratio {COUNTER_ARCH_RATIO}
              </figcaption>
            </figure>
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-12 sm:mt-16 sm:gap-16">
          {studies.map((study) => (
            <Card key={study.n} study={study} />
          ))}
        </div>

        {/* The square case, which none of the wide marks solves on its own. */}
        <section className="mt-12 border-2 border-ink bg-paper shadow-hard-lg sm:mt-16">
          <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-ink bg-ink px-5 py-3">
            <h2 className="font-display text-heading font-black uppercase leading-none tracking-tight text-paper">
              <span className="tally mr-3 text-meta font-normal tracking-[0.2em] text-apricot">
                07
              </span>
              The square
            </h2>
            <p className="font-mono text-meta uppercase tracking-[0.2em] text-apricot">
              Avatar · favicon · app tile
            </p>
          </header>
          <div className="grid gap-8 px-5 py-8 sm:grid-cols-2 sm:px-10">
            <figure>
              <IconMark className="w-full max-w-[15rem]" />
              <figcaption className="mt-3 max-w-[40ch] text-small leading-snug">
                <strong className="font-black uppercase tracking-tight">Large.</strong> A 3:1 bridge
                does not fit a 1:1 tile, so the square version shortens the pylons rather than the
                span — the letters lose height above the deck until the arch clears their tops.
              </figcaption>
            </figure>
            <figure>
              <IconMark className="w-full max-w-[15rem]" size="small" />
              <figcaption className="mt-3 max-w-[40ch] text-small leading-snug">
                <strong className="font-black uppercase tracking-tight">Small, under 48px.</strong>{" "}
                The arch and the hangers silt up, so they go. What is left is what the favicon
                already has — HH, the plate, the ember rule.
              </figcaption>
            </figure>
          </div>
          <div className="flex flex-wrap items-end gap-6 border-t-2 border-ink bg-paper-off px-5 py-5 sm:px-10">
            {[64, 48, 32, 16].map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <div style={{ width: size, height: size }}>
                  <IconMark className="w-full" size={size >= 48 ? "large" : "small"} />
                </div>
                <span className="tally text-micro uppercase tracking-[0.14em] text-slate">
                  {size}px
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* One lockup, so the mark is judged next to the name it has to sit with. */}
        <section className="mt-12 border-2 border-ink bg-ink px-5 py-10 shadow-hard-lg sm:mt-16 sm:px-10 sm:py-14">
          <p className="font-mono text-meta uppercase tracking-[0.2em] text-apricot">
            Lockup · The Span
          </p>
          <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
            <SpanMark className="w-full max-w-[16rem] shrink-0 text-paper" />
            <div className="border-l-0 border-t-2 border-paper pt-5 sm:border-l-2 sm:border-t-0 sm:pl-10 sm:pt-0">
              <p className="font-display text-title font-black uppercase leading-[0.85] tracking-[-0.05em] text-paper">
                Harbour
                <br />
                Hack
              </p>
              <p className="mt-3 font-mono text-meta uppercase tracking-[0.22em] text-apricot">
                {site.city} · {site.year}
              </p>
            </div>
          </div>
        </section>

        <p className="mt-12 sm:mt-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-b-2 border-ink pb-0.5 font-mono text-meta uppercase tracking-[0.14em]"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" strokeWidth={3} />
            Back to the canvas
          </Link>
        </p>
      </main>
    </>
  );
}
