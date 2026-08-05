import { dates, finalCta } from "@/content/site";
import { Button, Container } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

const KEY_DATES = [
  { label: "Applications open", value: dates.applicationsOpen },
  { label: "Applications close", value: dates.applicationsClose },
  { label: "Program starts", value: dates.programStart },
  { label: "Demo Day", value: dates.demoDay },
] as const;

export function FinalCta() {
  return (
    <section id="join" className="hh-final relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="hh-final-object"><span /><span /><span /><span /></div>
      <Container>
        <div className="relative z-10 grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-0">
          <Reveal variant="rise" className="lg:pr-16">
            <p className="font-mono text-label uppercase text-signal">Start here</p>
            <h2 className="mt-6 max-w-[13ch] font-display text-display-1 font-semibold uppercase">
              {finalCta.title.replace(/\.$/, "")}
              <span className="text-signal">.</span>
            </h2>
            <p className="mt-6 max-w-[46ch] text-lead text-ink-70">{finalCta.lede}</p>
            <div className="mt-9"><Button href={finalCta.cta.href}>{finalCta.cta.label}</Button></div>
          </Reveal>

          <Reveal delay={100} variant="fade" className="border-t border-hairline pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
            <h3 className="font-display text-body font-bold uppercase">Key dates</h3>
            <dl className="mt-6 border-t border-hairline">
              {KEY_DATES.map((item) => (
                <div key={item.label} className="flex items-baseline justify-between gap-6 border-b border-hairline-soft py-4">
                  <dt className="text-body-sm text-ink-70">{item.label}</dt>
                  <dd className="font-medium">
                    {item.value.iso ? <time dateTime={item.value.iso}>{item.value.label}</time> : item.value.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
