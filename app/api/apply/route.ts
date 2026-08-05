import { NextResponse } from "next/server";
import { site } from "@/content/site";
import { validateApplication } from "@/lib/validateApplication";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]!);

function renderEmail(data: Record<string, string>) {
  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Idea", data.idea],
    ["Problem", data.problem],
    ["Audience", data.audience],
    ["How they would reach them", data.reach],
    ["Optional link", data.link || "Not provided"],
    ["Solo or crew", data.team],
  ];

  const html = rows.map(([key, value]) =>
    `<tr><td style="padding:6px 16px 6px 0;vertical-align:top;color:#5b636d;white-space:nowrap">${key}</td>` +
    `<td style="padding:6px 0;vertical-align:top;color:#0b1016">${escapeHtml(value ?? "")}</td></tr>`,
  ).join("");
  const text = rows.map(([key, value]) => `${key}: ${value}`).join("\n");

  return {
    html: `<table style="font-family:ui-monospace,monospace;font-size:14px;border-collapse:collapse">${html}</table>`,
    text,
  };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: bots fill every field they find, so a value here is never human.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const errors = validateApplication(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const data = Object.fromEntries(
    ["name", "email", "idea", "problem", "audience", "reach", "link", "team"].map(
      (key) => [key, String(body[key] ?? "").trim()],
    ),
  );

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.APPLY_TO_EMAIL;
  const from = process.env.APPLY_FROM_EMAIL;
  const { html, text } = renderEmail(data);
  const isLiveDeploy = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview";

  if (!apiKey || !to || !from) {
    if (isLiveDeploy) {
      console.error("apply: RESEND_API_KEY, APPLY_TO_EMAIL or APPLY_FROM_EMAIL is not set");
      return NextResponse.json({ error: "Mail is not configured." }, { status: 500 });
    }
    console.warn("apply: no mail config, logging submission instead\n" + text);
    return NextResponse.json({ ok: true });
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `${site.shortName} application - ${data.name}`,
      html,
      text,
    }),
  });

  if (!response.ok) {
    console.error("apply: resend rejected the send", response.status, await response.text());
    return NextResponse.json({ error: "Could not send." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
