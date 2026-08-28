"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Clock, Wrench, User, InfoIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { firebaseService, COLLECTIONS } from "@/lib/firebase-service"
import { cn } from "@/lib/utils"

interface JobCardHistory {
  id: string
  customerName?: string
  phone?: string
  deviceInfo?: {
    type: string
    brand: string
    model: string
  }
  problemDescription?: string
  status?: string
  createdAt?: Date
  deliveryDate?: string
}

interface CustomerHistoryCardProps {
  customerPhone: string | null
  excludeJobId?: string | null
  className?: string
}

export function CustomerHistoryCard({ customerPhone, excludeJobId, className }: CustomerHistoryCardProps) {
  const [history, setHistory] = React.useState<JobCardHistory[]>([])
  const [loading, setLoading] = React.useState(false)
  const { user } = useAuth()

  React.useEffect(() => {
    // Reset history immediately when phone changes
    setHistory([])
    
    async function fetchCustomerHistory() {
      // Don't fetch if no user or no phone
      if (!user?.uid || !customerPhone) {
        console.log('[CustomerHistory] No user or phone, clearing history')
        return
      }

      // Validate phone is not empty string
      const normalizedPhone = customerPhone.trim()
      if (!normalizedPhone) {
        console.log('[CustomerHistory] Empty phone, clearing history')
        return
      }

      setLoading(true)
      console.log('[CustomerHistory] Fetching history for phone:', normalizedPhone)
      
      try {
        // Fetch all job cards and filter by phone
        const allJobCards = await firebaseService.getAll<JobCardHistory>(
          user.uid,
          COLLECTIONS.JOB_CARDS
        )
        
        // Filter by customer phone (normalized), exclude current job if editing
        const customerHistory = allJobCards
          .filter((jc) => {
            const jobPhone = jc.phone?.trim()
            return jobPhone === normalizedPhone && jc.id !== excludeJobId
          })
          .slice(0, 10) // Show max 10 recent entries
        
        console.log('[CustomerHistory] Found', customerHistory.length, 'previous visits for', normalizedPhone)
        setHistory(customerHistory)
      } catch (error) {
        console.error("Error fetching customer history:", error)
        setHistory([]) // Clear on error
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerHistory()
  }, [user?.uid, customerPhone, excludeJobId])

  // Don't render if no customer selected
  if (!customerPhone) {
    return null
  }

  // Don't render while loading
  if (loading) {
    return null
  }

  // Don't render if no previous visits (new customer)
  if (history.length === 0) {
    return null
  }

  // Format date for display
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A"
    const d = typeof date === "string" ? new Date(date) : date
    return d.toLocaleDateString("en-IN", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    })
  }

  // Get status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200"
      case "ready-for-delivery":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "pending":
      default:
        return "bg-amber-100 text-amber-700 border-amber-200"
    }
  }

  // Get status label
  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "delivered":
        return "Delivered"
      case "ready-for-delivery":
        return "Ready"
      case "pending":
      default:
        return "Pending"
    }
  }

  return (
    <Card className={cn("h-fit", className)}>
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Customer History
          </CardTitle>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <InfoIcon className="h-3 w-3" />
            Showing history for phone: {customerPhone}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground font-medium">
          {history.length} previous visit{history.length > 1 ? "s" : ""} found
        </p>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-2"
            >
              {/* Device Info */}
              <div className="flex items-center gap-2">
                <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {item.deviceInfo?.brand || "Unknown"} {item.deviceInfo?.model || "Device"}
                </span>
                <Badge 
                  variant="outline" 
                  className={cn("text-[10px] px-1.5 py-0", getStatusColor(item.status))}
                >
                  {getStatusLabel(item.status)}
                </Badge>
              </div>
              
              {/* Problem - truncated */}
              {item.problemDescription && (
                <div className="flex items-start gap-2">
                  <Wrench className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.problemDescription}
                  </p>
                </div>
              )}
              
              {/* Date */}
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

