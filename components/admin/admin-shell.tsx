"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Cpu, Users, CreditCard, Boxes, Menu, X, ChevronLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const NAV = [
  { href: "/admin/assets", label: "Assets", icon: Boxes, tag: "// SIDEBAR CONFIG" },
  { href: "/admin/user", label: "Users", icon: Users, tag: "// USER MGMT" },
  { href: "/admin/payment", label: "Payments", icon: CreditCard, tag: "// BILLING" },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full">
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-50 lg:z-10 h-screen w-72 shrink-0 border-r-2 border-foreground bg-background flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Cpu size={16} strokeWidth={1.5} />
            <span className="text-xs font-mono tracking-[0.15em] uppercase font-bold">Hasan.lib</span>
            <span className="bg-[#ea580c] px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-widest text-white">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="w-8 h-8 flex items-center justify-center border border-foreground/30 lg:hidden"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <span className="block px-1 pb-2 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
            {"// CONTROL PANEL"}
          </span>
          <div className="flex flex-col gap-1">
            {NAV.map((n) => {
              const Icon = n.icon
              const active = pathname === n.href || pathname.startsWith(n.href + "/")
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-2 py-2.5 text-[11px] font-mono uppercase tracking-widest transition-colors ${
                    active ? "bg-foreground text-background" : "hover:bg-foreground/5"
                  }`}
                >
                  <Icon size={13} strokeWidth={1.5} className={active ? "" : "text-[#ea580c]"} />
                  <span className="flex-1">{n.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t-2 border-foreground p-3">
          <Link
            href="/"
            className="flex items-center gap-2 border border-foreground/30 px-3 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
          >
            <ChevronLeft size={13} strokeWidth={1.5} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b-2 border-foreground bg-background/90 backdrop-blur-sm px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="w-8 h-8 flex items-center justify-center border border-foreground/30 shrink-0"
          >
            <Menu size={14} strokeWidth={1.5} />
          </button>
          <span className="text-xs font-mono tracking-[0.15em] uppercase font-bold">Hasan.lib / Admin</span>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ------------------------- Shared page header ------------------------- */

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="border-b-2 border-foreground px-4 py-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-pixel text-3xl tracking-tight text-foreground">{title}</h1>
          <p className="mt-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            {description}
          </p>
        </div>
        {action}
      </div>
    </div>
  )
}
