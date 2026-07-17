"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ReactNode } from "react"

type ArrowButtonProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  full?: boolean
  /** dark = light button w/ dark text (default), light = inverse for dark cards */
  tone?: "dark" | "light"
}

/**
 * Brutalist CTA: orange square + white arrow on the left.
 * On hover, the orange fill slides across the whole button and the label turns white.
 */
export function ArrowButton({
  children,
  href,
  onClick,
  className = "",
  full = false,
  tone = "dark",
}: ArrowButtonProps) {
  const base =
    tone === "dark"
      ? "bg-foreground text-background"
      : "bg-background text-foreground"

  const cls = `group relative inline-flex items-center gap-0 overflow-hidden text-sm font-mono tracking-wider uppercase ${base} ${
    full ? "w-full" : ""
  } ${className}`

  const inner = (
    <>
      {/* sliding orange fill — triggers on hover, focus, and click/tap */}
      <span
        aria-hidden="true"
        className="absolute inset-0 z-0 origin-left scale-x-0 bg-[#ea580c] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 group-active:scale-x-100"
      />
      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center bg-[#ea580c]">
        <ArrowRight
          size={16}
          strokeWidth={2}
          className="text-white transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </span>
      <span
        className={`relative z-10 py-2.5 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white group-active:text-white ${
          full ? "flex-1 px-5 text-center" : "px-5"
        }`}
      >
        {children}
      </span>
    </>
  )

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cls}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}
