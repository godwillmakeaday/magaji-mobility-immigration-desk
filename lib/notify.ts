// Fail-safe email notifications for new submissions.
//
// Design rules:
//  - NEVER throw into the request path. The submission is already saved; a
//    failed or unconfigured email must not turn a 201 into a 500.
//  - If RESEND_API_KEY / NOTIFY_EMAIL_TO are not set, this is a silent no-op so
//    local/dev and un-provisioned deploys keep working.
//  - A hung provider must not hang the request — every send has a timeout.
//
// Uses Resend's REST API directly (no SDK dependency).

import {
  MATTER_TYPE_LABEL,
  PAYMENT_STATUS_LABEL,
  RISK_LEVEL_LABEL,
} from "@/lib/enums";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const SEND_TIMEOUT_MS = 8000;

function config() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.NOTIFY_EMAIL_FROM || "Magaji Law <onboarding@resend.dev>";
  if (!apiKey || !to) return null;
  return { apiKey, to, from };
}

function esc(v: unknown): string {
  const s = v === null || v === undefined || v === "" ? "—" : String(v);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function send(subject: string, html: string, text: string): Promise<void> {
  const cfg = config();
  if (!cfg) return; // not configured — silent no-op

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: cfg.from,
        to: [cfg.to],
        subject,
        html,
        text,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Email notification failed:", res.status, detail);
    }
  } catch (err) {
    console.error("Email notification error:", err);
  } finally {
    clearTimeout(timer);
  }
}

// ---- Shell -------------------------------------------------------------------
function shell(heading: string, rows: [string, string][], link?: string): string {
  const body = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#6b6b6b;font-size:13px;white-space:nowrap;vertical-align:top">${esc(
          k
        )}</td><td style="padding:6px 12px;color:#14213D;font-size:14px">${esc(
          v
        )}</td></tr>`
    )
    .join("");
  const button = link
    ? `<tr><td colspan="2" style="padding:18px 12px 4px"><a href="${link}" style="display:inline-block;background:#14213D;color:#FBFAF7;text-decoration:none;font-size:13px;font-weight:600;padding:10px 18px;border-radius:3px">Open in admin console</a></td></tr>`
    : "";
  return `<div style="font-family:Arial,Helvetica,sans-serif;background:#FBFAF7;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E6E1D6;border-radius:8px;overflow:hidden">
    <div style="padding:16px 20px;border-bottom:1px solid #E6E1D6">
      <span style="font-size:12px;letter-spacing:2px;color:#8A6D3F;text-transform:uppercase">Magaji Law · Mobility Desk</span>
      <div style="font-size:18px;color:#14213D;font-weight:700;margin-top:4px">${esc(heading)}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;padding:8px">${body}${button}</table>
    <div style="padding:14px 20px;border-top:1px solid #E6E1D6;color:#9a9a9a;font-size:11px">
      Automated notification. Do not advise on regulated destination-country matters unless handled by a licensed professional in that jurisdiction.
    </div>
  </div>
</div>`;
}

// ---- Mobility review ---------------------------------------------------------
export type ReviewNotice = {
  id: string;
  fullName: string;
  phone: string;
  destinationCountry: string;
  matterType: string;
  paymentStatus: string | null;
  mainConcern: string;
};

const PAYMENT_EXPOSED = ["PARTIAL_PAYMENT", "FULL_PAYMENT", "ABOUT_TO_PAY"];

function reviewIsUrgent(r: ReviewNotice): boolean {
  if (r.matterType === "AGENT_DISPUTE_REFUND") return true;
  if (
    r.matterType === "WORK_ABROAD_JOB_OFFER" &&
    r.paymentStatus &&
    PAYMENT_EXPOSED.includes(r.paymentStatus)
  )
    return true;
  return false;
}

export async function notifyNewReview(
  r: ReviewNotice,
  origin: string
): Promise<void> {
  const urgent = reviewIsUrgent(r);
  const subject = `${urgent ? "[URGENT] " : ""}[Magaji Law] New mobility review — ${
    r.fullName
  } (${r.destinationCountry})`;
  const rows: [string, string][] = [
    ["Name", r.fullName],
    ["Phone", r.phone],
    ["Destination", r.destinationCountry],
    ["Matter", MATTER_TYPE_LABEL[r.matterType] ?? r.matterType],
    [
      "Payment",
      r.paymentStatus ? PAYMENT_STATUS_LABEL[r.paymentStatus] ?? r.paymentStatus : "—",
    ],
    ["Concern", r.mainConcern],
  ];
  if (urgent) rows.unshift(["Priority", "Compliance queue — review promptly"]);

  const link = `${origin}/admin/mobility-reviews/${r.id}`;
  const text =
    `${urgent ? "URGENT — " : ""}New mobility review\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\n${link}`;

  await send(subject, shell("New mobility review", rows, link), text);
}

// ---- Risk check --------------------------------------------------------------
export type RiskNotice = {
  id: string;
  destinationCountry: string;
  mainConcern: string;
  redFlagCount: number;
  riskLevel: string;
};

export async function notifyNewRiskCheck(
  r: RiskNotice,
  origin: string
): Promise<void> {
  const urgent = r.riskLevel === "SEVERE_RISK" || r.riskLevel === "HIGH_RISK";
  const level = RISK_LEVEL_LABEL[r.riskLevel] ?? r.riskLevel;
  const subject = `${urgent ? "[URGENT] " : ""}[Magaji Law] New risk check — ${level} (${
    r.destinationCountry
  })`;
  const rows: [string, string][] = [
    ["Risk level", level],
    ["Red flags", String(r.redFlagCount)],
    ["Destination", r.destinationCountry],
    ["Concern", r.mainConcern],
  ];
  if (urgent) rows.unshift(["Priority", "Compliance queue — review promptly"]);

  const link = `${origin}/admin/risk-checks/${r.id}`;
  const text =
    `${urgent ? "URGENT — " : ""}New risk check\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\n${link}`;

  await send(subject, shell("New risk check", rows, link), text);
}
