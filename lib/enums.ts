// Human labels <-> Prisma enum values. Kept framework-agnostic (plain strings)
// so both client components and server code can use them.

// ---- Matter type -------------------------------------------------------------
export const MATTER_TYPE_OPTIONS = [
  "Visit Visa / Travel Documentation",
  "Work Abroad / Job Offer",
  "Study Abroad",
  "Agent Dispute / Refund Issue",
  "Diaspora Legal Support",
  "Business / Investor Mobility",
  "Other",
] as const;

export const MATTER_TYPE_TO_ENUM: Record<string, string> = {
  "Visit Visa / Travel Documentation": "VISIT_VISA_TRAVEL_DOCUMENTATION",
  "Work Abroad / Job Offer": "WORK_ABROAD_JOB_OFFER",
  "Study Abroad": "STUDY_ABROAD",
  "Agent Dispute / Refund Issue": "AGENT_DISPUTE_REFUND",
  "Diaspora Legal Support": "DIASPORA_LEGAL_SUPPORT",
  "Business / Investor Mobility": "BUSINESS_INVESTOR_MOBILITY",
  Other: "OTHER",
};

export const MATTER_TYPE_LABEL: Record<string, string> = {
  VISIT_VISA_TRAVEL_DOCUMENTATION: "Visit Visa / Travel Documentation",
  WORK_ABROAD_JOB_OFFER: "Work Abroad / Job Offer",
  STUDY_ABROAD: "Study Abroad",
  AGENT_DISPUTE_REFUND: "Agent Dispute / Refund Issue",
  DIASPORA_LEGAL_SUPPORT: "Diaspora Legal Support",
  BUSINESS_INVESTOR_MOBILITY: "Business / Investor Mobility",
  OTHER: "Other",
};

// ---- Payment status ----------------------------------------------------------
export const PAYMENT_STATUS_OPTIONS = [
  "No",
  "Yes, partially",
  "Yes, fully",
  "I am about to pay",
] as const;

export const PAYMENT_STATUS_TO_ENUM: Record<string, string> = {
  No: "NO_PAYMENT",
  "Yes, partially": "PARTIAL_PAYMENT",
  "Yes, fully": "FULL_PAYMENT",
  "I am about to pay": "ABOUT_TO_PAY",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  NO_PAYMENT: "No payment",
  PARTIAL_PAYMENT: "Partial payment",
  FULL_PAYMENT: "Full payment",
  ABOUT_TO_PAY: "About to pay",
};

// ---- Preferred contact method ------------------------------------------------
export const CONTACT_METHOD_OPTIONS = ["WhatsApp", "Phone Call", "Email"] as const;

export const CONTACT_METHOD_TO_ENUM: Record<string, string> = {
  WhatsApp: "WHATSAPP",
  "Phone Call": "PHONE_CALL",
  Email: "EMAIL",
};

export const CONTACT_METHOD_LABEL: Record<string, string> = {
  WHATSAPP: "WhatsApp",
  PHONE_CALL: "Phone call",
  EMAIL: "Email",
};

// ---- Review status -----------------------------------------------------------
export const REVIEW_STATUS_OPTIONS = [
  "NEW",
  "REVIEWING",
  "AWAITING_CLIENT",
  "ACTION_REQUIRED",
  "REFERRED_TO_PARTNER",
  "CLOSED",
] as const;

export const REVIEW_STATUS_LABEL: Record<string, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  AWAITING_CLIENT: "Awaiting Client",
  ACTION_REQUIRED: "Action Required",
  REFERRED_TO_PARTNER: "Referred to Partner",
  CLOSED: "Closed",
};

export const REVIEW_STATUS_MEANING: Record<string, string> = {
  NEW: "Received and awaiting initial review.",
  REVIEWING: "Documents or facts are being considered.",
  AWAITING_CLIENT: "Further information is needed from the client.",
  ACTION_REQUIRED:
    "Legal, documentation, partner, or verification action is needed.",
  REFERRED_TO_PARTNER:
    "Regulated foreign or specialist support may be required.",
  CLOSED: "The matter has been completed or closed.",
};

// ---- Risk-check status -------------------------------------------------------
export const RISK_STATUS_OPTIONS = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "CLOSED",
] as const;

export const RISK_STATUS_LABEL: Record<string, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  CONTACTED: "Contacted",
  CLOSED: "Closed",
};

// ---- Risk level --------------------------------------------------------------
export const RISK_LEVEL_LABEL: Record<string, string> = {
  LOW_VISIBLE_RISK: "Low Visible Risk",
  MODERATE_RISK: "Moderate Risk",
  HIGH_RISK: "High Risk",
  SEVERE_RISK: "Severe Risk",
};
