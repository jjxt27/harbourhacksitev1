import { ArrowRight, MoveHorizontal } from "lucide-react";
import { dates, dryDock, site } from "@/content/canvas";
import { Button } from "@/components/ui/Button";
import { StickyNote } from "@/components/ui/StickyNote";
import { Stamp } from "@/components/ui/Stamp";
import { HandArrow } from "@/components/art/HandArrow";
import { PixelBridge } from "@/components/art/PixelBridge";

/** Zone 1 — the argument, the criteria, and the arrow that says "keep going". */
export function DryDock() {
  return (
    <div className="relative flex h-full flex-col justify-center px-6 pb-16 pt-24 md:px-14 md:pb-10 md:pt-20">
      {/*
        Three columns, not two: the headline, then the argument, then what the
        argument produces. On a canvas you pan through rather than scroll, the
        reading order is left to right, so the case builds as you travel. Two
        columns put the whole argument in one 615px stack, which overflowed a
        595px viewport and ran under the fixed zone nav.
      */}
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.72fr)_minmax(0,0.95fr)] md:items-center md:gap-12">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-mono text-meta uppercase tracking-[0.2em] text-ink/60">
              {dryDock.kicker}
            </p>
            {/* The dates ride in the kicker row rather than taking a line of
                their own — they are a label on the zone, not a sentence. */}
            <p className="border-2 border-ink bg-harbour px-3 py-1.5 font-mono text-meta uppercase tracking-[0.18em] text-paper">
              {dates.short}
            </p>
            <Stamp>{site.city}</Stamp>
          </div>

          <h1 className="mt-6 font-display text-display font-black uppercase leading-[0.82] tracking-[-0.05em]">
            <span className="block">Don&apos;t just</span>
            <span className="block">build.</span>
            <span className="mt-1 block">
              {/* inline-block + the same leading as the heading: as a plain
                  inline, the mark's box is sized by the font's default line
                  height, which at display size overflows ~25px above its own
                  line and clips the descenders of "build." above it. */}
              <mark className="inline-block bg-highlighter px-2.5 pb-1 leading-[0.82] text-ink">
                Ship.
              </mark>
            </span>
          </h1>

          <p className="mt-6 max-w-[44ch] text-lead leading-snug">{dryDock.subtext}</p>

          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Button toZone={dryDock.cta.zone} size="lg">
              {dryDock.cta.label}
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={3} />
            </Button>
            <Button toZone={dryDock.secondary.zone} variant="paper" sharpie={false}>
              {dryDock.secondary.label}
            </Button>
          </div>
        </div>

        {/* The argument, in its own column between the promise and the proof. */}
        <div className="border-l-4 border-ink pl-4">
          <p className="font-display text-heading font-black uppercase leading-[0.95] tracking-[-0.03em]">
            {dryDock.hook.heading}
          </p>
          <p className="mt-3 text-body leading-snug text-ink/80">{dryDock.hook.body}</p>
          <p className="mt-4 font-display text-body font-black uppercase tracking-tight">
            <mark className="inline-block bg-highlighter px-1.5 text-ink">
              {dryDock.hook.turn}
            </mark>
          </p>
        </div>

        <div>
          <p className="mb-4 font-display text-small font-black uppercase tracking-[0.12em]">
            {dryDock.criteriaLabel}
          </p>
          <ul className="grid gap-4 sm:grid-cols-3 md:gap-3.5">
            {dryDock.criteria.map((item) => (
              <li key={item.n}>
                <StickyNote tone={item.tone} rotate={item.rotate} tag={item.n} className="h-full">
                  <strong className="block font-display text-body font-black uppercase leading-tight tracking-tight">
                    {item.title}
                  </strong>
                  <span className="mt-2 block text-body leading-snug">{item.note}</span>
                </StickyNote>
              </li>
            ))}
          </ul>

          <p className="mt-4 max-w-[52ch] font-mono text-meta uppercase leading-relaxed tracking-[0.1em] text-ink/70">
            {dryDock.criteriaNote}
          </p>

          <div aria-hidden="true" className="mt-8 hidden md:block">
            <HandArrow className="h-16 w-[min(26rem,100%)]" />
            <p className="mt-1 pl-2 font-hand text-lead">keep going →</p>
          </div>
        </div>
      </div>

      {/*
        Pan hint on desktop, plain scroll hint once the zones stack.

        It is pinned to the bottom-left, which on a short window is where the
        call to action has been pushed. Rather than overlap it, the hint stands
        down under 680px of height — it is an affordance, and an affordance that
        sits on top of the button it is pointing at is worse than none.
      */}
      <p className="mt-10 flex items-center gap-2 font-mono text-meta uppercase tracking-[0.18em] text-ink/60 md:absolute md:bottom-8 md:left-14 md:mt-0 md:[@media(max-height:679px)]:hidden">
        <MoveHorizontal aria-hidden="true" className="size-3.5" />
        <span className="hidden md:inline">{dryDock.scrollCue}</span>
        <span className="md:hidden">Scroll down</span>
      </p>

      {/* The bridge carries the eye into the Shipyard. */}
      <PixelBridge className="pointer-events-none absolute bottom-0 right-[-6%] hidden w-[34rem] opacity-[0.13] md:block" />
    </div>
  );
}
