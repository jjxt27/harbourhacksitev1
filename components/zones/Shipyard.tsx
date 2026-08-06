import { MapPin, UserRound } from "lucide-react";
import type { CSSProperties } from "react";
import { shipyard } from "@/content/canvas";
import { ShippingContainer, CRATE, type ContainerFill } from "@/components/ui/ShippingContainer";
import { DeckPanel } from "@/components/map/DeckPanel";
import { Tbc } from "@/components/ui/Stamp";

/**
 * Kind decides the paint, so the yard is scannable by colour before it is
 * readable by label — which is the whole reason real containers are painted.
 */
const KINDS = {
  workshop: { label: "Workshop", fill: "industrial" },
  mentor: { label: "Mentor", fill: "orange" },
  session: { label: "Session", fill: "cargo" },
} as const satisfies Record<string, { label: string; fill: ContainerFill }>;

type Kind = keyof typeof KINDS;

/** Where each day's stack starts, in dock-local world units. */
const BAY_X = [140, 700, 1260];
const BAY_Y = 340;
/**
 * Gap between boxes down a stack.
 *
 * Set by the signs, not the boxes. The tilt compresses vertical distance to
 * about a third — 230 world units apart is only ~80px apart on screen — so a
 * pitch that looks generous on the ground is barely enough to stop two standing
 * plates from covering each other.
 */
const PITCH = 230;
/** The mentors' row, below the last bay. */
const BERTH = { y: 1270, width: 240, height: 96, pitch: 270, x: 140 };

/**
 * Dock 02 — Cockatoo Island, as a container yard.
 *
 * Three bays, one per day, each a stack of boxes dropped by a crane. Nothing
 * here is laid out by flow: every container is at a coordinate on the concrete,
 * and the day it belongs to is which bay it is standing in.
 *
 * The readable copy stands up on plates. Cargo lies in the ground plane, where
 * the map shears it — fine for a painted serial, fatal for a session title —
 * so the title and time are on a sign above the box rather than on its lid.
 */
export function Shipyard() {
  return (
    <>
      {shipyard.columns.map((column, bay) => (
        <div key={column.id} className="contents">
          {/* The bay's day, painted on the deck at its head. */}
          <p
            aria-hidden="true"
            className="ground-paint stencil absolute whitespace-nowrap font-display font-black uppercase leading-none text-ink opacity-25"
            style={
              {
                left: BAY_X[bay],
                top: BAY_Y - 190,
                fontSize: 62,
                width: 520,
              } as CSSProperties
            }
          >
            {column.title}
          </p>

          {column.cards.map((card, row) => {
            const kind = KINDS[card.kind as Kind] ?? KINDS.session;
            const x = BAY_X[bay];
            const y = BAY_Y + row * PITCH;
            return (
              <div key={card.title} className="contents">
                <ShippingContainer
                  label={card.title}
                  fill={kind.fill}
                  meta={kind.label}
                  x={x}
                  y={y}
                  index={bay * 4 + row}
                />
                {/* The sign over the box. Anchored at the box's near corner and
                    lifted clear of its lid. */}
                <DeckPanel x={x + 18} y={y + CRATE.depth} width={330}>
                  <p className="border-b-2 border-ink bg-ink px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-highlighter">
                    {kind.label} · {card.time === "TBC" ? "Time TBC" : card.time}
                  </p>
                  <p className="px-3 py-2 font-display text-[0.95rem] font-black uppercase leading-tight tracking-tight">
                    {card.title}
                  </p>
                </DeckPanel>
              </div>
            );
          })}
        </div>
      ))}

      {/* The yard office: what the weekend is, and what is still unconfirmed. */}
      <DeckPanel x={140} y={260} width={430}>
        <p className="border-b-2 border-ink bg-ink px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-highlighter">
          {shipyard.kicker}
        </p>
        <div className="px-3 py-3">
          <p className="font-display text-[1.35rem] font-black uppercase leading-none tracking-[-0.03em]">
            {shipyard.headline}
          </p>
          <p className="mt-2 font-hand text-[0.95rem] leading-snug">{shipyard.subtext}</p>
          <dl className="mt-3 flex gap-6 font-mono text-[0.68rem] uppercase tracking-[0.14em]">
            <div>
              <dt className="text-slate">Dates</dt>
              <dd className="mt-1">{shipyard.dates === "TBC" ? <Tbc /> : shipyard.dates}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-slate">
                <MapPin aria-hidden="true" className="size-3" /> Venue
              </dt>
              <dd className="mt-1">{shipyard.venue === "TBC" ? <Tbc /> : shipyard.venue}</dd>
            </div>
          </dl>
        </div>
      </DeckPanel>

      {/* Mentors: empty berths painted on the deck, and one plate saying why. */}
      <p
        aria-hidden="true"
        className="ground-paint stencil absolute whitespace-nowrap font-display font-black uppercase leading-none text-ink opacity-25"
        style={{ left: BERTH.x, top: BERTH.y - 74, fontSize: 58 }}
      >
        {shipyard.mentorsLabel}
      </p>

      {shipyard.mentors.length > 0
        ? shipyard.mentors.map((mentor, index) => (
            <ShippingContainer
              key={mentor.name}
              label={mentor.name}
              fill="cargo"
              meta={mentor.company}
              x={BERTH.x + index * BERTH.pitch}
              y={BERTH.y}
              index={index + 9}
            />
          ))
        : Array.from({ length: shipyard.mentorSlots }, (_, i) => (
            <div
              key={i}
              className="berth absolute border-2 border-dashed border-ink/45"
              style={{
                left: BERTH.x + i * BERTH.pitch,
                top: BERTH.y,
                width: BERTH.width,
                height: BERTH.height,
              }}
            >
              {/* Corner castings, with no container in them. */}
              {["left-0 top-0", "right-0 top-0", "bottom-0 left-0", "bottom-0 right-0"].map(
                (corner) => (
                  <span key={corner} aria-hidden="true" className={`absolute ${corner} size-3 bg-ink/45`} />
                ),
              )}
            </div>
          ))}

      <DeckPanel x={1560} y={BERTH.y + BERTH.height} width={300}>
        <p className="flex items-center gap-2 px-3 py-2 font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.12em]">
          <UserRound aria-hidden="true" className="size-4 shrink-0 text-slate" strokeWidth={2.5} />
          {shipyard.mentorsNote}
        </p>
      </DeckPanel>
    </>
  );
}
