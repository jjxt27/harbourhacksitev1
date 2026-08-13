import { ArrowRight } from "lucide-react";
import { partners, settingSail } from "@/content/canvas";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Tbc } from "@/components/ui/Stamp";

/**
 * Zone 3 — the objections, the way in, and the partner block.
 *
 * The form used to live here and now lives at `/eoi`. A canvas you pan through
 * is a bad home for the one thing that needs a URL: a zone cannot be linked
 * from an email, printed on a QR code, or put at the end of the brief. So the
 * zone makes the case and hands over, and the page does the asking.
 *
 * With the form went the state, which is why this is a server component again —
 * zone three used to ship a form, a card renderer and two lazy-loaded libraries
 * to every visitor who never reached it.
 */
export function SettingSail() {
  return (
    <div className="zone-body zone-rhythm bg-apricot px-6 py-20 md:px-14 md:py-[var(--zone-pad-y)]">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <p className="font-mono text-meta uppercase tracking-[0.2em] text-slate">
            {settingSail.kicker}
          </p>
          <h2 className="mt-3 font-display text-title font-black uppercase leading-[0.88] tracking-[-0.045em]">
            {settingSail.headline}
          </h2>
        </div>
        <p className="max-w-[46ch] text-lead leading-snug">{settingSail.subtext}</p>
      </header>

      {/*
        Three columns, measured against the zone rather than the window — see
        the note on `--container-pair` in globals.css for why both steps are
        ours. Far shorter than the four this zone carried when the form was in
        it, so the vertical budget is no longer tight at any realistic size.
      */}
      <div className="grid gap-8 @pair/zone:grid-cols-2 @roomy/zone:grid-cols-3 @roomy/zone:gap-10">
        {/* Paper cards, not sticky notes — the zone ground is already apricot,
            and a note in the same ink as the wall behind it has no edge. */}
        <section aria-labelledby="questions">
          <h3
            id="questions"
            className="font-display text-small font-black uppercase tracking-[0.14em]"
          >
            {settingSail.questionsLabel}
          </h3>
          <ul className="mt-3 grid gap-2.5">
            {settingSail.questions.map((item) => (
              <li key={item.q} className="border-2 border-ink bg-paper p-3 shadow-hard-sm">
                <p className="font-display text-small font-black uppercase leading-tight tracking-tight">
                  {item.q}
                </p>
                <p className="mt-1.5 text-small leading-snug text-ink/80">{item.a}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* The handover. Navy rather than paper: it is the one thing on this
            canvas we are actually asking for, and it outranks the cards either
            side of it. Paper on navy is 9.36:1. */}
        <section
          aria-labelledby="register"
          className="self-start border-2 border-ink bg-navy p-6 text-paper shadow-hard-lg"
        >
          <h3
            id="register"
            className="font-display text-heading font-black uppercase leading-[0.95] tracking-[-0.03em]"
          >
            {settingSail.headline}
          </h3>
          <p className="mt-3 text-body leading-snug text-paper/85">{settingSail.cta.note}</p>

          <div className="mt-6">
            <Button href={settingSail.cta.href} size="lg" variant="paper">
              {settingSail.cta.label}
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={3} />
            </Button>
          </div>
        </section>

        {/*
          Partners get a callout, not a pitch. Builders are the audience on this
          canvas; the full argument is in EOI_BRIEF.md and goes out by email.
        */}
        <Panel label={partners.label} tone="paper" className="self-start shadow-hard">
          <h3 className="font-display text-lead font-black uppercase leading-[0.95] tracking-[-0.03em]">
            {partners.heading}
          </h3>
          <p className="mt-2 text-small leading-snug text-ink/80">{partners.body}</p>

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {partners.slots.map((slot) => (
              <li
                key={slot}
                className="border-2 border-ink bg-harbour px-2 py-1 font-mono text-micro uppercase tracking-[0.12em] text-paper"
              >
                {slot}
              </li>
            ))}
          </ul>

          <p className="mt-3 border-t-2 border-ink pt-3 text-small leading-snug text-ink/80">
            {partners.note}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-meta uppercase tracking-[0.16em] text-ink/60">
              {partners.action}
            </span>
            {partners.contact === "TBC" ? (
              <Tbc />
            ) : (
              <a
                href={`mailto:${partners.contact}`}
                className="border-b-2 border-ink pb-0.5 font-mono text-meta uppercase tracking-[0.14em]"
              >
                {partners.contact}
              </a>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
