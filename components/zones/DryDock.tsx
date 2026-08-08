import { ArrowRight, MoveHorizontal } from "lucide-react";
import { dryDock, site } from "@/content/canvas";
import { Button } from "@/components/ui/Button";
import { StickyNote } from "@/components/ui/StickyNote";
import { Stamp } from "@/components/ui/Stamp";
import { HandArrow } from "@/components/art/HandArrow";
import { PixelBridge } from "@/components/art/PixelBridge";

/** Zone 1 — the pitch, the criteria, and the arrow that says "keep going". */
export function DryDock() {
  return (
    <div className="relative flex h-full flex-col justify-center px-6 pb-16 pt-24 md:px-14 md:pb-10 md:pt-20">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-14">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-mono text-meta uppercase tracking-[0.2em] text-ink/60">
              {dryDock.kicker}
            </p>
            <Stamp>{site.city}</Stamp>
          </div>

          <h1 className="mt-6 font-display text-display font-black uppercase leading-[0.82] tracking-[-0.05em]">
            <span className="block">Don&apos;t just</span>
            <span className="block">build.</span>
            <span className="mt-1 block">
              <mark className="bg-highlighter px-2.5 py-0.5 text-ink">Ship.</mark>
            </span>
          </h1>

          <p className="mt-7 max-w-[44ch] text-lead leading-snug md:text-lead">{dryDock.subtext}</p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Button toZone={dryDock.cta.zone} size="lg">
              {dryDock.cta.label}
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={3} />
            </Button>
            <Button toZone={dryDock.secondary.zone} variant="paper" sharpie={false}>
              {dryDock.secondary.label}
            </Button>
          </div>
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

          <div aria-hidden="true" className="mt-10 hidden md:block">
            <HandArrow className="h-20 w-[min(30rem,100%)]" />
            <p className="mt-1 pl-2 font-hand text-lead">keep going →</p>
          </div>
        </div>
      </div>

      {/* Pan hint on desktop, plain scroll hint once the zones stack. */}
      <p className="mt-10 flex items-center gap-2 font-mono text-meta uppercase tracking-[0.18em] text-ink/60 md:absolute md:bottom-8 md:left-14 md:mt-0">
        <MoveHorizontal aria-hidden="true" className="size-3.5" />
        <span className="hidden md:inline">{dryDock.scrollCue}</span>
        <span className="md:hidden">Scroll down</span>
      </p>

      {/* The bridge carries the eye into the Shipyard. */}
      <PixelBridge className="pointer-events-none absolute bottom-0 right-[-6%] hidden w-[34rem] opacity-[0.13] md:block" />
    </div>
  );
}
