import {
  REVIEW_STATUS_LABEL,
  RISK_STATUS_LABEL,
  RISK_LEVEL_LABEL,
} from "@/lib/enums";

const REVIEW_TONE: Record<string, string> = {
  NEW: "bg-ink/5 text-ink border-ink/20",
  REVIEWING: "bg-brass/10 text-brass-deep border-brass/30",
  AWAITING_CLIENT: "bg-forest/10 text-forest border-forest/30",
  ACTION_REQUIRED: "bg-clay/10 text-clay border-clay/30",
  REFERRED_TO_PARTNER: "bg-forest/10 text-forest-deep border-forest/30",
  CLOSED: "bg-charcoal/5 text-charcoal/60 border-charcoal/20",
};

const RISK_STATUS_TONE: Record<string, string> = {
  NEW: "bg-ink/5 text-ink border-ink/20",
  REVIEWING: "bg-brass/10 text-brass-deep border-brass/30",
  CONTACTED: "bg-forest/10 text-forest border-forest/30",
  CLOSED: "bg-charcoal/5 text-charcoal/60 border-charcoal/20",
};

const RISK_LEVEL_TONE: Record<string, string> = {
  LOW_VISIBLE_RISK: "bg-forest/10 text-forest border-forest/30",
  MODERATE_RISK: "bg-brass/10 text-brass-deep border-brass/30",
  HIGH_RISK: "bg-clay/10 text-clay border-clay/40",
  SEVERE_RISK: "bg-clay text-white border-clay",
};

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap";

export function ReviewStatusBadge({ status }: { status: string }) {
  return (
    <span className={`${base} ${REVIEW_TONE[status] ?? REVIEW_TONE.NEW}`}>
      {REVIEW_STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function RiskStatusBadge({ status }: { status: string }) {
  return (
    <span className={`${base} ${RISK_STATUS_TONE[status] ?? RISK_STATUS_TONE.NEW}`}>
      {RISK_STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function RiskLevelBadge({ level }: { level: string }) {
  return (
    <span className={`${base} ${RISK_LEVEL_TONE[level] ?? RISK_LEVEL_TONE.LOW_VISIBLE_RISK}`}>
      {RISK_LEVEL_LABEL[level] ?? level}
    </span>
  );
}
