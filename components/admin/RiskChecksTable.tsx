import Link from "next/link";
import { RiskStatusBadge, RiskLevelBadge } from "./badges";
import { formatDate, type RiskRow } from "@/lib/admin-types";
import { EmptyState } from "./MobilityReviewsTable";

export default function RiskChecksTable({ rows }: { rows: RiskRow[] }) {
  if (rows.length === 0) {
    return <EmptyState label="No risk checks in this view." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-hairline bg-white">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-hairline bg-mist/60 text-[11px] uppercase tracking-wide text-charcoal/55">
            <Th>Date</Th>
            <Th>Destination</Th>
            <Th>Risk level</Th>
            <Th>Red flags</Th>
            <Th>Concern</Th>
            <Th>Status</Th>
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
              <Td className="font-medium text-ink">{r.destinationCountry}</Td>
              <Td>
                <RiskLevelBadge level={r.riskLevel} />
              </Td>
              <Td className="text-charcoal/70">{r.redFlagCount}</Td>
              <Td className="max-w-[240px]">
                <span className="line-clamp-2 text-charcoal/70">
                  {r.mainConcern}
                </span>
              </Td>
              <Td>
                <RiskStatusBadge status={r.status} />
              </Td>
              <Td className="whitespace-nowrap">
                <Link
                  href={`/admin/risk-checks/${r.id}`}
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
