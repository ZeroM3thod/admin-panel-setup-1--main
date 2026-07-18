"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Cpu, Wallet, Coins, ArrowLeft, Copy, Check, 
  ExternalLink, AlertCircle, Shield, CheckCircle2, Info
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAdmin, CRYPTO_OPTIONS, PLAN_PRICES, type Plan } from "@/lib/admin-store"
import { useAuth } from "@/lib/auth-store"

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { submitPayment } = useAdmin()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      const currentPlan = searchParams.get("plan")
      const params = currentPlan ? `?plan=${currentPlan}` : ""
      router.push(`/signin?redirect=/payment${params}`)
    }
  }, [user, authLoading, router, searchParams])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen dot-grid-bg flex items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">Checking access...</p>
      </div>
    )
  }

  // States
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "professional" | null>(null)
  const [selectedCoin, setSelectedCoin] = useState<string>("USDT")
  const [selectedNetwork, setSelectedNetwork] = useState<string>("TRC-20")
  const [txId, setTxId] = useState<string>("")
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [showTxDialog, setShowTxDialog] = useState<boolean>(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false)

  // Parse plan from query param on mount
  useEffect(() => {
    const planParam = searchParams.get("plan")
    if (planParam === "pro" || planParam === "professional") {
      setSelectedPlan(planParam)
    } else {
      // If user is already "pro", default to "professional" or keep null to force selection
      setSelectedPlan(null)
    }
  }, [searchParams])

  // Get crypto details based on selected coin
  const coinConfig = CRYPTO_OPTIONS.find((c) => c.coin === selectedCoin) || CRYPTO_OPTIONS[0]
  
  // Update network if current network is not supported by newly selected coin
  useEffect(() => {
    if (coinConfig) {
      const hasNetwork = coinConfig.networks.some((n) => n.name === selectedNetwork)
      if (!hasNetwork && coinConfig.networks.length > 0) {
        setSelectedNetwork(coinConfig.networks[0].name)
      }
    }
  }, [selectedCoin, coinConfig, selectedNetwork])

  // Get deposit address
  const activeNetwork = coinConfig.networks.find((n) => n.name === selectedNetwork) || coinConfig.networks[0]
  const depositAddress = activeNetwork?.address || ""

  // Calculate amount in USD
  const usdAmount = selectedPlan ? PLAN_PRICES[selectedPlan] : 0

  // Copy address helper
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Handle transaction hash submission
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!txId.trim()) {
      alert("Please enter your transaction ID (TxID) to proceed.")
      return
    }
    
    if (selectedPlan) {
      // Submit to the admin store
      submitPayment({
        userId: user!.id,
        userName: user!.name,
        userEmail: user!.email,
        requestedPlan: selectedPlan,
        amount: usdAmount,
        coin: selectedCoin,
        network: selectedNetwork,
        depositAddress: depositAddress,
        txId: txId.trim(),
      })
      
      setShowTxDialog(false)
      setShowSuccessDialog(true)
    }
  }

  return (
    <div className="min-h-screen dot-grid-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 lg:px-6 border-b border-foreground/10 bg-background/50 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link
            href="/profile"
            className="flex h-8 w-8 items-center justify-center border border-foreground/20 hover:border-foreground hover:bg-foreground/5 transition-colors"
          >
            <ArrowLeft size={14} />
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Cpu size={16} strokeWidth={1.5} />
            <span className="text-xs font-mono tracking-[0.15em] uppercase font-bold">Hasan.lib</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/profile"
            className="hidden sm:inline-flex items-center border border-foreground px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
          >
            Back to Profile
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#ea580c] uppercase font-mono mb-2">
            <span className="h-1.5 w-1.5 bg-[#ea580c]" />
            <span>SECURE PAYMENT DEPLOYER</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-mono font-bold tracking-tight uppercase">
            Upgrade subscription
          </h1>
        </div>

        {/* Plan selection warning / prompt if not selected */}
        {!selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 border-2 border-[#ea580c] bg-[#ea580c]/5 p-4 flex gap-3 items-start"
          >
            <Info size={18} className="text-[#ea580c] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-mono font-bold uppercase text-[#ea580c] tracking-wider">
                Action Required: Choose subscription tier
              </p>
              <p className="mt-1 text-[11px] font-mono text-muted-foreground leading-relaxed">
                You navigated from your profile. Please select your desired upgrade plan below to generate payment options.
              </p>
            </div>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* STEP 1: Select Plan */}
          <section className="border-2 border-foreground bg-background">
            <div className="border-b-2 border-foreground px-5 py-3 bg-foreground/5 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {"// 01. SELECT ACCESS PLAN"}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground">STEP_01</span>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pro Tier */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("pro")}
                  className={`relative p-5 text-left border-2 transition-all flex flex-col h-full ${
                    selectedPlan === "pro"
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/25 hover:border-foreground/50 bg-background text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-mono font-bold">
                      PRO TIER
                    </span>
                    {selectedPlan === "pro" && (
                      <span className="bg-[#ea580c] text-white text-[8px] tracking-[0.1em] px-1.5 py-0.5 font-mono">
                        SELECTED
                      </span>
                    )}
                  </div>
                    <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono">$6</span>
                    <span className="text-[10px] font-mono opacity-60">/ LIFETIME</span>
                  </div>
                  <p className="mt-2 text-[10px] font-mono opacity-70 leading-relaxed">
                    Full library access, direct code downloads, customizable styling. Lifetime access.
                  </p>
                </button>

                {/* Professional Tier */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("professional")}
                  className={`relative p-5 text-left border-2 transition-all flex flex-col h-full ${
                    selectedPlan === "professional"
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/25 hover:border-foreground/50 bg-background text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-mono font-bold">
                      PROFESSIONAL TIER
                    </span>
                    {selectedPlan === "professional" && (
                      <span className="bg-[#ea580c] text-white text-[8px] tracking-[0.1em] px-1.5 py-0.5 font-mono">
                        SELECTED
                      </span>
                    )}
                  </div>
                    <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono">$10</span>
                    <span className="text-[10px] font-mono opacity-60">/ LIFETIME</span>
                  </div>
                  <p className="mt-2 text-[10px] font-mono opacity-70 leading-relaxed">
                    Everything in Pro plus landing templates, team seats, and priority support. Lifetime access.
                  </p>
                </button>
              </div>
            </div>
          </section>

          {selectedPlan && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* STEP 2: Payment Method */}
              <section className="border-2 border-foreground bg-background">
                <div className="border-b-2 border-foreground px-5 py-3 bg-foreground/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {"// 02. SELECT METHOD"}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-muted-foreground">STEP_02</span>
                </div>
                <div className="p-5">
                  <div className="border-2 border-foreground bg-[#ea580c]/5 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-[#ea580c] text-white flex items-center justify-center border-2 border-foreground shrink-0">
                        <Coins size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-wider block">
                          Cryptocurrency Transfer (Instant Settlement)
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
                          Only crypto payment methods are online for security
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#ea580c] font-bold">
                      [Active]
                    </span>
                  </div>
                </div>
              </section>

              {/* STEP 3: Coin selection & Network */}
              <section className="border-2 border-foreground bg-background">
                <div className="border-b-2 border-foreground px-5 py-3 bg-foreground/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {"// 03. CHOOSE CRYPTO CURRENCY & BLOCKCHAIN NETWORK"}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-muted-foreground">STEP_03</span>
                </div>
                <div className="p-5 space-y-5">
                  {/* Coin Picker */}
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2.5">
                      {"// Choose Coin"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CRYPTO_OPTIONS.map((opt) => {
                        const active = selectedCoin === opt.coin
                        return (
                          <button
                            key={opt.coin}
                            type="button"
                            onClick={() => setSelectedCoin(opt.coin)}
                            className={`px-4 py-2 text-[11px] font-mono uppercase tracking-wider font-bold border-2 transition-colors ${
                              active
                                ? "bg-[#ea580c] text-white border-foreground"
                                : "border-foreground/20 hover:border-foreground/40 bg-background text-foreground"
                            }`}
                          >
                            {opt.coin}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Network Picker */}
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2.5">
                      {"// Choose Blockchain Network"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {coinConfig.networks.map((net) => {
                        const active = selectedNetwork === net.name
                        return (
                          <button
                            key={net.name}
                            type="button"
                            onClick={() => setSelectedNetwork(net.name)}
                            className={`px-4 py-2 text-[11px] font-mono uppercase tracking-wider font-bold border-2 transition-colors ${
                              active
                                ? "bg-foreground text-background border-foreground"
                                : "border-foreground/20 hover:border-foreground/40 bg-background text-foreground"
                            }`}
                          >
                            {net.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* STEP 4: Checkout Summary & Transfer details */}
              <section className="border-2 border-foreground bg-background">
                <div className="border-b-2 border-foreground px-5 py-3 bg-foreground/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {"// 04. RECIPIENT WALLET DETAILS"}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-muted-foreground">STEP_04</span>
                </div>
                
                <div className="p-5 space-y-6">
                  {/* Amount Indicator */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-2 border-foreground p-4 bg-foreground/5">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground block mb-0.5">
                        Amount to Send (USD Value equivalent)
                      </span>
                      <span className="text-3xl font-pixel text-[#ea580c] font-bold">
                        ${usdAmount}.00
                      </span>
                    </div>
                    <div className="border-t sm:border-t-0 sm:border-l-2 border-foreground/15 pt-3 sm:pt-0 sm:pl-5 flex flex-col justify-center">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">
                        Paying for Plan
                      </span>
                      <span className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">
                        {selectedPlan === "pro" ? "Pro Access Tier" : "Professional Access Tier"}
                      </span>
                    </div>
                  </div>

                  {/* Transfer instruction and address */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Wallet size={14} className="text-[#ea580c]" />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-foreground">
                        Platform Deposit Address ({selectedCoin} / {selectedNetwork})
                      </span>
                    </div>
                    
                    <div className="relative flex flex-col sm:flex-row items-stretch border-2 border-foreground bg-background">
                      <div className="flex-1 p-3 font-mono text-[11px] sm:text-[12px] break-all bg-background text-foreground flex items-center">
                        {depositAddress}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="border-t-2 sm:border-t-0 sm:border-l-2 border-foreground bg-foreground text-background px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-[#ea580c] hover:text-white transition-colors flex items-center justify-center gap-2 shrink-0"
                      >
                        {isCopied ? (
                          <>
                            <Check size={12} strokeWidth={2.5} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> Copy Address
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Payment Alert warning */}
                  <div className="border border-foreground/15 p-3.5 bg-background flex gap-2.5 items-start">
                    <AlertCircle size={14} className="text-[#ea580c] shrink-0 mt-0.5" />
                    <p className="text-[10px] font-mono text-muted-foreground leading-relaxed uppercase">
                      * WARNING: Send only <span className="text-foreground font-bold">{selectedCoin}</span> to this deposit address on the <span className="text-foreground font-bold">{selectedNetwork}</span> chain network. Sending any other currency or using another network may result in permanent loss.
                    </p>
                  </div>

                  {/* PAYMENT DONE CTA BUTTON */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowTxDialog(true)}
                      className="w-full flex items-center justify-center gap-3 bg-[#ea580c] text-white p-4 text-[12px] font-mono uppercase tracking-widest hover:bg-foreground hover:text-background border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] font-bold active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                    >
                      Payment Done
                    </button>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-foreground/10 py-6 px-4">
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          <span>&copy; 2026 Hasan.lib LLC. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-foreground">Terms</Link>
            <span>//</span>
            <Link href="/" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </footer>

      {/* DIALOG 1: INPUT TRANSACTION ID (TRX ID) */}
      <AnimatePresence>
        {showTxDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTxDialog(false)}
              className="absolute inset-0 bg-background/85 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md border-2 border-foreground bg-background p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] z-10"
            >
              <div className="flex items-center justify-between border-b-2 border-foreground pb-4 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ea580c] font-bold flex items-center gap-1.5">
                  <Shield size={12} /> Secure Verification
                </span>
                <button
                  type="button"
                  onClick={() => setShowTxDialog(false)}
                  className="h-6 w-6 border border-foreground/20 hover:border-foreground flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleConfirmPayment} className="space-y-4">
                <div>
                  <h3 className="text-sm font-mono uppercase font-bold tracking-wider mb-2">
                    Enter Transaction ID (TxID)
                  </h3>
                  <p className="text-[10px] font-mono text-muted-foreground leading-relaxed uppercase mb-4">
                    To complete your upgrade to <span className="text-foreground font-bold">{selectedPlan}</span>, please provide the transaction hash / ID of your transfer.
                  </p>
                  
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                    {"// TRANSACTION TRX ID / HASH"}
                  </label>
                  <input
                    required
                    type="text"
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    placeholder="e.g. TxId, Hash, or wallet transfer note"
                    className="w-full border-2 border-foreground bg-background px-3 py-2.5 text-[12px] font-mono outline-none focus:border-[#ea580c] transition-colors"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTxDialog(false)}
                    className="flex-1 border-2 border-foreground px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-foreground text-background px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-[#ea580c] hover:text-white border-2 border-foreground transition-colors font-bold"
                  >
                    Confirm Payment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIALOG 2: ADMIN CHECKING POPUP */}
      <AnimatePresence>
        {showSuccessDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/90 backdrop-blur-md"
            />
            
            {/* Success Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md border-2 border-[#ea580c] bg-background p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)] z-10"
            >
              <div className="mx-auto h-12 w-12 bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center border-2 border-[#ea580c] rounded-none mb-4">
                <CheckCircle2 size={24} />
              </div>

              <h2 className="text-md font-mono uppercase font-bold tracking-widest text-[#ea580c] mb-3">
                PAYMENT DISPATCHED SUCCESS
              </h2>
              
              <div className="p-4 border border-foreground/10 bg-secondary/5 mb-6 text-left">
                <p className="text-[11px] font-mono text-foreground leading-relaxed uppercase">
                  Admin check the payment and update you as Pro/professional User .
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowSuccessDialog(false)
                  router.push("/profile")
                }}
                className="w-full bg-foreground text-background py-3 px-4 text-[10px] font-mono uppercase tracking-widest hover:bg-[#ea580c] hover:text-white border-2 border-foreground transition-colors font-bold"
              >
                Return to Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen dot-grid-bg flex items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
          Loading payment gateway...
        </p>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}
