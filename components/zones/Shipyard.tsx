import { Check, GraduationCap, MapPin, UserRound, Wrench } from "lucide-react";
import { Fragment } from "react";
import { shipyard } from "@/content/canvas";
import { Panel } from "@/components/ui/Panel";
import { Tbc } from "@/components/ui/Stamp";

/** Card kinds get a glyph and a fill, so the board is scannable at a glance. */
const KINDS = {
  workshop: { icon: GraduationCap, label: "Workshop", fill: "bg-highlighter" },
  mentor: { icon: Wrench, label: "Mentor", fill: "bg-harbour text-paper" },
  session: { icon: null, label: "Session", fill: "bg-paper" },
} as const;

type Kind = keyof typeof KINDS;

/** Zone 2 — the four days as an industrial Kanban board. */
export function Shipyard() {
  return (
    <div className="flex h-full flex-col justify-center gap-6 px-6 py-20 md:gap-7 md:px-14 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-meta uppercase tracking-[0.2em] text-ink/60">
            {shipyard.kicker}
          </p>
          <h2 className="mt-3 font-display text-title font-black uppercase leading-[0.88] tracking-[-0.045em]">
            {shipyard.headline}
          </h2>
          <p className="mt-3 max-w-[48ch] text-lead leading-snug">{shipyard.subtext}</p>
        </div>

        <dl className="flex gap-8 font-mono text-meta uppercase tracking-[0.16em]">
          <div>
            <dt className="text-ink/60">Dates</dt>
            <dd className="mt-2">{shipyard.dates}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-ink/60">
              <MapPin aria-hidden="true" className="size-3" /> Venue
            </dt>
            <dd className="mt-2">{shipyard.venue === "TBC" ? <Tbc /> : shipyard.venue}</dd>
          </div>
        </dl>
      </header>

      {/*
        Four days, with the week between drawn rather than closed up. The gap
        gets an `auto` column on desktop so it takes only the width of its rule;
        once the board stacks it becomes a labelled horizontal divider.
      */}
      <div className="grid items-start gap-5 md:grid-cols-[repeat(3,minmax(0,1fr))_auto_minmax(0,1fr)]">
        {shipyard.columns.map((column) => (
          <Fragment key={column.id}>
            <Panel
              label={`${column.day} — ${column.title}`}
              meta={column.time === "TBC" ? "Time TBC" : column.time}
              tone="off"
            >
              <p className="mb-2.5 font-display text-lead font-black uppercase leading-none tracking-[-0.02em]">
                {column.date}
              </p>
              <ul className="grid gap-3">
                {column.cards.map((card) => {
                  const kind = KINDS[card.kind as Kind] ?? KINDS.session;
                  const Icon = kind.icon;
                  return (
                    <li
                      key={card.title}
                      className={`border-2 border-ink px-3 py-2.5 shadow-hard-sm ${kind.fill}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-display text-small font-bold uppercase leading-tight tracking-tight">
                          {card.title}
                        </p>
                        {Icon ? (
                          <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
                        ) : null}
                      </div>
                      <p className="mt-2 flex items-center gap-2 font-mono text-micro uppercase tracking-[0.16em] opacity-75">
                        {kind.label}
                        <span aria-hidden="true">·</span>
                        {card.time === "TBC" ? "Time TBC" : card.time}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            {column.gapAfter ? (
              <div
                aria-hidden="true"
                className="flex items-center justify-center gap-3 py-1 md:h-full md:flex-col md:py-4"
              >
                <span className="h-0 flex-1 border-t-2 border-dashed border-ink/40 md:h-auto md:w-0 md:border-l-2 md:border-t-0" />
                <span className="whitespace-nowrap font-mono text-micro uppercase tracking-[0.18em] text-ink/60 md:[writing-mode:vertical-rl]">
                  {shipyard.gapLabel}
                </span>
                <span className="h-0 flex-1 border-t-2 border-dashed border-ink/40 md:h-auto md:w-0 md:border-l-2 md:border-t-0" />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>

      {/*
        The three closing blocks sit in one row rather than stacked. A canvas
        zone is exactly one screen tall and clips what does not fit, so vertical
        space here is a fixed budget, not something that can be scrolled into.
      */}
      <div className="grid gap-6 md:grid-cols-3">
        <section aria-labelledby="gap-note" className="border-l-4 border-ink pl-4">
          <h3
            id="gap-note"
            className="font-display text-heading font-black uppercase leading-[0.95] tracking-[-0.03em]"
          >
            {shipyard.gapNote.heading}
          </h3>
          <p className="mt-3 max-w-[52ch] text-body leading-snug text-ink/80">
            {shipyard.gapNote.body}
          </p>
        </section>

        <section aria-labelledby="takeaways">
          <h3 id="takeaways" className="font-display text-small font-black uppercase tracking-[0.14em]">
            {shipyard.takeawaysLabel}
          </h3>
          <ul className="mt-3 grid gap-2">
            {shipyard.takeaways.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-body leading-snug">
                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-harbour" strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="mentors">
          <h3 id="mentors" className="font-display text-small font-black uppercase tracking-[0.14em]">
            {shipyard.mentorsLabel}
          </h3>
          <p className="mt-1.5 font-mono text-meta uppercase tracking-[0.16em] text-ink/60">
            {shipyard.mentorsNote}
          </p>

          <ul className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-3">
            {shipyard.mentors.length > 0
              ? shipyard.mentors.map((mentor) => (
                  <li key={mentor.name} className="border-2 border-ink bg-paper p-2.5 shadow-hard-sm">
                    <p className="font-display text-small font-bold uppercase leading-tight">
                      {mentor.name}
                    </p>
                    <p className="mt-1 font-mono text-micro uppercase tracking-[0.14em] text-ink/70">
                      {mentor.role} · {mentor.company}
                    </p>
                  </li>
                ))
              : /* Empty slots, honestly labelled — never invented names. */
                Array.from({ length: shipyard.mentorSlots }, (_, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 border-2 border-dashed border-ink/40 bg-paper/50 p-2.5"
                  >
                    <UserRound aria-hidden="true" className="size-4 shrink-0 text-ink/40" strokeWidth={2.5} />
                    <Tbc />
                  </li>
                ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
