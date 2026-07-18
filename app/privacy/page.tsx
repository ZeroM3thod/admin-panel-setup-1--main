"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as const

/* ── blinking cursor ── */
function BlinkDot() {
  return <span className="inline-block h-2 w-2 bg-[#ea580c] animate-blink" />
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

/* ── policy block ── */
interface PolicyBlock {
  index: string
  code: string
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

const BLOCKS: PolicyBlock[] = [
  {
    index: "001",
    code: "// POLICY: INFORMATION_COLLECTED",
    heading: "Information We Collect",
    paragraphs: [
      "When you access Hasan.lib, we collect minimal data necessary to operate the service. This includes account information you voluntarily provide during registration, usage telemetry to improve component performance, and standard server logs including IP addresses, browser type, and referring URLs.",
    ],
    bullets: [
      "Email address and username on sign-up",
      "Purchase history and license tier selections",
      "Anonymous analytics: page views, component previews, session duration",
      "Cookies and local storage for theme preferences and session tokens",
    ],
  },
  {
    index: "002",
    code: "// POLICY: DATA_USAGE",
    heading: "How We Use Your Data",
    paragraphs: [
      "Data collected is used exclusively to operate, maintain, and improve Hasan.lib. We do not sell, rent, or trade your personal information to third parties. Usage patterns inform which components to build next and how to optimize existing ones.",
    ],
    bullets: [
      "Deliver purchased source-code downloads and license keys",
      "Send transactional emails (receipts, password resets)",
      "Aggregate analytics to prioritize the component roadmap",
      "Detect and prevent fraudulent purchases or abuse",
    ],
  },
  {
    index: "003",
    code: "// POLICY: STORAGE_RETENTION",
    heading: "Storage & Retention",
    paragraphs: [
      "Account data is stored on servers located in the European Union and the United States. We retain your data for as long as your account is active or as required to fulfill our legal obligations. You may request deletion at any time via the account settings or by contacting support.",
      "Payment data is processed by Stripe and is never stored on our servers. Stripe's privacy policy governs all payment information.",
    ],
  },
  {
    index: "004",
    code: "// POLICY: COOKIES",
    heading: "Cookies & Tracking",
    paragraphs: [
      "We use functional cookies to maintain your session and theme preference. We use analytics cookies (first-party only) to understand how the library is used. We do not use advertising or cross-site tracking cookies.",
    ],
    bullets: [
      "session_token — authentication, expires on browser close",
      "theme_pref — light / dark preference, expires in 365 days",
      "analytics_id — anonymous session ID, expires in 90 days",
    ],
  },
  {
    index: "005",
    code: "// POLICY: THIRD_PARTIES",
    heading: "Third-Party Services",
    paragraphs: [
      "Hasan.lib uses a small set of trusted third-party processors to deliver the service. Each is bound by its own privacy policy and by data processing agreements with us.",
    ],
    bullets: [
      "Stripe — payment processing",
      "Vercel — hosting and edge delivery",
      "Plausible Analytics — privacy-first, cookieless analytics",
      "Resend — transactional email delivery",
    ],
  },
  {
    index: "006",
    code: "// POLICY: YOUR_RIGHTS",
    heading: "Your Rights",
    paragraphs: [
      "Depending on your jurisdiction, you may have the right to access, correct, export, or delete the personal data we hold about you. You may also object to or restrict certain processing activities. To exercise any of these rights, contact us at privacy@hasan.lib.",
    ],
    bullets: [
      "Right of access — request a copy of your data",
      "Right to rectification — correct inaccurate data",
      "Right to erasure — request deletion of your account and data",
      "Right to portability — receive your data in a machine-readable format",
      "Right to object — opt out of analytics at any time",
    ],
  },
  {
    index: "007",
    code: "// POLICY: CHANGES",
    heading: "Policy Updates",
    paragraphs: [
      "We may update this policy as the service evolves. Material changes will be announced via email and a banner on the site at least 14 days before taking effect. Continued use after the effective date constitutes acceptance of the revised policy.",
      "Last updated: July 2025.",
    ],
  },
]

export default function PrivacyPage() {
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
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-4 mb-10"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono shrink-0">
            {"// DOC: PRIVACY_POLICY"}
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
          <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              PRIVACY_POLICY.md
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#ea580c] font-mono flex items-center gap-2">
              <BlinkDot /> ACTIVE
            </span>
          </div>
          <div className="px-5 py-8 lg:px-8 lg:py-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold tracking-tight uppercase text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed max-w-2xl">
              We believe in minimal data collection, full transparency, and your right to control what you share. This document explains exactly what we collect, why, and how you can remove it.
            </p>
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
                    href={`#section-${block.index}`}
                    className="flex items-center gap-3 px-4 py-3 border-b border-border text-[10px] tracking-[0.15em] uppercase font-mono text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors duration-200 last:border-b-0"
                  >
                    <span className="text-[#ea580c]">{block.index}</span>
                    {block.heading}
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
                id={`section-${block.index}`}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.06, ease }}
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
                          transition={{ delay: i * 0.06 + bi * 0.04 + 0.2, duration: 0.3, ease }}
                          className="flex items-start gap-2 text-xs font-mono text-muted-foreground"
                        >
                          <span className="text-[#ea580c] shrink-0 mt-0.5">—</span>
                          {b}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact footer strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5, ease }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-10 border-2 border-foreground px-5 py-5 lg:px-8"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              CONTACT: PRIVACY QUESTIONS
            </span>
            <a
              href="mailto:privacy@hasan.lib"
              className="text-xs font-mono text-foreground hover:text-[#ea580c] transition-colors duration-200"
            >
              privacy@hasan.lib
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-[#ea580c]" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              Response within 72 hours
            </span>
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
            {"* Governed by the laws of Bangladesh. Last revised July 2025."}
          </span>
          <div className="flex-1 border-t border-border" />
        </motion.div>
      </main>
    </div>
  )
}