"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Cpu, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-store"

// Password strength scorer
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (pw.length === 0) return { score: 0, label: "", color: "" }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 1) return { score: 1, label: "WEAK", color: "#ef4444" }
  if (score <= 3) return { score: 2, label: "MODERATE", color: "#f59e0b" }
  return { score: 3, label: "STRONG", color: "#22c55e" }
}

export default function NewPasswordPage() {
  const router = useRouter()
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const strength = getStrength(password)
  const passwordsMatch = confirm.length > 0 && password === confirm

  const field =
    "w-full border-2 border-foreground bg-background px-3 py-2.5 text-[12px] font-mono outline-none focus:border-[#ea580c] transition-colors"
  const labelCls = "block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    const { error: updateError } = await updatePassword(password)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)

    // Redirect to sign in after short delay
    setTimeout(() => router.push("/signin"), 2500)
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
        <AnimatePresence mode="wait">
          {done ? (
            /* ── Success Screen ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md border-2 border-foreground bg-background"
            >
              <div className="border-b-2 border-foreground px-6 py-5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                  {"// CREDENTIALS UPDATED"}
                </span>
                <h1 className="mt-2 font-pixel text-3xl tracking-tight">PASSWORD SET</h1>
              </div>

              <div className="px-6 py-8 flex flex-col items-center text-center gap-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-16 w-16 items-center justify-center border-2 border-[#22c55e] text-[#22c55e]"
                >
                  <ShieldCheck size={32} strokeWidth={1.5} />
                </motion.div>

                <div className="space-y-2">
                  <p className="text-[13px] font-mono font-bold text-foreground">Password updated successfully.</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Redirecting you to sign in…
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full border-2 border-foreground/20 h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-[#ea580c]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "linear" }}
                  />
                </div>

                <Link
                  href="/signin"
                  className="flex w-full items-center justify-center gap-2 bg-foreground px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-background hover:bg-[#ea580c] hover:text-white transition-colors"
                >
                  Sign In Now <ArrowRight size={13} strokeWidth={2} />
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ── New Password Form ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md border-2 border-foreground bg-background"
            >
              <div className="border-b-2 border-foreground px-6 py-5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                  {"// UPDATE CREDENTIALS"}
                </span>
                <h1 className="mt-2 font-pixel text-3xl tracking-tight">NEW PASSWORD</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
                {error && (
                  <div className="flex items-center gap-2 border-2 border-destructive p-3 bg-destructive/5">
                    <AlertCircle size={14} className="text-destructive shrink-0" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-destructive">{error}</span>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className={labelCls}>{"// New Password"}</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`${field} pr-11`}
                      required
                      minLength={6}
                      autoFocus
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

                  {/* Strength meter */}
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 space-y-1.5"
                    >
                      <div className="flex gap-1">
                        {[1, 2, 3].map((bar) => (
                          <div
                            key={bar}
                            className="h-1 flex-1 border border-foreground/20 overflow-hidden"
                          >
                            <motion.div
                              className="h-full"
                              style={{ backgroundColor: bar <= strength.score ? strength.color : "transparent" }}
                              initial={{ width: 0 }}
                              animate={{ width: bar <= strength.score ? "100%" : "0%" }}
                              transition={{ duration: 0.25 }}
                            />
                          </div>
                        ))}
                      </div>
                      <p
                        className="text-[9px] font-mono uppercase tracking-widest"
                        style={{ color: strength.color }}
                      >
                        {strength.label}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className={labelCls}>{"// Confirm Password"}</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className={`${field} pr-11 ${
                        confirm.length > 0
                          ? passwordsMatch
                            ? "border-[#22c55e]"
                            : "border-destructive"
                          : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      className="absolute right-0 top-0 flex h-full w-10 items-center justify-center border-l-2 border-foreground text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {confirm.length > 0 && !passwordsMatch && (
                    <p className="mt-1.5 text-[9px] font-mono uppercase tracking-widest text-destructive">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || (confirm.length > 0 && !passwordsMatch)}
                  className="mt-2 flex w-full items-center justify-center gap-2 bg-foreground px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-background hover:bg-[#ea580c] hover:text-white transition-colors disabled:opacity-50"
                >
                  {loading ? "Updating Password..." : <>Set New Password <ArrowRight size={13} strokeWidth={2} /></>}
                </button>
              </form>

              <div className="border-t-2 border-foreground px-6 py-4 text-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Remembered it?{" "}
                  <Link href="/signin" className="text-[#ea580c] hover:underline">
                    Sign In
                  </Link>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}