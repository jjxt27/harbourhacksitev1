"use client";

import {
  MAX_SKILLS,
  lookingFor,
  manifest,
  roles,
  skills,
  type LookingFor,
  type Role,
  type Skill,
} from "@/content/canvas";
import { LIMITS, type FieldErrors, type ManifestFormState } from "@/lib/registration";
import { Tbc } from "@/components/ui/Stamp";

const CHOICE =
  "block cursor-pointer border-2 border-ink bg-paper px-3 py-2 text-center font-display text-meta font-black uppercase tracking-tight transition-transform peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-harbour peer-disabled:cursor-not-allowed peer-disabled:opacity-40 hover:-translate-y-0.5";

type ManifestFormProps = {
  data: ManifestFormState;
  onChange: (next: Partial<ManifestFormState>) => void;
  errors: FieldErrors;
  ids: {
    name: string;
    nameError: string;
    email: string;
    emailError: string;
    skillsError: string;
  };
};

/**
 * The manifest inputs.
 *
 * Native radios and checkboxes under styled labels, rather than buttons with
 * ARIA state — the browser already gives arrow-key groups, form semantics and
 * announcements for free, and the visual treatment costs nothing to keep.
 */
export function ManifestForm({ data, onChange, errors, ids }: ManifestFormProps) {
  const atLimit = data.skills.length >= MAX_SKILLS;

  const toggleSkill = (skill: Skill) => {
    const has = data.skills.includes(skill);
    if (!has && atLimit) return;
    onChange({
      skills: has ? data.skills.filter((s) => s !== skill) : [...data.skills, skill],
    });
  };

  return (
    /*
      A container of its own, so the pairing below is decided by the width of
      the form rather than the width of the zone it sits in. Named, because an
      unnamed `@` variant would resolve against the nearest container and the
      zone is also one.
    */
    <div className="@container/form grid gap-6">
      <div>
        <label
          htmlFor={ids.name}
          className="font-display text-meta font-black uppercase tracking-[0.14em]"
        >
          {manifest.fields.name.label}
        </label>
        <input
          id={ids.name}
          value={data.name}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder={manifest.fields.name.placeholder}
          maxLength={LIMITS.name}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? ids.nameError : undefined}
          className="mt-2.5 w-full border-2 border-ink bg-paper px-3.5 py-3 font-display text-lead font-bold outline-none placeholder:font-normal placeholder:text-slate focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-harbour aria-[invalid=true]:border-alert"
        />
        {errors.name ? (
          <p id={ids.nameError} className="mt-2 font-mono text-meta uppercase tracking-[0.1em] text-alert">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor={ids.email}
          className="font-display text-meta font-black uppercase tracking-[0.14em]"
        >
          {manifest.fields.email.label}
        </label>
        <p className="mt-1.5 text-small text-slate">{manifest.fields.email.hint}</p>
        <input
          id={ids.email}
          type="email"
          value={data.email}
          onChange={(event) => onChange({ email: event.target.value })}
          placeholder={manifest.fields.email.placeholder}
          maxLength={LIMITS.email}
          autoComplete="email"
          inputMode="email"
          // The browser's own bubble would fire before the form's validation and
          // say something different from the copy below.
          formNoValidate
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? ids.emailError : undefined}
          className="mt-2.5 w-full border-2 border-ink bg-paper px-3.5 py-3 font-display text-lead font-bold outline-none placeholder:font-normal placeholder:text-slate focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-harbour aria-[invalid=true]:border-alert"
        />
        {errors.email ? (
          <p id={ids.emailError} className="mt-2 font-mono text-meta uppercase tracking-[0.1em] text-alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      {/*
        The honeypot.

        Clipped to a 1px box rather than `display: none` — a bot checking
        whether a field is displayed will skip anything hidden outright, and
        this one is meant to look fillable. It is untabbable, aria-hidden and
        has autocomplete off, so nothing filling the form in by hand, by
        password manager or by screen reader can reach it. A script walking the
        DOM for inputs fills it, and the route quietly discards the submission.
      */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="manifest-company" tabIndex={-1}>
          Company — leave this blank
        </label>
        <input
          id="manifest-company"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={data.company_website ?? ""}
          onChange={(event) => onChange({ company_website: event.target.value })}
        />
      </div>

      {/*
        The two single-choice groups share a row once the form is wide enough
        for it, which buys back the height the email field costs. Skills follows
        rather than sitting between them: it is the one group that needs the
        full width, and a fourteen-chip wrap between two short radio rows was
        the reason this column was the tallest thing in the zone.
      */}
      <div className="grid gap-6 @md/form:grid-cols-2">
        <fieldset>
          <legend className="font-display text-meta font-black uppercase tracking-[0.14em]">
            {manifest.fields.role.label}
          </legend>
          <p className="mt-1.5 text-small text-slate">{manifest.fields.role.hint}</p>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {roles.map((role) => (
              <label key={role}>
                <input
                  type="radio"
                  name="manifest-role"
                  value={role}
                  checked={data.role === role}
                  onChange={() => onChange({ role: role as Role })}
                  className="peer sr-only"
                />
                <span className={CHOICE}>{role}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-meta font-black uppercase tracking-[0.14em]">
            {manifest.fields.lookingFor.label}
          </legend>
          <p className="mt-1.5 text-small text-slate">{manifest.fields.lookingFor.hint}</p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {lookingFor.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="manifest-looking"
                  value={option}
                  checked={data.lookingFor === option}
                  onChange={() => onChange({ lookingFor: option as LookingFor })}
                  className="peer sr-only"
                />
                <span className={`${CHOICE} peer-checked:bg-harbour peer-checked:text-paper`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <fieldset>
        <legend className="font-display text-meta font-black uppercase tracking-[0.14em]">
          {manifest.fields.skills.label}
        </legend>
        <p className="mt-1.5 text-small text-slate">
          {manifest.fields.skills.hint}{" "}
          <span className="font-mono text-meta uppercase tracking-[0.1em] text-ink">
            {data.skills.length}/{MAX_SKILLS}
          </span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => {
            const checked = data.skills.includes(skill);
            return (
              <label key={skill}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!checked && atLimit}
                  onChange={() => toggleSkill(skill)}
                  aria-describedby={errors.skills ? ids.skillsError : undefined}
                  className="peer sr-only"
                />
                <span className={`${CHOICE} peer-checked:bg-apricot peer-checked:text-ink`}>
                  {skill}
                </span>
              </label>
            );
          })}
        </div>
        {errors.skills ? (
          <p id={ids.skillsError} className="mt-2.5 font-mono text-meta uppercase tracking-[0.1em] text-alert">
            {errors.skills}
          </p>
        ) : null}
      </fieldset>

      {/*
        Said where the address is asked for, not only in a policy nobody opens.

        The contact for a correction or a deletion is genuinely not decided yet,
        so it renders as TBC alongside the venue and the mentors rather than as
        a plausible-looking address. An unanswered inbox on a privacy notice is
        worse than an admitted gap.
      */}
      <p className="border-t-2 border-ink/25 pt-4 text-small leading-snug text-slate">
        {manifest.privacy.line}{" "}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          {manifest.privacy.contactLabel}: <Tbc />
        </span>
      </p>
    </div>
  );
}
