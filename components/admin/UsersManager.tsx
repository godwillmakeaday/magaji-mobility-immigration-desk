"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/admin-types";
import { ADMIN_ROLE_LABEL } from "@/lib/enums";

export type UserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  disabled: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

export default function UsersManager({
  users,
  currentAdminId,
}: {
  users: UserRow[];
  currentAdminId: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STAFF");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [rowError, setRowError] = useState("");

  async function addUser() {
    setBusy(true);
    setErrors({});
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setErrors({ form: data.error || "Could not create user." });
        return;
      }
      setName("");
      setEmail("");
      setRole("STAFF");
      setPassword("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setRowError("");
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setRowError(data.error || "Update failed.");
      return;
    }
    router.refresh();
  }

  const field =
    "mt-1 w-full rounded-sm border border-hairline bg-paper px-3 py-2 text-[14px] text-ink focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

  return (
    <div className="space-y-8">
      {/* Add user */}
      <div className="rounded-lg border border-hairline bg-white p-6 shadow-card">
        <h2 className="text-xs font-semibold uppercase tracking-eyebrow text-charcoal/55">
          Add a user
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[13px] font-semibold text-charcoal/80">Name</label>
            <input className={field} value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name && <p className="mt-1 text-[12px] text-clay">{errors.name}</p>}
          </div>
          <div>
            <label className="text-[13px] font-semibold text-charcoal/80">Email</label>
            <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <p className="mt-1 text-[12px] text-clay">{errors.email}</p>}
          </div>
          <div>
            <label className="text-[13px] font-semibold text-charcoal/80">Role</label>
            <select className={field} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="STAFF">Staff</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
          <div>
            <label className="text-[13px] font-semibold text-charcoal/80">
              Temporary password
            </label>
            <input className={field} type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 10 characters" />
            {errors.password && <p className="mt-1 text-[12px] text-clay">{errors.password}</p>}
          </div>
        </div>
        {errors.form && <p className="mt-3 text-[13px] text-clay">{errors.form}</p>}
        <button
          type="button"
          onClick={addUser}
          disabled={busy || !name || !email || !password}
          className="mt-5 rounded-sm border border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-charcoal disabled:opacity-50"
        >
          {busy ? "Adding…" : "Add user"}
        </button>
        <p className="mt-3 text-[12px] text-charcoal/55">
          Share the temporary password with the user over a secure channel. (A
          self-service password change can be added later.)
        </p>
      </div>

      {/* List */}
      <div className="overflow-x-auto rounded-lg border border-hairline bg-white">
        {rowError && <p className="px-4 pt-3 text-[13px] text-clay">{rowError}</p>}
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-hairline bg-mist/60 text-[11px] uppercase tracking-wide text-charcoal/55">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Last login</th>
              <th className="px-4 py-3 font-semibold">Access</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === currentAdminId;
              return (
                <tr key={u.id} className="border-b border-hairline last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">
                    {u.name}
                    {isSelf && (
                      <span className="ml-2 text-[11px] font-normal text-charcoal/45">
                        (you)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{u.email}</td>
                  <td className="px-4 py-3">
                    {isSelf ? (
                      <span className="text-charcoal/70">
                        {ADMIN_ROLE_LABEL[u.role] ?? u.role}
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => patch(u.id, { role: e.target.value })}
                        className="rounded-sm border border-hairline bg-paper px-2 py-1 text-[13px] text-ink focus:border-forest focus:outline-none"
                      >
                        <option value="STAFF">Staff</option>
                        <option value="OWNER">Owner</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-charcoal/60">
                    {u.lastLoginAt ? formatDate(u.lastLoginAt) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {isSelf ? (
                      <span className="text-[13px] text-charcoal/45">—</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => patch(u.id, { disabled: !u.disabled })}
                        className={[
                          "rounded-sm border px-3 py-1 text-[12px] font-semibold transition-colors",
                          u.disabled
                            ? "border-forest/40 text-forest hover:bg-forest/5"
                            : "border-clay/40 text-clay hover:bg-clay/5",
                        ].join(" ")}
                      >
                        {u.disabled ? "Enable" : "Disable"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
