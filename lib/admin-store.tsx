"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase"

export type Plan = "free" | "pro" | "professional"
export type AccessLevel = "free" | "pro" | "professional"

export type AdminUser = {
  id: string
  name: string
  email: string
  plan: Plan
  status: "active" | "suspended"
  joinedAt: string
}

export type Payment = {
  id: string
  userId: string
  userName: string
  userEmail: string
  requestedPlan: Exclude<Plan, "free">
  amount: number
  coin: string
  network: string
  depositAddress: string
  txId: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

export type CodeFile = {
  id: string
  name: string
  code: string
}

export type AssetSubButton = {
  id: string
  name: string
  icon: string
  previewLink: string
  zipLink: string
  codeFiles: CodeFile[]
  access: AccessLevel[]
}

export type AssetMainButton = {
  id: string
  name: string
  icon: string
  subButtons: AssetSubButton[]
}

export type CryptoOption = {
  coin: string
  networks: { name: string; address: string }[]
}

export const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    coin: "USDT",
    networks: [
      { name: "BEP-20", address: process.env.NEXT_PUBLIC_USDT_BEP20 || "0x7C4a2f19bE8d3aF5c1092Db4E6f8A0d21B93c7E4" },
      { name: "TRC-20", address: process.env.NEXT_PUBLIC_USDT_TRC20 || "TJYeasT4rN8gYq2Qp9v3H1cKfW6mLxZ7dR" },
      { name: "ERC-20", address: process.env.NEXT_PUBLIC_USDT_ERC20 || "0x9d2C71fA0e5B48630aF1c7E2b9D50648fC3a1B02" },
    ],
  },
  {
    coin: "USDC",
    networks: [
      { name: "BEP-20", address: process.env.NEXT_PUBLIC_USDC_BEP20 || "0x2Fb7A19c83E4d60597aB1c3F7e2D905648fC1a0B" },
      { name: "ERC-20", address: process.env.NEXT_PUBLIC_USDC_ERC20 || "0x3Ab9F1c72E4d80596aB1c3F7e2D905648fC1a0B3" },
    ],
  },
  {
    coin: "BTC",
    networks: [{ name: "Bitcoin", address: process.env.NEXT_PUBLIC_BTC_BITCOIN || "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq" }],
  },
  {
    coin: "ETH",
    networks: [{ name: "ERC-20", address: process.env.NEXT_PUBLIC_ETH_ERC20 || "0x5C1a2f19bE8d3aF5c1092Db4E6f8A0d21B93c7A9" }],
  },
  {
    coin: "BNB",
    networks: [{ name: "BEP-20", address: process.env.NEXT_PUBLIC_BNB_BEP20 || "0x8D4a2f19bE8d3aF5c1092Db4E6f8A0d21B93c7F1" }],
  },
]

export const PLAN_PRICES: Record<Exclude<Plan, "free">, number> = {
  pro: 6,
  professional: 10,
}

const LS_KEY_ASSETS = "hasanlib_assets"
const LS_KEY_PAYMENTS = "hasanlib_payments"

function loadFromLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveToLS(key: string, data: unknown) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // localStorage full or unavailable
  }
}

type AdminContextValue = {
  users: AdminUser[]
  payments: Payment[]
  assets: AssetMainButton[]
  assetsLoaded: boolean
  toggleUserStatus: (userId: string) => void
  setUserPlan: (userId: string, plan: Plan) => void
  approvePayment: (paymentId: string) => void
  rejectPayment: (paymentId: string) => void
  addMainButton: (name: string, icon: string) => void
  removeMainButton: (mainId: string) => void
  editMainButton: (mainId: string, name: string, icon: string) => void
  addSubButton: (mainId: string, sub: Omit<AssetSubButton, "id">) => void
  removeSubButton: (mainId: string, subId: string) => void
  editSubButton: (mainId: string, subId: string, sub: Omit<AssetSubButton, "id">) => void
  submitPayment: (payment: Omit<Payment, "id" | "status" | "submittedAt">) => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [payments, setPayments] = useState<Payment[]>(() => loadFromLS<Payment[]>(LS_KEY_PAYMENTS, []))
  const [assets, setAssets] = useState<AssetMainButton[]>(() => loadFromLS<AssetMainButton[]>(LS_KEY_ASSETS, []))
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
      const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project")

      if (isSupabaseConfigured) {
        try {
          const { data: profiles } = await supabase.from("profiles").select("*")
          if (profiles && profiles.length > 0) {
            setUsers(
              profiles.map((p: Record<string, unknown>) => ({
                id: p.id as string,
                name: p.name as string,
                email: (p.email as string) || "",
                plan: (p.plan as "free" | "pro" | "professional") || "free",
                status: (p.status as "active" | "suspended") || "active",
                joinedAt: (p.joined_at as string) || new Date().toISOString().split("T")[0],
              })),
            )
          }

          const { data: paymentsData } = await supabase.from("payments").select("*")
          if (paymentsData && paymentsData.length > 0) {
            const mapped = paymentsData.map((p: Record<string, unknown>) => ({
              id: p.id as string,
              userId: p.user_id as string,
              userName: p.user_name as string,
              userEmail: p.user_email as string,
              requestedPlan: p.requested_plan as "pro" | "professional",
              amount: p.amount as number,
              coin: p.coin as string,
              network: p.network as string,
              depositAddress: p.deposit_address as string,
              txId: p.tx_id as string,
              status: (p.status as "pending" | "approved" | "rejected") || "pending",
              submittedAt: p.submitted_at as string,
            }))
            setPayments(mapped)
            saveToLS(LS_KEY_PAYMENTS, mapped)
          }

          const { data: mainButtons } = await supabase.from("asset_main_buttons").select("*")
          if (mainButtons && mainButtons.length > 0) {
            const { data: subButtons } = await supabase.from("asset_sub_buttons").select("*")
            const { data: codeFiles } = await supabase.from("code_files").select("*")

            const assetList: AssetMainButton[] = mainButtons.map((m: Record<string, unknown>) => {
              const subs = (subButtons || []).filter((s: Record<string, unknown>) => s.main_button_id === m.id)
              return {
                id: m.id as string,
                name: m.name as string,
                icon: (m.icon as string) || "Boxes",
                subButtons: subs.map((s: Record<string, unknown>) => {
                  const files = (codeFiles || []).filter((cf: Record<string, unknown>) => cf.sub_button_id === s.id)
                  return {
                    id: s.id as string,
                    name: s.name as string,
                    icon: (s.icon as string) || "Square",
                    previewLink: (s.preview_link as string) || "",
                    zipLink: (s.zip_link as string) || "",
                    codeFiles: files.map((f: Record<string, unknown>) => ({
                      id: f.id as string,
                      name: f.name as string,
                      code: f.code as string,
                    })),
                    access: (s.access as string[]) || ["free"],
                  }
                }),
              }
            })
            setAssets(assetList)
            saveToLS(LS_KEY_ASSETS, assetList)
          }
        } catch {
          // Supabase call failed, localStorage fallback already in place
        }
      }
      setAssetsLoaded(true)
    }
    loadData()
  }, [supabase])

  // Persist assets to localStorage whenever they change
  useEffect(() => {
    if (assetsLoaded) saveToLS(LS_KEY_ASSETS, assets)
  }, [assets, assetsLoaded])

  useEffect(() => {
    if (assetsLoaded) saveToLS(LS_KEY_PAYMENTS, payments)
  }, [payments, assetsLoaded])

  const toggleUserStatus = useCallback((userId: string) => {
    setUsers((prev) => {
      const user = prev.find((u) => u.id === userId)
      if (!user) return prev
      const newStatus = user.status === "active" ? "suspended" : "active"
      supabase.from("profiles").update({ status: newStatus }).eq("id", userId).then(({ error }) => {
        if (error) console.error("Failed to toggle status:", error)
      })
      return prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    })
  }, [supabase])

  const setUserPlan = useCallback((userId: string, plan: Plan) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan } : u)))
    supabase.from("profiles").update({ plan }).eq("id", userId).then(({ error }) => {
      if (error) console.error("Failed to update plan:", error)
    })
  }, [supabase])

  const approvePayment = useCallback((paymentId: string) => {
    setPayments((prev) => {
      const payment = prev.find((p) => p.id === paymentId)
      if (payment) {
        setUsers((users) =>
          users.map((u) => (u.id === payment.userId ? { ...u, plan: payment.requestedPlan } : u)),
        )
        supabase.from("payments").update({ status: "approved" }).eq("id", paymentId).then(({ error }) => {
          if (error) console.error("Failed to approve payment:", error)
        })
        supabase.from("profiles").update({ plan: payment.requestedPlan }).eq("id", payment.userId).then(({ error }) => {
          if (error) console.error("Failed to update user plan:", error)
        })
      }
      return prev.map((p) => (p.id === paymentId ? { ...p, status: "approved" } : p))
    })
  }, [supabase])

  const rejectPayment = useCallback((paymentId: string) => {
    setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: "rejected" } : p)))
    supabase.from("payments").update({ status: "rejected" }).eq("id", paymentId).then(({ error }) => {
      if (error) console.error("Failed to reject payment:", error)
    })
  }, [supabase])

  const addMainButton = useCallback((name: string, icon: string) => {
    const id = `a${Date.now()}`
    setAssets((prev) => [...prev, { id, name, icon, subButtons: [] }])
    supabase.from("asset_main_buttons").insert({ id, name, icon }).then(({ error }) => {
      if (error) console.error("Failed to add main button:", error)
    })
  }, [supabase])

  const removeMainButton = useCallback((mainId: string) => {
    setAssets((prev) => prev.filter((m) => m.id !== mainId))
    supabase.from("asset_main_buttons").delete().eq("id", mainId).then(({ error }) => {
      if (error) console.error("Failed to remove main button:", error)
    })
  }, [supabase])

  const editMainButton = useCallback((mainId: string, name: string, icon: string) => {
    setAssets((prev) =>
      prev.map((m) => (m.id === mainId ? { ...m, name, icon } : m)),
    )
    supabase.from("asset_main_buttons").update({ name, icon }).eq("id", mainId).then(({ error }) => {
      if (error) console.error("Failed to edit main button:", error)
    })
  }, [supabase])

  const addSubButton = useCallback((mainId: string, sub: Omit<AssetSubButton, "id">) => {
    const subId = `s${Date.now()}`
    setAssets((prev) =>
      prev.map((m) =>
        m.id === mainId
          ? { ...m, subButtons: [...m.subButtons, { ...sub, id: subId }] }
          : m,
      ),
    )
    supabase.from("asset_sub_buttons").insert({
      id: subId,
      main_button_id: mainId,
      name: sub.name,
      icon: sub.icon,
      preview_link: sub.previewLink,
      zip_link: sub.zipLink,
      access: sub.access,
    }).then(({ error }) => {
      if (error) console.error("Failed to add sub button:", error)
    })
    for (const file of sub.codeFiles) {
      supabase.from("code_files").insert({
        sub_button_id: subId,
        name: file.name,
        code: file.code,
      }).then(({ error }) => {
        if (error) console.error("Failed to add code file:", error)
      })
    }
  }, [supabase])

  const removeSubButton = useCallback((mainId: string, subId: string) => {
    setAssets((prev) =>
      prev.map((m) =>
        m.id === mainId ? { ...m, subButtons: m.subButtons.filter((s) => s.id !== subId) } : m,
      ),
    )
    supabase.from("asset_sub_buttons").delete().eq("id", subId).then(({ error }) => {
      if (error) console.error("Failed to remove sub button:", error)
    })
  }, [supabase])

  const editSubButton = useCallback((mainId: string, subId: string, sub: Omit<AssetSubButton, "id">) => {
    setAssets((prev) =>
      prev.map((m) =>
        m.id === mainId
          ? {
              ...m,
              subButtons: m.subButtons.map((s) => (s.id === subId ? { ...sub, id: subId } : s)),
            }
          : m,
      ),
    )
    supabase.from("asset_sub_buttons").update({
      name: sub.name,
      icon: sub.icon,
      preview_link: sub.previewLink,
      zip_link: sub.zipLink,
      access: sub.access,
    }).eq("id", subId).then(({ error }) => {
      if (error) console.error("Failed to edit sub button:", error)
    })
  }, [supabase])

  const submitPayment = useCallback((payment: Omit<Payment, "id" | "status" | "submittedAt">) => {
    const newPayment: Payment = {
      id: `p${Date.now()}`,
      status: "pending",
      submittedAt: new Date().toISOString().split("T")[0],
      ...payment,
    }
    setPayments((prev) => [newPayment, ...prev])
    supabase.from("payments").insert({
      user_id: payment.userId,
      user_name: payment.userName,
      user_email: payment.userEmail,
      requested_plan: payment.requestedPlan,
      amount: payment.amount,
      coin: payment.coin,
      network: payment.network,
      deposit_address: payment.depositAddress,
      tx_id: payment.txId,
    }).then(({ error }) => {
      if (error) console.error("Failed to submit payment:", error)
    })
  }, [supabase])

  return (
    <AdminContext.Provider
      value={{
        users,
        payments,
        assets,
        assetsLoaded,
        toggleUserStatus,
        setUserPlan,
        approvePayment,
        rejectPayment,
        addMainButton,
        removeMainButton,
        editMainButton,
        addSubButton,
        removeSubButton,
        editSubButton,
        submitPayment,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider")
  return ctx
}
