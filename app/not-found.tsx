import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-paper-off p-6">
      <div className="w-full max-w-lg border-2 border-ink bg-paper p-8 shadow-hard-lg">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
          404 — Not on the chart
        </p>
        <h1 className="mt-4 font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em]">
          Off the harbour.
        </h1>
        <p className="mt-4 text-lg leading-snug">This page never made it out of dry dock.</p>
        <Link
          href="/"
          className="press mt-8 inline-block border-2 border-ink bg-orange px-5 py-3 font-display text-sm font-black uppercase tracking-wide text-paper"
        >
          Back to the canvas
        </Link>
      </div>
    </main>
  );
}
