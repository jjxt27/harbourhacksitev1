"use client";

import { Download } from "lucide-react";
import { useId, useRef, useState } from "react";
import { manifest, settingSail, site } from "@/content/canvas";
import { Button } from "@/components/ui/Button";
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
        toPng(node, { pixelRatio: 3, cacheBust: true, backgroundColor: "#ffffff" }),
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
          colors: ["#ff4f00", "#e2ff31", "#008542", "#0a0a0a"],
          disableForReducedMotion: true,
        });
      }

      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex h-full flex-col justify-center bg-highlighter px-6 py-20 md:px-14 md:py-16">
      <header className="mb-8">
        <p className="font-mono text-meta uppercase tracking-[0.2em] text-slate">
          {settingSail.kicker}
        </p>
        <h2 className="mt-4 font-display text-title font-black uppercase leading-[0.88] tracking-[-0.045em]">
          {settingSail.headline}
        </h2>
        <p className="mt-4 max-w-[46ch] text-lead leading-snug">{settingSail.subtext}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
        <div>
          <h3 className="sr-only">{manifest.formLabel}</h3>
          <ManifestForm data={data} onChange={update} errors={errors} ids={ids} />

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
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

        <div className="lg:sticky lg:top-24">
          <h3 className="mb-3 font-mono text-meta uppercase tracking-[0.18em] text-slate">
            {manifest.cardLabel}
          </h3>
          <ManifestCard ref={cardRef} data={data} />
          <p className="mt-3 max-w-[20.5rem] font-mono text-meta uppercase tracking-[0.12em] text-slate">
            {site.name} {site.year} · {site.city}
          </p>
        </div>
      </div>
    </div>
  );
}
