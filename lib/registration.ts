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
 * What the form holds while it is being filled in.
 *
 * `company` is the honeypot. It is part of the posted payload so the route can
 * see whether something filled it, and deliberately not part of `Registration`
 * so it can never be mistaken for a field worth storing.
 */
export type ManifestFormState = Registration & { company?: string };

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
export const LIMITS = { name: 32, email: 254 } as const;

/*
  Deliberately permissive: something, an @, something, a dot, something.

  Stricter patterns reject addresses that work. The only claim worth making
  here is "this is not obviously a mistake" — the address is proven by the
  confirmation email arriving, which is the check that actually means anything.
*/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const asString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

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

  const email = asString(raw.email).slice(0, LIMITS.email).toLowerCase();
  if (!email) errors.email = manifest.errors.email;
  else if (!EMAIL.test(email)) errors.email = manifest.errors.emailInvalid;

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
