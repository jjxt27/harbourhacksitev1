"use client";

import { Download } from "lucide-react";
import { useId, useRef, useState } from "react";
import { manifest, partners, settingSail, site } from "@/content/canvas";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Tbc } from "@/components/ui/Stamp";
import { ManifestCard } from "@/components/manifest/ManifestCard";
import { ManifestForm } from "@/components/manifest/ManifestForm";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import {
  validateRegistration,
  type FieldErrors,
  type ManifestFormState,
} from "@/lib/registration";

const START: ManifestFormState = {
  name: "",
  email: "",
  role: "Tech",
  skills: [],
  lookingFor: "Full Team",
  company: "",
};

/**
 * Two outcomes travel separately because they fail separately: the reader can
 * be safely on the list with no card to show for it, or holding a card we have
 * no record of. Collapsing them into one "done" would let the second case read
 * as a success, which is the one case where the reader has to act.
 */
type Status =
  | "idle"
  | "pending"
  /** Stored, card downloaded. */
  | "registered"
  /** Already on the list; details updated. */
  | "updated"
  /** Card downloaded, registration did not save. */
  | "unsaved"
  /** Stored, but rasterising the card failed. */
  | "cardFailed"
  /** The form has errors; nothing was sent. */
  | "error";

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
  const [data, setData] = useState<ManifestFormState>(START);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const base = useId();
  const ids = {
    name: `${base}-name`,
    nameError: `${base}-name-error`,
    email: `${base}-email`,
    emailError: `${base}-email-error`,
    skillsError: `${base}-skills-error`,
  };

  const update = (next: Partial<ManifestFormState>) => {
    setData((current) => ({ ...current, ...next }));
    setErrors({});
    setStatus("idle");
  };

  /** Rasterise and download. Returns whether the reader got a card. */
  async function downloadCard(): Promise<boolean> {
    const node = cardRef.current;
    if (!node) return false;

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
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Register, then hand over the card.
   *
   * In that order, and the card is not conditional on the first part. Being on
   * the list is the thing that matters and the thing only the server can do, so
   * it goes first; but a store that is down is not a reason to withhold a PNG
   * the browser can produce on its own. The reader ends up with the card either
   * way and is told, plainly, whether we have them.
   */
  async function onSubmit() {
    const checked = validateRegistration(data);
    if (!checked.ok) {
      setErrors(checked.errors);
      setStatus("error");
      // The first field that is actually wrong, rather than always the first
      // field in the form.
      const target = checked.errors.name ? ids.name : checked.errors.email ? ids.email : null;
      if (target) document.getElementById(target)?.focus();
      return;
    }

    setErrors({});
    setStatus("pending");

    let saved = false;
    let created = true;
    try {
      const response = await fetch("/api/manifest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The honeypot rides along: the server, not the browser, decides what
        // a filled trap means.
        body: JSON.stringify({ ...checked.value, company: data.company ?? "" }),
      });

      if (response.status === 422) {
        // The server disagreed with the browser about the same input. Its
        // answer wins, and nothing is downloaded for a registration that was
        // never valid.
        const json = (await response.json().catch(() => null)) as
          | { errors?: FieldErrors }
          | null;
        setErrors(json?.errors ?? {});
        setStatus("error");
        return;
      }

      if (response.ok) {
        const json = (await response.json().catch(() => null)) as
          | { created?: boolean }
          | null;
        saved = true;
        created = json?.created !== false;
      }
    } catch {
      // Offline, or the request never landed. Handled below like any other
      // unsaved registration.
    }

    const gotCard = await downloadCard();

    if (saved && !gotCard) {
      setStatus("cardFailed");
      return;
    }
    if (!saved) {
      setStatus("unsaved");
      return;
    }

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

    setStatus(created ? "registered" : "updated");
  }

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
        Four columns rather than stacked bands. A zone is exactly one screen
        tall and clips the overflow, so this one buys its space sideways: the
        objections, the form, the card and the partner block all sit on the
        same line and the reader pans instead of scrolling.

        The tiers are measured against the zone, not the window. Keyed to the
        window instead, as `xl:` once was, the columns stayed shut until 1280px
        and every tablet and half-screen window in between got one 2000px-tall
        stack in a zone that clips at the window's height, form included.

        Four columns wait for 1550px of zone rather than taking the first width
        they fit in. Below that the fixed 328px card leaves the form under
        500px, its two radio groups unpair, and four cramped columns come out
        taller than two roomy ones — so the middle band gets two: the questions
        beside the form, the card beside the partner block.
      */}
      {/*
        The weights are not even, because the columns do not need the same
        thing. The form is the only one that runs out of vertical room — the
        questions, the card and the partner block all finish well short of the
        zone — so width is moved to it from the three that have height to spare.
        A wider form wraps the fourteen skill chips into fewer rows and sets the
        privacy line on one, which is the same trade the zone makes with the
        canvas: buy room sideways where there is none downward.
      */}
      <div className="grid gap-8 @pair/zone:grid-cols-2 @roomy/zone:grid-cols-[minmax(0,0.7fr)_minmax(0,1.35fr)_auto_minmax(0,0.55fr)] @roomy/zone:gap-10">
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
            <Button onClick={onSubmit} size="lg" disabled={status === "pending"}>
              {status === "pending" ? manifest.actionPending : manifest.action}
              <Download aria-hidden="true" className="size-4" strokeWidth={3} />
            </Button>

            {data.name || data.email || data.skills.length ? (
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

          {/*
            One live region for every outcome. `alert` on the ones the reader
            has to act on, so a screen reader interrupts rather than waiting for
            a pause — being told later that a registration did not save is the
            same as not being told.
          */}
          <p
            aria-live={status === "unsaved" ? "assertive" : "polite"}
            className="mt-4 font-mono text-meta uppercase leading-relaxed tracking-[0.12em]"
          >
            {status === "registered" ? (
              <span className="text-ink">
                {manifest.registered} {manifest.actionDone} — {manifest.shareHint}
              </span>
            ) : status === "updated" ? (
              <span className="text-ink">
                {manifest.duplicate} {manifest.actionDone} — {manifest.shareHint}
              </span>
            ) : status === "unsaved" ? (
              <span className="text-alert">{manifest.registerFailed}</span>
            ) : status === "cardFailed" ? (
              <span className="text-ink">
                {manifest.registered} The card didn&apos;t render, but your place is saved.
              </span>
            ) : status === "error" && !errors.name && !errors.email && !errors.skills ? (
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
          {/*
            The card is handed only the fields it prints, rather than the whole
            form state. It never reads the email either way, but this is the
            node that gets rasterised and downloaded to be posted publicly, so
            the guarantee is worth making structural: an address cannot leak
            into a PNG it was never given.
          */}
          <ManifestCard
            ref={cardRef}
            data={{
              name: data.name,
              role: data.role,
              skills: data.skills,
              lookingFor: data.lookingFor,
            }}
          />
          <p className="mt-3 max-w-[20.5rem] font-mono text-meta uppercase tracking-[0.12em] text-slate">
            {site.name} {site.year} · {site.city}
          </p>
        </div>

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
