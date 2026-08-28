"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { InventoryItem } from "@/lib/validations"

interface StockStatusBadgeProps {
  item: InventoryItem
  className?: string
}

export type StockStatus = "low" | "medium" | "high"

export const getStockStatus = (quantity: number): StockStatus => {
  if (quantity < 10) {
    return "low"
  }
  if (quantity < 20) {
    return "medium"
  }
  return "high"
}

const statusConfig: Record<StockStatus, { label: string; className: string }> = {
  low: {
    label: "Low Stock",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
  medium: {
    label: "Medium Stock",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  },
  high: {
    label: "In Stock",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
}

export function StockStatusBadge({ item, className }: StockStatusBadgeProps) {
  const status = getStockStatus(item.quantity)
  const config = statusConfig[status]

  return (
    <Badge className={cn("rounded-full font-medium", config.className, className)}>
      {config.label}
    </Badge>
  )
}
