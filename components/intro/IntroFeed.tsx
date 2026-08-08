"use client";

import { ArrowRight } from "lucide-react";
import { INTRO_COUNT, intro } from "@/content/intro";
import { CountUp } from "@/components/intro/CountUp";
import { PixelHarbour } from "@/components/art/PixelHarbour";
import { Dither } from "@/components/art/Dither";

/** Rows, then the wordmark block. The rail is up from the first frame. */
const STEPS = intro.tallies.length + 1;

type IntroFeedProps = {
  /** How many steps have arrived. `STEPS` means the whole plate is up. */
  step: number;
  onDismiss: () => void;
  leaving: boolean;
};

/**
 * The plate the site opens on.
 *
 * It counts in three figures the programme actually has, then offers a way in.
 * It does not dismiss itself on a timer: an intro that vanishes mid-sentence is
 * worse than one that waits, and a timer that fires while someone is still
 * reading cannot be argued with. Escape, the button and a click anywhere all
 * do the same thing.
 *
 * The backdrop is the generated drawing unless `intro.photo` is set, in which
 * case the photograph is quantised to the same six inks in the browser. Both
 * paths end up on the same screen, so the plate looks printed either way.
 */
export function IntroFeed({ step, onDismiss, leaving }: IntroFeedProps) {
  return (
    <div
      className="intro"
      data-leaving={leaving}
      onClick={onDismiss}
      aria-label="HarbourHack 2026"
    >
      <div className="intro-plate">
        {intro.photo ? (
          <Dither src={intro.photo} className="size-full object-cover" />
        ) : (
          <PixelHarbour />
        )}
      </div>

      {/* Top rail. Present immediately — it is the masthead, not a reveal. */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b-2 border-paper bg-ink px-5 py-3 md:px-10">
        <p className="font-mono text-meta uppercase tracking-[0.24em] text-paper">
          {intro.wordmark} — {intro.port}
        </p>
        <p className="font-mono text-meta uppercase tracking-[0.2em] text-apricot">
          {intro.dateStamp}
        </p>
      </div>

      {/* The art shows through here. It gets whatever height is left over. */}
      <div className="min-h-14 flex-1" />

      <div className="intro-notice relative z-10 border-t-2 border-paper bg-ink px-5 pb-6 pt-5 md:px-10 md:pb-8 md:pt-6">
        <p className="font-mono text-meta uppercase tracking-[0.22em] text-apricot">
          {intro.manifestLabel}
        </p>

        {/*
          Three across at every width. The notes are the part that goes: on a
          narrow window they push the panel over two thirds of the screen and
          the drawing behind it is what pays, so under `sm` the figures carry
          the row on their own and the notes come back when there is room.
        */}
        <ul className="mt-4 grid grid-cols-3 gap-x-4 gap-y-5 sm:gap-x-8">
          {intro.tallies.map((tally, index) => (
            <li
              key={tally.label}
              className="intro-row flex flex-col gap-1 border-l-2 border-paper/40 pl-2.5 sm:flex-row sm:items-start sm:gap-3 sm:pl-3"
              /* Arrival is driven by the parent's step counter, so a row that is
                 already up never re-animates. */
              data-shown={step > index}
            >
              <CountUp
                value={tally.value}
                pad={tally.pad}
                duration={INTRO_COUNT}
                run={step > index}
                className="text-tally font-bold leading-[0.8] text-paper"
              />
              <span className="sm:pt-1">
                <strong className="block font-display text-small font-black uppercase tracking-[0.1em] text-apricot">
                  {tally.label}
                </strong>
                <span className="mt-1 hidden max-w-[26ch] text-small leading-snug text-paper sm:block">
                  {tally.note}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div
          className="intro-row mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border-t-2 border-paper/40 pt-5"
          data-shown={step >= STEPS}
        >
          <div>
            <p className="font-display text-title font-black uppercase leading-[0.84] tracking-[-0.045em] text-paper">
              {intro.wordmark} <span className="text-ember">{intro.year}</span>
            </p>
            <p className="mt-2 max-w-[52ch] text-body leading-snug text-paper">
              {intro.tagline} {intro.standfirst}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <button
              type="button"
              onClick={onDismiss}
              className="press-inverse inline-flex items-center gap-2.5 border-2 border-paper bg-apricot px-6 py-3.5 font-display text-body font-black uppercase tracking-tight text-ink"
            >
              {intro.enter}
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={3} />
            </button>
            <p className="font-mono text-micro uppercase tracking-[0.16em] text-paper/70">
              {intro.dismissHint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { STEPS as INTRO_STEPS };
