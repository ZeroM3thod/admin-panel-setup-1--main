"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Cpu, ArrowRight, AlertCircle, MailCheck, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-store"

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const field =
    "w-full border-2 border-foreground bg-background px-3 py-2.5 text-[12px] font-mono outline-none focus:border-[#ea580c] transition-colors"
  const labelCls = "block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: resetError } = await resetPassword(email)

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
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
          {sent ? (
            /* ── Link Sent Confirmation ── */
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md border-2 border-foreground bg-background"
            >
              <div className="border-b-2 border-foreground px-6 py-5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                  {"// RESET LINK DISPATCHED"}
                </span>
                <h1 className="mt-2 font-pixel text-3xl tracking-tight">LINK SENT</h1>
              </div>

              <div className="px-6 py-8 flex flex-col items-center text-center gap-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-16 w-16 items-center justify-center border-2 border-[#ea580c] text-[#ea580c]"
                >
                  <MailCheck size={32} strokeWidth={1.5} />
                </motion.div>

                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Reset link dispatched to
                  </p>
                  <p className="text-[13px] font-mono font-bold text-foreground break-all">{email}</p>
                </div>

                <div className="border-2 border-foreground/20 bg-foreground/5 px-4 py-4 text-left w-full space-y-2">
                  {[
                    "Open the email from Hasan.lib",
                    "Click the password reset link",
                    "Set your new password",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[9px] font-mono text-[#ea580c] shrink-0 mt-0.5">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground leading-relaxed">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                  Link expires in 60 minutes. Didn&apos;t get it?{" "}
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="text-[#ea580c] hover:underline"
                  >
                    Resend
                  </button>
                </p>

                <Link
                  href="/signin"
                  className="flex w-full items-center justify-center gap-2 bg-foreground px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-background hover:bg-[#ea580c] hover:text-white transition-colors"
                >
                  Back to Sign In <ArrowRight size={13} strokeWidth={2} />
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ── Forgot Password Form ── */
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
                  {"// RECOVERY PROTOCOL"}
                </span>
                <h1 className="mt-2 font-pixel text-3xl tracking-tight">RESET PASSWORD</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground leading-relaxed">
                  Enter the email linked to your account. We&apos;ll send a secure reset link automatically.
                </p>

                {error && (
                  <div className="flex items-center gap-2 border-2 border-destructive p-3 bg-destructive/5">
                    <AlertCircle size={14} className="text-destructive shrink-0" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-destructive">{error}</span>
                  </div>
                )}

                <div>
                  <label className={labelCls}>{"// Email Address"}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@sys.int"
                    className={field}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 bg-foreground px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-background hover:bg-[#ea580c] hover:text-white transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending Link..." : <>Send Reset Link <ArrowRight size={13} strokeWidth={2} /></>}
                </button>
              </form>

              <div className="border-t-2 border-foreground px-6 py-4 text-center">
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={11} strokeWidth={2} />
                  Back to Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}