// Single source of truth for the risk checker: the red-flag list and the
// threshold logic that maps a count to a level. Used by the public checker,
// the API route (to persist), and the admin views.

export const RED_FLAGS = [
  "The agent is promising guaranteed visa approval.",
  "There is no written agreement.",
  "There is no official receipt.",
  "Refund terms are unclear or only verbal.",
  "The arrangement is only on WhatsApp with no traceable office or identity.",
  "The agent is pressuring me to pay quickly.",
  "The employer details are missing or unclear.",
  "There is no employment contract.",
  "The salary or job role is vague.",
  "I was asked to provide false bank statements or false documents.",
  "The agent refused to disclose the visa route.",
  "The payment is going to a personal account.",
  "The offer sounds too good to be true.",
  "I cannot verify the school, employer, company, or sponsor.",
  "The person handling the process gets angry when I ask questions.",
] as const;

export type RiskLevelKey =
  | "LOW_VISIBLE_RISK"
  | "MODERATE_RISK"
  | "HIGH_RISK"
  | "SEVERE_RISK";

export type RiskLevelLabel =
  | "Low Visible Risk"
  | "Moderate Risk"
  | "High Risk"
  | "Severe Risk";

/**
 * Thresholds (inclusive lower bounds):
 *   0–2  -> Low Visible Risk
 *   3–5  -> Moderate Risk
 *   6–9  -> High Risk
 *   10+  -> Severe Risk
 */
export function riskFromCount(count: number): {
  key: RiskLevelKey;
  label: RiskLevelLabel;
} {
  if (count >= 10) return { key: "SEVERE_RISK", label: "Severe Risk" };
  if (count >= 6) return { key: "HIGH_RISK", label: "High Risk" };
  if (count >= 3) return { key: "MODERATE_RISK", label: "Moderate Risk" };
  return { key: "LOW_VISIBLE_RISK", label: "Low Visible Risk" };
}

export const RISK_GUIDANCE: Record<RiskLevelLabel, string> = {
  "Low Visible Risk":
    "No major red flag is visible from your answers, but document review is still recommended before payment or submission.",
  "Moderate Risk":
    "There are warning signs. You should request written terms, verify the agent or employer, and review documents before paying further money.",
  "High Risk":
    "This arrangement may expose you to loss, refusal, or documentation problems. Legal and verification review is strongly recommended before proceeding.",
  "Severe Risk":
    "Do not pay further money without urgent review. The promise may involve serious fraud, false documentation, or a non-transparent process.",
};
