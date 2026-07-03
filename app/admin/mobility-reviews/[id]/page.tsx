import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/admin-types";
import {
  MATTER_TYPE_LABEL,
  PAYMENT_STATUS_LABEL,
  CONTACT_METHOD_LABEL,
} from "@/lib/enums";
import { ReviewStatusBadge } from "@/components/admin/badges";
import DetailField from "@/components/admin/DetailField";
import ReviewEditor from "@/components/admin/ReviewEditor";
import DocumentsPanel from "@/components/admin/DocumentsPanel";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function MobilityReviewDetail({
  params,
}: {
  params: { id: string };
}) {
  if (!isAdminAuthenticated()) redirect("/admin");

  const r = await prisma.mobilityReview.findUnique({ where: { id: params.id } });
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
            <h1 className="font-display text-2xl text-ink">{r.fullName}</h1>
            <p className="mt-1 text-sm text-charcoal/60">
              Mobility review · logged {formatDate(r.createdAt.toISOString())}
            </p>
          </div>
          <ReviewStatusBadge status={r.status} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="space-y-6">
            <section className="rounded-lg border border-hairline bg-white p-6 shadow-card">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-eyebrow text-charcoal/55">
                Submission
              </h2>
              <dl className="grid gap-5 sm:grid-cols-2">
                <DetailField label="Full name" value={r.fullName} />
                <DetailField label="Phone / WhatsApp" value={r.phone} />
                <DetailField label="Email" value={r.email} />
                <DetailField label="Current location" value={r.currentLocation} />
                <DetailField
                  label="Destination country"
                  value={r.destinationCountry}
                />
                <DetailField
                  label="Matter type"
                  value={MATTER_TYPE_LABEL[r.matterType] ?? r.matterType}
                />
                <DetailField
                  label="Payment status"
                  value={
                    r.paymentStatus
                      ? PAYMENT_STATUS_LABEL[r.paymentStatus] ?? r.paymentStatus
                      : null
                  }
                />
                <DetailField
                  label="Amount paid / requested"
                  value={r.amountPaidOrRequested}
                />
                <DetailField
                  label="Agent / company / employer"
                  value={r.agentCompanyEmployer}
                  wide
                />
                <DetailField label="Promise made" value={r.promiseMade} wide />
                <DetailField
                  label="Documents available"
                  value={r.documentsAvailable}
                  wide
                />
                <DetailField label="Main concern" value={r.mainConcern} wide />
                <DetailField
                  label="Preferred contact"
                  value={
                    r.preferredContactMethod
                      ? CONTACT_METHOD_LABEL[r.preferredContactMethod] ??
                        r.preferredContactMethod
                      : null
                  }
                />
                <DetailField
                  label="Compliance acknowledged"
                  value={r.complianceAcknowledged ? "Yes" : "No"}
                />
              </dl>
            </section>

            <DocumentsPanel />
          </div>

          <ReviewEditor
            id={r.id}
            initialStatus={r.status}
            initialNote={r.internalNote ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
