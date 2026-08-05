"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="ground-light grid min-h-[72svh] items-center border-b border-hairline px-5 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <p className="font-mono text-label uppercase tracking-[0.16em] text-ink-muted">Something went wrong</p>
        <h1 className="mt-6 max-w-[11ch] font-display text-display-1 font-extrabold uppercase">We have run aground.</h1>
        <p className="mt-7 max-w-[50ch] text-lead text-ink-70">Try that action again, or head back to the program.</p>
        <div className="mt-10 flex flex-wrap items-center gap-7">
          <button type="button" onClick={reset} className="inline-flex items-center gap-3 rounded-full bg-tide px-7 py-4 text-body-sm font-bold uppercase tracking-[0.08em] text-accent-contrast"><RotateCcw aria-hidden="true" className="size-4" />Try again</button>
          <Link href="/" className="inline-flex items-center gap-2 border-b border-hairline pb-1 font-mono text-label uppercase"><ArrowLeft aria-hidden="true" className="size-4" />Back to program</Link>
        </div>
      </div>
    </div>
  );
}
