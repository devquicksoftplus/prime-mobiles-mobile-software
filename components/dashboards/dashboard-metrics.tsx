"use client"

import { Card, CardContent } from "@/components/ui/card"
import { IndianRupee, Activity, TrendingUp, TrendingDown, CheckCircle2 } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  iconBgClass?: string
  trend?: number
  trendLabel?: string
  subtitle?: string
}

export function MetricCard({ 
  title, 
  value, 
  icon, 
  iconBgClass = "bg-primary/10", 
  trend, 
  trendLabel,
  subtitle 
}: MetricCardProps) {
  const isPositive = trend !== undefined && trend >= 0
  
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          </div>
          <div className={`h-10 w-10 ${iconBgClass} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className={`flex items-center font-medium px-1.5 py-0.5 rounded ${isPositive ? 'text-accent bg-accent/10' : 'text-destructive bg-destructive/10'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {isPositive ? '+' : ''}{trend}%
            </span>
            <span className="text-slate-400">{trendLabel}</span>
          </div>
        )}
        {subtitle && !trend && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-slate-500 font-medium">{subtitle}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface DashboardMetricsProps {
  totalRevenue: number
  revenueGrowth?: number
  activeJobs: number
  jobsGrowth?: number
  totalPending: number
  pendingCount: number
  completedCount?: number
  totalJobs?: number
  revenueLabel?: string
  showCompletionRate?: boolean
}

export function DashboardMetrics({
  totalRevenue,
  revenueGrowth,
  activeJobs,
  jobsGrowth,
  totalPending,
  pendingCount,
  completedCount = 0,
  totalJobs = 0,
  revenueLabel = "Total Revenue",
  showCompletionRate = true
}: DashboardMetricsProps) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  const completionRate = totalJobs > 0 ? Math.round((completedCount / totalJobs) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Revenue Card */}
      <MetricCard
        title={revenueLabel}
        value={formatCurrency(totalRevenue)}
        icon={<IndianRupee className="w-5 h-5 text-accent" />}
        iconBgClass="bg-accent/10"
        trend={revenueGrowth}
        trendLabel="vs last period"
      />

      {/* Active Jobs Card */}
      <MetricCard
        title="Active Jobs"
        value={activeJobs}
        icon={<Activity className="w-5 h-5 text-primary" />}
        iconBgClass="bg-primary/10"
        trend={jobsGrowth}
        trendLabel="vs last period"
      />

      {/* Pending Collections Card */}
      <MetricCard
        title="Total Pending"
        value={formatCurrency(totalPending)}
        icon={<IndianRupee className="w-5 h-5 text-destructive" />}
        iconBgClass="bg-destructive/10"
        subtitle={`${pendingCount} jobs awaiting payment`}
      />

      {/* Completion Rate */}
      {showCompletionRate && (
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Completion Rate</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{completionRate}%</h3>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500" 
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
