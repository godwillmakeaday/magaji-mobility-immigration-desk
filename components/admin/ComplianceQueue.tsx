import Link from "next/link";
import { RiskLevelBadge } from "./badges";
import { formatDate, type ReviewRow, type RiskRow } from "@/lib/admin-types";
import { MATTER_TYPE_LABEL } from "@/lib/enums";
import { EmptyState } from "./MobilityReviewsTable";

const PAYMENT_EXPOSED = ["PARTIAL_PAYMENT", "FULL_PAYMENT", "ABOUT_TO_PAY"];

type QueueItem = {
  id: string;
  href: string;
  createdAt: string;
  title: string;
  detail: string;
  reason: string;
  severe: boolean;
  badge?: React.ReactNode;
};

export function buildQueue(reviews: ReviewRow[], risks: RiskRow[]): QueueItem[] {
  const items: QueueItem[] = [];

  for (const r of risks) {
    if (r.status === "CLOSED") continue;
    if (r.riskLevel === "SEVERE_RISK" || r.riskLevel === "HIGH_RISK") {
      items.push({
        id: `risk-${r.id}`,
        href: `/admin/risk-checks/${r.id}`,
        createdAt: r.createdAt,
        title: `Risk check — ${r.destinationCountry}`,
        detail: r.mainConcern,
        reason: r.riskLevel === "SEVERE_RISK" ? "Severe risk" : "High risk",
        severe: r.riskLevel === "SEVERE_RISK",
        badge: <RiskLevelBadge level={r.riskLevel} />,
      });
    }
  }

  for (const r of reviews) {
    if (r.status === "CLOSED") continue;
    const isDispute = r.matterType === "AGENT_DISPUTE_REFUND";
    const isExposedJob =
      r.matterType === "WORK_ABROAD_JOB_OFFER" &&
      !!r.paymentStatus &&
      PAYMENT_EXPOSED.includes(r.paymentStatus);
    if (isDispute || isExposedJob) {
      items.push({
        id: `review-${r.id}`,
        href: `/admin/mobility-reviews/${r.id}`,
        createdAt: r.createdAt,
        title: `${r.fullName} — ${r.destinationCountry}`,
        detail: r.mainConcern,
        reason: isDispute
          ? "Agent dispute / refund"
          : "Job offer with payment exposure",
        severe: isDispute,
      });
    }
  }

  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export default function ComplianceQueue({
  reviews,
  risks,
}: {
  reviews: ReviewRow[];
  risks: RiskRow[];
}) {
  const items = buildQueue(reviews, risks);

  if (items.length === 0) {
    return <EmptyState label="Nothing in the compliance queue right now." />;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={[
            "flex items-start justify-between gap-4 rounded-lg border bg-white px-5 py-4 transition-colors hover:bg-mist/40",
            item.severe ? "border-clay/40" : "border-hairline",
          ].join(" ")}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={[
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                  item.severe
                    ? "border-clay/40 bg-clay/10 text-clay"
                    : "border-brass/30 bg-brass/10 text-brass-deep",
                ].join(" ")}
              >
                {item.reason}
              </span>
              {item.badge}
            </div>
            <p className="mt-2 font-medium text-ink">{item.title}</p>
            <p className="mt-0.5 line-clamp-1 text-sm text-charcoal/65">
              {item.detail}
            </p>
          </div>
          <span className="whitespace-nowrap text-xs text-charcoal/50">
            {formatDate(item.createdAt)}
          </span>
        </Link>
      ))}
    </div>
  );
}
