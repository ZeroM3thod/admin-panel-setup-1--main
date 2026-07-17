import type { ReactNode } from "react"
import { ArrowRight, Cpu, Activity, Check, Terminal, Zap } from "lucide-react"

export type RegistryItem = {
  slug: string
  name: string
  description: string
  preview: ReactNode
  code: string
  url?: string
}

export type RegistryCategory = {
  slug: string
  name: string
  label: string
  items: RegistryItem[]
}

/* ----------------------------- Preview pieces ----------------------------- */

function BrutalButton() {
  return (
    <button className="group flex items-center gap-0 bg-foreground text-background text-xs font-mono tracking-wider uppercase">
      <span className="flex items-center justify-center w-9 h-9 bg-[#ea580c]">
        <ArrowRight size={14} strokeWidth={2} className="text-white" />
      </span>
      <span className="px-4 py-2">Deploy Now</span>
    </button>
  )
}

function StatBadge() {
  return (
    <div className="flex items-center gap-2 border border-foreground px-3 py-1.5">
      <span className="w-1.5 h-1.5 bg-[#ea580c] animate-blink" />
      <span className="text-[10px] font-mono uppercase tracking-widest text-foreground">System Online</span>
    </div>
  )
}

function TerminalMini() {
  return (
    <div className="w-full max-w-xs border-2 border-foreground bg-background">
      <div className="flex items-center gap-1.5 border-b-2 border-foreground px-3 py-1.5">
        <Terminal size={12} strokeWidth={2} />
        <span className="text-[10px] font-mono uppercase tracking-widest">bash</span>
      </div>
      <div className="p-3 font-mono text-[11px] leading-relaxed">
        <p className="text-muted-foreground">$ sys deploy --edge</p>
        <p className="text-[#ea580c]">{"> routing 12 nodes ..."}</p>
        <p className="text-foreground">{"> done in 4.2ms"}</p>
      </div>
    </div>
  )
}

function ToggleSwitch() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Edge</span>
      <div className="w-12 h-6 border-2 border-foreground bg-foreground flex items-center justify-end p-0.5">
        <span className="w-4 h-4 bg-[#ea580c]" />
      </div>
    </div>
  )
}

function GlitchText() {
  return (
    <span className="animate-glitch font-pixel text-3xl tracking-tight text-foreground select-none">Hasan.lib</span>
  )
}

function MarqueeTicker() {
  return (
    <div className="w-full overflow-hidden border-y-2 border-foreground py-2">
      <div className="animate-marquee whitespace-nowrap flex gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="text-[10px] font-mono uppercase tracking-widest text-foreground">
            {"// UPTIME 99.99% // SUB-5MS // EDGE ROUTING //"}
          </span>
        ))}
      </div>
    </div>
  )
}

function PulseDot() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        <span className="absolute w-10 h-10 border-2 border-[#ea580c] animate-ping" />
        <span className="w-3 h-3 bg-[#ea580c]" />
      </div>
      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Live Signal</span>
    </div>
  )
}

function PricingRow() {
  return (
    <div className="w-full max-w-sm border-2 border-foreground">
      <div className="border-b-2 border-foreground px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest">Pro</span>
        <span className="font-pixel text-2xl text-foreground">$29</span>
      </div>
      <ul className="p-4 space-y-2">
        {["Unlimited deploys", "Edge routing", "Priority support"].map((f) => (
          <li key={f} className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
            <Check size={12} className="text-[#ea580c]" /> {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatGrid() {
  return (
    <div className="grid grid-cols-3 border-2 border-foreground w-full max-w-md">
      {[
        { k: "4.2ms", v: "Latency" },
        { k: "99.9%", v: "Uptime" },
        { k: "128", v: "Regions" },
      ].map((s, i) => (
        <div key={s.v} className={`p-3 text-center ${i < 2 ? "border-r-2 border-foreground" : ""}`}>
          <p className="font-pixel text-xl text-foreground">{s.k}</p>
          <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{s.v}</p>
        </div>
      ))}
    </div>
  )
}

function CtaBar() {
  return (
    <div className="w-full max-w-md border-2 border-foreground p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-foreground">Ship faster</p>
        <p className="text-[10px] font-mono text-muted-foreground">Start your free trial today.</p>
      </div>
      <button className="bg-foreground text-background px-3 py-2 text-[10px] font-mono uppercase tracking-widest">
        Start
      </button>
    </div>
  )
}

function HeroSplit() {
  return (
    <div className="w-full max-w-md border-2 border-foreground grid grid-cols-2">
      <div className="p-4 border-r-2 border-foreground">
        <p className="font-pixel text-lg text-foreground leading-none mb-2">DEPLOY. SCALE.</p>
        <p className="text-[10px] font-mono text-muted-foreground mb-3">The deterministic deploy layer.</p>
        <button className="bg-[#ea580c] text-white px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest">
          Demo
        </button>
      </div>
      <div className="p-4 flex items-center justify-center bg-secondary">
        <Cpu size={40} strokeWidth={1} className="text-foreground" />
      </div>
    </div>
  )
}

function MinimalNav() {
  return (
    <div className="w-full max-w-md border-2 border-foreground px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Zap size={14} className="text-[#ea580c]" />
        <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Hasan.lib</span>
      </div>
      <div className="flex items-center gap-4">
        {["Docs", "Pricing"].map((l) => (
          <span key={l} className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {l}
          </span>
        ))}
        <span className="bg-foreground text-background px-2 py-1 text-[10px] font-mono uppercase">Login</span>
      </div>
    </div>
  )
}

function LiveTemplate() {
  return (
    <iframe
      src="https://hasandrone.vercel.app/"
      title="Hasan Drone live landing template"
      loading="lazy"
      className="block h-full w-full bg-background"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    />
  )
}

function FeatureCard() {
  return (
    <div className="w-full max-w-xs border-2 border-foreground p-4">
      <Activity size={20} strokeWidth={1.5} className="text-[#ea580c] mb-3" />
      <p className="text-xs font-mono uppercase tracking-widest text-foreground mb-1">Realtime Metrics</p>
      <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
        Monitor every request across the edge with sub-second telemetry.
      </p>
    </div>
  )
}

/* --------------------------------- Codes ---------------------------------- */

const codes = {
  brutalButton: `export function BrutalButton() {
  return (
    <button className="group flex items-center gap-0 bg-foreground text-background text-xs font-mono tracking-wider uppercase">
      <span className="flex items-center justify-center w-9 h-9 bg-[#ea580c]">
        <ArrowRight size={14} strokeWidth={2} className="text-white" />
      </span>
      <span className="px-4 py-2">Deploy Now</span>
    </button>
  )
}`,
  statBadge: `export function StatBadge() {
  return (
    <div className="flex items-center gap-2 border border-foreground px-3 py-1.5">
      <span className="w-1.5 h-1.5 bg-[#ea580c] animate-blink" />
      <span className="text-[10px] font-mono uppercase tracking-widest">System Online</span>
    </div>
  )
}`,
  terminalMini: `export function TerminalMini() {
  return (
    <div className="w-full max-w-xs border-2 border-foreground bg-background">
      <div className="flex items-center gap-1.5 border-b-2 border-foreground px-3 py-1.5">
        <Terminal size={12} strokeWidth={2} />
        <span className="text-[10px] font-mono uppercase tracking-widest">bash</span>
      </div>
      <div className="p-3 font-mono text-[11px] leading-relaxed">
        <p className="text-muted-foreground">$ sys deploy --edge</p>
        <p className="text-[#ea580c]">{"> routing 12 nodes ..."}</p>
        <p>{"> done in 4.2ms"}</p>
      </div>
    </div>
  )
}`,
  toggleSwitch: `export function ToggleSwitch() {
  return (
    <div className="w-12 h-6 border-2 border-foreground bg-foreground flex items-center justify-end p-0.5">
      <span className="w-4 h-4 bg-[#ea580c]" />
    </div>
  )
}`,
  glitchText: `export function GlitchText() {
  return (
    <span className="animate-glitch font-pixel text-3xl tracking-tight select-none">
      Hasan.lib
    </span>
  )
}

/* globals.css
@keyframes glitch { ... }
.animate-glitch { animation: glitch 5s infinite; }
*/`,
  marqueeTicker: `export function MarqueeTicker() {
  return (
    <div className="w-full overflow-hidden border-y-2 border-foreground py-2">
      <div className="animate-marquee whitespace-nowrap flex gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="text-[10px] font-mono uppercase tracking-widest">
            {"// UPTIME 99.99% // SUB-5MS //"}
          </span>
        ))}
      </div>
    </div>
  )
}`,
  pulseDot: `export function PulseDot() {
  return (
    <div className="relative flex items-center justify-center">
      <span className="absolute w-10 h-10 border-2 border-[#ea580c] animate-ping" />
      <span className="w-3 h-3 bg-[#ea580c]" />
    </div>
  )
}`,
  pricingRow: `export function PricingRow() {
  return (
    <div className="w-full max-w-sm border-2 border-foreground">
      <div className="border-b-2 border-foreground px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest">Pro</span>
        <span className="font-pixel text-2xl">$29</span>
      </div>
      <ul className="p-4 space-y-2">
        {["Unlimited deploys", "Edge routing", "Priority support"].map((f) => (
          <li key={f} className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
            <Check size={12} className="text-[#ea580c]" /> {f}
          </li>
        ))}
      </ul>
    </div>
  )
}`,
  statGrid: `export function StatGrid() {
  const stats = [
    { k: "4.2ms", v: "Latency" },
    { k: "99.9%", v: "Uptime" },
    { k: "128", v: "Regions" },
  ]
  return (
    <div className="grid grid-cols-3 border-2 border-foreground">
      {stats.map((s, i) => (
        <div key={s.v} className={i < 2 ? "border-r-2 border-foreground p-3 text-center" : "p-3 text-center"}>
          <p className="font-pixel text-xl">{s.k}</p>
          <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{s.v}</p>
        </div>
      ))}
    </div>
  )
}`,
  ctaBar: `export function CtaBar() {
  return (
    <div className="w-full border-2 border-foreground p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest">Ship faster</p>
        <p className="text-[10px] font-mono text-muted-foreground">Start your free trial today.</p>
      </div>
      <button className="bg-foreground text-background px-3 py-2 text-[10px] font-mono uppercase tracking-widest">
        Start
      </button>
    </div>
  )
}`,
  heroSplit: `export function HeroSplit() {
  return (
    <div className="border-2 border-foreground grid grid-cols-2">
      <div className="p-4 border-r-2 border-foreground">
        <p className="font-pixel text-lg leading-none mb-2">DEPLOY. SCALE.</p>
        <p className="text-[10px] font-mono text-muted-foreground mb-3">The deterministic deploy layer.</p>
        <button className="bg-[#ea580c] text-white px-3 py-1.5 text-[10px] font-mono uppercase">Demo</button>
      </div>
      <div className="p-4 flex items-center justify-center bg-secondary">
        <Cpu size={40} strokeWidth={1} />
      </div>
    </div>
  )
}`,
  minimalNav: `export function MinimalNav() {
  return (
    <nav className="border-2 border-foreground px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Zap size={14} className="text-[#ea580c]" />
        <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Hasan.lib</span>
      </div>
      <div className="flex items-center gap-4">
        {["Docs", "Pricing"].map((l) => (
          <span key={l} className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{l}</span>
        ))}
        <span className="bg-foreground text-background px-2 py-1 text-[10px] font-mono uppercase">Login</span>
      </div>
    </nav>
  )
}`,
  liveTemplate: `export function LiveTemplate() {
  return (
    <div className="w-full overflow-hidden border-2 border-foreground bg-background">
      <iframe
        src="https://hasandrone.vercel.app/"
        title="Hasan Drone live landing template"
        loading="lazy"
        className="block h-[520px] w-full"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  )
}`,
  featureCard: `export function FeatureCard() {
  return (
    <div className="border-2 border-foreground p-4 max-w-xs">
      <Activity size={20} strokeWidth={1.5} className="text-[#ea580c] mb-3" />
      <p className="text-xs font-mono uppercase tracking-widest mb-1">Realtime Metrics</p>
      <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
        Monitor every request across the edge with sub-second telemetry.
      </p>
    </div>
  )
}`,
}

/* -------------------------------- Registry -------------------------------- */

export const registry: RegistryCategory[] = [
  {
    slug: "components",
    name: "Components",
    label: "COMPONENTS",
    items: [
      { slug: "brutal-button", name: "Brutal Button", description: "A hard-edged CTA button with an accent icon slot.", preview: <BrutalButton />, code: codes.brutalButton },
      { slug: "stat-badge", name: "Status Badge", description: "Compact live-status indicator with a blinking dot.", preview: <StatBadge />, code: codes.statBadge },
      { slug: "terminal-mini", name: "Terminal Card", description: "A miniature terminal window with command output.", preview: <TerminalMini />, code: codes.terminalMini },
      { slug: "toggle-switch", name: "Toggle Switch", description: "A boxy on/off switch with an accent knob.", preview: <ToggleSwitch />, code: codes.toggleSwitch },
    ],
  },
  {
    slug: "animated",
    name: "Animated",
    label: "ANIMATED",
    items: [
      { slug: "glitch-text", name: "Glitch Text", description: "Pixel headline with a periodic glitch distortion.", preview: <GlitchText />, code: codes.glitchText },
      { slug: "marquee-ticker", name: "Marquee Ticker", description: "Infinite horizontal scrolling status ticker.", preview: <MarqueeTicker />, code: codes.marqueeTicker },
      { slug: "pulse-dot", name: "Pulse Signal", description: "A pinging live-signal indicator.", preview: <PulseDot />, code: codes.pulseDot },
    ],
  },
  {
    slug: "blocks",
    name: "Blocks",
    label: "BLOCKS",
    items: [
      { slug: "pricing-row", name: "Pricing Card", description: "Single-tier pricing block with feature list.", preview: <PricingRow />, code: codes.pricingRow },
      { slug: "stat-grid", name: "Stat Grid", description: "Three-column metric grid with pixel numerals.", preview: <StatGrid />, code: codes.statGrid },
      { slug: "cta-bar", name: "CTA Bar", description: "Inline call-to-action bar with a primary button.", preview: <CtaBar />, code: codes.ctaBar },
      { slug: "feature-card", name: "Feature Card", description: "Icon-led feature card with description.", preview: <FeatureCard />, code: codes.featureCard },
    ],
  },
  {
    slug: "landing",
    name: "Landing Pages",
    label: "LANDING",
    items: [
      { slug: "live-template", name: "Live Template", description: "Full landing template rendered live in an embedded preview.", preview: <LiveTemplate />, code: codes.liveTemplate, url: "https://hasandrone.vercel.app/" },
      { slug: "hero-split", name: "Hero Split", description: "Two-column hero with headline and illustration.", preview: <HeroSplit />, code: codes.heroSplit },
      { slug: "minimal-nav", name: "Minimal Nav", description: "Compact navigation bar with brand and login.", preview: <MinimalNav />, code: codes.minimalNav },
    ],
  },
]

export function findItem(categorySlug: string, itemSlug: string) {
  const cat = registry.find((c) => c.slug === categorySlug)
  return cat?.items.find((i) => i.slug === itemSlug)
}
