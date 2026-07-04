import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UsersManager, { type UserRow } from "@/components/admin/UsersManager";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function UsersPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");
  if (admin.role !== "OWNER") redirect("/admin");

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
  });

  const rows: UserRow[] = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    disabled: u.disabled,
    createdAt: u.createdAt.toISOString(),
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
  }));

  return (
    <div className="min-h-screen bg-mist">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link
          href="/admin"
          className="text-[13px] font-semibold text-brass-deep underline-offset-4 hover:underline"
        >
          ← Back to console
        </Link>
        <h1 className="mt-4 font-display text-2xl text-ink">Admin users</h1>
        <p className="mt-1 text-sm text-charcoal/60">
          Owners can add staff, change roles, and disable access.
        </p>
        <div className="mt-8">
          <UsersManager users={rows} currentAdminId={admin.id} />
        </div>
      </div>
    </div>
  );
}
