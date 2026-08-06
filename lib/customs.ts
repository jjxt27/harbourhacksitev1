import type { ContainerId, FieldName } from "@/content/customs";
import { manifestNumber } from "@/lib/manifest";

export type DeclarationPayload = Record<FieldName, string> & {
  cargo: readonly ContainerId[];
};

export type CustomsResult =
  | { ok: true; manifestNo: string }
  | { ok: false; reason: string };

/**
 * !!  THERE IS NO BACKEND BEHIND THIS.  !!
 *
 * This resolves after a plausible delay and returns a manifest number derived
 * from what was typed. Nothing is transmitted, nothing is stored, and the email
 * address goes nowhere. It is a stub so the interaction can be built and
 * demonstrated end to end — it is NOT a working expression of interest, and it
 * must not be put in front of students in this state or their registrations
 * will be silently discarded.
 *
 * To make it real, replace the body with a POST and keep the signature:
 *
 *   const response = await fetch("/api/eoi", {
 *     method: "POST",
 *     headers: { "content-type": "application/json" },
 *     body: JSON.stringify(payload),
 *   });
 *   if (!response.ok) return { ok: false, reason: `HTTP ${response.status}` };
 *   return { ok: true, manifestNo: (await response.json()).manifestNo };
 *
 * The route handler is the right place for the manifest number, so that two
 * people cannot be issued the same one, and the only place the email should be
 * persisted.
 */
export async function submitDeclaration(
  payload: DeclarationPayload,
): Promise<CustomsResult> {
  await new Promise((resolve) => setTimeout(resolve, 850));

  if (!payload.name.trim() || !payload.email.trim()) {
    return { ok: false, reason: "incomplete declaration" };
  }

  return { ok: true, manifestNo: manifestNumber(payload.name, payload.cargo) };
}
