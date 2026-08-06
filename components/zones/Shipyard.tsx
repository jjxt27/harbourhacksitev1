import { GraduationCap, MapPin, UserRound, Wrench } from "lucide-react";
import { shipyard } from "@/content/canvas";
import { Panel } from "@/components/ui/Panel";
import { ShippingContainer, type ContainerFill } from "@/components/ui/ShippingContainer";
import { Stencil } from "@/components/ui/Stencil";
import { Tbc } from "@/components/ui/Stamp";

/**
 * Kind decides the paint, so the yard is scannable by colour before it is
 * readable by label — which is the whole reason real containers are painted.
 */
const KINDS = {
  workshop: { icon: GraduationCap, label: "Workshop", fill: "industrial" },
  mentor: { icon: Wrench, label: "Mentor", fill: "orange" },
  session: { icon: null, label: "Session", fill: "cargo" },
} as const satisfies Record<string, { icon: unknown; label: string; fill: ContainerFill }>;

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
          <Stencil
            faded
            className="mt-4 text-title leading-[0.88] tracking-[-0.045em]"
          >
            {shipyard.headline}
          </Stencil>
          {/* On a clipboard, not floating. */}
          <p className="mt-5 max-w-[44ch] -rotate-1 border-2 border-ink bg-paper px-4 py-3 font-hand text-lead leading-snug shadow-hard-sm">
            {shipyard.subtext}
          </p>
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
        {shipyard.columns.map((column, columnIndex) => (
          <Panel
            key={column.id}
            label={column.title}
            meta={column.time === "TBC" ? "Time TBC" : column.time}
            tone="off"
          >
            {/* Extra gap: these lean, so square spacing would let corners
                touch. The stack is a yard, not a list. */}
            <ul className="grid gap-4">
              {column.cards.map((card, row) => {
                const kind = KINDS[card.kind as Kind] ?? KINDS.session;
                const Icon = kind.icon;
                return (
                  <li key={card.title}>
                    <ShippingContainer
                      label={card.title}
                      fill={kind.fill}
                      index={columnIndex * 4 + row}
                      meta={`${kind.label} · ${card.time === "TBC" ? "Time TBC" : card.time}`}
                      glyph={
                        Icon ? (
                          <Icon
                            aria-hidden="true"
                            className="relative mt-0.5 size-4 shrink-0"
                            strokeWidth={2.5}
                          />
                        ) : null
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </Panel>
        ))}
      </div>

      <section aria-labelledby="mentors" className="border-t-2 border-ink pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <Stencil as="h3" id="mentors" className="text-heading tracking-[0.06em]">
            {shipyard.mentorsLabel}
          </Stencil>
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
