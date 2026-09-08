"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useCompany } from "@/contexts/company-context"
import { useFirestore } from "@/hooks/use-firestore"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  IndianRupee, 
  Activity, 
  Smartphone, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  Crown,
  Download,
  Eye,
  Edit,
  FileText,
  Trash2,
  MoreVertical,
  Share2,
} from "lucide-react"
import { toast } from "sonner"
// Unified Invoice Service
import { downloadInvoice, shareOnWhatsApp } from "@/lib/unified-invoice-service"

interface JobCard {
  id: string
  customerName?: string
  phone?: string
  alternatePhone?: string
  address?: string
  status: string
  createdAt: string
  costEstimate?: {
    total?: number
    laborCost?: number
    partsCost?: number
    serviceCost?: number
  }
  advanceReceived?: number
  deviceInfo?: {
    type?: string
    brand?: string
    model?: string
  }
  imei?: string
  condition?: string
  accessories?: string
  problemDescription?: string
  technicianDiagnosis?: string
  requiredParts?: string[]
  deliveryDate?: string
  conditionImages?: Array<{ url: string; publicId: string }>
}

// Helper function to get date range boundaries
const getDateRange = (range: string): { start: Date; end: Date; prevStart: Date; prevEnd: Date } => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (range) {
    case "today": {
      const start = today
      const end = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      const prevStart = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      const prevEnd = today
      return { start, end, prevStart, prevEnd }
    }
    case "week": {
      const dayOfWeek = today.getDay()
      const start = new Date(today.getTime() - dayOfWeek * 24 * 60 * 60 * 1000)
      const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000)
      const prevStart = new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000)
      const prevEnd = start
      return { start, end, prevStart, prevEnd }
    }
    case "month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const prevEnd = start
      return { start, end, prevStart, prevEnd }
    }
    default: {
      // All time - use a very old start date
      const start = new Date(2020, 0, 1)
      const end = new Date(now.getFullYear() + 1, 0, 1)
      // For "all time", compare current month to previous month
      const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const prevEnd = new Date(now.getFullYear(), now.getMonth(), 1)
      return { start, end, prevStart, prevEnd }
    }
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { company } = useCompany()
  const { getJobCards, deleteJobCard } = useFirestore()
  const [allJobCards, setAllJobCards] = useState<JobCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("all")
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobCards = async () => {
      if (!isAuthenticated) {
        setIsLoading(false)
        return
      }

      try {
        const data = await getJobCards()
        setAllJobCards(data as JobCard[])
      } catch (error) {
        console.error("[Firebase] Failed to fetch job cards:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobCards()
  }, [isAuthenticated, getJobCards])

  // Filter job cards based on time range
  const { filteredJobs, previousPeriodJobs } = useMemo(() => {
    const { start, end, prevStart, prevEnd } = getDateRange(timeRange)
    
    const filtered = allJobCards.filter(job => {
      if (!job.createdAt) return timeRange === "all"
      const jobDate = new Date(job.createdAt)
      return jobDate >= start && jobDate < end
    })
    
    const previous = allJobCards.filter(job => {
      if (!job.createdAt) return false
      const jobDate = new Date(job.createdAt)
      return jobDate >= prevStart && jobDate < prevEnd
    })
    
    return { filteredJobs: filtered, previousPeriodJobs: previous }
  }, [allJobCards, timeRange])

  // --- Derived Stats Calculations ---

  const stats = useMemo(() => {
    const totalJobs = filteredJobs.length
    const totalRevenue = filteredJobs.reduce((acc: number, job: JobCard) => acc + (Number(job.costEstimate?.total) || 0), 0)
    const pendingCount = filteredJobs.filter((j: JobCard) => j.status === 'pending').length
    const completedCount = filteredJobs.filter((j: JobCard) => j.status === 'delivered' || j.status === 'ready-for-delivery').length
    
    // Calculate real trends from previous period
    const prevRevenue = previousPeriodJobs.reduce((acc: number, job: JobCard) => acc + (Number(job.costEstimate?.total) || 0), 0)
    const prevJobs = previousPeriodJobs.length
    
    const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : (totalRevenue > 0 ? 100 : 0)
    const jobsGrowth = prevJobs > 0 ? ((totalJobs - prevJobs) / prevJobs) * 100 : (totalJobs > 0 ? 100 : 0)
    // Calculate total pending amount (balance due from customers)
    const totalPending = filteredJobs
      .filter((j: JobCard) => j.status !== 'delivered')
      .reduce((acc: number, job: JobCard) => {
        const total = Number(job.costEstimate?.total) || 0
        const advance = Number(job.advanceReceived) || 0
        return acc + Math.max(0, total - advance)
      }, 0)
    
    return {
      totalJobs,
      totalRevenue,
      pendingCount,
      completedCount,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      jobsGrowth: Math.round(jobsGrowth * 10) / 10,
      totalPending
    }
  }, [filteredJobs, previousPeriodJobs])

  const chartData = useMemo(() => {
    const months: Record<string, { name: string; revenue: number; jobs: number }> = {}
    const now = new Date()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Init last 7 months
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${monthNames[d.getMonth()]}`
      months[key] = { name: key, revenue: 0, jobs: 0 }
    }

    // Use all job cards for chart (not filtered) to show full history
    allJobCards.forEach((job: JobCard) => {
      if (!job.createdAt) return
      const date = new Date(job.createdAt)
      const key = monthNames[date.getMonth()]
      if (months[key]) {
        months[key].revenue += Number(job.costEstimate?.total) || 0
        months[key].jobs += 1
      }
    })

    return Object.values(months)
  }, [allJobCards])

  const statusData = useMemo(() => {
    const counts = {
      pending: filteredJobs.filter((j: JobCard) => j.status === 'pending').length,
      ready: filteredJobs.filter((j: JobCard) => j.status === 'ready-for-delivery').length,
      delivered: filteredJobs.filter((j: JobCard) => j.status === 'delivered').length,
    }
    return [
      { name: 'Pending', value: counts.pending, color: '#f59e0b' },
      { name: 'Ready', value: counts.ready, color: '#3b82f6' },
      { name: 'Delivered', value: counts.delivered, color: '#22c55e' },
    ]
  }, [filteredJobs])

  const recentJobs = useMemo(() => {
    return [...allJobCards]
      .filter(job => job.createdAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  }, [allJobCards])

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  // Export to CSV
  const handleExport = useCallback(() => {
    if (filteredJobs.length === 0) {
      toast.error("No data to export")
      return
    }
    
    const headers = ["Customer Name", "Phone", "Device", "Status", "Amount", "Date"]
    const rows = filteredJobs.map((job: JobCard) => [
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
    link.download = `service-report-${timeRange}-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    
    toast.success("Report exported successfully!")
  }, [filteredJobs, timeRange])

  // Navigation handlers
  const handleViewAll = () => router.push("/job-cards")
  const handleEditJob = (jobId: string) => router.push(`/job-cards/${jobId}/edit`)

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return
    
    try {
      await deleteJobCard(jobToDelete)
      setAllJobCards(prev => prev.filter(job => job.id !== jobToDelete))
      toast.success("Service request deleted successfully")
    } catch (error) {
      console.error("Failed to delete job:", error)
      toast.error("Failed to delete service request")
    } finally {
      setDeleteDialogOpen(false)
      setJobToDelete(null)
    }
  }

  // Always load the full Dashboard (All Elite-level analytics & metrics enabled by default)
  return (
    <PageLayout>
      <div className="min-h-screen bg-transparent p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
              <p className="text-slate-500 mt-1">Overview of your service center performance.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px] bg-white border-slate-200">
                <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-primary hover:bg-primary/90" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> 
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue Card */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats.totalRevenue)}</h3>
                </div>
                <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className={`flex items-center font-medium px-1.5 py-0.5 rounded ${stats.revenueGrowth >= 0 ? 'text-accent bg-accent/10' : 'text-destructive bg-destructive/10'}`}>
                  {stats.revenueGrowth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}%
                </span>
                <span className="text-slate-400">vs last period</span>
              </div>
            </CardContent>
          </Card>

          {/* Jobs Card */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Jobs</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalJobs}</h3>
                </div>
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className={`flex items-center font-medium px-1.5 py-0.5 rounded ${stats.jobsGrowth >= 0 ? 'text-primary bg-primary/10' : 'text-destructive bg-destructive/10'}`}>
                  {stats.jobsGrowth >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {stats.jobsGrowth >= 0 ? '+' : ''}{stats.jobsGrowth}%
                </span>
                <span className="text-slate-400">vs last period</span>
              </div>
            </CardContent>
          </Card>

          {/* Pending Collections Card */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Pending</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats.totalPending)}</h3>
                </div>
                <div className="h-10 w-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-destructive" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-slate-500 font-medium">
                  {stats.pendingCount} jobs
                </span>
                <span className="text-slate-400">awaiting payment</span>
              </div>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Completion Rate</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {stats.totalJobs > 0 ? Math.round((stats.completedCount / stats.totalJobs) * 100) : 0}%
                  </h3>
                </div>
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ width: `${stats.totalJobs > 0 ? (stats.completedCount / stats.totalJobs) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend Chart */}
          <Card className="lg:col-span-2 border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">Revenue Analytics</CardTitle>
                  <CardDescription>Monthly revenue vs job volume</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      const csvData = chartData.map(row => `${row.name},${row.revenue}`).join('\n')
                      const blob = new Blob([`Month,Revenue\n${csvData}`], { type: 'text/csv' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'revenue-analytics.csv'
                      a.click()
                      toast.success('Chart data exported successfully')
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      toast.info('Revenue Analytics', {
                        description: `Total revenue: ₹${stats.totalRevenue.toLocaleString('en-IN')} across ${stats.totalJobs} jobs`
                      })
                    }}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Summary
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      tickFormatter={(value) => `₹${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#1e293b' }}
                      formatter={(value: number) => [`₹${value}`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Job Status Distribution */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">Current Status</CardTitle>
              <CardDescription>Distribution across active jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center text for donut chart */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-slate-900">{stats.totalJobs}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide">Total Jobs</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
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

        {/* Recent Activity Section */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-slate-50/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900">Recent Service Requests</CardTitle>
                <CardDescription>Latest updates from your service center</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="bg-white" onClick={handleViewAll}>View All</Button>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Device</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-4 py-3 text-center">View</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading data...</td>
                  </tr>
                ) : recentJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No recent jobs found.</td>
                  </tr>
                ) : (
                  recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 bg-primary/10 text-primary">
                            <AvatarFallback>{job.customerName?.charAt(0) || 'C'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">{job.customerName || 'Unknown'}</p>
                            <p className="text-xs text-slate-500">{job.phone || 'No phone'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900">{job.deviceInfo?.brand || 'Generic'} {job.deviceInfo?.model}</span>
                          <span className="text-xs text-slate-500 capitalize">{job.deviceInfo?.type || 'Device'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {formatCurrency(Number(job.costEstimate?.total) || 0)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="secondary"
                          className={
                            job.status === 'delivered' ? 'bg-accent/10 text-accent hover:bg-accent/20' :
                            job.status === 'ready-for-delivery' ? 'bg-primary/10 text-primary hover:bg-primary/20' :
                            'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20'
                          }
                        >
                          {job.status === 'ready-for-delivery' ? 'Ready' : job.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => {
                            setSelectedJob(job)
                            setIsSheetOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-slate-600"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              const jobCardWithCompanyInfo = {
                                ...job,
                                deviceInfo: {
                                  type: job.deviceInfo?.type || 'Device',
                                  brand: job.deviceInfo?.brand || 'Unknown',
                                  model: job.deviceInfo?.model || '',
                                },
                                companyInfo: company ? {
                                  name: company.companyName,
                                  tagline: company.tagline,
                                  phone: company.phone,
                                  alternatePhone: company.alternatePhone,
                                  email: company.email,
                                  address: company.address,
                                  city: company.city,
                                  state: company.state,
                                  pincode: company.pincode,
                                  gstNumber: company.gstNumber,
                                  logoUrl: company.logoUrl,
                                  website: company.website,
                                  selectedTerms: company.selectedTerms,
                                  customTerms: company.customTerms,
                                  termsAndConditions: company.termsAndConditions,
                                } : undefined
                              }
                              downloadInvoice(jobCardWithCompanyInfo)
                            }}>
                              <FileText className="w-4 h-4 mr-2" />
                              Download Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              const jobCardWithCompanyInfo = {
                                ...job,
                                deviceInfo: {
                                  type: job.deviceInfo?.type || 'Device',
                                  brand: job.deviceInfo?.brand || 'Unknown',
                                  model: job.deviceInfo?.model || '',
                                },
                                companyInfo: company ? {
                                  name: company.companyName,
                                  tagline: company.tagline,
                                  phone: company.phone,
                                  alternatePhone: company.alternatePhone,
                                  email: company.email,
                                  address: company.address,
                                  city: company.city,
                                  state: company.state,
                                  pincode: company.pincode,
                                  gstNumber: company.gstNumber,
                                  logoUrl: company.logoUrl,
                                  website: company.website,
                                  selectedTerms: company.selectedTerms,
                                  customTerms: company.customTerms,
                                  termsAndConditions: company.termsAndConditions,
                                } : undefined
                              }
                              shareOnWhatsApp(jobCardWithCompanyInfo)
                            }}>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share on WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditJob(job.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setJobToDelete(job.id)
                                setDeleteDialogOpen(true)
                              }}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Job Details Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 z-10">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-lg font-semibold">Service Details</SheetTitle>
                  <div className="flex items-center gap-3">
                    {selectedJob && (
                      <Badge 
                        className={`text-xs px-3 py-1 ${selectedJob.status === 'delivered' ? 'bg-green-100 text-green-700' : selectedJob.status === 'ready-for-delivery' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}
                      >
                        {selectedJob.status === 'ready-for-delivery' ? 'Ready' : selectedJob.status}
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-slate-100"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <span className="text-lg">×</span>
                    </Button>
                  </div>
                </div>
              </SheetHeader>
            </div>
            
            {selectedJob && (
              <div className="px-6 py-5 space-y-5">
                {/* Customer Info Card */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Name</p>
                      <p className="text-sm font-medium text-slate-900">{selectedJob.customerName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                      <p className="text-sm font-medium text-slate-900">{selectedJob.phone || "N/A"}</p>
                    </div>
                    {selectedJob.alternatePhone && (
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Alt. Phone</p>
                        <p className="text-sm font-medium text-slate-900">{selectedJob.alternatePhone}</p>
                      </div>
                    )}
                    {selectedJob.address && (
                      <div className="col-span-2">
                        <p className="text-xs text-slate-500 mb-0.5">Address</p>
                        <p className="text-sm font-medium text-slate-900">{selectedJob.address}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Device Info Card */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    Device Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Type</p>
                      <p className="text-sm font-medium text-slate-900 capitalize">{selectedJob.deviceInfo?.type || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Brand</p>
                      <p className="text-sm font-medium text-slate-900">{selectedJob.deviceInfo?.brand || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Model</p>
                      <p className="text-sm font-medium text-slate-900">{selectedJob.deviceInfo?.model || "N/A"}</p>
                    </div>
                    {selectedJob.imei && (
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">IMEI</p>
                        <p className="text-sm font-medium text-slate-900 font-mono">{selectedJob.imei}</p>
                      </div>
                    )}
                  </div>
                  {(selectedJob.condition || selectedJob.accessories) && (
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      {selectedJob.condition && (
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Condition</p>
                          <p className="text-sm text-slate-700">{selectedJob.condition}</p>
                        </div>
                      )}
                      {selectedJob.accessories && (
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Accessories</p>
                          <p className="text-sm text-slate-700">{selectedJob.accessories}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Problem & Diagnosis Card */}
                {(selectedJob.problemDescription || selectedJob.technicianDiagnosis || (selectedJob.requiredParts && selectedJob.requiredParts.length > 0)) && (
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      Problem & Diagnosis
                    </h4>
                    <div className="space-y-3">
                      {selectedJob.problemDescription && (
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Problem</p>
                          <p className="text-sm text-slate-700">{selectedJob.problemDescription}</p>
                        </div>
                      )}
                      {selectedJob.technicianDiagnosis && (
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Diagnosis</p>
                          <p className="text-sm text-slate-700">{selectedJob.technicianDiagnosis}</p>
                        </div>
                      )}
                      {selectedJob.requiredParts && selectedJob.requiredParts.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1.5">Required Parts</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedJob.requiredParts.map((part, i) => (
                              <Badge key={i} variant="secondary" className="text-xs bg-white border">
                                {part}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cost & Payment Card */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 space-y-3 border border-primary/10">
                  <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Cost & Payment
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Labor Cost</span>
                      <span className="font-medium">{formatCurrency(selectedJob.costEstimate?.laborCost || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Parts Cost</span>
                      <span className="font-medium">{formatCurrency(selectedJob.costEstimate?.partsCost || 0)}</span>
                    </div>
                    {selectedJob.costEstimate?.serviceCost !== undefined && selectedJob.costEstimate.serviceCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Service Cost</span>
                        <span className="font-medium">{formatCurrency(selectedJob.costEstimate?.serviceCost || 0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-primary/20">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(selectedJob.costEstimate?.total || 0)}</span>
                    </div>
                    {selectedJob.advanceReceived !== undefined && selectedJob.advanceReceived > 0 && (
                      <>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Advance Paid</span>
                          <span className="font-medium">- {formatCurrency(selectedJob.advanceReceived)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold text-amber-600 bg-amber-50 -mx-4 px-4 py-2 rounded-lg">
                          <span>Balance Due</span>
                          <span>{formatCurrency((selectedJob.costEstimate?.total || 0) - selectedJob.advanceReceived)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Dates Card */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex flex-col gap-2 text-sm">
                    {selectedJob.deliveryDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Expected Delivery</span>
                        <span className="font-medium text-slate-900">{new Date(selectedJob.deliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Created On</span>
                      <span className="font-medium text-slate-900">{new Date(selectedJob.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                {/* Invoice Generation */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Generate Invoice
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    Download invoice using your selected template from Settings → Templates
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                      onClick={() => {
                        // Spread all job properties (including conditionImages) and add company info
                        const jobCardWithCompanyInfo = {
                          ...selectedJob,
                          // Ensure deviceInfo has proper fallback values
                          deviceInfo: {
                            type: selectedJob.deviceInfo?.type || 'Device',
                            brand: selectedJob.deviceInfo?.brand || 'Unknown',
                            model: selectedJob.deviceInfo?.model || '',
                          },
                          // Add company info for invoice generation
                          companyInfo: company ? {
                            name: company.companyName,
                            tagline: company.tagline,
                            phone: company.phone,
                            alternatePhone: company.alternatePhone,
                            email: company.email,
                            address: company.address,
                            city: company.city,
                            state: company.state,
                            pincode: company.pincode,
                            gstNumber: company.gstNumber,
                            logoUrl: company.logoUrl,
                            website: company.website,
                            selectedTerms: company.selectedTerms,
                            customTerms: company.customTerms,
                            termsAndConditions: company.termsAndConditions,
                          } : undefined
                        }
                        downloadInvoice(jobCardWithCompanyInfo)
                        toast.success("Invoice download started!")
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        const jobCardWithCompanyInfo = {
                          ...selectedJob,
                          deviceInfo: {
                            type: selectedJob.deviceInfo?.type || 'Device',
                            brand: selectedJob.deviceInfo?.brand || 'Unknown',
                            model: selectedJob.deviceInfo?.model || '',
                          },
                          companyInfo: company ? {
                            name: company.companyName,
                            tagline: company.tagline,
                            phone: company.phone,
                            alternatePhone: company.alternatePhone,
                            email: company.email,
                            address: company.address,
                            city: company.city,
                            state: company.state,
                            pincode: company.pincode,
                            gstNumber: company.gstNumber,
                            logoUrl: company.logoUrl,
                            website: company.website,
                            selectedTerms: company.selectedTerms,
                            customTerms: company.customTerms,
                            termsAndConditions: company.termsAndConditions,
                          } : undefined
                        }
                        shareOnWhatsApp(jobCardWithCompanyInfo)
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90 rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  )
}

