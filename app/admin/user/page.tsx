"use client"

import { useMemo, useState } from "react"
import { Search, Users } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-shell"
import { useAdmin, type Plan } from "@/lib/admin-store"

const PLAN_OPTIONS: Plan[] = ["free", "pro", "professional"]

const planBadge: Record<Plan, string> = {
  free: "bg-secondary text-secondary-foreground",
  pro: "bg-[#ea580c] text-white",
  professional: "bg-foreground text-background",
}

export default function UserPage() {
  const { users, setUserPlan, toggleUserStatus } = useAdmin()
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [users, query])

  const stats = useMemo(
    () => ({
      total: users.length,
      pro: users.filter((u) => u.plan === "pro").length,
      professional: users.filter((u) => u.plan === "professional").length,
      suspended: users.filter((u) => u.status === "suspended").length,
    }),
    [users],
  )

  return (
    <div className="flex flex-col">
      <AdminHeader title="USERS" description="View user details and manage their plans" />

      <div className="p-4 lg:p-8 dot-grid-bg space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-2 border-foreground bg-background">
          {[
            { k: stats.total, v: "Total Users" },
            { k: stats.pro, v: "Pro" },
            { k: stats.professional, v: "Professional" },
            { k: stats.suspended, v: "Suspended" },
          ].map((s, i) => (
            <div
              key={s.v}
              className={`p-4 text-center ${i < 3 ? "border-r-2 border-foreground" : ""} ${i < 2 ? "border-b-2 md:border-b-0 border-foreground" : ""}`}
            >
              <p className="font-pixel text-2xl text-foreground">{s.k}</p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 border-2 border-foreground bg-background px-3 py-2">
          <Search size={14} strokeWidth={1.5} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-transparent text-[12px] font-mono outline-none"
          />
        </div>

        {/* Table */}
        <div className="border-2 border-foreground bg-background overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b-2 border-foreground text-left">
                {["User", "Email", "Plan", "Status", "Joined", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[9px] font-mono uppercase tracking-widest text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-foreground/15 last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 shrink-0 bg-foreground text-background flex items-center justify-center font-pixel text-[10px]">
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                      <span className="text-[12px] font-mono">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] font-mono text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-widest ${planBadge[u.plan]}`}
                    >
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest ${
                        u.status === "active" ? "text-emerald-500" : "text-destructive"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 ${u.status === "active" ? "bg-emerald-500" : "bg-destructive"}`}
                      />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] font-mono text-muted-foreground">{u.joinedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={u.plan}
                        onChange={(e) => setUserPlan(u.id, e.target.value as Plan)}
                        aria-label={`Set plan for ${u.name}`}
                        className="border border-foreground/40 bg-background px-2 py-1.5 text-[10px] font-mono uppercase tracking-widest outline-none focus:border-[#ea580c]"
                      >
                        {PLAN_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className="border border-foreground/40 px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors whitespace-nowrap"
                      >
                        {u.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Users size={26} strokeWidth={1.5} className="text-[#ea580c] mb-3" />
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                No users match your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
