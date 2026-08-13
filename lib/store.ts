import type { Registration } from "@/lib/registration";

/**
 * Where registrations land.
 *
 * Airtable rather than a database because the people who need this list are
 * running an event, not querying one: matching a lone registrant to a team,
 * mailing everyone when the venue is confirmed, and counting the room are all
 * things an organiser has to do without waiting for a developer.
 *
 * Everything Airtable-shaped is in this file. Swapping to a Sheet, or to
 * Postgres once someone wants constraints, means rewriting `storeRegistration`
 * and nothing else — the route handler only knows the return type.
 *
 * The table needs these columns, spelled exactly as below. `Email` must be the
 * merge field, so it should be the primary field or have a unique view:
 *
 *   Name (text) · Email (text) · Company (text) · Role (select)
 *   Skills (text) · Looking for (select) · Manifest no. (text)
 *   Registered (date, with time)
 *
 * One table holds both forms. An expression of interest fills the first three;
 * `Role`, `Skills`, `Looking for` and `Manifest no.` stay empty until the same
 * person comes back through the manifest, which upserts onto the same row by
 * email. That only works because a write sends the fields it has and no others
 * — see `fieldsFor` below.
 */
const FIELDS = {
  name: "Name",
  email: "Email",
  company: "Company",
  role: "Role",
  skills: "Skills",
  lookingFor: "Looking for",
  manifestNumber: "Manifest no.",
  registeredAt: "Registered",
} as const;

const API = "https://api.airtable.com/v0";

export type StoreResult =
  /** `created` distinguishes a new registrant from someone updating their details. */
  { ok: true; created: boolean } | { ok: false; reason: string };

function config() {
  const token = process.env.AIRTABLE_TOKEN;
  const base = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE || "Registrations";
  return token && base ? { token, base, table } : null;
}

/**
 * Whether the store is wired up at all.
 *
 * Checked before a registration is accepted rather than after: silently
 * dropping someone who filled in a form is worse than telling them it did not
 * work, and a local checkout with no credentials must not look like a success.
 */
export function isStoreConfigured(): boolean {
  return config() !== null;
}

/**
 * Only the fields this submission actually has.
 *
 * An upsert overwrites every field it is given, so sending a key with an empty
 * value is not the same as leaving it out: the first would blank the role and
 * skills of someone who registered interest months ago and has since filled in
 * a full manifest. Omitted keys are left untouched by Airtable, which is what
 * lets one row be built up by two different forms.
 */
function fieldsFor(entry: StoreEntry): Record<string, string> {
  const fields: Record<string, string> = {
    [FIELDS.name]: entry.name,
    [FIELDS.email]: entry.email,
    [FIELDS.registeredAt]: new Date().toISOString(),
  };
  if (entry.company) fields[FIELDS.company] = entry.company;
  if (entry.role) fields[FIELDS.role] = entry.role;
  if (entry.skills?.length) fields[FIELDS.skills] = entry.skills.join(", ");
  if (entry.lookingFor) fields[FIELDS.lookingFor] = entry.lookingFor;
  if (entry.manifestNumber) fields[FIELDS.manifestNumber] = entry.manifestNumber;
  return fields;
}

/**
 * Either form's payload.
 *
 * Name and email are the only things both forms always have — an EOI adds a
 * company, a manifest adds a role, skills, a looking-for and a number. Anything
 * absent is left alone on the row rather than written as blank.
 */
export type StoreEntry = Partial<Registration> &
  Pick<Registration, "name" | "email"> & {
    company?: string;
    manifestNumber?: string;
  };

/**
 * Upsert on email.
 *
 * `performUpsert` makes the duplicate case Airtable's problem rather than a
 * read-then-write in this process, which two submissions landing together would
 * lose. Registering twice updates the row instead of creating a second one, so
 * someone who fixes a typo in their name does not become two people in the
 * count — and someone who expressed interest in March and files a manifest in
 * October is still one person.
 */
export async function storeRegistration(entry: StoreEntry): Promise<StoreResult> {
  const cfg = config();
  if (!cfg) return { ok: false, reason: "store not configured" };

  const body = {
    performUpsert: { fieldsToMergeOn: [FIELDS.email] },
    // `typecast` lets Airtable accept a plain string for a column an organiser
    // has since turned into a select, rather than failing the write.
    typecast: true,
    records: [{ fields: fieldsFor(entry) }],
  };

  try {
    const response = await fetch(`${API}/${cfg.base}/${encodeURIComponent(cfg.table)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      // Never cached, and never prerendered into a static response.
      cache: "no-store",
    });

    if (!response.ok) {
      // The body can contain the request we just sent, so it is summarised for
      // the server log rather than returned to the browser.
      const detail = await response.text().catch(() => "");
      console.error("airtable upsert failed", response.status, detail.slice(0, 300));
      return { ok: false, reason: `airtable ${response.status}` };
    }

    const json = (await response.json()) as { createdRecords?: unknown[] };
    return { ok: true, created: (json.createdRecords?.length ?? 0) > 0 };
  } catch (reason) {
    console.error("airtable upsert threw", reason);
    return { ok: false, reason: "network" };
  }
}
