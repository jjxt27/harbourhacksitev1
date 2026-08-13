import {
  MAX_SKILLS,
  eoi,
  lookingFor,
  manifest,
  roles,
  skills,
  type LookingFor,
  type Role,
  type Skill,
} from "@/content/canvas";

/**
 * What the boarding pass shows.
 *
 * This half is public by design — the card exists to be posted in a Discord or
 * on LinkedIn, so everything in this type is something the reader has chosen to
 * publish about themselves.
 */
export type ManifestData = {
  name: string;
  role: Role;
  skills: readonly Skill[];
  lookingFor: LookingFor;
};

/**
 * What registering adds.
 *
 * The email is deliberately not part of `ManifestData` and is never passed to
 * the card. The card is rasterised and downloaded to be shared, and an address
 * printed onto a PNG that someone posts publicly cannot be taken back.
 */
export type Registration = ManifestData & { email: string };

/**
 * What the manifest form holds while it is being filled in.
 *
 * `company_website` is the honeypot — see `lib/guard.ts` for why it is not
 * called `company`. It is part of the posted payload so the route can see
 * whether something filled it, and deliberately not part of `Registration` so
 * it can never be mistaken for a field worth storing.
 */
export type ManifestFormState = Registration & { company_website?: string };

export type FieldName = "name" | "email" | "skills";
export type FieldErrors = Partial<Record<FieldName, string>>;

export type Validated =
  | { ok: true; value: Registration }
  | { ok: false; errors: FieldErrors };

/**
 * Caps, applied on both sides.
 *
 * 254 is the maximum length of an email address that can actually be delivered
 * (RFC 5321). The name cap matches the `maxLength` on the input, so the client
 * and the server agree about what is too long.
 */
export const LIMITS = { name: 32, email: 254, company: 64 } as const;

/**
 * An expression of interest: the three fields the live form asks for.
 *
 * Separate from `Registration` rather than a subset of it, because the two are
 * answered by different people at different moments. Everything below that
 * mentions role, skills or looking-for belongs to the manifest, which is parked
 * until there is a team-forming round — it is kept working, not left to rot.
 */
export type Eoi = { name: string; email: string; company: string };

/** Form state: the EOI plus the honeypot, which is posted but never stored. */
export type EoiFormState = Eoi & { company_website?: string };

export type EoiField = "name" | "email" | "company";
export type EoiErrors = Partial<Record<EoiField, string>>;

export type EoiValidated =
  | { ok: true; value: Eoi }
  | { ok: false; errors: EoiErrors };

/*
  Deliberately permissive: something, an @, something, a dot, something.

  Stricter patterns reject addresses that work. The only claim worth making
  here is "this is not obviously a mistake" — the address is proven by the
  confirmation email arriving, which is the check that actually means anything.
*/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const asString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** Shared by both forms, so one address is judged the same way twice. */
function checkEmail(raw: unknown, copy: { email: string; emailInvalid: string }) {
  const email = asString(raw).slice(0, LIMITS.email).toLowerCase();
  if (!email) return { email, error: copy.email };
  if (!EMAIL.test(email)) return { email, error: copy.emailInvalid };
  return { email, error: null };
}

/**
 * The expression of interest.
 *
 * Run in the browser for the error messages and again in the route for the
 * truth, the same as the manifest — the endpoint is public, and a POST does not
 * have to come from the form.
 *
 * Company is required. It is the one field here that could reasonably be
 * optional, and it is not, because "Student" and "building my own thing" are
 * answers worth having and a blank box collects neither. The hint offers both
 * rather than leaving someone to guess whether they qualify.
 */
export function validateEoi(input: unknown): EoiValidated {
  const errors: EoiErrors = {};
  const raw = (input ?? {}) as Record<string, unknown>;

  const name = asString(raw.name).slice(0, LIMITS.name);
  if (!name) errors.name = eoi.errors.name;

  const { email, error } = checkEmail(raw.email, eoi.errors);
  if (error) errors.email = error;

  const company = asString(raw.company).slice(0, LIMITS.company);
  if (!company) errors.company = eoi.errors.company;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { name, email, company } };
}

/**
 * The single validator, run in the browser for the error messages and again on
 * the server for the truth.
 *
 * The client renders radios and checkboxes, so a normal visitor cannot submit a
 * role or a skill that is not on the list — but the endpoint is public and a
 * POST is a POST, so every enum is checked against the source list rather than
 * assumed. Unknown values are rejected outright instead of being coerced to a
 * default, because a silently corrected registration is a wrong one.
 */
export function validateRegistration(input: unknown): Validated {
  const errors: FieldErrors = {};
  const raw = (input ?? {}) as Record<string, unknown>;

  const name = asString(raw.name).slice(0, LIMITS.name);
  if (!name) errors.name = manifest.errors.name;

  const { email, error } = checkEmail(raw.email, manifest.errors);
  if (error) errors.email = error;

  const chosen = Array.isArray(raw.skills) ? raw.skills : [];
  const picked = chosen.filter((s): s is Skill =>
    (skills as readonly string[]).includes(s as string),
  );
  // De-duplicated before the count, or the same skill sent twice would pass a
  // check the interface makes impossible.
  const unique = [...new Set(picked)];
  if (unique.length === 0) errors.skills = manifest.errors.skills;

  const role = roles.includes(raw.role as Role) ? (raw.role as Role) : null;
  const wants = lookingFor.includes(raw.lookingFor as LookingFor)
    ? (raw.lookingFor as LookingFor)
    : null;

  /*
    Role and looking-for get no field error, and deliberately do not borrow
    another field's.

    Both are radio groups with a default already selected, so the interface
    cannot produce a bad value for either; anything invalid here arrived from
    something other than the form. Refusing with an empty error set leaves the
    caller to say "that didn't save", which is true. Pinning it on the name
    would tell someone who did fill in their name to go and fill it in.
  */
  if (Object.keys(errors).length > 0 || !role || !wants) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: { name, email, role, skills: unique.slice(0, MAX_SKILLS), lookingFor: wants },
  };
}
