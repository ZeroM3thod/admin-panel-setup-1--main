"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"

const ease = [0.22, 1, 0.36, 1] as const

/* ── blinking cursor ── */
function BlinkDot() {
  return <span className="inline-block h-2 w-2 bg-[#ea580c] animate-blink" />
}

/* ── live timestamp ── */
function LiveTimestamp() {
  const [ts, setTs] = useState("")

  useEffect(() => {
    const fmt = () => {
      const now = new Date()
      setTs(
        `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(
          now.getUTCDate()
        ).padStart(2, "0")} ${String(now.getUTCHours()).padStart(2, "0")}:${String(
          now.getUTCMinutes()
        ).padStart(2, "0")} UTC`
      )
    }
    fmt()
    const id = setInterval(fmt, 60000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="font-mono text-[#ea580c]" style={{ fontVariantNumeric: "tabular-nums" }}>
      {ts}
    </span>
  )
}

/* ── section label bar ── */
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

/* ── term block data ── */
interface TermBlock {
  index: string
  code: string
  heading: string
  paragraphs: string[]
  bullets?: string[]
  note?: string
}

const BLOCKS: TermBlock[] = [
  {
    index: "001",
    code: "// TERMS: ACCEPTANCE",
    heading: "Acceptance of Terms",
    paragraphs: [
      "By accessing or using Hasan.lib — including its website, component library, source downloads, and any related services — you agree to be bound by these Terms and Conditions. If you do not agree, do not use the service.",
      "We may update these terms at any time. Continued use after changes are published constitutes acceptance. We will notify registered users of material changes via email at least 14 days before they take effect.",
    ],
  },
  {
    index: "002",
    code: "// TERMS: LICENSE_GRANT",
    heading: "License Grant",
    paragraphs: [
      "Hasan.lib offers two license tiers. The license granted depends on the plan you have purchased.",
    ],
    bullets: [
      "Free Plan — grants a read-only, non-commercial preview license. No source download or redistribution permitted.",
      "Pro Plan ($6, lifetime) — grants a personal commercial license to copy, modify, and include components in unlimited personal and commercial projects. Redistribution as a standalone library or template is not permitted.",
      "Professional Plan ($10, lifetime) — grants a team commercial license for up to 5 seats, including redistribution rights within closed client projects and use of Figma source files.",
    ],
    note:
      "In all tiers, attribution is not required but appreciated. Reselling unmodified components or templates as your own product is prohibited.",
  },
  {
    index: "003",
    code: "// TERMS: PAYMENTS_REFUNDS",
    heading: "Payments & Refunds",
    paragraphs: [
      "All purchases are one-time payments processed by Stripe. Prices are listed in USD and are inclusive of any applicable fees. We do not charge recurring fees.",
      "Due to the digital nature of the product — source code is immediately accessible after purchase — refunds are not issued once a download has been initiated. If you have not yet downloaded your files and believe you purchased in error, contact support within 48 hours for a review.",
    ],
    bullets: [
      "No recurring charges — ever",
      "Lifetime access to your licensed tier at the time of purchase",
      "Future component additions are included for Pro and Professional buyers",
    ],
  },
  {
    index: "004",
    code: "// TERMS: PROHIBITED_USE",
    heading: "Prohibited Use",
    paragraphs: [
      "You agree not to use Hasan.lib for any of the following activities. Violations may result in immediate license termination without refund.",
    ],
    bullets: [
      "Reselling or sublicensing unmodified components or templates as a competing library",
      "Scraping the site or component previews in bulk via automated means",
      "Sharing, posting, or distributing downloaded source ZIPs publicly",
      "Attempting to bypass payment or access Premium content without a valid license",
      "Using the service in any way that violates applicable law",
    ],
  },
  {
    index: "005",
    code: "// TERMS: INTELLECTUAL_PROPERTY",
    heading: "Intellectual Property",
    paragraphs: [
      "All design, code, documentation, and visual assets on Hasan.lib — except content explicitly licensed to you under your plan — remain the exclusive property of Hasan.lib and its contributors.",
      "The Hasan.lib name, logo, and branding may not be used to endorse or promote products without prior written permission. Components derived from open-source libraries retain their original licenses; refer to each component's source header for attribution requirements.",
    ],
  },
  {
    index: "006",
    code: "// TERMS: DISCLAIMER",
    heading: "Disclaimer of Warranties",
    paragraphs: [
      'Hasan.lib is provided "as is" and "as available" without any warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.',
      "We do not warrant that the library will be error-free, uninterrupted, or compatible with every framework version or browser. You assume all risk associated with integrating components into your project.",
    ],
    note:
      "Components are production-tested but your project's dependencies, build pipeline, and runtime environment are outside our control.",
  },
  {
    index: "007",
    code: "// TERMS: LIMITATION_LIABILITY",
    heading: "Limitation of Liability",
    paragraphs: [
      "To the fullest extent permitted by law, Hasan.lib and its contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service, even if advised of the possibility of such damages.",
      "Our total aggregate liability to you for any claim arising from these terms or your use of the service shall not exceed the amount you paid for your license in the 12 months preceding the claim.",
    ],
  },
  {
    index: "008",
    code: "// TERMS: GOVERNING_LAW",
    heading: "Governing Law",
    paragraphs: [
      "These terms are governed by and construed in accordance with the laws of Bangladesh, without regard to conflict-of-law principles. Any dispute arising from these terms shall be resolved in the courts of Dhaka, Bangladesh, unless both parties agree to binding arbitration.",
    ],
  },
  {
    index: "009",
    code: "// TERMS: CONTACT",
    heading: "Contact",
    paragraphs: [
      "For questions about these terms, license clarifications, or abuse reports, contact us at legal@hasan.lib. We respond to all legal inquiries within 5 business days.",
    ],
  },
]

export default function TermsPage() {
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
        {/* Page header label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-4 mb-10"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono shrink-0">
            {"// DOC: TERMS_AND_CONDITIONS"}
          </span>
          <div className="flex-1 border-t border-border" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            REV 2025.07
          </span>
        </motion.div>

        {/* Hero heading */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65, delay: 0.1, ease }}
          className="mb-12 border-2 border-foreground"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 border-b-2 border-foreground gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              TERMS_OF_SERVICE.md
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                EFFECTIVE:
              </span>
              <LiveTimestamp />
            </div>
          </div>
          <div className="px-5 py-8 lg:px-8 lg:py-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold tracking-tight uppercase text-foreground mb-4">
              Terms &amp;{" "}
              <span className="text-[#ea580c]">Conditions</span>
            </h1>
            <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed max-w-2xl">
              Plain-language terms for a plain-source library. These govern your use of Hasan.lib, its component source code, and all related services. Read them. They matter.
            </p>
          </div>

          {/* Quick summary strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 border-t-2 border-foreground">
            {[
              { label: "License model", value: "One-time / Lifetime" },
              { label: "Governing law", value: "Bangladesh" },
              { label: "Refund window", value: "48h (pre-download)" },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`flex flex-col gap-1 px-5 py-4 ${
                  i < 2 ? "sm:border-r-2 border-foreground border-b-2 sm:border-b-0" : "border-b-2 sm:border-b-0"
                }`}
              >
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                  {item.label}
                </span>
                <span className="text-sm font-mono font-bold tracking-tight text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Two-column layout on desktop */}
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-12">
          {/* Sticky sidebar — desktop only */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="hidden lg:block w-56 shrink-0"
          >
            <div className="sticky top-8 border-2 border-foreground">
              <div className="px-4 py-3 border-b-2 border-foreground">
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                  CONTENTS
                </span>
              </div>
              <nav className="flex flex-col">
                {BLOCKS.map((block) => (
                  <a
                    key={block.index}
                    href={`#term-${block.index}`}
                    className="flex items-center gap-3 px-4 py-3 border-b border-border text-[10px] tracking-[0.12em] uppercase font-mono text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors duration-200 last:border-b-0"
                  >
                    <span className="text-[#ea580c] shrink-0">{block.index}</span>
                    <span className="truncate">{block.heading}</span>
                  </a>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col gap-0 border-2 border-foreground">
            {BLOCKS.map((block, i) => (
              <motion.div
                key={block.index}
                id={`term-${block.index}`}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.05, ease }}
                className={`px-5 py-7 lg:px-8 lg:py-8 ${
                  i < BLOCKS.length - 1 ? "border-b-2 border-foreground" : ""
                }`}
              >
                <SectionLabel code={block.code} index={block.index} />

                <h2 className="text-base lg:text-lg font-mono font-bold tracking-tight uppercase text-foreground mb-4">
                  {block.heading}
                </h2>

                <div className="flex flex-col gap-3">
                  {block.paragraphs.map((p, pi) => (
                    <p
                      key={pi}
                      className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}

                  {block.bullets && (
                    <ul className="flex flex-col gap-2 mt-2 border-l-2 border-[#ea580c] pl-4">
                      {block.bullets.map((b, bi) => (
                        <motion.li
                          key={bi}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: i * 0.05 + bi * 0.04 + 0.2,
                            duration: 0.3,
                            ease,
                          }}
                          className="flex items-start gap-2 text-xs font-mono text-muted-foreground"
                        >
                          <span className="text-[#ea580c] shrink-0 mt-0.5">—</span>
                          {b}
                        </motion.li>
                      ))}
                    </ul>
                  )}

                  {block.note && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.4, ease }}
                      className="flex items-start gap-3 mt-2 bg-foreground/5 border-l-2 border-foreground px-4 py-3"
                    >
                      <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono shrink-0 mt-0.5">
                        NOTE:
                      </span>
                      <span className="text-xs font-mono text-muted-foreground leading-relaxed">
                        {block.note}
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact + privacy link footer strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5, ease }}
          className="grid grid-cols-1 sm:grid-cols-2 border-2 border-foreground mt-10"
        >
          <div className="flex flex-col gap-1 px-5 py-5 lg:px-8 sm:border-r-2 border-foreground border-b-2 sm:border-b-0">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              LEGAL CONTACT
            </span>
            <a
              href="mailto:legal@hasan.lib"
              className="text-xs font-mono text-foreground hover:text-[#ea580c] transition-colors duration-200"
            >
              legal@hasan.lib
            </a>
          </div>
          <div className="flex flex-col gap-1 px-5 py-5 lg:px-8">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              RELATED DOCS
            </span>
            <Link
              href="/privacy"
              className="text-xs font-mono text-foreground hover:text-[#ea580c] transition-colors duration-200"
            >
              Privacy Policy →
            </Link>
          </div>
        </motion.div>

        {/* Bottom divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5, ease }}
          className="flex items-center gap-3 mt-6"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            {"* Subject to change. Always refer to the latest version at hasan.lib/terms."}
          </span>
          <div className="flex-1 border-t border-border" />
        </motion.div>
      </main>
    </div>
  )
}