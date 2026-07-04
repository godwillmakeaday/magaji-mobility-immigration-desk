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

export type DocRow = {
  id: string;
  createdAt: string;
  fileName: string;
  fileType: string | null;
  fileSize: number | null;
  storageUrl: string | null;
  note: string | null;
};

export function formatBytes(n: number | null): string {
  if (!n && n !== 0) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
