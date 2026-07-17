"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Cpu, Eye, EyeOff, ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)

  const field =
    "w-full border-2 border-foreground bg-background px-3 py-2.5 text-[12px] font-mono outline-none focus:border-[#ea580c] transition-colors"
  const labelCls = "block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2"

  return (
    <div className="min-h-screen dot-grid-bg flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Cpu size={16} strokeWidth={1.5} />
          <span className="text-xs font-mono tracking-[0.15em] uppercase font-bold">Hasan.lib</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Card */}
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

          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4 px-6 py-6"
          >
            <div>
              <label className={labelCls}>{"// Email"}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@sys.int"
                className={field}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                  {"// Password"}
                </label>
                <Link
                  href="/signin"
                  className="text-[9px] font-mono uppercase tracking-widest text-[#ea580c] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${field} pr-11`}
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
              className="mt-2 flex w-full items-center justify-center gap-2 bg-foreground px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-background hover:bg-[#ea580c] hover:text-white transition-colors"
            >
              Enter <ArrowRight size={13} strokeWidth={2} />
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
