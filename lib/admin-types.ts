// Plain, fully-serialisable shapes passed from server components to the client
// admin UI (dates as ISO strings, no Prisma Date objects crossing the boundary).

export type ReviewRow = {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string | null;
  currentLocation: string | null;
  destinationCountry: string;
  matterType: string;
  paymentStatus: string | null;
  amountPaidOrRequested: string | null;
  agentCompanyEmployer: string | null;
  promiseMade: string | null;
  documentsAvailable: string | null;
  mainConcern: string;
  preferredContactMethod: string | null;
  complianceAcknowledged: boolean;
  status: string;
  internalNote: string | null;
};

export type RiskRow = {
  id: string;
  createdAt: string;
  destinationCountry: string;
  mainConcern: string;
  selectedFlags: string[];
  redFlagCount: number;
  riskLevel: string;
  optionalName: string | null;
  optionalPhone: string | null;
  optionalEmail: string | null;
  status: string;
  internalNote: string | null;
};

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
