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
import type { ManifestData } from "@/components/manifest/ManifestCard";

const CHOICE =
  "block cursor-pointer border-2 border-ink bg-paper px-3 py-2 text-center font-display text-meta font-black uppercase tracking-tight transition-transform peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-harbour peer-disabled:cursor-not-allowed peer-disabled:opacity-40 hover:-translate-y-0.5";

type ManifestFormProps = {
  data: ManifestData;
  onChange: (next: Partial<ManifestData>) => void;
  errors: Partial<Record<"name" | "skills", string>>;
  ids: { name: string; nameError: string; skillsError: string };
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
    <div className="grid gap-7">
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
          maxLength={32}
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

      <fieldset>
        <legend className="font-display text-meta font-black uppercase tracking-[0.14em]">
          {manifest.fields.lookingFor.label}
        </legend>
        <p className="mt-1.5 text-small text-slate">{manifest.fields.lookingFor.hint}</p>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
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
  );
}
