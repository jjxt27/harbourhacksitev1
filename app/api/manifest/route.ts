import { manifestNumber } from "@/lib/manifest";
import { validateRegistration } from "@/lib/registration";
import { isStoreConfigured, storeRegistration } from "@/lib/store";
import { sendConfirmation } from "@/lib/email";

/**
 * Registration.
 *
 * The form in zone three posts here. Everything it checked in the browser is
 * checked again, because those checks are a courtesy to the reader rather than
 * a control on the endpoint — this route is public and unauthenticated, and a
 * POST does not have to come from the form.
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

function rateLimited(key: string): boolean {
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
function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  if (rateLimited(clientKey(request))) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  /*
    The honeypot.

    `company` is rendered off-screen, unlabelled and untabbable, so nobody
    filling the form in can put anything in it. A bot walking the DOM fills
    every input it finds. Answered with 200 rather than an error: telling a
    script it was caught is telling it what to change.
  */
  const trap = (payload as Record<string, unknown> | null)?.company;
  if (typeof trap === "string" && trap.trim() !== "") {
    return Response.json({ ok: true, registered: true, created: true });
  }

  const checked = validateRegistration(payload);
  if (!checked.ok) {
    return Response.json({ ok: false, error: "invalid", errors: checked.errors }, { status: 422 });
  }

  /*
    Refused rather than accepted-and-dropped.

    With no credentials there is nowhere for this to go, and returning success
    would hand someone a boarding pass for a registration that never existed.
    The reader is told it did not work, which is the only honest answer and the
    one they can act on.
  */
  if (!isStoreConfigured()) {
    console.error("registration received with no store configured");
    return Response.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const entry = {
    ...checked.value,
    manifestNumber: manifestNumber(checked.value.name, checked.value.role),
  };

  const stored = await storeRegistration(entry);
  if (!stored.ok) {
    return Response.json({ ok: false, error: "store_failed" }, { status: 502 });
  }

  // Awaited so a serverless instance is not frozen mid-send, but its result
  // never changes the answer: the registration is already safely stored.
  const emailed = await sendConfirmation(entry);

  return Response.json({
    ok: true,
    created: stored.created,
    emailed,
    manifestNumber: entry.manifestNumber,
  });
}
