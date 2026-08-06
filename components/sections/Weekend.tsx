import { weekend } from "@/content/canvas";

/**
 * Chapter II — the programme.
 *
 * Three days as three columns of a timetable, not three Kanban boards. The
 * distinction is real: a Kanban column implies things move between columns, and
 * nothing here does. This is a schedule, so it is set like one — a day, a rule,
 * then rows with the time on the left and the session on the right.
 *
 * Unconfirmed times render as TBC rather than being omitted, so the shape of
 * the weekend is legible before the detail is settled.
 */
const KIND_LABEL = {
  workshop: "Workshop",
  mentor: "Mentors",
  session: "Session",
} as const;

type Kind = keyof typeof KIND_LABEL;

export function Weekend() {
  return (
    <div className="flex h-full flex-col justify-center gap-12 px-6 pb-24 pt-32 sm:px-10 md:px-14 md:pb-28 md:pt-36">
      <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[32rem]">
          <p className="eyebrow text-ivory-faint">
            {weekend.numeral} — {weekend.label}
          </p>
          <h2 className="display mt-7 text-display text-ivory">{weekend.headline}</h2>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-14">
          <p className="max-w-[34ch] font-sans text-body leading-relaxed text-ivory-dim">
            {weekend.standfirst}
          </p>
          <dl className="flex gap-10 whitespace-nowrap">
            <div>
              <dt className="font-sans text-micro font-medium uppercase tracking-[0.28em] text-ivory-faint">
                Dates
              </dt>
              <dd className="mt-2 font-display text-subhead font-semibold text-ivory">
                {weekend.dates}
              </dd>
            </div>
            <div>
              <dt className="font-sans text-micro font-medium uppercase tracking-[0.28em] text-ivory-faint">
                Venue
              </dt>
              <dd className="mt-2 font-display text-subhead font-semibold text-ivory">
                {weekend.venue}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="grid gap-x-12 gap-y-10 md:grid-cols-3">
        {weekend.columns.map((column) => (
          <div key={column.id}>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-subhead font-semibold tracking-[-0.02em] text-ivory">
                {column.title}
              </h3>
              <span className="font-sans text-micro font-medium uppercase tracking-[0.28em] text-brass">
                {column.day}
              </span>
            </div>
            <p className="mt-1.5 font-sans text-small text-ivory-faint">{column.summary}</p>

            <ul className="mt-6">
              {column.cards.map((card) => (
                <li key={card.title}>
                  <div className="hairline" />
                  <div className="grid grid-cols-[4.5rem_1fr] gap-x-4 py-4">
                    <span className="font-sans text-micro font-medium uppercase tracking-[0.2em] text-ivory-faint">
                      {card.time}
                    </span>
                    <div>
                      <p className="font-sans text-small leading-snug text-ivory">{card.title}</p>
                      <p className="mt-1 font-sans text-micro font-medium uppercase tracking-[0.2em] text-ivory-faint">
                        {KIND_LABEL[card.kind as Kind] ?? KIND_LABEL.session}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              <li aria-hidden="true">
                <div className="hairline" />
              </li>
            </ul>
          </div>
        ))}
      </div>

      <section aria-labelledby="mentors" className="max-w-[52rem]">
        <div className="hairline" />
        <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
          <h3
            id="mentors"
            className="font-display text-subhead font-semibold tracking-[-0.02em] text-ivory"
          >
            {weekend.mentorsLabel}
          </h3>
          <p className="max-w-[46ch] font-sans text-small leading-relaxed text-ivory-dim">
            {weekend.mentorsNote}
          </p>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
          {weekend.mentors.length > 0
            ? weekend.mentors.map((mentor) => (
                <li key={mentor.name}>
                  <p className="font-sans text-small text-ivory">{mentor.name}</p>
                  <p className="mt-0.5 font-sans text-micro font-medium uppercase tracking-[0.2em] text-ivory-faint">
                    {mentor.company}
                  </p>
                </li>
              ))
            : /* Honest placeholders — never invented names. */
              Array.from({ length: weekend.mentorSlots }, (_, i) => (
                <li key={i}>
                  <div className="hairline opacity-60" />
                  <p className="pt-2 font-sans text-micro font-medium uppercase tracking-[0.24em] text-ivory-faint">
                    TBC
                  </p>
                </li>
              ))}
        </ul>
      </section>
    </div>
  );
}
