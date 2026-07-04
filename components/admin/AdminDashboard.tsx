"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Seal, IconShield } from "@/components/icons";
import MobilityReviewsTable from "./MobilityReviewsTable";
import RiskChecksTable from "./RiskChecksTable";
import ComplianceQueue, { buildQueue } from "./ComplianceQueue";
import type { ReviewRow, RiskRow } from "@/lib/admin-types";

type Tab = "reviews" | "risks" | "queue" | "closed";

const TABS: { key: Tab; label: string }[] = [
  { key: "reviews", label: "Mobility Reviews" },
  { key: "risks", label: "Risk Checks" },
  { key: "queue", label: "Compliance Queue" },
  { key: "closed", label: "Closed Matters" },
];

export default function AdminDashboard({
  reviews,
  risks,
  admin,
}: {
  reviews: ReviewRow[];
  risks: RiskRow[];
  admin: { name: string; email: string; role: "OWNER" | "STAFF" };
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("reviews");

  const stats = useMemo(() => {
    const openReviews = reviews.filter((r) => r.status !== "CLOSED");
    const openRisks = risks.filter((r) => r.status !== "CLOSED");
    return {
      totalReviews: reviews.length,
      newReviews: reviews.filter((r) => r.status === "NEW").length,
      totalRisks: risks.length,
      severeRisks: risks.filter((r) => r.riskLevel === "SEVERE_RISK").length,
      highRisks: risks.filter((r) => r.riskLevel === "HIGH_RISK").length,
      openMatters: openReviews.length + openRisks.length,
      queue: buildQueue(reviews, risks).length,
    };
  }, [reviews, risks]);

  const openReviews = reviews.filter((r) => r.status !== "CLOSED");
  const openRisks = risks.filter((r) => r.status !== "CLOSED");
  const closedReviews = reviews.filter((r) => r.status === "CLOSED");
  const closedRisks = risks.filter((r) => r.status === "CLOSED");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-mist">
      {/* Header */}
      <header className="border-b border-hairline bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Seal className="h-8 w-8 text-brass-deep" />
            <div className="leading-none">
              <p className="font-display text-[15px] font-bold text-ink">
                MAGAJI LAW
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-eyebrow text-charcoal/55">
                Operations Console
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {admin.role === "OWNER" && (
              <>
                <Link
                  href="/admin/users"
                  className="rounded-sm px-3 py-2 text-[13px] font-semibold text-charcoal/70 transition-colors hover:text-ink"
                >
                  Users
                </Link>
                <Link
                  href="/admin/audit"
                  className="rounded-sm px-3 py-2 text-[13px] font-semibold text-charcoal/70 transition-colors hover:text-ink"
                >
                  Audit log
                </Link>
              </>
            )}
            <div className="hidden text-right sm:block">
              <p className="text-[13px] font-semibold text-ink">{admin.name}</p>
              <p className="text-[11px] uppercase tracking-wide text-charcoal/50">
                {admin.role === "OWNER" ? "Owner" : "Staff"}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-sm border border-ink/25 px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-brass hover:text-brass-deep"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Compliance reminder */}
        <div className="mb-8 flex gap-3 rounded-md border border-forest/25 bg-forest/[0.05] px-5 py-4">
          <IconShield className="mt-0.5 h-5 w-5 flex-none text-forest" />
          <p className="text-[13px] leading-relaxed text-charcoal/80">
            <span className="font-semibold text-charcoal">
              Compliance Reminder:
            </span>{" "}
            Do not advise on regulated destination-country immigration matters
            unless handled by a properly licensed professional in that
            jurisdiction.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          <Stat label="Total Reviews" value={stats.totalReviews} />
          <Stat label="New Reviews" value={stats.newReviews} accent="brass" />
          <Stat label="Total Risk Checks" value={stats.totalRisks} />
          <Stat label="Severe Risk" value={stats.severeRisks} accent="clay" />
          <Stat label="High Risk" value={stats.highRisks} accent="clay" />
          <Stat label="Open Matters" value={stats.openMatters} accent="forest" />
        </div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap gap-1 border-b border-hairline">
          {TABS.map((t) => {
            const active = tab === t.key;
            const count =
              t.key === "queue"
                ? stats.queue
                : t.key === "reviews"
                ? openReviews.length
                : t.key === "risks"
                ? openRisks.length
                : closedReviews.length + closedRisks.length;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={[
                  "-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                  active
                    ? "border-brass text-ink"
                    : "border-transparent text-charcoal/55 hover:text-ink",
                ].join(" ")}
              >
                {t.label}
                <span className="ml-2 rounded-full bg-ink/5 px-2 py-0.5 text-[11px] text-charcoal/60">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {tab === "reviews" && <MobilityReviewsTable rows={openReviews} />}
          {tab === "risks" && <RiskChecksTable rows={openRisks} />}
          {tab === "queue" && (
            <ComplianceQueue reviews={reviews} risks={risks} />
          )}
          {tab === "closed" && (
            <div className="space-y-8">
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-eyebrow text-charcoal/55">
                  Closed reviews
                </h3>
                <MobilityReviewsTable rows={closedReviews} />
              </div>
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-eyebrow text-charcoal/55">
                  Closed risk checks
                </h3>
                <RiskChecksTable rows={closedRisks} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "brass" | "clay" | "forest";
}) {
  const color =
    accent === "clay"
      ? "text-clay"
      : accent === "forest"
      ? "text-forest"
      : accent === "brass"
      ? "text-brass-deep"
      : "text-ink";
  return (
    <div className="rounded-lg border border-hairline bg-white p-4 shadow-card">
      <p className={`font-display text-3xl ${color}`}>{value}</p>
      <p className="mt-1 text-[12px] font-medium leading-tight text-charcoal/60">
        {label}
      </p>
    </div>
  );
}
