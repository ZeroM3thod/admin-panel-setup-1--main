"use client"

import { AdminHeader } from "@/components/admin/admin-shell"
import {
  DollarSign,
  Users,
  Boxes,
  Code2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  TrendingUp,
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useEffect, useState } from "react"

interface ActivityLog {
  id: string
  user_email: string
  activity_type: string
  description: string
  created_at: string
}

interface DashboardStats {
  totalRevenue: number
  revenueChange: string
  activeUsers: number
  usersChange: string
  totalComponents: number
  componentsChange: string
  newInstalls: number
  installsChange: string
}

export default function AdminDashboard() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: "+0%",
    activeUsers: 0,
    usersChange: "+0%",
    totalComponents: 0,
    componentsChange: "+0%",
    newInstalls: 0,
    installsChange: "+0",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    const supabase = createClient()

    try {
      // Fetch recent activities
      const { data: activitiesData } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      if (activitiesData) {
        setActivities(activitiesData)
      }

      // Fetch total revenue from approved payments
      const { data: revenueData } = await supabase
        .from("payments")
        .select("amount")
        .eq("status", "approved")

      const totalRevenue = revenueData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0

      // Fetch last month revenue for comparison
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      
      const { data: lastMonthRevenue } = await supabase
        .from("payments")
        .select("amount")
        .eq("status", "approved")
        .lt("created_at", new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString())

      const lastMonthTotal = lastMonthRevenue?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0
      const revenueChangePercent = lastMonthTotal > 0 ? (((totalRevenue - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1) : "0"

      // Fetch active users count
      const { count: activeUsersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")

      // Fetch last month users for comparison
      const { count: lastMonthUsersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .lt("created_at", lastMonth.toISOString())

      const usersChangePercent = lastMonthUsersCount && lastMonthUsersCount > 0 
        ? ((((activeUsersCount || 0) - lastMonthUsersCount) / lastMonthUsersCount) * 100).toFixed(1)
        : "0"

      // Fetch total components
      const { count: totalComponentsCount } = await supabase
        .from("asset_sub_buttons")
        .select("*", { count: "exact", head: true })

      // Fetch last month components for comparison
      const { count: lastMonthComponentsCount } = await supabase
        .from("asset_sub_buttons")
        .select("*", { count: "exact", head: true })
        .lt("created_at", lastMonth.toISOString())

      const componentsChangePercent = lastMonthComponentsCount && lastMonthComponentsCount > 0
        ? ((((totalComponentsCount || 0) - lastMonthComponentsCount) / lastMonthComponentsCount) * 100).toFixed(1)
        : "0"

      // Fetch new installs (last hour)
      const oneHourAgo = new Date()
      oneHourAgo.setHours(oneHourAgo.getHours() - 1)

      const { count: newInstallsCount } = await supabase
        .from("component_installs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", oneHourAgo.toISOString())

      // Fetch previous hour installs for comparison
      const twoHoursAgo = new Date()
      twoHoursAgo.setHours(twoHoursAgo.getHours() - 2)

      const { count: prevHourInstallsCount } = await supabase
        .from("component_installs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", twoHoursAgo.toISOString())
        .lt("created_at", oneHourAgo.toISOString())

      const installsChange = (newInstallsCount || 0) - (prevHourInstallsCount || 0)

      setStats({
        totalRevenue,
        revenueChange: `${Number(revenueChangePercent) >= 0 ? "+" : ""}${revenueChangePercent}% from last month`,
        activeUsers: activeUsersCount || 0,
        usersChange: `${Number(usersChangePercent) >= 0 ? "+" : ""}${usersChangePercent}% from last month`,
        totalComponents: totalComponentsCount || 0,
        componentsChange: `${Number(componentsChangePercent) >= 0 ? "+" : ""}${componentsChangePercent}% from last month`,
        newInstalls: newInstallsCount || 0,
        installsChange: `${installsChange >= 0 ? "+" : ""}${installsChange} since last hour`,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  function getActivityIcon(activityType: string) {
    switch (activityType) {
      case "USER_CREATED":
      case "USER_ACTIVATED":
        return Users
      case "PAYMENT_SUBMITTED":
        return AlertCircle
      case "PAYMENT_APPROVED":
      case "PLAN_UPGRADED":
        return CheckCircle
      case "PAYMENT_REJECTED":
      case "USER_SUSPENDED":
        return XCircle
      case "ASSET_DOWNLOADED":
        return Download
      default:
        return TrendingUp
    }
  }

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds} seconds ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`
    const months = Math.floor(days / 30)
    return `${months} month${months > 1 ? "s" : ""} ago`
  }

  if (loading) {
    return (
      <div>
        <AdminHeader
          title="Dashboard"
          description="Welcome to the admin dashboard."
        />
        <div className="p-4 lg:p-8 flex items-center justify-center">
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        description="Welcome to the admin dashboard."
      />

      <div className="p-4 lg:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          change={stats.revenueChange}
          icon={DollarSign}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toString()}
          change={stats.usersChange}
          icon={Users}
        />
        <StatCard
          title="Total Components"
          value={stats.totalComponents.toString()}
          change={stats.componentsChange}
          icon={Boxes}
        />
        <StatCard
          title="New Installs"
          value={stats.newInstalls.toString()}
          change={stats.installsChange}
          icon={Code2}
        />
      </div>

      <div className="p-4 lg:px-8">
        <div className="border-2 border-foreground">
          <div className="p-4 border-b-2 border-foreground">
            <h2 className="font-pixel text-xl tracking-tight text-foreground">Recent Activity</h2>
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">A log of recent account and library changes.</p>
          </div>
          <div className="divide-y-2 divide-foreground">
            {activities.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">No recent activity</p>
              </div>
            ) : (
              activities.map((activity) => {
                const Icon = getActivityIcon(activity.activity_type)
                return (
                  <div key={activity.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-secondary border border-foreground/30 flex items-center justify-center">
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="text-[11px] font-mono uppercase tracking-widest">
                          <span className="text-foreground font-bold">{activity.description}</span>
                        </p>
                        <p className="text-[9px] font-mono text-muted-foreground">
                          {formatTimeAgo(activity.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <span className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest bg-secondary border border-foreground/30">
                        {activity.activity_type}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon: Icon }: { title: string, value: string, change: string, icon: React.ElementType }) {
  return (
    <div className="border-2 border-foreground p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">{title}</p>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="font-pixel text-2xl sm:text-3xl tracking-tight text-foreground">{value}</p>
      <p className="text-[10px] font-mono text-muted-foreground mt-1">{change}</p>
    </div>
  )
}
