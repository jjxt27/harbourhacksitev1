import type { Metadata } from "next";
import { faq } from "@/content/faq";
import { site } from "@/content/site";
import { Button, Container, Label } from "@/components/ui";

export const metadata: Metadata = {
  title: "FAQ",
  description: `The practical details before you apply to ${site.name}.`,
};

export default function FaqPage() {
  return (
    <div className="ground-light pb-20 pt-32 sm:pb-28 sm:pt-40">
      <Container>
        <div className="mx-auto max-w-3xl">
          <header className="mb-16">
            <Label as="p">Practical details</Label>
            <h1 className="mt-6 font-display text-display-1 font-extrabold uppercase">
              Questions<span className="text-tide">.</span>
            </h1>
            <p className="mt-7 max-w-[44ch] text-lead text-ink-70">
              What to know before you apply, and before you leave the harbour.
            </p>
          </header>

          {faq.map((group) => (
            <section key={group.title} className="mb-16 last:mb-0">
              <Label as="h2" className="block border-t border-hairline pt-5">{group.title}</Label>
              <div className="mt-3">
                {group.items.map((item) => (
                  <details key={item.q} className="group border-b border-hairline py-6">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                      <h3 className="font-display text-display-3 font-bold">{item.q}</h3>
                      <span aria-hidden="true" className="relative mt-2 block size-3 shrink-0">
                        <span className="absolute top-1/2 block h-px w-3 bg-ink" />
                        <span className="absolute top-1/2 block h-px w-3 rotate-90 bg-ink transition-transform duration-300 group-open:rotate-0" />
                      </span>
                    </summary>
                    <div className="mt-5 space-y-4">
                      {item.unconfirmed && <p className="font-mono text-label uppercase text-danger">Not yet confirmed</p>}
                      {item.a.map((paragraph) => <p key={paragraph} className="max-w-[62ch] leading-relaxed text-ink-70">{paragraph}</p>)}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="mt-20 border-t border-hairline pt-10">
            <p className="max-w-[40ch] font-display text-display-3 font-bold">An idea is enough to start. Tell us who it is for.</p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button href="/apply">Apply to {site.name}</Button>
              {site.contactEmail ? <Button href={`mailto:${site.contactEmail}`} variant="text">Ask a question</Button> : null}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
