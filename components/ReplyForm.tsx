"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { apply, type ApplicationField } from "@/content/apply";
import { validateApplication, type FieldErrors } from "@/lib/validateApplication";
import { Arrow } from "@/components/Arrow";

type Status = "idle" | "pending" | "error" | "sent";

const STORAGE_KEY = "harbourhack-reply-v1";
const EMPTY = {
  name: "", email: "", team: "",
  idea: "", problem: "", audience: "", reach: "",
  link: "", commitment: false,
};
type Values = typeof EMPTY;

/** Order shown, and the order the error summary lists problems in. */
const ORDER: readonly ApplicationField[] = [
  "name", "email", "team", "idea", "problem", "audience", "reach", "link", "commitment",
];

const answered = (values: Values) =>
  ORDER.filter((field) =>
    field === "commitment" ? values.commitment : String(values[field]).trim() !== "",
  ).length;

export function ReplyForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sendError, setSendError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  const formId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const fieldId = (field: string) => `${formId}-${field}`;
  const errorId = (field: string) => `${formId}-${field}-error`;
  const hintId = (field: string) => `${formId}-${field}-hint`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { version?: number; values?: Partial<Values> };
        // Restoring a draft has to happen after hydration: localStorage does
        // not exist on the server, and seeding it in a state initialiser would
        // make the client's first render disagree with the server's markup.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (saved.version === 1 && saved.values) setValues({ ...EMPTY, ...saved.values });
      }
    } catch {
      // The form stays fully usable when storage is unavailable.
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored || status === "sent") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, values }));
    } catch {
      // Saving is an enhancement, never a requirement for replying.
    }
  }, [restored, status, values]);

  const set = (field: keyof Values, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field as ApplicationField];
      return next;
    });
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSendError(null);

    const found = validateApplication(values);
    if (Object.keys(found).length) {
      setErrors(found);
      setStatus("error");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

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
          setErrors(body.errors as FieldErrors);
          setStatus("error");
          requestAnimationFrame(() => summaryRef.current?.focus());
          return;
        }
        throw new Error(`Request failed: ${response.status}`);
      }

      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      setStatus("sent");
      requestAnimationFrame(() => sentRef.current?.focus());
    } catch {
      setStatus("error");
      setSendError(apply.errors.submit);
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }

  if (status === "sent") {
    return (
      <div ref={sentRef} tabIndex={-1} className="reply">
        <div className="reply-rail">{apply.sent.receipt}</div>
        <div className="reply-body">
          <div>
            <h2 className="msg msg-lead" data-seen="true">{apply.sent.title}</h2>
            <p className="sent-receipt">{apply.sent.receipt}</p>
          </div>
          <div className="exchange-a">
            {apply.sent.body.map((line) => <p key={line}>{line}</p>)}
          </div>
          <Link href="/" className="action-quiet">{apply.sent.back}</Link>
        </div>
      </div>
    );
  }

  const listed = ORDER.filter((field) => errors[field]);
  const showSummary = listed.length > 0 || sendError;

  return (
    <form onSubmit={onSubmit} noValidate className="reply">
      <div className="reply-rail">
        <span>{apply.progressLabel}</span>
        <span><b>{answered(values)}</b> / {ORDER.length}</span>
      </div>

      <div className="reply-body">
        <div ref={summaryRef} tabIndex={-1} role="alert" aria-live="assertive">
          {showSummary ? (
            <div className="summary">
              <p>{sendError ? apply.errors.submit : apply.errors.summary}</p>
              {sendError ? null : (
                <ul>
                  {listed.map((field) => (
                    <li key={field}>
                      <a href={`#${fieldId(field)}`}>{errors[field]}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>

        <Field id={fieldId("name")} label={apply.questions.name.label} error={errors.name} errorId={errorId("name")}>
          <input id={fieldId("name")} name="name" autoComplete="name" className="control"
            value={values.name} onChange={(e) => set("name", e.target.value)}
            aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? errorId("name") : undefined} />
        </Field>

        <Field id={fieldId("email")} label={apply.questions.email.label} error={errors.email} errorId={errorId("email")}>
          <input id={fieldId("email")} name="email" type="email" autoComplete="email" className="control"
            value={values.email} onChange={(e) => set("email", e.target.value)}
            aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? errorId("email") : undefined} />
        </Field>

        <Field id={fieldId("team")} label={apply.questions.team.label} hint={apply.questions.team.hint} hintId={hintId("team")} error={errors.team} errorId={errorId("team")}>
          <input id={fieldId("team")} name="team" className="control"
            value={values.team} onChange={(e) => set("team", e.target.value)}
            aria-invalid={Boolean(errors.team)} aria-describedby={describe(hintId("team"), errors.team && errorId("team"))} />
        </Field>

        {(["idea", "problem", "audience", "reach"] as const).map((field) => (
          <Field key={field} id={fieldId(field)} label={apply.questions[field].label} hint={apply.questions[field].hint} hintId={hintId(field)} error={errors[field]} errorId={errorId(field)}>
            <textarea id={fieldId(field)} name={field} rows={field === "audience" ? 2 : 3} className="control"
              value={values[field]} onChange={(e) => set(field, e.target.value)}
              aria-invalid={Boolean(errors[field])} aria-describedby={describe(hintId(field), errors[field] && errorId(field))} />
          </Field>
        ))}

        <Field id={fieldId("link")} label={apply.questions.link.label} optional hint={apply.questions.link.hint} hintId={hintId("link")} error={errors.link} errorId={errorId("link")}>
          <input id={fieldId("link")} name="link" type="url" inputMode="url" className="control"
            placeholder={apply.questions.link.placeholder}
            value={values.link} onChange={(e) => set("link", e.target.value)}
            aria-invalid={Boolean(errors.link)} aria-describedby={describe(hintId("link"), errors.link && errorId("link"))} />
        </Field>

        <div className="field">
          <label className="consent">
            <input id={fieldId("commitment")} name="commitment" type="checkbox"
              checked={values.commitment} onChange={(e) => set("commitment", e.target.checked)}
              aria-invalid={Boolean(errors.commitment)}
              aria-describedby={errors.commitment ? errorId("commitment") : undefined} />
            <span>{apply.questions.commitment.label}</span>
          </label>
          {errors.commitment ? <p id={errorId("commitment")} className="field-error">{errors.commitment}</p> : null}
        </div>

        {/* Bots fill every field they find, so any value here is never human. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
          <label htmlFor={fieldId("company")}>Company</label>
          <input ref={honeypotRef} id={fieldId("company")} name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <button type="submit" className="action" disabled={status === "pending"}>
            {status === "pending" ? apply.send.pending : apply.send.idle}
            <Arrow />
          </button>
          <p className="field-hint" style={{ marginTop: "1.25rem" }}>{apply.savedNote}</p>
        </div>
      </div>
    </form>
  );
}

const describe = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(" ") || undefined;

function Field({
  id, label, hint, hintId, error, errorId, optional, children,
}: {
  id: string; label: string; hint?: string; hintId?: string;
  error?: string; errorId: string; optional?: boolean; children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional ? <span className="field-optional">{apply.optionalNote}</span> : null}
      </label>
      {hint ? <p id={hintId} className="field-hint">{hint}</p> : null}
      {children}
      {error ? <p id={errorId} className="field-error">{error}</p> : null}
    </div>
  );
}
