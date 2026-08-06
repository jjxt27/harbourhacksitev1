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

/**
 * A selectable option.
 *
 * Underlined rather than boxed, and selected by a brass rule beneath rather
 * than a fill. Fourteen filled chips on a dark ground is a control panel; the
 * same fourteen as a line of type with one underlined is a list with a choice
 * made in it.
 */
const CHOICE = [
  "block cursor-pointer border-b pb-2 pt-1 text-left font-sans text-small transition-colors",
  "border-ivory/15 text-ivory-dim hover:border-ivory/40 hover:text-ivory",
  "peer-checked:border-brass peer-checked:text-ivory",
  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-brass",
  "peer-disabled:cursor-not-allowed peer-disabled:opacity-35 peer-disabled:hover:border-ivory/15",
].join(" ");

const FIELD =
  "mt-3 w-full border-0 border-b border-ivory/20 bg-transparent pb-3 font-display text-[1.6rem] font-semibold text-ivory outline-none transition-colors placeholder:font-sans placeholder:text-body placeholder:font-normal placeholder:text-ivory-faint focus:border-brass focus-visible:outline-none aria-[invalid=true]:border-alert";

const LEGEND = "font-sans text-micro font-medium uppercase tracking-[0.28em] text-ivory-faint";

type ManifestFormProps = {
  data: ManifestData;
  onChange: (next: Partial<ManifestData>) => void;
  errors: Partial<Record<"name" | "skills", string>>;
  ids: { name: string; nameError: string; skillsError: string };
};

/**
 * The manifest inputs.
 *
 * Native radios and checkboxes under styled labels rather than buttons with
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
    <div className="grid gap-10">
      <div>
        <label htmlFor={ids.name} className={LEGEND}>
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
          className={FIELD}
        />
        {errors.name ? (
          <p id={ids.nameError} className="mt-3 font-sans text-small text-alert">
            {errors.name}
          </p>
        ) : null}
      </div>

      <fieldset>
        <legend className={LEGEND}>{manifest.fields.role.label}</legend>
        <p className="mt-2 font-sans text-small text-ivory-faint">{manifest.fields.role.hint}</p>
        <div className="mt-5 grid grid-cols-3 gap-x-6">
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
        <legend className={LEGEND}>{manifest.fields.skills.label}</legend>
        <p className="mt-2 font-sans text-small text-ivory-faint">
          {manifest.fields.skills.hint}{" "}
          <span className="text-ivory-dim">
            {data.skills.length} of {MAX_SKILLS} selected
          </span>
        </p>
        <div className="mt-5 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-4">
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
                <span className={CHOICE}>{skill}</span>
              </label>
            );
          })}
        </div>
        {errors.skills ? (
          <p id={ids.skillsError} className="mt-4 font-sans text-small text-alert">
            {errors.skills}
          </p>
        ) : null}
      </fieldset>

      <fieldset>
        <legend className={LEGEND}>{manifest.fields.lookingFor.label}</legend>
        <p className="mt-2 font-sans text-small text-ivory-faint">
          {manifest.fields.lookingFor.hint}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-x-6 sm:grid-cols-4">
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
              <span className={CHOICE}>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
