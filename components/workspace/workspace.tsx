"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  Sparkles,
  LayoutTemplate,
  SquareStack,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react"
import { registry } from "@/lib/registry"
import { CodeMenu } from "@/components/workspace/code-menu"
import { ArrowButton } from "@/components/arrow-button"
import { ThemeToggle } from "@/components/theme-toggle"

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

const categoryIcons: Record<string, typeof Boxes> = {
  components: Boxes,
  animated: Sparkles,
  blocks: SquareStack,
  landing: LayoutTemplate,
}

type WorkspaceProps = {
  locked?: boolean
}

export function Workspace({ locked = false }: WorkspaceProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ components: true, landing: true })
  const [activeCat, setActiveCat] = useState("landing")
  const [activeItem, setActiveItem] = useState("live-template")
  const [tab, setTab] = useState<"preview" | "code">("preview")
  const [device, setDevice] = useState<Device>("desktop")
  const [mobileOpen, setMobileOpen] = useState(false)

  const category = registry.find((c) => c.slug === activeCat)!
  const item = category.items.find((i) => i.slug === activeItem) ?? category.items[0]
  const fileName = `${item.slug}.tsx`

  function selectItem(catSlug: string, itemSlug: string) {
    setActiveCat(catSlug)
    setActiveItem(itemSlug)
    setMobileOpen(false)
  }

  function toggleCat(slug: string) {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }))
  }

  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full">
      {/* Mobile overlay */}
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
        {/* Sidebar header */}
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

        {/* Category buttons + sub buttons */}
        <nav className="flex-1 overflow-y-auto p-3">
          <span className="block px-1 pb-2 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
            {"// LIBRARY"}
          </span>
          <div className="flex flex-col gap-1">
            {registry.map((cat) => {
              const Icon = categoryIcons[cat.slug] ?? Boxes
              const isOpen = expanded[cat.slug]
              return (
                <div key={cat.slug}>
                  <button
                    onClick={() => toggleCat(cat.slug)}
                    className="w-full flex items-center gap-2 px-2 py-2 text-[11px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
                  >
                    <ChevronRight
                      size={13}
                      strokeWidth={2}
                      className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                    />
                    <Icon size={13} strokeWidth={1.5} className="text-[#ea580c]" />
                    <span className="flex-1 text-left">{cat.name}</span>
                    <span className="text-[9px] text-muted-foreground">{cat.items.length}</span>
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
                          {cat.items.map((it) => {
                            const active = activeCat === cat.slug && activeItem === it.slug
                            return (
                              <button
                                key={it.slug}
                                onClick={() => selectItem(cat.slug, it.slug)}
                                className={`text-left px-2 py-1.5 text-[11px] font-mono transition-colors ${
                                  active
                                    ? "bg-foreground text-background"
                                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                                }`}
                              >
                                {it.name}
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

        {/* Profile card (bottom) */}
        <div className="border-t-2 border-foreground p-3">
          <div className="flex items-center gap-3 border border-foreground/30 p-3">
            <div className="w-9 h-9 shrink-0 bg-foreground text-background flex items-center justify-center font-pixel text-sm">
              AX
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-mono uppercase tracking-widest truncate">Alex Chen</p>
              <p className="text-[9px] font-mono text-muted-foreground truncate">
                {locked ? "Free Plan" : "Pro Member"}
              </p>
            </div>
            <span
              className={`px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-widest ${
                locked ? "bg-secondary text-secondary-foreground" : "bg-[#ea580c] text-white"
              }`}
            >
              {locked ? "Free" : "Pro"}
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
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
              <p className="text-[11px] font-mono uppercase tracking-widest truncate">{item.name}</p>
              <p className="text-[9px] font-mono text-muted-foreground truncate hidden sm:block">
                {item.description}
              </p>
            </div>
          </div>

          {/* Preview / Code tabs */}
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
            {tab === "code" && !locked && <CodeMenu fileName={fileName} code={item.code} />}
          </div>
        </div>

        {/* Device toggle (preview only) */}
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

        {/* Body */}
        <div className="flex-1 p-4 lg:p-8 dot-grid-bg">
          {tab === "preview" ? (
            <PreviewFrame device={device} url={item.url}>
              {item.preview}
            </PreviewFrame>
          ) : locked ? (
            <LockedCode />
          ) : (
            <CodeView fileName={fileName} code={item.code} />
          )}
        </div>
      </div>
    </div>
  )
}

/* --------------------------- Browser-like frame --------------------------- */

function PreviewFrame({
  device,
  url,
  children,
}: {
  device: Device
  url?: string
  children: React.ReactNode
}) {
  const isDesktop = device === "desktop"
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      style={{ width: DEVICE_WIDTH[device], maxWidth: "100%" }}
      className={`mx-auto border-2 border-foreground bg-background ${isDesktop ? "max-w-4xl" : ""}`}
    >
      {/* Chrome bar */}
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
      <div
        className={
          url
            ? "h-[75vh] min-h-[520px] w-full overflow-hidden"
            : `flex min-h-[360px] items-center justify-center ${device === "mobile" ? "p-4" : "p-8"}`
        }
      >
        {children}
      </div>
    </motion.div>
  )
}

/* -------------------------------- Code view ------------------------------- */

function CodeView({ fileName, code }: { fileName: string; code: string }) {
  const files = [
    { name: fileName, code },
    {
      name: "README.md",
      code: `# ${fileName}\n\nExported from the Hasan.lib UI Library.\n\n## Usage\n\n1. Copy \`${fileName}\` into your \`components\` directory.\n2. Import and render the component:\n\n\`\`\`tsx\nimport { Component } from "@/components/${fileName.replace(/\.[^.]+$/, "")}"\n\`\`\`\n\n## Notes\n\n- Built with Tailwind CSS and the brutalist Hasan.lib design tokens.\n- Requires \`lucide-react\` for icons where applicable.\n`,
    },
  ]
  const [activeFile, setActiveFile] = useState(0)

  // Reset to the first tab whenever the selected component changes.
  useEffect(() => {
    setActiveFile(0)
  }, [fileName])

  return (
    <div className="mx-auto w-full max-w-4xl border-2 border-foreground bg-[#0d0d0d] text-[#e6e6e6]">
      {/* File tab list */}
      <div className="flex items-center border-b-2 border-foreground/50">
        {files.map((file, i) => {
          const active = activeFile === i
          return (
            <button
              key={file.name}
              onClick={() => setActiveFile(i)}
              className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors ${
                i > 0 ? "border-l border-foreground/30" : ""
              } ${active ? "bg-[#ea580c] text-white" : "text-white/40 hover:text-white hover:bg-white/5"}`}
            >
              {file.name}
            </button>
          )
        })}
      </div>
      <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed font-mono">
        <code>{files[activeFile].code}</code>
      </pre>
    </div>
  )
}

/* ------------------------------ Locked message ---------------------------- */

function LockedCode() {
  return (
    <div className="mx-auto flex w-full max-w-4xl min-h-[360px] flex-col items-center justify-center border-2 border-dashed border-foreground bg-background p-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center border-2 border-foreground">
        <Lock size={22} strokeWidth={1.5} className="text-[#ea580c]" />
      </div>
      <p className="font-pixel text-2xl tracking-tight text-foreground mb-2">LOCKED</p>
      <p className="max-w-sm text-[11px] font-mono uppercase tracking-widest text-muted-foreground leading-relaxed mb-6">
        Source code is only available for Pro and Professionals.
      </p>
      <ArrowButton href="/lib" className="text-[11px]">
        Browse Library
      </ArrowButton>
    </div>
  )
}
