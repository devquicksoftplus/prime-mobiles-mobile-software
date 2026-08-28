"use client"

import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Clock, Truck, CheckCircle, ChevronDown } from "lucide-react"
import type { JobCardStatus } from "@/lib/validations"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: JobCardStatus
  className?: string
  onStatusChange?: (newStatus: JobCardStatus) => void
  showActions?: boolean
}

const statusConfig: Record<JobCardStatus, { label: string; className: string; hoverClassName: string; icon: typeof Clock }> = {
  pending: {
    label: "PENDING",
    className: "bg-amber-100 text-amber-800",
    hoverClassName: "hover:bg-amber-200",
    icon: Clock,
  },
  "ready-for-delivery": {
    label: "READY",
    className: "bg-blue-100 text-blue-800",
    hoverClassName: "hover:bg-blue-200",
    icon: Truck,
  },
  delivered: {
    label: "DELIVERED",
    className: "bg-green-100 text-green-800",
    hoverClassName: "hover:bg-green-200",
    icon: CheckCircle,
  },
}

// For backwards compatibility with old data
const legacyStatusMap: Record<string, JobCardStatus> = {
  "in-progress": "pending",
  "completed": "delivered",
  "paid": "delivered",
}

export function StatusBadge({ status, className, onStatusChange, showActions = true }: StatusBadgeProps) {
  // Map legacy statuses to new ones
  const normalizedStatus = legacyStatusMap[status] || status
  const config = statusConfig[normalizedStatus as JobCardStatus] || statusConfig.pending
  const IconComponent = config.icon

  const handleStatusChange = (newStatus: JobCardStatus) => {
    if (onStatusChange) {
      onStatusChange(newStatus)
    }
  }

  // If no status change allowed, show simple badge
  if (!showActions || !onStatusChange) {
    return (
      <Badge className={cn("font-medium rounded-full", config.className, className)}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  // Clickable badge with dropdown for status change
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge 
          className={cn(
            "font-medium rounded-full cursor-pointer flex items-center gap-1 pr-1.5 transition-colors",
            config.className,
            config.hoverClassName,
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <IconComponent className="w-3 h-3" />
          {config.label}
          <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            handleStatusChange("pending")
          }}
          className={normalizedStatus === "pending" ? "bg-amber-50" : ""}
        >
          <Clock className="w-4 h-4 mr-2 text-amber-600" />
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            handleStatusChange("ready-for-delivery")
          }}
          className={normalizedStatus === "ready-for-delivery" ? "bg-blue-50" : ""}
        >
          <Truck className="w-4 h-4 mr-2 text-blue-600" />
          Ready for Delivery
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            handleStatusChange("delivered")
          }}
          className={normalizedStatus === "delivered" ? "bg-green-50" : ""}
        >
          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
          Delivered
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
