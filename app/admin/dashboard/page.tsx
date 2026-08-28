"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  UserCheck,
  UserPlus,
  Activity,
  CreditCard,
  TrendingUp,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/features/admin/components/admin-layout"
import { StatCard } from "@/features/admin/components/stat-card"

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  newUsersThisYear: number
  loginsThisMonth: number
  loginsThisYear: number
  activeSubscriptions: number
  expiredSubscriptions: number
}

interface MonthlyData {
  month: string
  newUsers: number
  logins: number
}

interface ChartData {
  name: string
  value: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthlyStats, setMonthlyStats] = useState<MonthlyData[]>([])
  const [roleDistribution, setRoleDistribution] = useState<ChartData[]>([])
  const [planDistribution, setPlanDistribution] = useState<ChartData[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      
      // Fetch stats
      const statsResponse = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (statsResponse.ok) {
        const data = await statsResponse.json()
        setStats(data.stats)
        setMonthlyStats(data.monthlyStats || [])
        setRoleDistribution(data.roleDistribution || [])
        setPlanDistribution(data.planDistribution || [])
      }

      // Fetch recent activity
      const activityResponse = await fetch("/api/admin/activity?limit=5", {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (activityResponse.ok) {
        const data = await activityResponse.json()
        setRecentActivity(data.activities || [])
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
    setIsLoading(false)
  }

  const getMaxValue = (data: MonthlyData[], key: keyof MonthlyData) => {
    return Math.max(...data.map((d) => d[key] as number), 1)
  }

  return (
    <AdminLayout
      title="Dashboard"
      description="Overview of your subscription platform metrics"
    >
      {/* Refresh Button */}
      <div className="flex justify-end mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDashboardData}
          disabled={isLoading}
          className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          description="All registered users"
          icon={Users}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          description="Logged in last 30 days"
          icon={UserCheck}
          trend={{ value: 12, isPositive: true }}
          iconClassName="bg-accent/10 text-accent"
        />
        <StatCard
          title="New This Month"
          value={stats?.newUsersThisMonth || 0}
          description="Users registered"
          icon={UserPlus}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats?.activeSubscriptions || 0}
          description="Paid subscribers"
          icon={CreditCard}
          iconClassName="bg-secondary text-secondary-foreground"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Logins This Month"
          value={stats?.loginsThisMonth || 0}
          icon={Activity}
          iconClassName="bg-accent/10 text-accent"
        />
        <StatCard
          title="Logins This Year"
          value={stats?.loginsThisYear || 0}
          icon={TrendingUp}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          title="New Users This Year"
          value={stats?.newUsersThisYear || 0}
          icon={Calendar}
          iconClassName="bg-secondary text-secondary-foreground"
        />
        <StatCard
          title="Expired Subscriptions"
          value={stats?.expiredSubscriptions || 0}
          icon={Clock}
          iconClassName="bg-destructive/10 text-destructive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly User Growth Chart */}
        <Card className="lg:col-span-2 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              User Growth (Last 12 Months)
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              New user registrations over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2">
              {monthlyStats.map((data, index) => {
                const maxUsers = getMaxValue(monthlyStats, "newUsers")
                const height = (data.newUsers / maxUsers) * 100
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-lg transition-all hover:bg-primary opacity-90 hover:opacity-100"
                      style={{ height: `${Math.max(height, 5)}%` }}
                      title={`${data.newUsers} new users`}
                    />
                    <span className="text-xs text-muted-foreground transform -rotate-45 origin-top-left">
                      {data.month}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => router.push("/admin/users")}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Manage Users
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => router.push("/admin/activity")}
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                View Activity
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => router.push("/admin/subscriptions")}
            >
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Subscriptions
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Role Distribution */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">User Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roleDistribution.map((item) => {
                const total = roleDistribution.reduce((acc, i) => acc + i.value, 0) || 1
                const percentage = Math.round((item.value / total) * 100)
                return (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="text-slate-500">{item.value} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.name === "Admins"
                            ? "bg-accent"
                            : "bg-primary"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Subscription Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planDistribution.map((item) => {
                const total = planDistribution.reduce((acc, i) => acc + i.value, 0) || 1
                const percentage = Math.round((item.value / total) * 100)
                const colors: Record<string, string> = {
                  Free: "bg-muted",
                  Basic: "bg-secondary",
                  Premium: "bg-primary",
                  Enterprise: "bg-accent",
                }
                return (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="text-slate-500">{item.value} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[item.name] || colors.Free}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground text-lg flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              Recent Logins
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <div>
                      <p className="text-sm text-foreground font-medium">{activity.userName}</p>
                      <p className="text-xs text-muted-foreground">{activity.userEmail}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        activity.action === "login"
                          ? "border-accent/20 text-accent bg-accent/10"
                          : "border-border text-muted-foreground bg-background"
                      }`}
                    >
                      {activity.action}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
