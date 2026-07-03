import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import type { ReviewRow, RiskRow } from "@/lib/admin-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminPage() {
  if (!isAdminAuthenticated()) {
    return <AdminLogin />;
  }

  const [reviews, risks] = await Promise.all([
    prisma.mobilityReview.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.riskCheck.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const reviewRows: ReviewRow[] = reviews.map((r) => ({
    id: r.id,
    createdAt: r.createdAt.toISOString(),
    fullName: r.fullName,
    phone: r.phone,
    email: r.email,
    currentLocation: r.currentLocation,
    destinationCountry: r.destinationCountry,
    matterType: r.matterType,
    paymentStatus: r.paymentStatus,
    amountPaidOrRequested: r.amountPaidOrRequested,
    agentCompanyEmployer: r.agentCompanyEmployer,
    promiseMade: r.promiseMade,
    documentsAvailable: r.documentsAvailable,
    mainConcern: r.mainConcern,
    preferredContactMethod: r.preferredContactMethod,
    complianceAcknowledged: r.complianceAcknowledged,
    status: r.status,
    internalNote: r.internalNote,
  }));

  const riskRows: RiskRow[] = risks.map((r) => ({
    id: r.id,
    createdAt: r.createdAt.toISOString(),
    destinationCountry: r.destinationCountry,
    mainConcern: r.mainConcern,
    selectedFlags: r.selectedFlags,
    redFlagCount: r.redFlagCount,
    riskLevel: r.riskLevel,
    optionalName: r.optionalName,
    optionalPhone: r.optionalPhone,
    optionalEmail: r.optionalEmail,
    status: r.status,
    internalNote: r.internalNote,
  }));

  return <AdminDashboard reviews={reviewRows} risks={riskRows} />;
}
