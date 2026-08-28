"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"
import { DataTableSkeleton } from "@/components/loading-skeletons"
import { EmptyJobCards } from "@/components/empty-state"
import { toast } from "sonner"
import { useFirestore } from "@/hooks/use-firestore"
import type { JobCard } from "@/lib/db-schemas"

export function JobCardsTable() {
  const router = useRouter()
  const { isAuthenticated, getJobCards } = useFirestore()
  const [jobCards, setJobCards] = useState<JobCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function fetchJobCards() {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        const data = await getJobCards()
        setJobCards(data)
      } catch (error: any) {
        console.error("[Firebase] Error fetching job cards:", error)
        setError(error.message || "Error loading job cards. Please check your connection.")
        toast.error("Error connecting to database")
      } finally {
        setLoading(false)
      }
    }

    fetchJobCards()
  }, [isAuthenticated, getJobCards])

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-amber-100 text-amber-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      paid: "bg-primary/10 text-primary",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const columns = [
    {
      key: "id",
      header: "Job ID",
      render: (item: JobCard) => (
        <span className="font-mono text-xs text-muted-foreground">
          {item.id?.toString().slice(0, 8)}
        </span>
      ),
    },
    {
      key: "problemDescription",
      header: "Problem Description",
      render: (item: JobCard) => (
        <span className="max-w-[200px] truncate block">{item.problemDescription}</span>
      ),
    },
    {
      key: "costEstimate",
      header: "Cost Estimate",
      render: (item: JobCard) => (
        <span className="font-semibold">₹{(item.costEstimate?.total ?? 0).toFixed(2)}</span>
      ),
    },
    {
      key: "deliveryDate",
      header: "Delivery Date",
      render: (item: JobCard) => new Date(item.deliveryDate).toLocaleDateString(),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (item: JobCard) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: "status",
      header: "Status",
      render: (item: JobCard) => (
        <Badge className={getStatusColor(item.status)}>
          {item.status.toUpperCase()}
        </Badge>
      ),
    },
  ]

  if (loading) {
    return <DataTableSkeleton rows={5} columns={5} />
  }

  if (error) {
    return (
      <div className="bg-card rounded-2xl border border-destructive/20 p-6 animate-in fade-in-50 duration-300">
        <p className="text-destructive text-sm">{error}</p>
        <p className="text-muted-foreground text-xs mt-2">
          Please check your Firebase configuration and try again.
        </p>
      </div>
    )
  }

  if (jobCards.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border">
        <EmptyJobCards onCreateClick={() => router.push("/intake")} />
      </div>
    )
  }

  return (
    <DataTable
      title="Job Cards"
      data={jobCards}
      columns={columns}
      isLoading={loading}
      showCheckbox={true}
      showActions={true}
    />
  )
}
