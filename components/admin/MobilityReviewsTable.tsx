import Link from "next/link";
import { ReviewStatusBadge } from "./badges";
import { formatDate, type ReviewRow } from "@/lib/admin-types";
import { MATTER_TYPE_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/enums";

export default function MobilityReviewsTable({ rows }: { rows: ReviewRow[] }) {
  if (rows.length === 0) {
    return <EmptyState label="No mobility reviews in this view." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-hairline bg-white">
      <table className="w-full min-w-[880px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-hairline bg-mist/60 text-[11px] uppercase tracking-wide text-charcoal/55">
            <Th>Date</Th>
            <Th>Full name</Th>
            <Th>Phone</Th>
            <Th>Destination</Th>
            <Th>Matter</Th>
            <Th>Payment</Th>
            <Th>Status</Th>
            <Th>Concern</Th>
            <Th> </Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-b border-hairline last:border-0 hover:bg-mist/40"
            >
              <Td className="whitespace-nowrap text-charcoal/70">
                {formatDate(r.createdAt)}
              </Td>
              <Td className="font-medium text-ink">{r.fullName}</Td>
              <Td className="whitespace-nowrap text-charcoal/70">{r.phone}</Td>
              <Td className="text-charcoal/70">{r.destinationCountry}</Td>
              <Td className="text-charcoal/70">
                {MATTER_TYPE_LABEL[r.matterType] ?? r.matterType}
              </Td>
              <Td className="whitespace-nowrap text-charcoal/70">
                {r.paymentStatus
                  ? PAYMENT_STATUS_LABEL[r.paymentStatus] ?? r.paymentStatus
                  : "—"}
              </Td>
              <Td>
                <ReviewStatusBadge status={r.status} />
              </Td>
              <Td className="max-w-[220px]">
                <span className="line-clamp-2 text-charcoal/70">
                  {r.mainConcern}
                </span>
              </Td>
              <Td className="whitespace-nowrap">
                <Link
                  href={`/admin/mobility-reviews/${r.id}`}
                  className="font-semibold text-brass-deep underline-offset-4 hover:underline"
                >
                  View Details
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-hairline bg-white px-6 py-14 text-center text-sm text-charcoal/55">
      {label}
    </div>
  );
}
