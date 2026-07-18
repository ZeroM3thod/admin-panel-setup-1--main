"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { User, AuthError } from "@supabase/supabase-js"
import { useLocalStorage } from "@/lib/use-local-storage"
import { createClient } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"

export type UserPlan = "free" | "pro" | "professional"

export type AuthUser = {
  id: string
  email: string
  name: string
  plan: UserPlan
  status: "active" | "suspended"
  joinedAt: string
  emailVerified: boolean
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; isAdmin: boolean }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  updateProfile: (data: { name?: string; email?: string }) => Promise<{ error: string | null }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<AuthUser | null>("user", null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const fetchProfile = useCallback(async (userId: string, email: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (profile) {
      setUser({
        id: userId,
        email,
        name: profile.name || email.split("@")[0],
        plan: profile.plan || "free",
        status: profile.status || "active",
        joinedAt: profile.joined_at || new Date().toISOString().split("T")[0],
        emailVerified: true,
      })
    } else {
      const newProfile = {
        id: userId,
        name: email.split("@")[0],
        email,
        plan: "free",
        status: "active",
        joined_at: new Date().toISOString().split("T")[0],
      }
      await supabase.from("profiles").insert(newProfile)
      setUser({
        id: userId,
        email,
        name: newProfile.name,
        plan: "free",
        status: "active",
        joinedAt: newProfile.joined_at,
        emailVerified: true,
      })
    }
  }, [supabase])

  useEffect(() => {
    const protectedRoutes = ["/admin", "/profile", "/payment"]
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    if (!loading && !user && isProtectedRoute) {
      router.push("/signin")
    }
  }, [user, loading, pathname, router])
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error, isAdmin: false }

    // Check if user has admin role in database (SECURE)
    const { data: adminRole } = await supabase
      .from("admin_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .single()

    const isAdmin = !!adminRole
    return { error: null, isAdmin }
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (error) return { error }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        name,
        email,
        plan: "free",
        status: "active",
        joined_at: new Date().toISOString().split("T")[0],
      })
      if (profileError) console.error("Profile insert error:", profileError)
    }

    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.localStorage.removeItem("user")
    router.push("/")
  }

  const updateProfile = async (data: { name?: string; email?: string }) => {
    try {
      if (!user) return { error: "Not authenticated" }

      const updates: Record<string, string> = {}
      if (data.name) updates.name = data.name

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)

      if (error) return { error: error.message }

      if (data.email && data.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: data.email })
        if (emailError) return { error: emailError.message }
      }

      setUser((prev) => prev ? { ...prev, ...data } : null)
      return { error: null }
    } catch {
      return { error: "Failed to update profile" }
    }
  }

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await fetchProfile(session.user.id, session.user.email!)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
