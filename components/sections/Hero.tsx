import { site, dryDock } from "@/content/canvas";

/**
 * The first screenful.
 *
 * Deliberately the intro's own composition, held: the wordmark set in Cormorant
 * against the bottom-right of the harbour, the wide-tracked label under it, the
 * place and year under that. Someone arriving from harbourhack.com should not
 * be able to point at the moment the curtain lifted — the type is in the same
 * position and the same size, and only the words below it change.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end px-6 pb-16 pt-28 sm:px-10 md:px-14 md:pb-24">
      <div className="ml-auto w-full max-w-[46rem] text-right">
        <h1 className="display text-hero text-ivory">{site.name}</h1>

        <p className="eyebrow mt-8 text-ivory md:mt-10">{site.tagline}</p>

        <p className="mt-3 font-sans text-label font-medium tracking-[0.12em] text-ivory-dim">
          {site.city} · Australia · {site.year}
        </p>

        <p className="mt-8 ml-auto max-w-[38ch] font-sans text-lead leading-relaxed text-ivory-dim">
          {dryDock.subtext}
        </p>
      </div>

      {/* The one instruction on the page, and it earns its place: nothing else
          tells a reader the harbour continues below the fold. */}
      <p className="eyebrow absolute bottom-8 left-6 text-ivory-faint sm:left-10 md:left-14">
        Scroll
      </p>
    </section>
  );
}
