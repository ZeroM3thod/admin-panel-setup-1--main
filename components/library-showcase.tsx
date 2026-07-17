"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { registry } from "@/lib/registry"

const ease = [0.22, 1, 0.36, 1] as const

export function LibraryShowcase() {
  return (
    <section id="library" className="w-full px-6 py-20 lg:px-12">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-4 mb-8"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          {"// SECTION: LIBRARY"}
        </span>
        <div className="flex-1 border-t border-border" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">002</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="font-pixel text-3xl sm:text-5xl tracking-tight text-foreground mb-3"
      >
        BUILD BLOCKS.
      </motion.h2>
      <p className="text-xs lg:text-sm text-muted-foreground max-w-md mb-10 leading-relaxed font-mono">
        Copy-paste components, animated effects, blocks, and full landing templates. Engineered in a single brutalist system.
      </p>

      {/* Category grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-2 border-foreground">
        {registry.map((cat, ci) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: ci * 0.08, duration: 0.5, ease }}
            className={`flex flex-col ${ci % 2 === 0 ? "md:border-r-2" : ""} ${
              ci < registry.length - (registry.length % 2 === 0 ? 2 : 1) ? "border-b-2" : ""
            } border-foreground`}
          >
            <div className="flex items-center justify-between border-b border-foreground/20 px-4 py-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-foreground">
                {cat.name}
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                {cat.items.length} items
              </span>
            </div>

            {/* Mini preview strip */}
            <div className="flex flex-wrap items-center justify-center gap-4 p-6 min-h-[180px] bg-background scale-90">
              {cat.items.slice(0, 2).map((it) => (
                <div key={it.slug} className="flex items-center justify-center pointer-events-none">
                  {it.preview}
                </div>
              ))}
            </div>

            <Link
              href="/pro"
              className="mt-auto flex items-center justify-between border-t border-foreground/20 px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              Browse {cat.name}
              <ArrowUpRight size={13} strokeWidth={1.5} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* CTA row */}
      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link
          href="/pro"
          className="group flex items-center gap-0 bg-foreground text-background text-sm font-mono tracking-wider uppercase"
        >
          <span className="flex items-center justify-center w-10 h-10 bg-[#ea580c]">
            <ArrowUpRight size={16} strokeWidth={2} className="text-white" />
          </span>
          <span className="px-5 py-2.5">Open Workspace</span>
        </Link>
        <Link
          href="/template"
          className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          {"// Preview as free user"}
        </Link>
      </div>
    </section>
  )
}
