"use client";

import { customs, declarationFields, type FieldName } from "@/content/customs";

type DeclarationFormProps = {
  fields: Record<FieldName, string>;
  errors: Partial<Record<FieldName, string>>;
  /** Prefix for the generated input and error ids. */
  idBase: string;
  onChange: (name: FieldName, value: string) => void;
  disabled: boolean;
};

/** Part A — the paperwork, on a metal clipboard. */
export function DeclarationForm({
  fields,
  errors,
  idBase,
  onChange,
  disabled,
}: DeclarationFormProps) {
  return (
    <section aria-labelledby="declaration-title" className="grid gap-4">
      <div>
        <h3
          id="declaration-title"
          className="font-display text-heading font-black uppercase leading-none tracking-[-0.03em]"
        >
          {customs.declarationTitle}
        </h3>
        <p className="mt-2 font-mono text-meta uppercase tracking-[0.14em] text-slate">
          {customs.declarationNote}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {declarationFields.map((field) => {
          const id = `${idBase}-${field.name}`;
          const errorId = `${id}-error`;
          const error = errors[field.name];

          return (
            <div key={field.name} className={field.name === "linkedin" ? "sm:col-span-2" : ""}>
              <label
                htmlFor={id}
                className="flex items-baseline justify-between gap-2 font-display text-meta font-black uppercase tracking-[0.14em]"
              >
                {field.label}
                {!field.required ? (
                  <span className="font-mono font-normal tracking-[0.12em] text-slate">
                    Optional
                  </span>
                ) : null}
              </label>

              <input
                id={id}
                name={field.name}
                type={field.type}
                value={fields[field.name]}
                onChange={(event) => onChange(field.name, event.target.value)}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                maxLength={field.max}
                required={field.required}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className="mt-2 w-full border-2 border-ink bg-paper px-3.5 py-3 font-mono text-body uppercase tracking-tight outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-slate focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange disabled:bg-grid disabled:text-slate aria-[invalid=true]:border-alert"
              />

              {error ? (
                <p
                  id={errorId}
                  className="mt-2 font-mono text-meta uppercase tracking-[0.1em] text-alert"
                >
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
