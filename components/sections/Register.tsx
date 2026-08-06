"use client";

import { useId, useRef, useState } from "react";
import { manifest, register, site } from "@/content/canvas";
import { ManifestCard, type ManifestData } from "@/components/manifest/ManifestCard";
import { ManifestForm } from "@/components/manifest/ManifestForm";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const START: ManifestData = {
  name: "",
  role: "Tech",
  skills: [],
  lookingFor: "A full team",
};

type Status = "idle" | "pending" | "done" | "error";

const slug = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "crew";

/** Ceiling on rasterising the pass, in ms. */
const EXPORT_TIMEOUT = 12000;

/**
 * Rasterisation can hang rather than reject — a webfont that never resolves, or
 * a tab that is not compositing, leaves the promise pending forever. Without
 * this the button would sit on "Issuing" with no way back.
 */
function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    work,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("export timed out")), ms)),
  ]);
}

/**
 * Chapter III — the manifest.
 *
 * Form on the left, the pass building live on the right. The pass updates as
 * you type rather than appearing at the end, because the thing being offered is
 * the artefact: showing it half-finished is what makes completing it feel worth
 * doing.
 */
export function Register() {
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

  async function onIssue() {
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
      if (document.fonts?.ready) await document.fonts.ready;

      const url = await withTimeout(
        toPng(node, { pixelRatio: 3, cacheBust: true, backgroundColor: "#061e3c" }),
        EXPORT_TIMEOUT,
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `harbourhack-pass-${slug(data.name)}.png`;
      link.click();

      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex h-full flex-col justify-center gap-12 px-6 pb-24 pt-32 sm:px-10 md:px-14 md:pb-28 md:pt-36">
      <header className="max-w-[34rem]">
        <p className="eyebrow text-ivory-faint">
          {register.numeral} — {register.label}
        </p>
        <h2 className="display mt-7 text-display text-ivory">{register.headline}</h2>
        <p className="mt-6 font-sans text-lead leading-relaxed text-ivory-dim">
          {register.standfirst}
        </p>
      </header>

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
        <div>
          <h3 className="sr-only">{manifest.formLabel}</h3>
          <ManifestForm data={data} onChange={update} errors={errors} ids={ids} />

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
            <button
              type="button"
              onClick={onIssue}
              disabled={status === "pending"}
              className="group inline-flex items-baseline gap-3 border-b border-brass pb-1 font-sans text-body font-medium text-ivory transition-colors hover:text-brass disabled:opacity-50"
            >
              {status === "pending" ? manifest.actionPending : manifest.action}
              <span
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:translate-x-1"
                style={{ transitionTimingFunction: "var(--ease-out)" }}
              >
                ↓
              </span>
            </button>

            {data.name || data.skills.length ? (
              <button
                type="button"
                onClick={() => {
                  setData(START);
                  setErrors({});
                  setStatus("idle");
                }}
                className="font-sans text-small text-ivory-faint transition-colors hover:text-ivory"
              >
                {manifest.reset}
              </button>
            ) : null}
          </div>

          <p aria-live="polite" className="mt-5 font-sans text-small">
            {status === "done" ? (
              <span className="text-ferry">
                {manifest.actionDone}. {manifest.shareHint}
              </span>
            ) : status === "error" && !errors.name && !errors.skills ? (
              <span className="text-alert">That didn&apos;t save. Try again.</span>
            ) : (
              <span className="text-ivory-faint">{manifest.shareHint}</span>
            )}
          </p>
        </div>

        <div className="lg:sticky lg:top-32">
          <p className="mb-5 font-sans text-micro font-medium uppercase tracking-[0.28em] text-ivory-faint">
            {manifest.cardLabel}
          </p>
          <div style={{ boxShadow: reduced ? undefined : "var(--shadow-panel)" }}>
            <ManifestCard ref={cardRef} data={data} />
          </div>
          <p className="mt-5 max-w-[21rem] font-sans text-small text-ivory-faint">
            {site.name} {site.year} · {site.city}
          </p>
        </div>
      </div>
    </div>
  );
}
