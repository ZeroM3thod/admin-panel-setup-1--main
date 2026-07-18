"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Cpu, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-store"
import { checkRateLimit, recordAttempt, resetRateLimit, getRateLimitTimeRemaining } from "@/lib/rate-limit"

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const field =
    "w-full border-2 border-foreground bg-background px-3 py-2.5 text-[12px] font-mono outline-none focus:border-[#ea580c] transition-colors"
  const labelCls = "block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const { allowed, remaining } = checkRateLimit()
    if (!allowed) {
      setError(`Too many login attempts. Try again in ${getRateLimitTimeRemaining()}.`)
      return
    }

    setLoading(true)

    const { error: signInError, isAdmin } = await signIn(email, password)

    if (signInError) {
      recordAttempt()
      setError(signInError.message)
      setLoading(false)
      return
    }

    resetRateLimit()
    const redirectTo = searchParams.get("redirect") || (isAdmin ? "/admin/dashboard" : "/lib")
    router.push(redirectTo)
  }

  return (
    <div className="min-h-screen dot-grid-bg flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Cpu size={16} strokeWidth={1.5} />
          <span className="text-xs font-mono tracking-[0.15em] uppercase font-bold">Hasan.lib</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md border-2 border-foreground bg-background"
        >
          <div className="border-b-2 border-foreground px-6 py-5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
              {"// ACCESS TERMINAL"}
            </span>
            <h1 className="mt-2 font-pixel text-3xl tracking-tight">SIGN IN</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            {error && (
              <div className="flex items-center gap-2 border-2 border-destructive p-3 bg-destructive/5">
                <AlertCircle size={14} className="text-destructive shrink-0" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-destructive">{error}</span>
              </div>
            )}

            <div>
              <label className={labelCls}>{"// Email"}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@sys.int"
                className={field}
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                  {"// Password"}
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${field} pr-11`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-0 top-0 flex h-full w-10 items-center justify-center border-l-2 border-foreground text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 bg-foreground px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-background hover:bg-[#ea580c] hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? "Signing In..." : <>Enter <ArrowRight size={13} strokeWidth={2} /></>}
            </button>
          </form>

          <div className="border-t-2 border-foreground px-6 py-4 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              No account?{" "}
              <Link href="/signup" className="text-[#ea580c] hover:underline">
                Sign Up
              </Link>
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen dot-grid-bg flex items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">Loading...</p>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
