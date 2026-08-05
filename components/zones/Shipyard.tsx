import { GraduationCap, MapPin, UserRound, Wrench } from "lucide-react";
import { shipyard } from "@/content/canvas";
import { Panel } from "@/components/ui/Panel";
import { Tbc } from "@/components/ui/Stamp";

/** Card kinds get a glyph and a fill, so the board is scannable at a glance. */
const KINDS = {
  workshop: { icon: GraduationCap, label: "Workshop", fill: "bg-highlighter" },
  mentor: { icon: Wrench, label: "Mentor", fill: "bg-orange text-paper" },
  session: { icon: null, label: "Session", fill: "bg-paper" },
} as const;

type Kind = keyof typeof KINDS;

/** Zone 2 — the weekend as an industrial Kanban board. */
export function Shipyard() {
  return (
    <div className="flex h-full flex-col justify-center gap-8 px-6 py-20 md:px-14 md:py-16">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-meta uppercase tracking-[0.2em] text-ink/60">
            {shipyard.kicker}
          </p>
          <h2 className="mt-4 font-display text-title font-black uppercase leading-[0.88] tracking-[-0.045em]">
            {shipyard.headline}
          </h2>
          <p className="mt-4 max-w-[48ch] text-lead leading-snug">{shipyard.subtext}</p>
        </div>

        <dl className="flex gap-8 font-mono text-meta uppercase tracking-[0.16em]">
          <div>
            <dt className="text-ink/60">Dates</dt>
            <dd className="mt-2">{shipyard.dates === "TBC" ? <Tbc /> : shipyard.dates}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-ink/60">
              <MapPin aria-hidden="true" className="size-3" /> Venue
            </dt>
            <dd className="mt-2">{shipyard.venue === "TBC" ? <Tbc /> : shipyard.venue}</dd>
          </div>
        </dl>
      </header>

      <div className="grid gap-5 md:grid-cols-3 md:gap-6">
        {shipyard.columns.map((column) => (
          <Panel
            key={column.id}
            label={column.title}
            meta={column.time === "TBC" ? "Time TBC" : column.time}
            tone="off"
          >
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
                      {Icon ? <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} /> : null}
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
        ))}
      </div>

      <section aria-labelledby="mentors" className="border-t-2 border-ink pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h3 id="mentors" className="font-display text-small font-black uppercase tracking-[0.14em]">
            {shipyard.mentorsLabel}
          </h3>
          <p className="font-mono text-meta uppercase tracking-[0.16em] text-ink/60">
            {shipyard.mentorsNote}
          </p>
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {shipyard.mentors.length > 0
            ? shipyard.mentors.map((mentor) => (
                <li key={mentor.name} className="border-2 border-ink bg-paper p-3 shadow-hard-sm">
                  <p className="font-display text-small font-bold uppercase leading-tight">{mentor.name}</p>
                  <p className="mt-1 font-mono text-micro uppercase tracking-[0.14em] text-ink/70">
                    {mentor.role} · {mentor.company}
                  </p>
                </li>
              ))
            : /* Empty slots, honestly labelled — never invented names. */
              Array.from({ length: shipyard.mentorSlots }, (_, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 border-2 border-dashed border-ink/40 bg-paper/50 p-3"
                >
                  <UserRound aria-hidden="true" className="size-4 shrink-0 text-ink/40" strokeWidth={2.5} />
                  <Tbc />
                </li>
              ))}
        </ul>
      </section>
    </div>
  );
}
