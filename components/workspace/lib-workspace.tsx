"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  Code2,
  Eye,
  Lock,
  Menu,
  X,
  Cpu,
  Boxes,
  Download,
  Copy,
  Check,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
} from "lucide-react"
import { useAdmin, type AssetMainButton, type AssetSubButton, type AccessLevel } from "@/lib/admin-store"
import { useAuth } from "@/lib/auth-store"
import { ThemeToggle } from "@/components/theme-toggle"
import { AssetIcon } from "@/lib/asset-icons"

type Device = "mobile" | "tablet" | "desktop"

const DEVICE_WIDTH: Record<Device, string> = {
  mobile: "375px",
  tablet: "768px",
  desktop: "100%",
}

const DEVICE_OPTIONS: { id: Device; label: string; icon: typeof Monitor }[] = [
  { id: "mobile", label: "Mobile", icon: Smartphone },
  { id: "tablet", label: "Tablet", icon: Tablet },
  { id: "desktop", label: "Desktop", icon: Monitor },
]

export function LibWorkspace() {
  const { assets, assetsLoaded } = useAdmin()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [tab, setTab] = useState<"preview" | "code">("preview")
  const [device, setDevice] = useState<Device>("desktop")
  const [copied, setCopied] = useState(false)
  const [selectedCat, setSelectedCat] = useState<string>("")
  const [selectedSub, setSelectedSub] = useState<string>("")

  const category = params?.category as string
  const slug = params?.slug as string

  useEffect(() => {
    if (assets.length > 0) {
      let catId = ""
      let subId = ""
      if (category && slug) {
        const cat = assets.find((a) => a.name.toLowerCase().replace(/\s+/g, "-") === category)
        if (cat) {
          catId = cat.id
          const sub = cat.subButtons.find((s) => s.name.toLowerCase().replace(/\s+/g, "-") === slug)
          if (sub) subId = sub.id
        }
      }
      if (!catId || !subId) {
        const firstCat = assets[0]
        const firstSub = firstCat?.subButtons[0]
        if (firstCat && firstSub) {
          catId = firstCat.id
          subId = firstSub.id
          const catSlug = firstCat.name.toLowerCase().replace(/\s+/g, "-")
          const subSlug = firstSub.name.toLowerCase().replace(/\s+/g, "-")
          router.replace(`/lib/${catSlug}/${subSlug}`)
        }
      }
      setSelectedCat(catId)
      setSelectedSub(subId)
    }
  }, [assets, category, slug, router])

  const currentCat = assets.find((a) => a.id === selectedCat)
  const currentItem = currentCat?.subButtons.find((s) => s.id === selectedSub)

  function selectItem(catId: string, subId: string) {
    setSelectedCat(catId)
    setSelectedSub(subId)
    setMobileOpen(false)
    const cat = assets.find((a) => a.id === catId)
    const sub = cat?.subButtons.find((s) => s.id === subId)
    if (cat && sub) {
      const catSlug = cat.name.toLowerCase().replace(/\s+/g, "-")
      const subSlug = sub.name.toLowerCase().replace(/\s+/g, "-")
      router.push(`/lib/${catSlug}/${subSlug}`)
    }
  }

  function canAccessCode(access: AccessLevel[]): boolean {
    if (!user) return false
    if (user.status === "suspended") return false
    const userPlanRank = { free: 0, pro: 1, professional: 2 }
    return access.some((a) => userPlanRank[user.plan] >= userPlanRank[a])
  }

  async function handleCopyCode(code: string) {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (!assetsLoaded) {
    return (
      <div className="min-h-screen dot-grid-bg flex items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">Loading library...</p>
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="min-h-screen dot-grid-bg flex flex-col items-center justify-center p-8 text-center">
        <p className="font-pixel text-2xl tracking-tight text-foreground mb-2">No components yet</p>
        <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground max-w-md">
          Admin needs to add components from the admin panel first.
        </p>
      </div>
    )
  }

  const previewUrl = currentItem?.previewLink

  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full">
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

      <aside
        className={`fixed lg:sticky top-0 z-50 lg:z-10 h-screen w-72 shrink-0 border-r-2 border-foreground bg-background flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Cpu size={16} strokeWidth={1.5} />
            <span className="text-xs font-mono tracking-[0.15em] uppercase font-bold">Hasan.lib</span>
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
            {"// LIBRARY"}
          </span>
          <div className="flex flex-col gap-1">
            {assets.map((cat) => {
              const isOpen = selectedCat === cat.id
              return (
                <div key={cat.id}>
                  <button
                    onClick={() => {
                      if (isOpen) {
                        setSelectedCat("")
                      } else {
                        setSelectedCat(cat.id)
                        if (cat.subButtons.length > 0) {
                          const sub = cat.subButtons[0]
                          selectItem(cat.id, sub.id)
                        }
                      }
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 text-[11px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
                  >
                    <ChevronRight
                      size={13}
                      strokeWidth={2}
                      className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                    />
                    <AssetIcon name={cat.icon} size={13} />
                    <span className="flex-1 text-left">{cat.name}</span>
                    <span className="text-[9px] text-muted-foreground">{cat.subButtons.length}</span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 border-l border-foreground/20 pl-2 py-1 flex flex-col gap-0.5">
                          {cat.subButtons.map((sub) => {
                            const active = selectedSub === sub.id
                            return (
                              <button
                                key={sub.id}
                                onClick={() => selectItem(cat.id, sub.id)}
                                className={`text-left px-2 py-1.5 text-[11px] font-mono transition-colors ${
                                  active
                                    ? "bg-foreground text-background"
                                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                                }`}
                              >
                                {sub.name}
                              </button>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </nav>

        <div className="border-t-2 border-foreground p-3">
          <div className="flex items-center gap-3 border border-foreground/30 p-3">
            <div className="w-9 h-9 shrink-0 bg-foreground text-background flex items-center justify-center font-pixel text-sm">
              {user ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-mono uppercase tracking-widest truncate">
                {user ? user.name : "Guest"}
              </p>
              <p className="text-[9px] font-mono text-muted-foreground truncate">
                {user ? `${user.plan} plan` : "Not signed in"}
              </p>
            </div>
            <span
              className={`px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-widest ${
                !user ? "bg-secondary text-secondary-foreground" : user.plan === "free" ? "bg-secondary text-secondary-foreground" : "bg-[#ea580c] text-white"
              }`}
            >
              {user ? (user.plan === "free" ? "Free" : user.plan) : "Guest"}
            </span>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b-2 border-foreground bg-background/90 backdrop-blur-sm px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="w-8 h-8 flex items-center justify-center border border-foreground/30 lg:hidden shrink-0"
            >
              <Menu size={14} strokeWidth={1.5} />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] font-mono uppercase tracking-widest truncate">
                {currentItem?.name || "Select an item"}
              </p>
              <p className="text-[9px] font-mono text-muted-foreground truncate hidden sm:block">
                {currentCat?.name} / {currentItem?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex border border-foreground/30">
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-colors ${
                  tab === "preview" ? "bg-foreground text-background" : "hover:bg-foreground/5"
                }`}
              >
                <Eye size={12} strokeWidth={1.5} /> <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                onClick={() => setTab("code")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-colors border-l border-foreground/30 ${
                  tab === "code" ? "bg-foreground text-background" : "hover:bg-foreground/5"
                }`}
              >
                <Code2 size={12} strokeWidth={1.5} /> <span className="hidden sm:inline">Code</span>
              </button>
            </div>
          </div>
        </div>

        {tab === "preview" && (
          <div className="flex items-center justify-center gap-2 border-b-2 border-foreground bg-background px-4 py-2">
            <span className="mr-1 hidden text-[9px] font-mono uppercase tracking-widest text-muted-foreground sm:inline">
              {"// VIEWPORT"}
            </span>
            <div className="flex border border-foreground/30">
              {DEVICE_OPTIONS.map((opt, i) => {
                const Icon = opt.icon
                const active = device === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setDevice(opt.id)}
                    aria-pressed={active}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-colors ${
                      i > 0 ? "border-l border-foreground/30" : ""
                    } ${active ? "bg-foreground text-background" : "hover:bg-foreground/5"}`}
                  >
                    <Icon size={12} strokeWidth={1.5} />
                    <span className="hidden sm:inline">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex-1 p-4 lg:p-8 dot-grid-bg">
          {tab === "preview" ? (
            <PreviewFrame device={device} url={previewUrl} />
          ) : currentItem ? (
            canAccessCode(currentItem.access) ? (
              <CodeView
                item={currentItem}
                onCopy={handleCopyCode}
                copied={copied}
              />
            ) : (
              <LockedCode user={user} />
            )
          ) : (
            <div className="flex items-center justify-center h-full min-h-[360px]">
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Select a component from the sidebar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PreviewFrame({ device, url }: { device: Device; url?: string }) {
  const isDesktop = device === "desktop"
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      style={{ width: DEVICE_WIDTH[device], maxWidth: "100%" }}
      className={`mx-auto border-2 border-foreground bg-background ${isDesktop ? "max-w-4xl" : ""}`}
    >
      <div className="flex items-center gap-2 border-b-2 border-foreground px-3 py-2">
        <span className="w-2.5 h-2.5 border border-foreground bg-[#ea580c]" />
        <span className="w-2.5 h-2.5 border border-foreground bg-emerald-500" />
        <span className="w-2.5 h-2.5 border border-foreground bg-sky-500" />
        {url ? (
          <div className="ml-3 flex flex-1 items-center gap-2 border border-foreground/20 bg-secondary/40 px-2 py-0.5">
            <span className="inline-block h-1.5 w-1.5 animate-pulse bg-emerald-500" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Live Preview
            </span>
          </div>
        ) : (
          <div className="ml-3 flex-1 h-5 border border-foreground/20 bg-secondary/40" />
        )}
      </div>
      <div className="h-[75vh] min-h-[520px] w-full overflow-hidden flex items-center justify-center bg-secondary/20">
        {url ? (
          <iframe
            src={url}
            title="Live Preview"
            loading="lazy"
            className="block h-full w-full bg-background"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        ) : (
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            No preview link configured
          </p>
        )}
      </div>
    </motion.div>
  )
}

function CodeView({
  item,
  onCopy,
  copied,
}: {
  item: AssetSubButton
  onCopy: (code: string) => void
  copied: boolean
}) {
  const [activeFile, setActiveFile] = useState(0)

  useEffect(() => {
    setActiveFile(0)
  }, [item.id])

  const files = item.codeFiles.length > 0
    ? item.codeFiles
    : [{ id: "default", name: `${item.name.toLowerCase().replace(/\s+/g, "-")}.tsx`, code: "// No code files yet" }]

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex border border-foreground/30 overflow-x-auto">
          {files.map((file, i) => (
            <button
              key={file.id}
              onClick={() => setActiveFile(i)}
              className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest whitespace-nowrap transition-colors ${
                i > 0 ? "border-l border-foreground/30" : ""
              } ${activeFile === i ? "bg-foreground text-background" : "hover:bg-foreground/5"}`}
            >
              {file.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onCopy(files[activeFile]?.code || "")}
            className="flex items-center gap-1.5 border border-foreground/30 px-3 py-2 text-[10px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
          {item.zipLink && (
            <a
              href={item.zipLink}
              download
              className="flex items-center gap-1.5 bg-foreground text-background px-3 py-2 text-[10px] font-mono uppercase tracking-widest hover:bg-[#ea580c] hover:text-white transition-colors"
            >
              <Download size={12} /> ZIP
            </a>
          )}
        </div>
      </div>
      <div className="border-2 border-foreground bg-[#0d0d0d] text-[#e6e6e6]">
        <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed font-mono">
          <code>{files[activeFile]?.code || ""}</code>
        </pre>
      </div>
    </div>
  )
}

function LockedCode({ user }: { user: import("@/lib/auth-store").AuthUser | null }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl min-h-[360px] flex-col items-center justify-center border-2 border-dashed border-foreground bg-background p-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center border-2 border-foreground">
        <Lock size={22} strokeWidth={1.5} className="text-[#ea580c]" />
      </div>
      <p className="font-pixel text-2xl tracking-tight text-foreground mb-2">LOCKED</p>
      <p className="max-w-sm text-[11px] font-mono uppercase tracking-widest text-muted-foreground leading-relaxed mb-6">
        {user ? "Your current plan does not grant access to this component's source code." : "Sign in to access source code."}
      </p>
      <Link
        href={user ? "/payment" : "/signin?redirect=/lib"}
        className="inline-flex items-center gap-2 border-2 border-foreground px-4 py-2.5 text-[11px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
      >
        {user ? "Upgrade Plan" : "Sign In"} <ExternalLink size={13} strokeWidth={2} />
      </Link>
    </div>
  )
}
