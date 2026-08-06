import { brief, site } from "@/content/canvas";
import { ChapterLink } from "@/components/deck/DeckContext";

/**
 * Chapter I — the pitch, the premise and the criteria.
 *
 * Built on one long measure and a lot of air. The type does the work: a display
 * line at the top of the scale, a standfirst at reading size, then the criteria
 * as a numbered list separated by hairlines. No cards, no panels, no boxes —
 * a rule and an indent are enough to group three things, and a page that never
 * reaches for a container is the difference between a prospectus and a
 * dashboard.
 */
export function Brief() {
  return (
    <div className="flex h-full flex-col justify-center gap-14 px-6 pb-24 pt-32 sm:px-10 md:px-14 md:pb-28 md:pt-36 lg:flex-row lg:items-center lg:gap-24">
      <div className="max-w-[36rem] shrink-0">
        <p className="eyebrow text-ivory-faint">
          {brief.numeral} — {brief.label}
        </p>

        <h1 className="display mt-8 text-hero text-ivory">
          {brief.headline.map((line, i) => (
            <span key={line} className={i === 2 ? "block text-brass" : "block"}>
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-9 max-w-[42ch] font-sans text-lead leading-relaxed text-ivory-dim">
          {brief.standfirst}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ChapterLink
            to={brief.cta.zone}
            className="group inline-flex items-baseline gap-3 border-b border-brass pb-1 font-sans text-body font-medium text-ivory transition-colors hover:text-brass"
          >
            {brief.cta.label}
            <span
              aria-hidden="true"
              className="transition-transform duration-500 group-hover:translate-x-1"
              style={{ transitionTimingFunction: "var(--ease-out)" }}
            >
              →
            </span>
          </ChapterLink>

          <ChapterLink
            to={brief.secondary.zone}
            className="font-sans text-body text-ivory-dim transition-colors hover:text-ivory"
          >
            {brief.secondary.label}
          </ChapterLink>
        </div>

        <p className="eyebrow mt-14 hidden text-ivory-faint md:block">{brief.panHint}</p>
      </div>

      <div className="max-w-[30rem] lg:pt-6">
        <p className="font-sans text-body leading-relaxed text-ivory-dim">
          <span className="mb-2 block font-sans text-micro font-medium uppercase tracking-[0.28em] text-brass">
            {brief.premise.label}
          </span>
          {brief.premise.body}
        </p>

        <div className="mt-12">
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="font-display text-title font-semibold tracking-[-0.02em] text-ivory">
              {brief.criteriaLabel}
            </h2>
          </div>
          <p className="mt-2 font-sans text-small text-ivory-faint">{brief.criteriaNote}</p>

          <ul className="mt-8">
            {brief.criteria.map((item) => (
              <li key={item.n}>
                <div className="hairline" />
                <div className="grid grid-cols-[3rem_1fr] gap-x-4 py-5">
                  <span className="font-sans text-micro font-medium uppercase tracking-[0.28em] text-brass">
                    {item.n}
                  </span>
                  <div>
                    <h3 className="font-display text-subhead font-semibold leading-tight tracking-[-0.02em] text-ivory">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 font-sans text-small leading-relaxed text-ivory-dim">
                      {item.note}
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

        <p className="mt-10 font-sans text-small text-ivory-faint">
          {site.name} {site.year} · {site.city}
        </p>
      </div>
    </div>
  );
}
