"use client";

import { ArrowRight, Check } from "lucide-react";
import { useId, useState } from "react";
import { eoi } from "@/content/canvas";
import { Button } from "@/components/ui/Button";
import { Tbc } from "@/components/ui/Stamp";
import { HONEYPOT } from "@/lib/guard";
import {
  LIMITS,
  validateEoi,
  type EoiErrors,
  type EoiFormState,
} from "@/lib/registration";

const START: EoiFormState = { name: "", email: "", company: "", company_website: "" };

type Status =
  | "idle"
  | "pending"
  /** Stored, confirmation sent. */
  | "done"
  /** Stored, confirmation did not send. */
  | "doneNoEmail"
  /** Already on the list; details updated. */
  | "updated"
  /** Nothing was stored — the only status the reader has to act on. */
  | "failed"
  /** The form has errors; nothing was sent. */
  | "error";

const FIELD =
  "mt-2.5 w-full border-2 border-ink bg-paper px-3.5 py-3 font-display text-lead font-bold outline-none placeholder:font-normal placeholder:text-slate focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-harbour aria-[invalid=true]:border-alert";
const LABEL = "font-display text-meta font-black uppercase tracking-[0.14em]";
const ERROR = "mt-2 font-mono text-meta uppercase tracking-[0.1em] text-alert";

/**
 * Three fields and a button.
 *
 * The fuller manifest — role, skills, looking-for and a boarding pass — is
 * built and parked in `components/manifest/`, for the team-forming round. This
 * asks a stranger for a minute; that asks a committed entrant for five.
 */
export function EoiForm() {
  const [data, setData] = useState<EoiFormState>(START);
  const [errors, setErrors] = useState<EoiErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const base = useId();
  const ids = {
    name: `${base}-name`,
    nameError: `${base}-name-error`,
    email: `${base}-email`,
    emailError: `${base}-email-error`,
    company: `${base}-company`,
    companyError: `${base}-company-error`,
  };

  const update = (next: Partial<EoiFormState>) => {
    setData((current) => ({ ...current, ...next }));
    setErrors({});
    if (status === "error" || status === "failed") setStatus("idle");
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const checked = validateEoi(data);
    if (!checked.ok) {
      setErrors(checked.errors);
      setStatus("error");
      // The first field that is actually wrong, rather than always the first.
      const target = checked.errors.name
        ? ids.name
        : checked.errors.email
          ? ids.email
          : checked.errors.company
            ? ids.company
            : null;
      if (target) document.getElementById(target)?.focus();
      return;
    }

    setErrors({});
    setStatus("pending");

    try {
      const response = await fetch("/api/eoi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The honeypot rides along: the server, not the browser, decides what a
        // filled trap means.
        body: JSON.stringify({
          ...checked.value,
          [HONEYPOT]: data.company_website ?? "",
        }),
      });

      if (response.status === 422) {
        // The server disagreed with the browser about the same input. Its
        // answer wins.
        const json = (await response.json().catch(() => null)) as { errors?: EoiErrors } | null;
        setErrors(json?.errors ?? {});
        setStatus("error");
        return;
      }

      if (!response.ok) {
        setStatus("failed");
        return;
      }

      const json = (await response.json().catch(() => null)) as
        | { created?: boolean; emailed?: boolean }
        | null;

      if (json?.created === false) setStatus("updated");
      else setStatus(json?.emailed === false ? "doneNoEmail" : "done");
    } catch {
      setStatus("failed");
    }
  }

  const settled = status === "done" || status === "updated" || status === "doneNoEmail";

  /*
    On success the form is replaced rather than annotated. A page whose only
    purpose is one submission should not leave a filled-in form sitting under a
    confirmation, inviting a second identical send.
  */
  if (settled) {
    return (
      <div className="border-2 border-ink bg-paper p-6 shadow-hard sm:p-8" aria-live="polite">
        <p className="flex items-center gap-3 font-display text-heading font-black uppercase leading-[0.95] tracking-[-0.03em]">
          <Check aria-hidden="true" className="size-7 shrink-0 text-harbour" strokeWidth={3} />
          {status === "updated" ? eoi.duplicate : eoi.done}
        </p>
        <p className="mt-4 text-body leading-snug text-ink/80">
          {status === "doneNoEmail" ? eoi.doneNoEmail : eoi.doneNote}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <h2 className="sr-only">{eoi.formLabel}</h2>

      <div>
        <label htmlFor={ids.name} className={LABEL}>
          {eoi.fields.name.label}
        </label>
        <input
          id={ids.name}
          value={data.name}
          onChange={(event) => update({ name: event.target.value })}
          placeholder={eoi.fields.name.placeholder}
          maxLength={LIMITS.name}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? ids.nameError : undefined}
          className={FIELD}
        />
        {errors.name ? (
          <p id={ids.nameError} className={ERROR}>
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={ids.email} className={LABEL}>
          {eoi.fields.email.label}
        </label>
        <p className="mt-1.5 text-small text-slate">{eoi.fields.email.hint}</p>
        <input
          id={ids.email}
          type="email"
          value={data.email}
          onChange={(event) => update({ email: event.target.value })}
          placeholder={eoi.fields.email.placeholder}
          maxLength={LIMITS.email}
          autoComplete="email"
          inputMode="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? ids.emailError : undefined}
          className={FIELD}
        />
        {errors.email ? (
          <p id={ids.emailError} className={ERROR}>
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={ids.company} className={LABEL}>
          {eoi.fields.company.label}
        </label>
        <p className="mt-1.5 text-small text-slate">{eoi.fields.company.hint}</p>
        <input
          id={ids.company}
          value={data.company}
          onChange={(event) => update({ company: event.target.value })}
          placeholder={eoi.fields.company.placeholder}
          maxLength={LIMITS.company}
          autoComplete="organization"
          aria-invalid={Boolean(errors.company)}
          aria-describedby={errors.company ? ids.companyError : undefined}
          className={FIELD}
        />
        {errors.company ? (
          <p id={ids.companyError} className={ERROR}>
            {errors.company}
          </p>
        ) : null}
      </div>

      {/*
        The honeypot.

        Clipped to a 1px box rather than `display: none` — a bot checking
        whether a field is displayed will skip anything hidden outright, and
        this one is meant to look fillable. Untabbable, aria-hidden and
        autocomplete off, so nothing filling this in by hand, by password
        manager or by screen reader can reach it. Its name is not `company`,
        which is a real field on this form — see lib/guard.ts.
      */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="eoi-company-website" tabIndex={-1}>
          Company website — leave this blank
        </label>
        <input
          id="eoi-company-website"
          name={HONEYPOT}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={data.company_website ?? ""}
          onChange={(event) => update({ company_website: event.target.value })}
        />
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button type="submit" size="lg" disabled={status === "pending"}>
          {status === "pending" ? eoi.actionPending : eoi.action}
          <ArrowRight aria-hidden="true" className="size-4" strokeWidth={3} />
        </Button>
      </div>

      <p aria-live="assertive" className="min-h-[1.25rem] font-mono text-meta uppercase tracking-[0.12em]">
        {status === "failed" ? <span className="text-alert">{eoi.failed}</span> : null}
      </p>

      <p className="border-t-2 border-ink/25 pt-4 text-small leading-snug text-slate">
        {eoi.privacy.line}{" "}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          {eoi.privacy.contactLabel}: <Tbc />
        </span>
      </p>
    </form>
  );
}
