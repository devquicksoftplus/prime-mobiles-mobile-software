"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useFirestore } from "@/hooks/use-firestore"
import { 
  Plus, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Wrench,
  Package,
  IndianRupee,
  Activity,
  Sparkles,
  Phone,
  Zap
} from "lucide-react"

interface JobCard {
  id: string
  customerName?: string
  phone?: string
  status: string
  createdAt: string
  costEstimate?: { total?: number }
  advanceReceived?: number
  deviceInfo?: { type?: string; brand?: string; model?: string }
  problemDescription?: string
}

export function BasicDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const { getActiveJobCards, updateJobCard } = useFirestore()
  const [jobs, setJobs] = useState<JobCard[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getActiveJobCards()
        setJobs(data as JobCard[])
      } catch (error) {
        console.error("[BasicDashboard] Failed to fetch active jobs:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [getActiveJobCards])

  const stats = useMemo(() => {
    const pendingJobs = jobs.filter(j => j.status === 'pending')
    const readyJobs = jobs.filter(j => j.status === 'ready-for-delivery')
    
    const pipelineValue = jobs.reduce((acc, job) => acc + (Number(job.costEstimate?.total) || 0), 0)
    
    const pendingAmount = jobs.reduce((acc, job) => {
      const total = Number(job.costEstimate?.total) || 0
      const advance = Number(job.advanceReceived) || 0
      return acc + Math.max(0, total - advance)
    }, 0)

    return {
      totalActive: jobs.length,
      pendingCount: pendingJobs.length,
      readyCount: readyJobs.length,
      pipelineValue,
      pendingAmount
    }
  }, [jobs])

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  const handleMarkReady = async (jobId: string) => {
    try {
      await updateJobCard(jobId, { status: 'ready-for-delivery' })
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'ready-for-delivery' } : j))
    } catch (error) {
      console.error("Failed to update job:", error)
    }
  }

  const handleMarkDelivered = async (jobId: string) => {
    try {
      await updateJobCard(jobId, { status: 'delivered' })
      setJobs(prev => prev.filter(j => j.id !== jobId))
    } catch (error) {
      console.error("Failed to update job:", error)
    }
  }

  const pendingJobs = jobs.filter(j => j.status === 'pending')
  const readyJobs = jobs.filter(j => j.status === 'ready-for-delivery')

  return (
    <div className="min-h-screen space-y-8">
      {/* Hero Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDE0di0yaDIyek0zNiAxNHYySDR2LTJoMzJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
                </h1>
                <Badge className="bg-white/10 text-white/90 border-white/20 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Basic
                </Badge>
              </div>
              <p className="text-slate-300 text-lg">Here's your service center at a glance</p>
            </div>
            <Button 
              size="lg"
              onClick={() => router.push('/job-cards/new')}
              className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl shadow-white/10"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Job
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <IndianRupee className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Pipeline</p>
                  <p className="text-xl font-bold">{formatCurrency(stats.pipelineValue)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Active</p>
                  <p className="text-xl font-bold">{stats.totalActive} Jobs</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Pending</p>
                  <p className="text-xl font-bold">{stats.pendingCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Ready</p>
                  <p className="text-xl font-bold">{stats.readyCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card 
          className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
          onClick={() => router.push('/job-cards/new')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl text-white group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">New Service</h3>
              <p className="text-sm text-slate-500">Create job card</p>
            </div>
          </CardContent>
        </Card>
        <Card 
          className="group cursor-pointer hover:shadow-lg hover:border-slate-400 transition-all duration-300 hover:-translate-y-1"
          onClick={() => router.push('/job-cards')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl text-white group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">All Jobs</h3>
              <p className="text-sm text-slate-500">View & manage</p>
            </div>
          </CardContent>
        </Card>
        <Card 
          className="group cursor-pointer hover:shadow-lg hover:border-amber-400 transition-all duration-300 hover:-translate-y-1"
          onClick={() => router.push('/inventory')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl text-white group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Inventory</h3>
              <p className="text-sm text-slate-500">Stock & parts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Work */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/50 to-transparent rounded-full blur-2xl" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 rounded-lg text-white">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900">Pending Work</CardTitle>
                  <CardDescription className="text-amber-700">
                    {stats.pendingCount} job{stats.pendingCount !== 1 ? 's' : ''} awaiting repair
                  </CardDescription>
                </div>
              </div>
              {stats.pendingCount > 0 && (
                <Badge className="bg-amber-500 text-white">{stats.pendingCount}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 relative">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              </div>
            ) : pendingJobs.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-amber-300 mx-auto mb-3" />
                <p className="text-amber-700 font-medium">All caught up! 🎉</p>
                <p className="text-amber-600 text-sm">No pending repairs right now</p>
              </div>
            ) : (
              <>
                {pendingJobs.slice(0, 4).map(job => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-gradient-to-br from-amber-200 to-orange-200 text-amber-700 font-semibold">
                        <AvatarFallback>{job.customerName?.charAt(0) || 'C'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{job.customerName || 'Unknown'}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Smartphone className="w-3 h-3" />
                          <span>{job.deviceInfo?.brand} {job.deviceInfo?.model}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                      onClick={() => handleMarkReady(job.id)}
                    >
                      <Wrench className="w-4 h-4 mr-1" />
                      Ready
                    </Button>
                  </div>
                ))}
                {stats.pendingCount > 4 && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-amber-700 hover:bg-amber-100" 
                    onClick={() => router.push('/job-cards?status=pending')}
                  >
                    View all {stats.pendingCount} pending <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Ready for Pickup */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/50 to-transparent rounded-full blur-2xl" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-lg text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900">Ready for Pickup</CardTitle>
                  <CardDescription className="text-emerald-700">
                    {stats.readyCount} job{stats.readyCount !== 1 ? 's' : ''} ready to deliver
                  </CardDescription>
                </div>
              </div>
              {stats.readyCount > 0 && (
                <Badge className="bg-emerald-500 text-white">{stats.readyCount}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 relative">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : readyJobs.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                <p className="text-emerald-700 font-medium">Nothing to deliver</p>
                <p className="text-emerald-600 text-sm">Mark jobs as ready when done</p>
              </div>
            ) : (
              <>
                {readyJobs.slice(0, 4).map(job => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-gradient-to-br from-emerald-200 to-green-200 text-emerald-700 font-semibold">
                        <AvatarFallback>{job.customerName?.charAt(0) || 'C'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{job.customerName || 'Unknown'}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone className="w-3 h-3" />
                          <span>{job.phone || 'No phone'}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                      onClick={() => handleMarkDelivered(job.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Deliver
                    </Button>
                  </div>
                ))}
                {stats.readyCount > 4 && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-emerald-700 hover:bg-emerald-100" 
                    onClick={() => router.push('/job-cards?status=ready-for-delivery')}
                  >
                    View all {stats.readyCount} ready <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Prompt */}
      <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDE0di0yaDIyek0zNiAxNHYySDR2LTJoMzJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl" />
        <CardContent className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Unlock Advanced Analytics</h3>
              <p className="text-purple-100 mt-1">Get monthly trends, revenue charts, and export reports with Pro</p>
            </div>
          </div>
          <Button 
            size="lg"
            className="bg-white text-purple-700 hover:bg-purple-50 shadow-xl shadow-purple-900/20 whitespace-nowrap"
            onClick={() => router.push('/subscription')}
          >
            Upgrade to Pro
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
