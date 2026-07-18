"use client"

import { useMemo, useState } from "react"
import { Check, X, CreditCard } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-shell"
import { useAdmin, type Payment } from "@/lib/admin-store"

type Filter = "pending" | "approved" | "rejected" | "all"

const FILTERS: Filter[] = ["pending", "approved", "rejected", "all"]

const statusStyle: Record<Payment["status"], string> = {
  pending: "text-[#ea580c]",
  approved: "text-emerald-500",
  rejected: "text-destructive",
}

const planBadge: Record<Payment["requestedPlan"], string> = {
  pro: "bg-[#ea580c] text-white",
  professional: "bg-foreground text-background",
}

export default function PaymentPage() {
  const { payments, approvePayment, rejectPayment } = useAdmin()
  const [filter, setFilter] = useState<Filter>("pending")

  const filtered = useMemo(
    () => (filter === "all" ? payments : payments.filter((p) => p.status === filter)),
    [payments, filter],
  )

  const pendingRevenue = useMemo(
    () => payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
    [payments],
  )
  const approvedRevenue = useMemo(
    () => payments.filter((p) => p.status === "approved").reduce((sum, p) => sum + p.amount, 0),
    [payments],
  )

  return (
    <div className="flex flex-col">
      <AdminHeader title="PAYMENTS" description="Approve payments and promote users to their plan" />

      <div className="p-4 lg:p-8 dot-grid-bg space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 border-2 border-foreground bg-background">
          {[
            { k: payments.filter((p) => p.status === "pending").length, v: "Pending" },
            { k: `$${pendingRevenue}`, v: "Pending Revenue" },
            { k: `$${approvedRevenue}`, v: "Approved Revenue" },
          ].map((s, i) => (
            <div
              key={s.v}
              className={`p-4 text-center ${i < 2 ? "border-r-2 border-foreground" : ""} ${i < 1 ? "border-b-2 md:border-b-0 border-foreground" : ""}`}
            >
              <p className="font-pixel text-2xl text-foreground">{s.k}</p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap border-2 border-foreground w-fit">
          {FILTERS.map((f, i) => {
            const active = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors ${
                  i > 0 ? "border-l-2 border-foreground" : ""
                } ${active ? "bg-foreground text-background" : "hover:bg-foreground/5"}`}
              >
                {f}
              </button>
            )
          })}
        </div>

        {/* Payment cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-foreground p-12 text-center">
            <CreditCard size={26} strokeWidth={1.5} className="text-[#ea580c] mb-3" />
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              No {filter === "all" ? "" : filter} payments.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((p) => (
              <div key={p.id} className="border-2 border-foreground bg-background">
                <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono">{p.userName}</span>
                    <span
                      className={`px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-widest ${planBadge[p.requestedPlan]}`}
                    >
                      {p.requestedPlan}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest ${statusStyle[p.status]}`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="px-4 py-3 space-y-2">
                  <Row label="Amount" value={`$${p.amount}`} />
                  <Row label="Email" value={p.userEmail} />
                  <Row label="Coin" value={`${p.coin} (${p.network})`} />
                  <Row label="TxID" value={p.txId.slice(0, 30) + "..."} />
                  <Row label="Submitted" value={p.submittedAt} />
                </div>

                {p.status === "pending" && (
                  <div className="flex border-t-2 border-foreground">
                    <button
                      onClick={() => approvePayment(p.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 bg-foreground text-background py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                    >
                      <Check size={13} strokeWidth={2} /> Approve &amp; Promote
                    </button>
                    <button
                      onClick={() => rejectPayment(p.id)}
                      className="flex items-center justify-center gap-1.5 border-l-2 border-foreground px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X size={13} strokeWidth={2} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-[11px] font-mono truncate">{value}</span>
    </div>
  )
}
