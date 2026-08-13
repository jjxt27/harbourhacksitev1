/**
 * What every public form endpoint does before it trusts a request.
 *
 * Shared by /api/eoi and /api/manifest so the two cannot drift — a rate limit
 * that only one route applies is a rate limit an attacker picks around.
 */

/** Requests per window, per address. */
const LIMIT = 5;
const WINDOW_MS = 60_000;

/*
  Best-effort throttling, and honestly labelled as such.

  This map lives in one server instance. On a platform that runs several, or
  that freezes an idle one, a determined flood gets `LIMIT` attempts per
  instance rather than `LIMIT` overall. It is here to stop a stuck retry loop
  and casual abuse, which is most of it; the upsert on email is what actually
  keeps the table clean. Anything stronger needs shared state — Redis, or the
  platform's own rate limiting in front of the route.
*/
const hits = new Map<string, number[]>();

export function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // The map would otherwise grow for the life of the process.
  if (hits.size > 5_000) {
    for (const [ip, times] of hits) {
      if (times.every((at) => now - at >= WINDOW_MS)) hits.delete(ip);
    }
  }

  return recent.length > LIMIT;
}

/** The left-most entry is the client; the rest are the proxies it passed through. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/**
 * The honeypot field name, shared by both forms.
 *
 * Not `company`: the expression of interest asks for a company for real, and a
 * trap that shares a name with a live field is a trap that eventually eats
 * genuine submissions. `company_website` is plausible enough for a script to
 * fill and is not a field either form will ever want.
 */
export const HONEYPOT = "company_website";

/** True when something filled the field no human can see. */
export function trapped(payload: unknown): boolean {
  const value = (payload as Record<string, unknown> | null)?.[HONEYPOT];
  return typeof value === "string" && value.trim() !== "";
}
