"use client"

import { useEffect, useState } from "react"
import { Check, Minus } from "lucide-react"
import { motion } from "framer-motion"
import { ArrowButton } from "@/components/arrow-button"

const ease = [0.22, 1, 0.36, 1] as const

/* ── scramble-in price effect ── */
function ScramblePrice({ target, prefix = "$" }: { target: string; prefix?: string }) {
  const [display, setDisplay] = useState(target.replace(/[0-9]/g, "0"))

  useEffect(() => {
    let iterations = 0
    const maxIterations = 18
    const interval = setInterval(() => {
      if (iterations >= maxIterations) {
        setDisplay(target)
        clearInterval(interval)
        return
      }
      setDisplay(
        target
          .split("")
          .map((char, i) => {
            if (!/[0-9]/.test(char)) return char
            if (iterations > maxIterations - 5 && i < iterations - (maxIterations - 5)) return char
            return String(Math.floor(Math.random() * 10))
          })
          .join("")
      )
      iterations++
    }, 50)
    return () => clearInterval(interval)
  }, [target])

  return (
    <span className="font-mono font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}{display}
    </span>
  )
}

/* ── data-stream status line ── */
function StatusLine() {
  const [throughput, setThroughput] = useState("0.0")

  useEffect(() => {
    const interval = setInterval(() => {
      setThroughput((Math.random() * 50 + 10).toFixed(1))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-[10px] tracking-widest text-muted-foreground uppercase font-mono">
      <span className="h-1.5 w-1.5 bg-[#ea580c]" />
      <span>live throughput: {throughput}k req/s</span>
    </div>
  )
}

/* ── blinking cursor indicator ── */
function BlinkDot() {
  return <span className="inline-block h-2 w-2 bg-[#ea580c] animate-blink" />
}

/* ── tier config ── */
interface Tier {
  id: string
  name: string
  price: string
  period: string
  tag: string | null
  description: string
  features: { text: string; included: boolean }[]
  cta: string
  highlighted: boolean
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "FREE",
    price: "0",
    period: "/ forever",
    tag: null,
    description: "Browse and preview the full library. No source download.",
    features: [
      { text: "Live component previews", included: true },
      { text: "Mobile / tablet / desktop views", included: true },
      { text: "Community components", included: true },
      { text: "Dark + light themes", included: true },
      { text: "Source code download", included: false },
      { text: "Premium blocks & templates", included: false },
    ],
    cta: "START FREE",
    highlighted: false,
  },
  {
    id: "pro",
    name: "PRO",
    price: "6",
    period: "/ lifetime",
    tag: "RECOMMENDED",
    description: "Full source access. Copy, download, and ship every component. Lifetime access.",
    features: [
      { text: "Everything in Free", included: true },
      { text: "Copy & download source (ZIP)", included: true },
      { text: "All components", included: true },
      { text: "Animated effects library", included: true },
      { text: "Blocks & sections", included: true },
      { text: "Team seats & templates", included: false },
    ],
    cta: "GO PRO",
    highlighted: true,
  },
  {
    id: "professional",
    name: "PROFESSIONAL",
    price: "10",
    period: "/ lifetime",
    tag: null,
    description: "For teams and agencies shipping brutalist products at scale. Lifetime access.",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Full landing page templates", included: true },
      { text: "5 team seats included", included: true },
      { text: "Figma design files", included: true },
      { text: "Priority support", included: true },
      { text: "Commercial license", included: true },
    ],
    cta: "GET PROFESSIONAL",
    highlighted: false,
  },
]

/* ── single pricing card ── */
function PricingCard({ tier, index }: { tier: Tier; index: number }) {
  const isCustom = tier.price === "CUSTOM"

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.12, duration: 0.6, ease }}
      className={`flex flex-col h-full ${
        tier.highlighted
          ? "border-2 border-foreground bg-foreground text-background"
          : "border-2 border-foreground bg-background text-foreground"
      }`}
    >
      {/* Card header */}
      <div
        className={`flex items-center justify-between px-5 py-3 border-b-2 ${
          tier.highlighted ? "border-background/20" : "border-foreground"
        }`}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-mono">
          {tier.name}
        </span>
        <div className="flex items-center gap-2">
          {tier.tag && (
            <span className="bg-[#ea580c] text-background text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 font-mono">
              {tier.tag}
            </span>
          )}
          <span className="text-[10px] tracking-[0.2em] font-mono opacity-50">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Price block */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-baseline gap-1">
          {isCustom ? (
            <span className="text-3xl lg:text-4xl font-mono font-bold tracking-tight">CUSTOM</span>
          ) : (
            <span className="text-3xl lg:text-4xl">
              <ScramblePrice target={tier.price} />
            </span>
          )}
          {tier.period && (
            <span
              className={`text-xs font-mono tracking-widest uppercase ${
                tier.highlighted ? "text-background/50" : "text-muted-foreground"
              }`}
            >
              {tier.period}
            </span>
          )}
        </div>
        <p
          className={`text-xs font-mono mt-3 leading-relaxed ${
            tier.highlighted ? "text-background/60" : "text-muted-foreground"
          }`}
        >
          {tier.description}
        </p>
      </div>

      {/* Feature list */}
      <div
        className={`flex-1 px-5 py-4 border-t-2 ${
          tier.highlighted ? "border-background/20" : "border-foreground"
        }`}
      >
        <div className="flex flex-col gap-3">
          {tier.features.map((feature, fi) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 + 0.3 + fi * 0.04, duration: 0.35, ease }}
              className="flex items-start gap-3"
            >
              {feature.included ? (
                <Check
                  size={12}
                  strokeWidth={2.5}
                  className="mt-0.5 shrink-0 text-[#ea580c]"
                />
              ) : (
                <Minus
                  size={12}
                  strokeWidth={2}
                  className={`mt-0.5 shrink-0 ${
                    tier.highlighted ? "text-background/30" : "text-muted-foreground/40"
                  }`}
                />
              )}
              <span
                className={`text-xs font-mono leading-relaxed ${
                  feature.included
                    ? ""
                    : tier.highlighted
                    ? "text-background/30 line-through"
                    : "text-muted-foreground/40 line-through"
                }`}
              >
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5 pt-3">
        <ArrowButton
          href={tier.id === "free" ? "/lib" : `/payment?plan=${tier.id}`}
          full
          tone={tier.highlighted ? "light" : "dark"}
          className="text-xs"
        >
          {tier.cta}
        </ArrowButton>
      </div>
    </motion.div>
  )
}

/* ── main pricing section ── */
export function PricingSection() {
  return (
    <section className="w-full px-6 py-20 lg:px-12">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-4 mb-8"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
          {"// SECTION: PRICING_TIERS"}
        </span>
        <div className="flex-1 border-t border-border" />
        <BlinkDot />
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
          006
        </span>
      </motion.div>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
      >
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl lg:text-3xl font-mono font-bold tracking-tight uppercase text-foreground text-balance">
            Pick your license tier
          </h2>
          <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed max-w-md">
            Every tier includes live previews, dark + light themes, and full mobile / tablet / desktop responsiveness.
          </p>
        </div>
        <StatusLine />
      </motion.div>

      {/* Pricing grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {TIERS.map((tier, i) => (
          <PricingCard key={tier.id} tier={tier} index={i} />
        ))}
      </div>

          {/* Bottom note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5, ease }}
        className="flex items-center gap-3 mt-6"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
          {"* One-time payment. Lifetime access. No recurring fees."}
        </span>
        <div className="flex-1 border-t border-border" />
      </motion.div>
    </section>
  )
}
