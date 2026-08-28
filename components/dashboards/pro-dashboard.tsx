"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useFirestore } from "@/hooks/use-firestore"
import { DashboardMetrics } from "./dashboard-metrics"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { 
  Plus, 
  Calendar,
  Download,
  Eye,
  ArrowUpRight
} from "lucide-react"
import { toast } from "sonner"

interface JobCard {
  id: string
  customerName?: string
  phone?: string
  status: string
  createdAt: string
  costEstimate?: { total?: number }
  advanceReceived?: number
  deviceInfo?: { type?: string; brand?: string; model?: string }
}

export function ProDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const { getMonthlyJobCards, deleteJobCard } = useFirestore()
  const [jobs, setJobs] = useState<JobCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("month")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // OPTIMIZED: Only fetch last 30 days
        const data = await getMonthlyJobCards()
        setJobs(data as JobCard[])
      } catch (error) {
        console.error("Failed to fetch monthly jobs:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [getMonthlyJobCards])

  // Filter based on selected time range (within the 30-day window we fetched)
  const filteredJobs = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    return jobs.filter(job => {
      if (!job.createdAt) return true
      const jobDate = new Date(job.createdAt)
      
      switch (timeRange) {
        case "today":
          return jobDate >= today
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return jobDate >= weekAgo
        default:
          return true // month - show all fetched data
      }
    })
  }, [jobs, timeRange])

  const stats = useMemo(() => {
    const totalRevenue = filteredJobs.reduce((acc, job) => acc + (Number(job.costEstimate?.total) || 0), 0)
    const pendingJobs = filteredJobs.filter(j => j.status === 'pending')
    const completedJobs = filteredJobs.filter(j => j.status === 'delivered' || j.status === 'ready-for-delivery')
    
    const pendingAmount = filteredJobs
      .filter(j => j.status !== 'delivered')
      .reduce((acc, job) => {
        const total = Number(job.costEstimate?.total) || 0
        const advance = Number(job.advanceReceived) || 0
        return acc + Math.max(0, total - advance)
      }, 0)

    // Simple growth calculation (compare first half vs second half of period)
    const midpoint = Math.floor(filteredJobs.length / 2)
    const recentHalf = filteredJobs.slice(0, midpoint)
    const olderHalf = filteredJobs.slice(midpoint)
    const recentRevenue = recentHalf.reduce((acc, job) => acc + (Number(job.costEstimate?.total) || 0), 0)
    const olderRevenue = olderHalf.reduce((acc, job) => acc + (Number(job.costEstimate?.total) || 0), 0)
    const growth = olderRevenue > 0 ? Math.round(((recentRevenue - olderRevenue) / olderRevenue) * 100) : 0

    return {
      totalJobs: filteredJobs.length,
      totalRevenue,
      pendingCount: pendingJobs.length,
      completedCount: completedJobs.length,
      pendingAmount,
      growth
    }
  }, [filteredJobs])

  // Weekly chart data (last 4 weeks)
  const chartData = useMemo(() => {
    const weeks: Record<string, { name: string; revenue: number; jobs: number }> = {}
    const now = new Date()
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i * 7 + 6) * 24 * 60 * 60 * 1000)
      const key = `Week ${4 - i}`
      weeks[key] = { name: key, revenue: 0, jobs: 0 }
    }

    jobs.forEach(job => {
      if (!job.createdAt) return
      const jobDate = new Date(job.createdAt)
      const daysAgo = Math.floor((now.getTime() - jobDate.getTime()) / (24 * 60 * 60 * 1000))
      const weekIndex = Math.floor(daysAgo / 7)
      if (weekIndex < 4) {
        const key = `Week ${4 - weekIndex}`
        if (weeks[key]) {
          weeks[key].revenue += Number(job.costEstimate?.total) || 0
          weeks[key].jobs += 1
        }
      }
    })

    return Object.values(weeks)
  }, [jobs])

  const statusData = useMemo(() => [
    { name: 'Pending', value: filteredJobs.filter(j => j.status === 'pending').length, color: '#f59e0b' },
    { name: 'Ready', value: filteredJobs.filter(j => j.status === 'ready-for-delivery').length, color: '#3b82f6' },
    { name: 'Delivered', value: filteredJobs.filter(j => j.status === 'delivered').length, color: '#22c55e' },
  ], [filteredJobs])

  const recentJobs = useMemo(() => {
    return [...filteredJobs]
      .filter(job => job.createdAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [filteredJobs])

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  const handleExport = useCallback(() => {
    if (filteredJobs.length === 0) {
      toast.error("No data to export")
      return
    }
    
    const headers = ["Customer Name", "Phone", "Device", "Status", "Amount", "Date"]
    const rows = filteredJobs.map(job => [
      job.customerName || "Unknown",
      job.phone || "",
      `${job.deviceInfo?.brand || ""} ${job.deviceInfo?.model || ""}`.trim(),
      job.status,
      Number(job.costEstimate?.total) || 0,
      new Date(job.createdAt).toLocaleDateString()
    ])
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `pro-report-${timeRange}-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    
    toast.success("Report exported successfully!")
  }, [filteredJobs, timeRange])

  return (
    <div className="min-h-screen bg-transparent p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pro Dashboard</h1>
          <p className="text-slate-500 mt-1">Monthly performance overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Pro Plan
          </Badge>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] bg-white">
              <Calendar className="w-4 h-4 mr-2 text-slate-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push('/job-cards/new')} className="bg-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Job
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <DashboardMetrics
        totalRevenue={stats.totalRevenue}
        revenueLabel="Monthly Revenue"
        revenueGrowth={stats.growth}
        activeJobs={stats.totalJobs}
        jobsGrowth={stats.growth}
        totalPending={stats.pendingAmount}
        pendingCount={stats.pendingCount}
        completedCount={stats.completedCount}
        totalJobs={stats.totalJobs}
        showCompletionRate={true}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Weekly Revenue Trend</CardTitle>
            <CardDescription>Last 4 weeks performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenuePro" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    tickFormatter={(value) => `₹${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenuePro)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Pie */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Status Distribution</CardTitle>
            <CardDescription>Current job status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-900">{stats.totalJobs}</span>
                <span className="text-xs text-slate-500">Jobs</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <CardDescription>Latest service requests this month</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push('/job-cards')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-center text-slate-500 py-4">Loading...</p>
            ) : recentJobs.length === 0 ? (
              <p className="text-center text-slate-500 py-4">No jobs this month</p>
            ) : (
              recentJobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 bg-primary/10 text-primary">
                      <AvatarFallback>{job.customerName?.charAt(0) || 'C'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{job.customerName || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{job.deviceInfo?.brand} {job.deviceInfo?.model}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">{formatCurrency(Number(job.costEstimate?.total) || 0)}</p>
                    <Badge 
                      variant="secondary"
                      className={
                        job.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        job.status === 'ready-for-delivery' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }
                    >
                      {job.status === 'ready-for-delivery' ? 'Ready' : job.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompt */}
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Unlock Full Analytics</h3>
            <p className="text-sm text-slate-600">Upgrade to Elite for all-time data, advanced reports & more.</p>
          </div>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Upgrade to Elite
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
