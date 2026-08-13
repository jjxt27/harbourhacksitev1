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
 *   Name (text) · Email (text) · Role (text) · Skills (text)
 *   Looking for (text) · Manifest no. (text) · Registered (text)
 */
const FIELDS = {
  name: "Name",
  email: "Email",
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
 * Upsert on email.
 *
 * `performUpsert` makes the duplicate case Airtable's problem rather than a
 * read-then-write in this process, which two submissions landing together would
 * lose. Registering twice updates the row instead of creating a second one, so
 * someone who fixes a typo in their name does not become two people in the
 * count.
 */
export async function storeRegistration(
  entry: Registration & { manifestNumber: string },
): Promise<StoreResult> {
  const cfg = config();
  if (!cfg) return { ok: false, reason: "store not configured" };

  const body = {
    performUpsert: { fieldsToMergeOn: [FIELDS.email] },
    // `typecast` lets Airtable accept a plain string for a column an organiser
    // has since turned into a select, rather than failing the write.
    typecast: true,
    records: [
      {
        fields: {
          [FIELDS.name]: entry.name,
          [FIELDS.email]: entry.email,
          [FIELDS.role]: entry.role,
          [FIELDS.skills]: entry.skills.join(", "),
          [FIELDS.lookingFor]: entry.lookingFor,
          [FIELDS.manifestNumber]: entry.manifestNumber,
          [FIELDS.registeredAt]: new Date().toISOString(),
        },
      },
    ],
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
