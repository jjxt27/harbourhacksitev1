"use client";

import { Download } from "lucide-react";
import { useId, useRef, useState } from "react";
import { manifest, partners, settingSail, site } from "@/content/canvas";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Tbc } from "@/components/ui/Stamp";
import { ManifestCard, type ManifestData } from "@/components/manifest/ManifestCard";
import { ManifestForm } from "@/components/manifest/ManifestForm";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const START: ManifestData = {
  name: "",
  role: "Tech",
  skills: [],
  lookingFor: "Full Team",
};

type Status = "idle" | "pending" | "done" | "error";

const slug = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "crew";

/** Ceiling on rasterising the card, in ms. */
const EXPORT_TIMEOUT = 12000;

/**
 * Rasterisation can hang rather than reject — a webfont that never resolves,
 * or a tab that is not compositing, leaves the promise pending forever. Without
 * this the button would sit on "Stamping…" with no way back.
 */
function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    work,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("export timed out")), ms),
    ),
  ]);
}

/** Zone 3 — fill in the manifest on the left, watch the card build on the right. */
export function SettingSail() {
  const [data, setData] = useState<ManifestData>(START);
  const [errors, setErrors] = useState<Partial<Record<"name" | "skills", string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const base = useId();
  const ids = {
    name: `${base}-name`,
    nameError: `${base}-name-error`,
    skillsError: `${base}-skills-error`,
  };

  const update = (next: Partial<ManifestData>) => {
    setData((current) => ({ ...current, ...next }));
    setErrors({});
    setStatus("idle");
  };

  async function onGenerate() {
    const found: typeof errors = {};
    if (!data.name.trim()) found.name = manifest.errors.name;
    if (data.skills.length === 0) found.skills = manifest.errors.skills;
    if (Object.keys(found).length) {
      setErrors(found);
      setStatus("error");
      document.getElementById(found.name ? ids.name : ids.skillsError)?.focus?.();
      return;
    }

    const node = cardRef.current;
    if (!node) return;

    setStatus("pending");
    try {
      // Loaded on demand: neither library belongs in the initial bundle when
      // most visitors never reach this button.
      const { toPng } = await import("html-to-image");
      const url = await withTimeout(
        toPng(node, { pixelRatio: 3, cacheBust: true, backgroundColor: "#fbead7" }),
        EXPORT_TIMEOUT,
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `harbourhack-manifest-${slug(data.name)}.png`;
      link.click();

      if (!reduced) {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 90,
          spread: 78,
          startVelocity: 42,
          origin: { y: 0.72 },
          colors: ["#1a5da8", "#f6be85", "#e2711d", "#08192e"],
          disableForReducedMotion: true,
        });
      }

      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex h-full flex-col justify-center bg-apricot px-6 py-20 md:px-14 md:py-10">
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
        Four columns rather than stacked bands. A zone is exactly one screen
        tall and clips the overflow, so this one buys its space sideways: the
        objections, the form, the card and the partner block all sit on the
        same line and the reader pans instead of scrolling.
      */}
      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_auto_minmax(0,0.7fr)] xl:gap-10">
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

        <div>
          <h3 className="sr-only">{manifest.formLabel}</h3>
          <ManifestForm data={data} onChange={update} errors={errors} ids={ids} />

          <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button onClick={onGenerate} size="lg" disabled={status === "pending"}>
              {status === "pending" ? manifest.actionPending : manifest.action}
              <Download aria-hidden="true" className="size-4" strokeWidth={3} />
            </Button>

            {data.name || data.skills.length ? (
              <button
                type="button"
                onClick={() => {
                  setData(START);
                  setErrors({});
                  setStatus("idle");
                }}
                className="border-b-2 border-ink pb-0.5 font-mono text-meta uppercase tracking-[0.14em]"
              >
                {manifest.reset}
              </button>
            ) : null}
          </div>

          <p aria-live="polite" className="mt-4 font-mono text-meta uppercase tracking-[0.12em]">
            {status === "done" ? (
              <span className="text-ink">{manifest.actionDone} — {manifest.shareHint}</span>
            ) : status === "error" && !errors.name && !errors.skills ? (
              <span className="text-alert">That didn&apos;t save. Try again.</span>
            ) : (
              <span className="text-slate">{manifest.shareHint}</span>
            )}
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-mono text-meta uppercase tracking-[0.18em] text-slate">
            {manifest.cardLabel}
          </h3>
          <ManifestCard ref={cardRef} data={data} />
          <p className="mt-3 max-w-[20.5rem] font-mono text-meta uppercase tracking-[0.12em] text-slate">
            {site.name} {site.year} · {site.city}
          </p>
        </div>

        {/*
          Partners get a callout, not a pitch. Students are the audience on this
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
