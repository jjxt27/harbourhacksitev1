import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container, Label } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="ground-light grid min-h-[72svh] items-center border-b border-hairline py-24">
      <Container>
        <Label as="p" className="text-ink-muted">404 / Not on the map</Label>
        <h1 className="mt-6 max-w-[12ch] font-display text-display-1 font-extrabold uppercase">
          This page never shipped.
        </h1>
        <p className="mt-7 max-w-[50ch] text-lead text-ink-70">The routes that matter are still open.</p>
        <div className="mt-10 flex flex-wrap items-center gap-7">
          <Link href="/" className="inline-flex items-center gap-2 border-b border-hairline pb-1 font-mono text-label uppercase"><ArrowLeft aria-hidden="true" className="size-4" />Home</Link>
          <Link href="/apply" className="inline-flex items-center gap-3 rounded-full bg-signal px-7 py-4 text-body-sm font-bold uppercase tracking-[0.08em] text-accent-contrast">Apply<ArrowRight aria-hidden="true" className="size-4" /></Link>
        </div>
      </Container>
    </div>
  );
}
