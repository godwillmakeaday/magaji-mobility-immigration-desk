import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AUDIT_ACTION_LABEL } from "@/lib/enums";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const FAILURE_ACTIONS = new Set(["LOGIN_FAILURE", "USER_DISABLED", "DOCUMENT_DELETED"]);

export default async function AuditPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");
  if (admin.role !== "OWNER") redirect("/admin");

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="min-h-screen bg-mist">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link
          href="/admin"
          className="text-[13px] font-semibold text-brass-deep underline-offset-4 hover:underline"
        >
          ← Back to console
        </Link>
        <h1 className="mt-4 font-display text-2xl text-ink">Audit log</h1>
        <p className="mt-1 text-sm text-charcoal/60">
          The 100 most recent actions. Sign-ins, status changes, notes, document
          activity, and user administration are recorded.
        </p>

        <div className="mt-8 overflow-x-auto rounded-lg border border-hairline bg-white">
          {logs.length === 0 ? (
            <p className="px-6 py-14 text-center text-sm text-charcoal/55">
              No activity recorded yet.
            </p>
          ) : (
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-hairline bg-mist/60 text-[11px] uppercase tracking-wide text-charcoal/55">
                  <th className="px-4 py-3 font-semibold">When</th>
                  <th className="px-4 py-3 font-semibold">Actor</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Detail</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-hairline last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-charcoal/60">
                      {when(l.createdAt.toISOString())}
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">
                      {l.actorEmail ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                          FAILURE_ACTIONS.has(l.action)
                            ? "border-clay/40 bg-clay/10 text-clay"
                            : "border-ink/15 bg-ink/5 text-ink",
                        ].join(" ")}
                      >
                        {AUDIT_ACTION_LABEL[l.action] ?? l.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">{l.detail ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
