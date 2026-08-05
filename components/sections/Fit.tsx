import { audience, judging } from "@/content/site";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

export function Fit() {
  return (
    <section id="who-ships-out" className="hh-criteria scroll-mt-20 border-t border-hairline">
      <Container>
        <div className="hh-criteria-grid">
          <Reveal variant="fade" className="hh-criteria-panel">
            <p className="font-mono text-label uppercase text-tide">01 / Who comes aboard</p>
            <h2 className="mt-6 max-w-[10ch] font-display text-display-1 font-semibold uppercase">
              {audience.title}<span className="text-tide">.</span>
            </h2>
            <p className="mt-8 max-w-[30ch] text-lead text-ink-70">{audience.lede}</p>
            <ul className="mt-12 border-t border-hairline">
              {audience.points.map((point) => (
                <li key={point} className="group flex items-start gap-4 border-b border-hairline py-5 text-body text-ink-70">
                  <span aria-hidden="true" className="mt-[0.45em] size-2 shrink-0 rounded-full border border-ink-muted transition-colors group-hover:border-tide group-hover:bg-tide" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100} variant="fade" className="hh-criteria-panel hh-criteria-panel-right">
            <p className="font-mono text-label uppercase text-beacon">02 / How far it travelled</p>
            <h2 className="mt-6 max-w-[10ch] font-display text-display-1 font-semibold uppercase">
              {judging.title}<span className="text-beacon">.</span>
            </h2>
            <p className="mt-8 max-w-[34ch] text-lead text-ink-70">{judging.lede}</p>
            <ul className="mt-12 border-t border-hairline">
              {judging.criteria.map((criterion, index) => {
                const [term, detail] = criterion.split(" — ");
                return (
                  <li key={criterion} className="group flex items-baseline gap-5 border-b border-hairline py-5">
                    <span className="font-mono text-label text-ink-muted">0{index + 1}</span>
                    <span className="transition-transform group-hover:translate-x-2">
                      <strong className="font-display text-body font-semibold uppercase text-ink">{term}</strong>
                      {detail ? <span className="ml-3 text-body-sm text-ink-70">{detail}</span> : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
