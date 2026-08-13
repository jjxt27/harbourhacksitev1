import { dates, site } from "@/content/canvas";
import type { Eoi, Registration } from "@/lib/registration";

/**
 * The confirmation.
 *
 * Sent through Resend over plain `fetch` rather than the SDK — this is one POST
 * with five fields, and the site's dependency list is short on purpose.
 *
 * It exists to do two things the download cannot. It proves the address is real
 * and typed correctly, which is the only check on an email that means anything;
 * and it is the first of the messages the briefs promise, so the address has
 * demonstrably worked before anyone is relying on it to send a venue.
 */
const API = "https://api.resend.com/emails";

function config() {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.REGISTRATION_FROM_EMAIL;
  return key && from ? { key, from } : null;
}

export function isEmailConfigured(): boolean {
  return config() !== null;
}

/** Kept out of the copy file: this is a transactional message, not site copy. */
function body(entry: Registration & { manifestNumber: string }) {
  const skills = entry.skills.join(" and ");
  const text = [
    `${entry.name} — you're on the manifest.`,
    "",
    `${site.name} ${site.year}, ${site.city}. ${dates.long}.`,
    `Build weekend ${dates.buildWeekend}, pitch night ${dates.pitchNight}.`,
    "",
    `Manifest no.  ${entry.manifestNumber}`,
    `Class         ${entry.role}`,
    `Cargo         ${skills}`,
    `Looking for   ${entry.lookingFor}`,
    "",
    "The venue, times, mentors and prizes aren't confirmed yet. You'll get each",
    "one from us as it is, and nothing else — unsubscribe any time by replying",
    "to this message.",
    "",
    "Don't just build. Ship.",
  ].join("\n");

  return text;
}

/**
 * The expression-of-interest confirmation.
 *
 * Deliberately not the manifest's message with the middle cut out. This one is
 * often the first thing a stranger receives from the event, so it says what
 * they have and have not signed up for — an EOI is not a ticket, and implying
 * otherwise buys a bad surprise later.
 */
function eoiBody(entry: Eoi) {
  return [
    `${entry.name} — you're on the list.`,
    "",
    `${site.name} ${site.year}, ${site.city}. ${dates.long}.`,
    `Build weekend ${dates.buildWeekend}, pitch night ${dates.pitchNight}.`,
    "",
    "This is an expression of interest, not a ticket — nothing is owed either",
    "way. What it means is that when the venue, the times, the mentors and the",
    "prizes are confirmed, you hear about them from us first.",
    "",
    `We have you down as: ${entry.company}`,
    "",
    "If that's wrong, or you'd rather not hear from us at all, reply to this",
    "message and we'll fix it or take you off the list.",
    "",
    "Don't just build. Ship.",
  ].join("\n");
}

/**
 * Returns whether the message was accepted, never throws.
 *
 * A registration that is safely stored is a success even if the confirmation
 * bounces off a misconfigured sending domain. The caller reports the storage
 * outcome to the reader and this failure to the log, because the reader can do
 * nothing about the second one.
 */
export async function sendEoiConfirmation(entry: Eoi): Promise<boolean> {
  return send(entry.email, `You're on the list — ${site.name} ${site.year}`, eoiBody(entry));
}

export async function sendConfirmation(
  entry: Registration & { manifestNumber: string },
): Promise<boolean> {
  return send(
    entry.email,
    `You're on the manifest — ${site.name} ${site.year}`,
    body(entry),
  );
}

async function send(to: string, subject: string, text: string): Promise<boolean> {
  const cfg = config();
  if (!cfg) return false;

  try {
    const response = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: cfg.from, to: [to], subject, text }),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("resend send failed", response.status, detail.slice(0, 300));
      return false;
    }
    return true;
  } catch (reason) {
    console.error("resend send threw", reason);
    return false;
  }
}
