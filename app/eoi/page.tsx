import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { dates, eoi, site } from "@/content/canvas";
import { EoiForm } from "@/components/eoi/EoiForm";
import { Stamp } from "@/components/ui/Stamp";

export const metadata: Metadata = {
  title: "Register your interest",
  description: eoi.standfirst,
  openGraph: {
    title: `Register your interest — ${site.name} ${site.year}`,
    description: eoi.standfirst,
    url: `${site.url}/eoi`,
  },
  alternates: { canonical: "/eoi" },
};

/**
 * The expression of interest, on a page of its own.
 *
 * Off the canvas deliberately. The canvas is a thing to explore and this is a
 * thing to finish, so it gets a URL that can be pasted into an email, a QR code
 * or the brief — none of which can point at a zone you have to pan to. It is a
 * plain scrolling document: no pan hook, no intro plate, no cursors.
 */
export default function EoiPage() {
  return (
    <>
      {/* The same ground as the canvas, held still. There is nothing to
          parallax against on a page that simply scrolls. */}
      <div className="ground" aria-hidden="true">
        <div className="ground-screen screen-dots" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-svh w-full max-w-[46rem] flex-col px-6 py-10 sm:px-8 sm:py-14">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="press inline-flex items-center border-2 border-ink bg-ink px-3 py-2 font-display text-small font-black uppercase tracking-tight text-paper"
          >
            {site.name}
            <span className="ml-2 font-mono text-meta font-normal tracking-[0.14em] text-apricot">
              {site.year}
            </span>
          </Link>
          <Stamp>{site.city}</Stamp>
        </header>

        <div className="mt-12 sm:mt-16">
          <p className="font-mono text-meta uppercase tracking-[0.2em] text-slate">
            {eoi.kicker}
          </p>
          <h1 className="mt-3 font-display text-title font-black uppercase leading-[0.88] tracking-[-0.045em]">
            {eoi.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* The dates ride as a label rather than taking a sentence, the same
              way they do in zone one. */}
          <p className="mt-5 inline-block border-2 border-ink bg-harbour px-3 py-1.5 font-mono text-meta uppercase tracking-[0.18em] text-paper">
            {dates.short}
          </p>

          <p className="mt-5 max-w-[54ch] text-lead leading-snug">{eoi.standfirst}</p>
        </div>

        <div className="mt-10 border-2 border-ink bg-paper p-6 shadow-hard-lg sm:mt-12 sm:p-8">
          <EoiForm />
        </div>

        <p className="mt-10 sm:mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-b-2 border-ink pb-0.5 font-mono text-meta uppercase tracking-[0.14em]"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" strokeWidth={3} />
            {eoi.back}
          </Link>
        </p>

        <p className="mt-auto pt-12 font-mono text-micro uppercase tracking-[0.16em] text-slate">
          {site.name} {site.year} · {site.city} · {dates.long}
        </p>
      </main>
    </>
  );
}
