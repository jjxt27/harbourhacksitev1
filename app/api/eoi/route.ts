import { validateEoi } from "@/lib/registration";
import { isStoreConfigured, storeRegistration } from "@/lib/store";
import { sendEoiConfirmation } from "@/lib/email";
import { clientKey, rateLimited, trapped } from "@/lib/guard";

/**
 * Expressions of interest.
 *
 * The live form posts here. Everything it checked in the browser is checked
 * again, because those checks are a courtesy to the reader rather than a
 * control on the endpoint — this route is public and unauthenticated, and a
 * POST does not have to come from the form.
 *
 * It writes to the same Airtable row a full manifest would, merged on email, so
 * someone who registers interest now and files a manifest later is one person
 * rather than two. See /api/manifest, which is built and parked.
 */
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

  // Answered 200 rather than an error: telling a script it was caught is
  // telling it what to change.
  if (trapped(payload)) return Response.json({ ok: true, created: true, emailed: true });

  const checked = validateEoi(payload);
  if (!checked.ok) {
    return Response.json({ ok: false, error: "invalid", errors: checked.errors }, { status: 422 });
  }

  /*
    Refused rather than accepted-and-dropped. With no credentials there is
    nowhere for this to go, and returning success would tell someone they are on
    a list that does not have them.
  */
  if (!isStoreConfigured()) {
    console.error("EOI received with no store configured");
    return Response.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const stored = await storeRegistration(checked.value);
  if (!stored.ok) {
    return Response.json({ ok: false, error: "store_failed" }, { status: 502 });
  }

  // Awaited so a serverless instance is not frozen mid-send, but its result
  // never changes the answer: the EOI is already safely stored.
  const emailed = await sendEoiConfirmation(checked.value);

  return Response.json({ ok: true, created: stored.created, emailed });
}
