"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStatsSkeleton } from "@/components/loading-skeletons"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useFirestore } from "@/hooks/use-firestore"

interface Stats {
  totalCustomers: number
  pendingRepairs: number
  totalInvoices: number
}

export function DashboardStats() {
  const { isAuthenticated, getCustomers, getJobCards, getInvoices } = useFirestore()
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    pendingRepairs: 0,
    totalInvoices: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        const [customers, jobCards, invoices] = await Promise.all([
          getCustomers(),
          getJobCards(),
          getInvoices(),
        ])

        const pendingRepairs = jobCards.filter(
          (jc: any) => jc.status === "pending" || jc.status === "in-progress",
        ).length

        setStats({
          totalCustomers: customers.length,
          pendingRepairs,
          totalInvoices: invoices.length,
        })
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load stats")
        toast.error("Failed to load dashboard stats")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated, getCustomers, getJobCards, getInvoices])

  if (loading) {
    return <DashboardStatsSkeleton />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
      {error && (
        <Card className="col-span-full border-destructive/30 bg-destructive/5 rounded-2xl">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">
              <strong>Error:</strong> {error}
            </p>
            <p className="text-destructive/80 text-xs mt-2">
              Please check your Firebase configuration and try again.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border-border/50 shadow-sm bg-card/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{stats.totalCustomers}</div>
          <p className="text-xs text-muted-foreground mt-2">Active customers</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/50 shadow-sm bg-card/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Repairs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{stats.pendingRepairs}</div>
          <p className="text-xs text-muted-foreground mt-2">In progress</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/50 shadow-sm bg-card/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{stats.totalInvoices}</div>
          <p className="text-xs text-muted-foreground mt-2">All invoices</p>
        </CardContent>
      </Card>
    </div>
  )
}
