"use client"

import { useEffect, useState } from "react"

const FRAMEWORKS = [
  { name: "REACT 19", status: "STABLE", version: "v2.4" },
  { name: "NEXT.JS 16", status: "STABLE", version: "v2.4" },
  { name: "VITE 6", status: "STABLE", version: "v2.4" },
  { name: "ASTRO 5", status: "BETA", version: "v2.3" },
]

export function StatusCard() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-2">
        <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
          framework.compat
        </span>
        <span className="text-[10px] tracking-widest text-muted-foreground">
          {`TICK:${String(tick).padStart(4, "0")}`}
        </span>
      </div>
      <div className="flex-1 flex flex-col p-4 gap-0">
        {/* Table header */}
        <div className="grid grid-cols-3 gap-2 border-b border-border pb-2 mb-2">
          <span className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground">Framework</span>
          <span className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground">Status</span>
          <span className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground text-right">Version</span>
        </div>
        {FRAMEWORKS.map((framework) => (
          <div
            key={framework.name}
            className="grid grid-cols-3 gap-2 py-2 border-b border-border last:border-none"
          >
            <span className="text-xs font-mono text-foreground">{framework.name}</span>
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5"
                style={{
                  backgroundColor: framework.status === "STABLE" ? "#ea580c" : "hsl(var(--muted-foreground))",
                }}
              />
              <span className="text-xs font-mono text-muted-foreground">{framework.status}</span>
            </div>
            <span className="text-xs font-mono text-foreground text-right">{framework.version}</span>
          </div>
        ))}
        {/* Throughput bar */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground">
              Registry Coverage
            </span>
            <span className="text-[9px] font-mono text-foreground">87%</span>
          </div>
          <div className="h-2 w-full border border-foreground">
            <div className="h-full bg-foreground" style={{ width: "87%" }} />
          </div>
        </div>
      </div>
    </div>
  )
}
