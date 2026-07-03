import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/admin-types";
import { RiskLevelBadge, RiskStatusBadge } from "@/components/admin/badges";
import DetailField from "@/components/admin/DetailField";
import RiskEditor from "@/components/admin/RiskEditor";
import DocumentsPanel from "@/components/admin/DocumentsPanel";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function RiskCheckDetail({
  params,
}: {
  params: { id: string };
}) {
  if (!isAdminAuthenticated()) redirect("/admin");

  const r = await prisma.riskCheck.findUnique({ where: { id: params.id } });
  if (!r) notFound();

  return (
    <div className="min-h-screen bg-mist">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Link
          href="/admin"
          className="text-[13px] font-semibold text-brass-deep underline-offset-4 hover:underline"
        >
          ← Back to console
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl text-ink">
              Risk check — {r.destinationCountry}
            </h1>
            <p className="mt-1 text-sm text-charcoal/60">
              Logged {formatDate(r.createdAt.toISOString())}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RiskLevelBadge level={r.riskLevel} />
            <RiskStatusBadge status={r.status} />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="space-y-6">
            <section className="rounded-lg border border-hairline bg-white p-6 shadow-card">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-eyebrow text-charcoal/55">
                Assessment
              </h2>
              <dl className="grid gap-5 sm:grid-cols-2">
                <DetailField
                  label="Destination country"
                  value={r.destinationCountry}
                />
                <DetailField label="Red flags" value={String(r.redFlagCount)} />
                <DetailField label="Main concern" value={r.mainConcern} wide />
                <DetailField
                  label="Selected red flags"
                  wide
                  value={
                    r.selectedFlags.length > 0 ? (
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-[14px] text-charcoal/80">
                        {r.selectedFlags.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    ) : null
                  }
                />
                <DetailField label="Name (optional)" value={r.optionalName} />
                <DetailField label="Phone (optional)" value={r.optionalPhone} />
                <DetailField label="Email (optional)" value={r.optionalEmail} />
              </dl>
            </section>

            <DocumentsPanel />
          </div>

          <RiskEditor
            id={r.id}
            initialStatus={r.status}
            initialNote={r.internalNote ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
