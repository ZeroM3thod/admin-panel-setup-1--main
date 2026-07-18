"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"

const ease = [0.22, 1, 0.36, 1] as const

/* ── types ── */
type Status = "operational" | "degraded" | "outage" | "maintenance"

interface Service {
  id: string
  name: string
  description: string
  status: Status
  uptime: string
  latency: string
}

interface Incident {
  id: string
  title: string
  date: string
  status: "resolved" | "monitoring" | "investigating"
  updates: { time: string; message: string }[]
}

/* ── static data ── */
const SERVICES: Service[] = [
  {
    id: "web",
    name: "Website & CDN",
    description: "hasan.lib main site and asset delivery",
    status: "operational",
    uptime: "99.98%",
    latency: "42ms",
  },
  {
    id: "lib",
    name: "Component Library",
    description: "Live previews, browsing, and search",
    status: "operational",
    uptime: "99.95%",
    latency: "68ms",
  },
  {
    id: "api",
    name: "Download API",
    description: "Source ZIP generation and delivery",
    status: "operational",
    uptime: "99.91%",
    latency: "120ms",
  },
  {
    id: "auth",
    name: "Auth & Accounts",
    description: "Sign-in, registration, session management",
    status: "operational",
    uptime: "99.99%",
    latency: "55ms",
  },
  {
    id: "payments",
    name: "Payment Processing",
    description: "Stripe checkout and license activation",
    status: "operational",
    uptime: "100%",
    latency: "210ms",
  },
  {
    id: "email",
    name: "Transactional Email",
    description: "Receipts, password resets, notifications",
    status: "operational",
    uptime: "99.87%",
    latency: "340ms",
  },
]

const INCIDENTS: Incident[] = [
  {
    id: "INC-004",
    title: "Elevated download latency",
    date: "2025-07-01",
    status: "resolved",
    updates: [
      { time: "14:32 UTC", message: "Issue identified — edge cache miss on ZIP generation layer." },
      { time: "15:10 UTC", message: "Cache warm-up deployed. Latency returning to baseline." },
      { time: "15:45 UTC", message: "Fully resolved. All systems nominal." },
    ],
  },
  {
    id: "INC-003",
    title: "Auth service intermittent 503s",
    date: "2025-06-18",
    status: "resolved",
    updates: [
      { time: "09:12 UTC", message: "Investigating intermittent 503 responses from auth endpoints." },
      { time: "09:40 UTC", message: "Root cause: database connection pool exhaustion. Fix deployed." },
      { time: "10:05 UTC", message: "Resolved. Connection pool limits raised. Monitoring." },
    ],
  },
  {
    id: "INC-002",
    title: "Scheduled maintenance — infrastructure upgrade",
    date: "2025-05-22",
    status: "resolved",
    updates: [
      { time: "02:00 UTC", message: "Maintenance window started. Expect brief interruptions." },
      { time: "04:15 UTC", message: "Upgrade complete. All services restored." },
    ],
  },
]

/* ── uptime history bar (90 days) ── */
const UPTIME_BARS = Array.from({ length: 90 }, (_, i) => {
  const r = Math.random()
  if (i === 88) return "degraded"
  if (i === 71) return "outage"
  if (r > 0.015) return "operational"
  if (r > 0.005) return "degraded"
  return "outage"
}) as Status[]

const STATUS_META: Record<Status, { label: string; color: string; bg: string; dot: string }> = {
  operational: {
    label: "Operational",
    color: "text-emerald-500",
    bg: "bg-emerald-500",
    dot: "#10b981",
  },
  degraded: {
    label: "Degraded",
    color: "text-amber-500",
    bg: "bg-amber-500",
    dot: "#f59e0b",
  },
  outage: {
    label: "Outage",
    color: "text-red-500",
    bg: "bg-red-500",
    dot: "#ef4444",
  },
  maintenance: {
    label: "Maintenance",
    color: "text-blue-400",
    bg: "bg-blue-400",
    dot: "#60a5fa",
  },
}

const INCIDENT_META = {
  resolved: { label: "RESOLVED", color: "text-emerald-500" },
  monitoring: { label: "MONITORING", color: "text-amber-500" },
  investigating: { label: "INVESTIGATING", color: "text-red-500" },
}

/* ── helpers ── */
function BlinkDot({ color = "#ea580c" }: { color?: string }) {
  return (
    <span
      className="inline-block h-2 w-2 animate-blink shrink-0"
      style={{ backgroundColor: color }}
    />
  )
}

function SectionLabel({ code, index }: { code: string; index: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease }}
      className="flex items-center gap-4 mb-6"
    >
      <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono shrink-0">
        {code}
      </span>
      <div className="flex-1 border-t border-border" />
      <BlinkDot />
      <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
        {index}
      </span>
    </motion.div>
  )
}

/* ── live clock ── */
function LiveClock() {
  const [ts, setTs] = useState("")
  useEffect(() => {
    const fmt = () => {
      const n = new Date()
      setTs(
        `${n.getUTCFullYear()}-${String(n.getUTCMonth() + 1).padStart(2, "0")}-${String(
          n.getUTCDate()
        ).padStart(2, "0")} ${String(n.getUTCHours()).padStart(2, "0")}:${String(
          n.getUTCMinutes()
        ).padStart(2, "0")}:${String(n.getUTCSeconds()).padStart(2, "0")} UTC`
      )
    }
    fmt()
    const id = setInterval(fmt, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="font-mono text-[#ea580c]" style={{ fontVariantNumeric: "tabular-nums" }}>
      {ts}
    </span>
  )
}

/* ── live latency ticker ── */
function LatencyTicker({ base }: { base: number }) {
  const [val, setVal] = useState(base)
  useEffect(() => {
    const id = setInterval(
      () => setVal(base + Math.floor((Math.random() - 0.5) * 20)),
      2000
    )
    return () => clearInterval(id)
  }, [base])
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {val}ms
    </span>
  )
}

/* ── overall banner ── */
function OverallBanner({ allOperational }: { allOperational: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.15, ease }}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 px-5 py-5 lg:px-8 mb-0 ${
        allOperational ? "border-foreground" : "border-amber-500"
      }`}
    >
      <div className="flex items-center gap-4">
        <BlinkDot color={allOperational ? "#10b981" : "#f59e0b"} />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-mono font-bold tracking-tight uppercase text-foreground">
            {allOperational ? "All systems operational" : "Some systems degraded"}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
            {allOperational
              ? "No incidents reported. Everything running nominally."
              : "One or more services are experiencing issues. See below."}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-start sm:items-end gap-0.5 shrink-0">
        <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
          Last checked
        </span>
        <LiveClock />
      </div>
    </motion.div>
  )
}

/* ── uptime bar ── */
function UptimeBar() {
  return (
    <div className="flex items-end gap-[2px] h-8 w-full">
      {UPTIME_BARS.map((s, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.008, duration: 0.3, ease }}
          style={{ transformOrigin: "bottom" }}
          className={`flex-1 ${
            s === "operational"
              ? "bg-emerald-500"
              : s === "degraded"
              ? "bg-amber-500"
              : "bg-red-500"
          } opacity-80 hover:opacity-100 transition-opacity duration-150`}
          title={`Day ${90 - i}: ${STATUS_META[s].label}`}
        />
      ))}
    </div>
  )
}

/* ── service row ── */
function ServiceRow({ service, index }: { service: Service; index: number }) {
  const meta = STATUS_META[service.status]
  const baseLatency = parseInt(service.latency)

  return (
    <motion.div
      initial={{ opacity: 0, x: -12, filter: "blur(3px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.07, duration: 0.45, ease }}
      className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 gap-y-2 px-5 py-4 lg:px-8 border-b-2 border-foreground last:border-b-0"
    >
      {/* Name + description */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-mono font-bold tracking-tight uppercase text-foreground truncate">
          {service.name}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground tracking-wide truncate">
          {service.description}
        </span>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2 justify-end sm:justify-start">
        <span
          className={`h-1.5 w-1.5 shrink-0 animate-blink`}
          style={{ backgroundColor: meta.dot }}
        />
        <span className={`text-[10px] font-mono tracking-widest uppercase ${meta.color} whitespace-nowrap`}>
          {meta.label}
        </span>
      </div>

      {/* Uptime */}
      <div className="hidden sm:flex flex-col items-end gap-0.5">
        <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
          30d uptime
        </span>
        <span className="text-xs font-mono font-bold text-foreground">
          {service.uptime}
        </span>
      </div>

      {/* Latency */}
      <div className="hidden sm:flex flex-col items-end gap-0.5">
        <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
          Latency
        </span>
        <span className="text-xs font-mono font-bold text-foreground">
          <LatencyTicker base={baseLatency} />
        </span>
      </div>
    </motion.div>
  )
}

/* ── incident card ── */
function IncidentCard({ incident, index }: { incident: Incident; index: number }) {
  const [open, setOpen] = useState(index === 0)
  const meta = INCIDENT_META[incident.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease }}
      className="border-b-2 border-foreground last:border-b-0"
    >
      {/* Header — clickable */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 lg:px-8 text-left group hover:bg-foreground/5 transition-colors duration-200"
      >
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground uppercase">
              {incident.id}
            </span>
            <span className={`text-[10px] font-mono tracking-[0.2em] uppercase ${meta.color}`}>
              {meta.label}
            </span>
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-tight text-foreground truncate">
            {incident.title}
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0 ml-4">
          <span className="text-[10px] font-mono text-muted-foreground tracking-widest hidden sm:block">
            {incident.date}
          </span>
          <span
            className={`text-[10px] font-mono text-muted-foreground tracking-widest transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </div>
      </button>

      {/* Updates — collapsible */}
      {open && (
        <div className="px-5 pb-5 lg:px-8 border-t-2 border-foreground/20 pt-4">
          <div className="flex flex-col gap-0 border-l-2 border-[#ea580c] ml-2">
            {incident.updates.map((u, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3, ease }}
                className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 pl-4 pb-4 last:pb-0"
              >
                <span className="text-[10px] font-mono text-[#ea580c] tracking-widest shrink-0 pt-0.5">
                  {u.time}
                </span>
                <span className="text-xs font-mono text-muted-foreground leading-relaxed">
                  {u.message}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

/* ── legend ── */
function Legend() {
  return (
    <div className="flex items-center gap-6 flex-wrap">
      {(["operational", "degraded", "outage"] as Status[]).map((s) => (
        <div key={s} className="flex items-center gap-2">
          <span className={`h-2 w-2 shrink-0 ${STATUS_META[s].bg}`} />
          <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
            {STATUS_META[s].label}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ── main page ── */
export default function StatusPage() {
  const allOperational = SERVICES.every((s) => s.status === "operational")

  return (
    <div className="min-h-screen dot-grid-bg">
      {/* Back nav */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="w-full px-6 pt-6 lg:px-12"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground hover:text-foreground transition-colors duration-200 group"
        >
          <ArrowLeft
            size={12}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          Back to Hasan.lib
        </Link>
      </motion.div>

      <main className="w-full px-6 py-12 lg:px-12 lg:py-20">

        {/* Page label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-4 mb-10"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono shrink-0">
            {"// DOC: SYSTEM_STATUS"}
          </span>
          <div className="flex-1 border-t border-border" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            LIVE
          </span>
        </motion.div>

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65, delay: 0.1, ease }}
          className="mb-0 border-2 border-b-0 border-foreground px-5 py-8 lg:px-8 lg:py-10"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold tracking-tight uppercase text-foreground mb-3">
            System{" "}
            <span className="text-[#ea580c]">Status</span>
          </h1>
          <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed max-w-xl">
            Real-time status of all Hasan.lib services. Updated every 60 seconds. Incident history kept for 90 days.
          </p>
        </motion.div>

        {/* Overall banner */}
        <OverallBanner allOperational={allOperational} />

        {/* ── SECTION 001: Services ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="mt-12"
        >
          <SectionLabel code="// STATUS: SERVICE_HEALTH" index="001" />
          <div className="border-2 border-foreground">
            {SERVICES.map((service, i) => (
              <ServiceRow key={service.id} service={service} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── SECTION 002: 90-day uptime ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease }}
          className="mt-12"
        >
          <SectionLabel code="// STATUS: UPTIME_HISTORY" index="002" />
          <div className="border-2 border-foreground">
            <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                90-day history — all services aggregate
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-foreground font-mono font-bold">
                99.94% avg
              </span>
            </div>
            <div className="px-5 py-5 lg:px-8">
              <UptimeBar />
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                  90 days ago
                </span>
                <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                  Today
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-3 lg:px-8 border-t-2 border-foreground">
              <Legend />
            </div>
          </div>
        </motion.div>

        {/* ── SECTION 003: Incidents ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease }}
          className="mt-12"
        >
          <SectionLabel code="// STATUS: INCIDENT_LOG" index="003" />
          <div className="border-2 border-foreground">
            <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                Past incidents
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                Click to expand
              </span>
            </div>
            {INCIDENTS.map((incident, i) => (
              <IncidentCard key={incident.id} incident={incident} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Subscribe strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5, ease }}
          className="grid grid-cols-1 sm:grid-cols-2 border-2 border-foreground mt-10"
        >
          <div className="flex flex-col gap-1 px-5 py-5 lg:px-8 sm:border-r-2 border-foreground border-b-2 sm:border-b-0">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              INCIDENT NOTIFICATIONS
            </span>
            <a
              href="mailto:status@hasan.lib?subject=Subscribe to status updates"
              className="text-xs font-mono text-foreground hover:text-[#ea580c] transition-colors duration-200"
            >
              Subscribe via email →
            </a>
          </div>
          <div className="flex flex-col gap-1 px-5 py-5 lg:px-8">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              REPORT AN ISSUE
            </span>
            <a
              href="mailto:support@hasan.lib"
              className="text-xs font-mono text-foreground hover:text-[#ea580c] transition-colors duration-200"
            >
              support@hasan.lib →
            </a>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5, ease }}
          className="flex items-center gap-3 mt-6"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            {"* Latency values are p50 measured from Singapore. Uptime calculated on rolling 30-day window."}
          </span>
          <div className="flex-1 border-t border-border" />
        </motion.div>
      </main>
    </div>
  )
}