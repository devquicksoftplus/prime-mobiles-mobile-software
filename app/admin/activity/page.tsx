"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  RefreshCw,
  Search,
  Calendar,
  Clock,
  LogIn,
  LogOut,
  Filter,
  Download,
  User,
  Monitor,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/features/admin/components/admin-layout"
import { StatCard } from "@/features/admin/components/stat-card"

interface LoginActivity {
  id: string
  userId: string
  userName: string
  userEmail: string
  timestamp: string
  action: "login" | "logout"
  ipAddress?: string
  userAgent?: string
}

export default function ActivityPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<LoginActivity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<LoginActivity[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  useEffect(() => {
    let result = activities

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (activity) =>
          activity.userName.toLowerCase().includes(query) ||
          activity.userEmail.toLowerCase().includes(query)
      )
    }

    // Apply action filter
    if (actionFilter !== "all") {
      result = result.filter((activity) => activity.action === actionFilter)
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date()
      result = result.filter((activity) => {
        const activityDate = new Date(activity.timestamp)
        switch (dateFilter) {
          case "today":
            return activityDate.toDateString() === now.toDateString()
          case "week":
            const weekAgo = new Date(now.setDate(now.getDate() - 7))
            return activityDate >= weekAgo
          case "month":
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
            return activityDate >= monthAgo
          default:
            return true
        }
      })
    }

    setFilteredActivities(result)
  }, [searchQuery, actionFilter, dateFilter, activities])

  const fetchActivities = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/activity?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
        setFilteredActivities(data.activities || [])
      }
    } catch (error) {
      console.error("Error fetching activities:", error)
    }
    setIsLoading(false)
  }

  const getStats = () => {
    const now = new Date()
    const today = activities.filter(
      (a) => new Date(a.timestamp).toDateString() === now.toDateString()
    )
    const thisWeek = activities.filter((a) => {
      const date = new Date(a.timestamp)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date >= weekAgo
    })
    const logins = activities.filter((a) => a.action === "login")
    const uniqueUsers = new Set(activities.map((a) => a.userId)).size

    return {
      todayLogins: today.filter((a) => a.action === "login").length,
      weekLogins: thisWeek.filter((a) => a.action === "login").length,
      totalLogins: logins.length,
      uniqueUsers,
    }
  }

  const stats = getStats()

  const exportActivities = () => {
    const csvContent = [
      ["User Name", "Email", "Action", "Timestamp", "IP Address"],
      ...filteredActivities.map((activity) => [
        activity.userName,
        activity.userEmail,
        activity.action,
        new Date(activity.timestamp).toLocaleString(),
        activity.ipAddress || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `login-activity-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const parseUserAgent = (userAgent?: string) => {
    if (!userAgent) return { browser: "Unknown", os: "Unknown" }
    
    let browser = "Unknown"
    let os = "Unknown"

    if (userAgent.includes("Chrome")) browser = "Chrome"
    else if (userAgent.includes("Firefox")) browser = "Firefox"
    else if (userAgent.includes("Safari")) browser = "Safari"
    else if (userAgent.includes("Edge")) browser = "Edge"

    if (userAgent.includes("Windows")) os = "Windows"
    else if (userAgent.includes("Mac")) os = "macOS"
    else if (userAgent.includes("Linux")) os = "Linux"
    else if (userAgent.includes("Android")) os = "Android"
    else if (userAgent.includes("iOS")) os = "iOS"

    return { browser, os }
  }

  return (
    <AdminLayout
      title="Login Activity"
      description="Monitor user login and logout activity"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Logins Today"
          value={stats.todayLogins}
          icon={Clock}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          title="Logins This Week"
          value={stats.weekLogins}
          icon={Calendar}
          iconClassName="bg-accent/10 text-accent"
        />
        <StatCard
          title="Total Logins"
          value={stats.totalLogins}
          icon={Activity}
          iconClassName="bg-secondary text-secondary-foreground"
        />
        <StatCard
          title="Unique Users"
          value={stats.uniqueUsers}
          icon={User}
          iconClassName="bg-primary/20 text-primary"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by user name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-32 bg-white border-slate-200 text-slate-900">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="login">Logins</SelectItem>
              <SelectItem value="logout">Logouts</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-32 bg-white border-slate-200 text-slate-900">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchActivities}
            disabled={isLoading}
            className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="outline"
            onClick={exportActivities}
            className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Activity Table */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-slate-50 bg-slate-50/50">
                  <TableHead className="text-slate-600">User</TableHead>
                  <TableHead className="text-slate-600">Action</TableHead>
                  <TableHead className="text-slate-600 hidden md:table-cell">Device</TableHead>
                  <TableHead className="text-slate-600 hidden lg:table-cell">IP Address</TableHead>
                  <TableHead className="text-slate-600 text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                      Loading activity...
                    </TableCell>
                  </TableRow>
                ) : filteredActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                      <Activity className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-300" />
                      No activity recorded yet
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredActivities.map((activity) => {
                    const { browser, os } = parseUserAgent(activity.userAgent)
                    return (
                      <TableRow
                        key={activity.id}
                        className="border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium shadow-sm">
                              {activity.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">
                                {activity.userName}
                              </p>
                              <p className="text-xs text-slate-500">{activity.userEmail}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              activity.action === "login"
                                ? "border-accent/20 text-accent bg-accent/10"
                                : "border-slate-200 text-slate-600 bg-white"
                            }`}
                          >
                            {activity.action === "login" ? (
                              <LogIn className="w-3 h-3 mr-1" />
                            ) : (
                              <LogOut className="w-3 h-3 mr-1" />
                            )}
                            {activity.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Monitor className="w-3 h-3 text-slate-400" />
                            {browser} / {os}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Globe className="w-3 h-3 text-slate-400" />
                            {activity.ipAddress || "Unknown"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-sm text-slate-900">
                            {formatTimestamp(activity.timestamp)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
