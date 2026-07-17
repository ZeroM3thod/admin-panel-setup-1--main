"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

/* ------------------------------- Types ------------------------------- */

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

/* --------------------------- Crypto config --------------------------- */

export type CryptoOption = {
  coin: string
  networks: { name: string; address: string }[]
}

// Supported coins, their blockchain networks, and the deposit address per network.
export const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    coin: "USDT",
    networks: [
      { name: "BEP-20", address: "0x7C4a2f19bE8d3aF5c1092Db4E6f8A0d21B93c7E4" },
      { name: "TRC-20", address: "TJYeasT4rN8gYq2Qp9v3H1cKfW6mLxZ7dR" },
      { name: "ERC-20", address: "0x9d2C71fA0e5B48630aF1c7E2b9D50648fC3a1B02" },
    ],
  },
  {
    coin: "USDC",
    networks: [
      { name: "BEP-20", address: "0x2Fb7A19c83E4d60597aB1c3F7e2D905648fC1a0B" },
      { name: "ERC-20", address: "0x3Ab9F1c72E4d80596aB1c3F7e2D905648fC1a0B3" },
    ],
  },
  {
    coin: "BTC",
    networks: [{ name: "Bitcoin", address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq" }],
  },
  {
    coin: "ETH",
    networks: [{ name: "ERC-20", address: "0x5C1a2f19bE8d3aF5c1092Db4E6f8A0d21B93c7A9" }],
  },
  {
    coin: "BNB",
    networks: [{ name: "BEP-20", address: "0x8D4a2f19bE8d3aF5c1092Db4E6f8A0d21B93c7F1" }],
  },
]

// Price per plan in USD.
export const PLAN_PRICES: Record<Exclude<Plan, "free">, number> = {
  pro: 19,
  professional: 49,
}

/* ------------------------------ Seed data ---------------------------- */

const seedUsers: AdminUser[] = [
  { id: "u1", name: "Alex Chen", email: "alex@sys.int", plan: "pro", status: "active", joinedAt: "2025-11-02" },
  { id: "u2", name: "Maria Voss", email: "maria@sys.int", plan: "free", status: "active", joinedAt: "2026-01-14" },
  { id: "u3", name: "Kenji Ito", email: "kenji@sys.int", plan: "professional", status: "active", joinedAt: "2025-09-21" },
  { id: "u4", name: "Dana Brooks", email: "dana@sys.int", plan: "free", status: "suspended", joinedAt: "2026-02-08" },
  { id: "u5", name: "Omar Reyes", email: "omar@sys.int", plan: "free", status: "active", joinedAt: "2026-03-30" },
]

const seedPayments: Payment[] = [
  {
    id: "p1",
    userId: "u2",
    userName: "Maria Voss",
    userEmail: "maria@sys.int",
    requestedPlan: "pro",
    amount: 19,
    coin: "USDT",
    network: "BEP-20",
    depositAddress: "0x7C4a2f19bE8d3aF5c1092Db4E6f8A0d21B93c7E4",
    txId: "0x9f3a1c7e28b5d604a1f8c2e93b7d05a6f4c1e8290bd374a5e6f19c2b7d048a51",
    status: "pending",
    submittedAt: "2026-06-30",
  },
  {
    id: "p2",
    userId: "u5",
    userName: "Omar Reyes",
    userEmail: "omar@sys.int",
    requestedPlan: "professional",
    amount: 49,
    coin: "USDT",
    network: "TRC-20",
    depositAddress: "TJYeasT4rN8gYq2Qp9v3H1cKfW6mLxZ7dR",
    txId: "b7e2c9a41f83d6057e0a9c2b1d84f6a3e5c70d19b28f4a6c3e91d7502fa63b8c4",
    status: "pending",
    submittedAt: "2026-07-04",
  },
  {
    id: "p3",
    userId: "u1",
    userName: "Alex Chen",
    userEmail: "alex@sys.int",
    requestedPlan: "pro",
    amount: 19,
    coin: "USDC",
    network: "ERC-20",
    depositAddress: "0x3Ab9F1c72E4d80596aB1c3F7e2D905648fC1a0B3",
    txId: "0x1d4f7a2c9e5b8306f1a0c7e2b9d4536a8f0c1e7290b3d5a6f4c8e1902bd73a56",
    status: "approved",
    submittedAt: "2025-11-02",
  },
]

const seedAssets: AssetMainButton[] = [
  {
    id: "a1",
    name: "Components",
    icon: "Boxes",
    subButtons: [
      {
        id: "s1",
        name: "Brutal Button",
        icon: "Square",
        previewLink: "https://hasandrone.vercel.app/",
        zipLink: "https://hasandrone.vercel.app/brutal-button.zip",
        codeFiles: [
          {
            id: "cf1",
            name: "brutal-button.tsx",
            code: `export function BrutalButton() {\n  return <button className="bg-foreground text-background px-4 py-2">Deploy</button>\n}`,
          },
        ],
        access: ["free"],
      },
    ],
  },
  {
    id: "a2",
    name: "Animated",
    icon: "Sparkles",
    subButtons: [
      {
        id: "s2",
        name: "Glitch Text",
        icon: "Sparkles",
        previewLink: "https://hasandrone.vercel.app/",
        zipLink: "",
        codeFiles: [
          {
            id: "cf2",
            name: "glitch-text.tsx",
            code: `export function GlitchText() {\n  return <span className="animate-glitch">Hasan.lib</span>\n}`,
          },
        ],
        access: ["pro"],
      },
    ],
  },
]

/* ------------------------------ Context ------------------------------ */

type AdminContextValue = {
  users: AdminUser[]
  payments: Payment[]
  assets: AssetMainButton[]
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
  submitPayment: (payment: Omit<Payment, "id" | "userId" | "userName" | "userEmail" | "status" | "submittedAt">) => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>(seedUsers)
  const [payments, setPayments] = useState<Payment[]>(seedPayments)
  const [assets, setAssets] = useState<AssetMainButton[]>(seedAssets)

  const toggleUserStatus = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u,
      ),
    )
  }, [])

  const setUserPlan = useCallback((userId: string, plan: Plan) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan } : u)))
  }, [])

  const approvePayment = useCallback((paymentId: string) => {
    setPayments((prev) => {
      const payment = prev.find((p) => p.id === paymentId)
      if (payment) {
        setUsers((users) =>
          users.map((u) => (u.id === payment.userId ? { ...u, plan: payment.requestedPlan } : u)),
        )
      }
      return prev.map((p) => (p.id === paymentId ? { ...p, status: "approved" } : p))
    })
  }, [])

  const rejectPayment = useCallback((paymentId: string) => {
    setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: "rejected" } : p)))
  }, [])

  const addMainButton = useCallback((name: string, icon: string) => {
    setAssets((prev) => [...prev, { id: `a${Date.now()}`, name, icon, subButtons: [] }])
  }, [])

  const removeMainButton = useCallback((mainId: string) => {
    setAssets((prev) => prev.filter((m) => m.id !== mainId))
  }, [])

  const editMainButton = useCallback((mainId: string, name: string, icon: string) => {
    setAssets((prev) =>
      prev.map((m) => (m.id === mainId ? { ...m, name, icon } : m)),
    )
  }, [])

  const addSubButton = useCallback((mainId: string, sub: Omit<AssetSubButton, "id">) => {
    setAssets((prev) =>
      prev.map((m) =>
        m.id === mainId
          ? { ...m, subButtons: [...m.subButtons, { ...sub, id: `s${Date.now()}` }] }
          : m,
      ),
    )
  }, [])

  const removeSubButton = useCallback((mainId: string, subId: string) => {
    setAssets((prev) =>
      prev.map((m) =>
        m.id === mainId ? { ...m, subButtons: m.subButtons.filter((s) => s.id !== subId) } : m,
      ),
    )
  }, [])

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
  }, [])

  const submitPayment = useCallback((payment: Omit<Payment, "id" | "userId" | "userName" | "userEmail" | "status" | "submittedAt">) => {
    const newPayment: Payment = {
      id: `p${Date.now()}`,
      userId: "u1", // mock logged in user ID
      userName: "Alex Chen", // mock logged in user name
      userEmail: "alex@sys.int", // mock logged in user email
      status: "pending",
      submittedAt: new Date().toISOString().split("T")[0],
      ...payment,
    }
    setPayments((prev) => [newPayment, ...prev])
  }, [])

  return (
    <AdminContext.Provider
      value={{
        users,
        payments,
        assets,
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
