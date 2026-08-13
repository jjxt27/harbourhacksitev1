"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-svh place-items-center bg-paper-off p-6">
      <div className="w-full max-w-lg border-2 border-ink bg-paper p-8 shadow-hard-lg">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
          Something broke
        </p>
        <h1 className="mt-4 font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em]">
          Ran aground.
        </h1>
        <p className="mt-4 text-lg leading-snug">Try that again.</p>
        <button
          type="button"
          onClick={reset}
          className="press mt-8 border-2 border-ink bg-harbour px-5 py-3 font-display text-sm font-black uppercase tracking-wide text-paper"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
