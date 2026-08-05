"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { apply, type ApplicationField } from "@/content/apply";
import { validateApplication, type FieldErrors } from "@/lib/validateApplication";
import { Label } from "@/components/ui";
import { cn } from "@/lib/cn";

type Status = "idle" | "pending" | "error" | "success";
type Step = 0 | 1;

const STORAGE_KEY = "harbourhack-application-v1";
const EMPTY = { name: "", email: "", idea: "", problem: "", audience: "", reach: "", link: "", team: "", commitment: false };
type Values = typeof EMPTY;

const STEP_FIELDS: readonly ApplicationField[][] = [
  ["name", "email", "team"],
  ["idea", "problem", "audience", "reach", "link", "commitment"],
];

const controlStyles =
  "w-full border border-hairline bg-paper-raised px-4 py-4 text-body text-ink transition-colors placeholder:text-ink-muted focus:border-ink focus:outline-none aria-[invalid=true]:border-danger";

export function ApplicationForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [step, setStep] = useState<Step>(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const formId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as { version?: number; values?: Partial<Values> };
          if (saved.version === 1 && saved.values) setValues({ ...EMPTY, ...saved.values });
        }
      } catch {
        // The form remains fully usable when local storage is unavailable.
      }
      setStorageReady(true);
    }, 0);

    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (!storageReady || status === "success") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, values }));
    } catch {
      // Saving is an enhancement, never a requirement for applying.
    }
  }, [status, storageReady, values]);

  const fieldId = (field: string) => `${formId}-${field}`;
  const errorId = (field: string) => `${formId}-${field}-error`;
  const hintId = (field: string) => `${formId}-${field}-hint`;

  const set = (field: keyof Values, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field as ApplicationField];
      return next;
    });
  };

  const errorsFor = (targetStep: Step) => {
    const all = validateApplication(values);
    return Object.fromEntries(
      STEP_FIELDS[targetStep].flatMap((field) => all[field] ? [[field, all[field]]] : []),
    ) as FieldErrors;
  };

  const showErrors = (found: FieldErrors) => {
    setErrors(found);
    setStatus("error");
    requestAnimationFrame(() => summaryRef.current?.focus());
  };

  const goToStep = (next: Step) => {
    setStep(next);
    setErrors({});
    setStatus("idle");
    setSubmitError(null);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const continueToCargo = () => {
    const found = errorsFor(0);
    if (Object.keys(found).length) return showErrors(found);
    goToStep(1);
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const found = validateApplication(values);
    if (Object.keys(found).length) return showErrors(found);

    setStatus("pending");
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypotRef.current?.value ?? "" }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        if (body?.errors) {
          showErrors(body.errors as FieldErrors);
          return;
        }
        throw new Error(`Request failed: ${response.status}`);
      }

      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus("error");
      setSubmitError(apply.errors.submit);
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} className="border-t border-hairline py-10 focus:outline-none">
        <Label as="p" className="text-ink-muted">Received</Label>
        <h2 className="mt-5 font-display text-display-2 font-extrabold uppercase">{apply.success.title}</h2>
        <Label as="p" className="mt-9 text-ink-muted">{apply.success.nextLabel}</Label>
        <div className="mt-5 space-y-4">
          {apply.success.body.map((line) => <p key={line} className="max-w-[58ch] text-lead text-ink-70">{line}</p>)}
        </div>
        <Link href="/" className="mt-9 inline-flex items-center gap-2 border-b border-tide pb-1 font-mono text-label uppercase">
          <ArrowLeft aria-hidden="true" className="size-4" /> {apply.workflow.backToProgram}
        </Link>
      </div>
    );
  }

  const errorList = STEP_FIELDS[step].filter((field) => errors[field]);
  const showSummary = errorList.length > 0 || submitError;

  return (
    <form onSubmit={onSubmit} noValidate className="border-t border-hairline pt-8">
      <div className="grid items-start gap-5 md:grid-cols-[6rem_1fr]">
        <Label as="p" className="pt-1 text-ink">{step + 1} of 2</Label>
        <ol className="grid grid-cols-2">
          {apply.workflow.steps.map((label, index) => (
            <li key={label} className="relative border-t border-hairline pt-5">
              <button type="button" disabled={index === 1 && step === 0} onClick={() => index === 0 && goToStep(0)} aria-current={step === index ? "step" : undefined} className={cn("font-mono text-label uppercase transition-colors", step === index ? "text-ink" : "text-ink-muted", index === 0 ? "text-left" : "w-full text-right")}>
                <span className={cn("absolute -top-2 size-4 rounded-full border border-ink bg-paper", index === 0 ? "left-0" : "right-0", step === index && "border-tide bg-tide")} />
                {label}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-hairline-soft py-4">
        <Label as="p" className="text-ink-muted">{apply.requiredNote}</Label>
        <p className="font-mono text-label uppercase text-ink-muted">{apply.workflow.saved}</p>
      </div>

      <div ref={summaryRef} tabIndex={-1} role="alert" aria-live="assertive" className={cn("focus:outline-none", showSummary && "mt-8 border border-danger bg-danger/[0.04] p-6")}>
        {showSummary ? <>
          <Label as="p" className="text-danger">{submitError ? "Could not send" : `${errorList.length} to fix`}</Label>
          {submitError ? <p className="mt-4 text-ink-70">{submitError}</p> : (
            <ul className="mt-4 space-y-2">{errorList.map((field) => <li key={field}><a href={`#${fieldId(field)}`} className="underline underline-offset-4">{errors[field]}</a></li>)}</ul>
          )}
        </> : null}
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="sr-only focus:outline-none">{apply.workflow.steps[step]}</h2>

      {step === 0 ? (
        <div className="mt-10 space-y-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <Field id={fieldId("name")} label={apply.fields.name.label} error={errors.name} errorId={errorId("name")}>
              <input id={fieldId("name")} name="name" autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? errorId("name") : undefined} className={controlStyles} />
            </Field>
            <Field id={fieldId("email")} label={apply.fields.email.label} error={errors.email} errorId={errorId("email")}>
              <input id={fieldId("email")} name="email" type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? errorId("email") : undefined} className={controlStyles} />
            </Field>
          </div>
          <Field id={fieldId("team")} label={apply.fields.team.label} hint={apply.fields.team.hint} hintId={hintId("team")} error={errors.team} errorId={errorId("team")}>
            <input id={fieldId("team")} name="team" value={values.team} onChange={(e) => set("team", e.target.value)} aria-invalid={Boolean(errors.team)} aria-describedby={cn(hintId("team"), errors.team && errorId("team"))} className={controlStyles} />
          </Field>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          <TextArea field="idea" value={values.idea} set={set} error={errors.idea} fieldId={fieldId} errorId={errorId} hintId={hintId} />
          <TextArea field="problem" value={values.problem} set={set} error={errors.problem} fieldId={fieldId} errorId={errorId} hintId={hintId} />
          <TextArea field="audience" value={values.audience} set={set} error={errors.audience} fieldId={fieldId} errorId={errorId} hintId={hintId} rows={3} />
          <TextArea field="reach" value={values.reach} set={set} error={errors.reach} fieldId={fieldId} errorId={errorId} hintId={hintId} />
          <Field id={fieldId("link")} label={apply.fields.link.label} hint={apply.fields.link.hint} hintId={hintId("link")} error={errors.link} errorId={errorId("link")}>
            <input id={fieldId("link")} name="link" type="url" inputMode="url" placeholder={apply.fields.link.placeholder} value={values.link} onChange={(e) => set("link", e.target.value)} aria-invalid={Boolean(errors.link)} aria-describedby={cn(hintId("link"), errors.link && errorId("link"))} className={controlStyles} />
          </Field>
          <div className="border-y border-hairline py-6">
            <label className="flex cursor-pointer items-start gap-4">
              <input id={fieldId("commitment")} name="commitment" type="checkbox" checked={values.commitment} onChange={(e) => set("commitment", e.target.checked)} aria-invalid={Boolean(errors.commitment)} aria-describedby={errors.commitment ? errorId("commitment") : undefined} className="mt-1 size-5 shrink-0 accent-ink" />
              <span className="text-body text-ink-70">{apply.fields.commitment.label}</span>
            </label>
            {errors.commitment ? <p id={errorId("commitment")} className="mt-3 text-body-sm text-danger">{errors.commitment}</p> : null}
          </div>
          {apply.dataUseNote ? <p className="max-w-[62ch] text-body-sm text-ink-muted">{apply.dataUseNote}</p> : null}
        </div>
      )}

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={fieldId("company")}>Company</label>
        <input ref={honeypotRef} id={fieldId("company")} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-6">
        {step === 0 ? (
          <button type="button" onClick={continueToCargo} className="inline-flex items-center gap-3 rounded-full bg-tide px-7 py-4 text-body-sm font-bold uppercase tracking-[0.08em] text-accent-contrast transition-transform hover:scale-[0.985] active:scale-[0.97]">
            {apply.workflow.next}<ArrowRight aria-hidden="true" className="size-4" />
          </button>
        ) : <>
          <button type="button" onClick={() => goToStep(0)} className="inline-flex items-center gap-2 border-b border-hairline pb-1 font-mono text-label uppercase"><ArrowLeft aria-hidden="true" className="size-4" />{apply.workflow.back}</button>
          <button type="submit" disabled={status === "pending"} className="inline-flex rounded-full bg-tide px-7 py-4 text-body-sm font-bold uppercase tracking-[0.08em] text-accent-contrast transition-transform hover:scale-[0.985] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60">
            {status === "pending" ? apply.submit.pending : apply.submit.idle}
          </button>
        </>}
      </div>

      <Link href="/" className="mt-9 inline-flex items-center gap-2 text-body-sm text-ink-muted transition-colors hover:text-ink"><ArrowLeft aria-hidden="true" className="size-4" />{apply.workflow.backToProgram}</Link>
    </form>
  );
}

function TextArea({ field, value, set, error, fieldId, errorId, hintId, rows = 4 }: {
  field: "idea" | "problem" | "audience" | "reach"; value: string; set: (field: keyof Values, value: string | boolean) => void; error?: string; fieldId: (field: string) => string; errorId: (field: string) => string; hintId: (field: string) => string; rows?: number;
}) {
  const copy = apply.fields[field];
  return <Field id={fieldId(field)} label={copy.label} hint={copy.hint} hintId={hintId(field)} error={error} errorId={errorId(field)}><textarea id={fieldId(field)} name={field} rows={rows} value={value} onChange={(e) => set(field, e.target.value)} aria-invalid={Boolean(error)} aria-describedby={cn(hintId(field), error && errorId(field))} className={cn(controlStyles, "resize-y")} /></Field>;
}

function Field({ id, label, hint, hintId, error, errorId, children }: { id: string; label: string; hint?: string; hintId?: string; error?: string; errorId: string; children: ReactNode }) {
  return <div><label htmlFor={id} className="block font-display text-body font-bold">{label}</label>{hint ? <p id={hintId} className="mt-1 max-w-[58ch] text-body-sm text-ink-muted">{hint}</p> : null}<div className="mt-3">{children}</div>{error ? <p id={errorId} className="mt-2 text-body-sm text-danger">{error}</p> : null}</div>;
}
