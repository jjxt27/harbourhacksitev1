import { manifestNumber } from "@/lib/manifest";
import { validateRegistration } from "@/lib/registration";
import { isStoreConfigured, storeRegistration } from "@/lib/store";
import { sendConfirmation } from "@/lib/email";
import { clientKey, rateLimited, trapped } from "@/lib/guard";

/**
 * The full manifest — role, skills, looking-for and a boarding pass.
 *
 * **Parked, deliberately.** Nothing routes to the form that posts here: the
 * live ask is the expression of interest at /api/eoi, which is three fields and
 * no card. This is kept whole, and kept working, for the team-forming round it
 * was built for. It is not dead code, and deleting it loses a finished feature.
 *
 * It writes to the same Airtable row an EOI does, merged on email, and sends
 * only the fields it has — so filling in a manifest later adds a role and
 * skills to an existing person rather than creating a second one.
 *
 * Everything the browser checked is checked again here, because those checks
 * are a courtesy to the reader rather than a control on the endpoint.
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
  if (trapped(payload)) return Response.json({ ok: true, registered: true, created: true });

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
