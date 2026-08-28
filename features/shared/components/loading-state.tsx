"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  rows?: number
  columns?: number
  className?: string
}

export function LoadingState({
  rows = 5,
  columns = 5,
  className,
}: LoadingStateProps) {
  return (
    <div className={cn("bg-card rounded-2xl border border-border p-4", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="space-y-3">
        {/* Header row */}
        <div className="flex gap-4 pb-3 border-b border-border/30">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {/* Data rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 py-3">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className="h-4 flex-1"
                style={{ opacity: 1 - rowIndex * 0.1 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
