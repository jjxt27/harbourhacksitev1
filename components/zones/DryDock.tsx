import { ArrowRight } from "lucide-react";
import { dryDock, site } from "@/content/canvas";
import { Button } from "@/components/ui/Button";
import { DeckPanel } from "@/components/map/DeckPanel";
import { PaintedBlock } from "@/components/ui/Stencil";

/**
 * Dock 01 — The Rocks.
 *
 * The pitch is sprayed straight onto the concrete, at the size a sign painter
 * would use on a wharf: it is the biggest thing on the map and it lies flat in
 * the ground plane, sheared with everything else. That is what makes it read as
 * paint rather than as a headline.
 *
 * Everything a reader has to actually take in — the pitch line, the judging
 * criteria, the way on to the next dock — stands up on plates.
 */
export function DryDock() {
  return (
    <>
      {/* The headline, in the ground plane. Three lines, hand-placed rather
          than flowed, because they are paint on a surface and not a paragraph. */}
      <p
        aria-hidden="true"
        className="ground-paint stencil absolute whitespace-nowrap font-display font-black uppercase leading-[0.84] tracking-[-0.03em] text-ink opacity-[0.22]"
        style={{ left: 90, top: 150, fontSize: 172 }}
      >
        Don&apos;t just
      </p>
      <p
        aria-hidden="true"
        className="ground-paint stencil absolute whitespace-nowrap font-display font-black uppercase leading-[0.84] tracking-[-0.03em] text-ink opacity-[0.22]"
        style={{ left: 90, top: 300, fontSize: 172 }}
      >
        build.
      </p>

      {/* "Ship." is a painted deck marking rather than sprayed type: orange on
          concrete is 2.6:1 and fails even the large-text bar, but as a fill
          with ink knocked out of it, it is 5.7:1. */}
      <div className="absolute" style={{ left: 90, top: 450 }}>
        <PaintedBlock className="font-display text-[172px] font-black uppercase leading-[0.9] tracking-[-0.03em]">
          Ship.
        </PaintedBlock>
      </div>

      <h1 className="sr-only">
        {dryDock.headline.join(" ")} — {site.name} {site.year}
      </h1>

      {/* The pitch, on a board bolted to the deck. */}
      <DeckPanel x={120} y={860} width={520}>
        <p className="border-b-2 border-ink bg-ink px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-highlighter">
          {dryDock.kicker}
        </p>
        <div className="px-4 py-4">
          <p className="font-hand text-[1.15rem] leading-snug">{dryDock.subtext}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button toDock={dryDock.cta.dock} size="md">
              {dryDock.cta.label}
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={3} />
            </Button>
            <Button toDock={dryDock.secondary.dock} variant="paper" sharpie={false}>
              {dryDock.secondary.label}
            </Button>
          </div>
        </div>
      </DeckPanel>

      {/* Judged on three things — one note per criterion, pinned to the deck. */}
      <p
        aria-hidden="true"
        className="ground-paint stencil absolute whitespace-nowrap font-display font-black uppercase leading-none text-ink opacity-25"
        style={{ left: 760, top: 640, fontSize: 58 }}
      >
        {dryDock.criteriaLabel}
      </p>

      {dryDock.criteria.map((item, index) => (
        <DeckPanel
          key={item.n}
          x={760 + index * 200}
          y={880 + index * 60}
          width={250}
          className="!bg-highlighter"
        >
          <div className="px-3 py-3" style={{ rotate: `${item.rotate}deg` }}>
            <p className="border-b-2 border-ink/25 pb-1 font-mono text-[0.68rem] uppercase tracking-[0.18em]">
              {item.n}
            </p>
            <p className="mt-2 font-display text-[0.95rem] font-black uppercase leading-tight tracking-tight">
              {item.title}
            </p>
            <p className="mt-1.5 font-hand text-[0.95rem] leading-tight">{item.note}</p>
          </div>
        </DeckPanel>
      ))}
    </>
  );
}
