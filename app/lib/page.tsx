"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-store"

export default function LibPage() {
  const { assets, assetsLoaded } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!assetsLoaded) return
    if (assets.length > 0 && assets[0].subButtons.length > 0) {
      const firstCat = assets[0]
      const firstSub = firstCat.subButtons[0]
      if (firstCat && firstSub) {
        const catSlug = firstCat.name.toLowerCase().replace(/\s+/g, "-")
        const subSlug = firstSub.name.toLowerCase().replace(/\s+/g, "-")
        router.replace(`/lib/${catSlug}/${subSlug}`)
      }
    }
  }, [assets, assetsLoaded, router])

  if (!assetsLoaded) {
    return (
      <div className="min-h-screen dot-grid-bg flex items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
          Loading library...
        </p>
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

  return (
    <div className="min-h-screen dot-grid-bg flex items-center justify-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
        Loading library...
      </p>
    </div>
  )
}
