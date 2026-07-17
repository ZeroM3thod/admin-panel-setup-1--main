"use client"

import { useEffect, useRef, useState } from "react"
import { MoreVertical, Download, Copy, Github, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type CodeMenuProps = {
  fileName: string
  code: string
}

export function CodeMenu({ fileName, code }: CodeMenuProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  async function handleDownload() {
    setDownloading(true)
    try {
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()
      zip.file(fileName, code)
      zip.file(
        "README.md",
        `# ${fileName}\n\nExported from Hasan.lib UI Library.\nDrop this component into your app/components directory.\n`,
      )
      const blob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${fileName.replace(/\.[^.]+$/, "")}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
      setOpen(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open code actions"
        className="w-8 h-8 flex items-center justify-center border border-foreground/30 hover:bg-foreground/5 transition-colors"
      >
        <MoreVertical size={14} strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 z-30 w-52 border-2 border-foreground bg-popover"
          >
            <div className="border-b border-foreground/20 px-3 py-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                Actions
              </span>
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors disabled:opacity-50"
            >
              <Download size={13} strokeWidth={1.5} className="text-[#ea580c]" />
              {downloading ? "Zipping..." : "Download Code"}
            </button>
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors border-t border-foreground/10"
            >
              {copied ? (
                <Check size={13} strokeWidth={1.5} className="text-[#ea580c]" />
              ) : (
                <Copy size={13} strokeWidth={1.5} />
              )}
              {copied ? "Copied" : "Copy Source"}
            </button>
            <a
              href="#"
              className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors border-t border-foreground/10"
            >
              <Github size={13} strokeWidth={1.5} />
              View on GitHub
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
