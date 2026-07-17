"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Cpu, User, Mail, Calendar, Shield, LogOut, Check, ArrowUpRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAdmin, type Plan } from "@/lib/admin-store"

/* Mock default user fallback for the prototype */
const defaultUser = {
  name: "Alex Chen",
  email: "alex@sys.int",
  plan: "free" as Plan,
  status: "active" as const,
  joinedAt: "2025-11-02",
}

const planBadge: Record<Plan, string> = {
  free: "bg-secondary text-foreground",
  pro: "bg-[#ea580c] text-white",
  professional: "bg-foreground text-background",
}

export default function ProfilePage() {
  const { users } = useAdmin()
  const activeUser = users.find((u) => u.id === "u1") || defaultUser

  const [name, setName] = useState(activeUser.name)
  const [email, setEmail] = useState(activeUser.email)
  const [saved, setSaved] = useState(false)

  const field =
    "w-full border-2 border-foreground bg-background px-3 py-2.5 text-[12px] font-mono outline-none focus:border-[#ea580c] transition-colors"
  const labelCls = "block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2"

  function save(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen dot-grid-bg flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Cpu size={16} strokeWidth={1.5} />
          <span className="text-xs font-mono tracking-[0.15em] uppercase font-bold">Hasan.lib</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/signin"
            className="flex items-center gap-2 border-2 border-foreground px-3 py-2 text-[10px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
          >
            <LogOut size={12} /> Log Out
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        {/* Identity header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="border-2 border-foreground bg-background"
        >
          <div className="flex flex-wrap items-center gap-4 border-b-2 border-foreground px-6 py-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-foreground bg-foreground text-background">
              <User size={28} strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-pixel text-3xl tracking-tight">{activeUser.name}</h1>
              <p className="mt-1 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                {activeUser.email}
              </p>
            </div>
            <span
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest ${planBadge[activeUser.plan]}`}
            >
              {activeUser.plan} plan
            </span>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-1 divide-y-2 divide-foreground sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
            <Stat icon={Shield} label="Status" value={activeUser.status} />
            <Stat icon={Calendar} label="Joined" value={activeUser.joinedAt} />
            <Stat icon={Mail} label="Verified" value="Yes" />
          </div>
        </motion.div>

        {/* Account settings */}
        <motion.form
          onSubmit={save}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 border-2 border-foreground bg-background"
        >
          <div className="border-b-2 border-foreground px-6 py-4">
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
              {"// ACCOUNT SETTINGS"}
            </span>
          </div>
          <div className="space-y-4 px-6 py-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>{"// Full Name"}</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className={field} />
              </div>
              <div>
                <label className={labelCls}>{"// Email"}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={field}
                />
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-foreground px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest text-background hover:bg-[#ea580c] hover:text-white transition-colors"
            >
              {saved ? (
                <>
                  <Check size={13} strokeWidth={2} /> Saved
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </motion.form>

        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 border-2 border-foreground bg-background"
        >
          <div className="border-b-2 border-foreground px-6 py-4">
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
              {"// SUBSCRIPTION"}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-6">
            <div>
              <p className="text-[13px] font-mono uppercase tracking-widest">
                Current: <span className="text-[#ea580c]">{activeUser.plan}</span>
              </p>
              <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Manage or upgrade your access tier.
              </p>
            </div>
            <Link
              href="/payment"
              className="flex items-center gap-2 border-2 border-foreground px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
            >
              Upgrade Plan <ArrowUpRight size={13} strokeWidth={2} />
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Shield
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-4">
      <Icon size={16} strokeWidth={1.5} className="text-[#ea580c]" />
      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-[12px] font-mono uppercase tracking-widest">{value}</p>
      </div>
    </div>
  )
}
