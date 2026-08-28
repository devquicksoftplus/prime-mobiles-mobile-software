"use client"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// Table row skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border/30">
      <td className="py-3 px-4">
        <Skeleton className="h-5 w-5 rounded" />
      </td>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <Skeleton className={cn("h-4", i === 0 ? "w-24" : i === columns - 1 ? "w-16" : "w-32")} />
        </td>
      ))}
      <td className="py-3 px-4">
        <Skeleton className="h-8 w-8 rounded-lg" />
      </td>
    </tr>
  )
}

// Data table loading skeleton
export function DataTableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <th className="py-3 px-4 text-left">
                  <Skeleton className="h-5 w-5 rounded" />
                </th>
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={i} className="py-3 px-4 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
                <th className="py-3 px-4 text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, i) => (
                <TableRowSkeleton key={i} columns={columns} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border/30 flex items-center justify-end gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16 rounded-lg" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Stats card skeleton
export function StatsCardSkeleton() {
  return (
    <Card className="rounded-2xl border-border/50 shadow-sm bg-card/80 backdrop-blur-sm animate-pulse">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  )
}

// Dashboard stats skeleton
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-50 duration-300">
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
    </div>
  )
}

// Customer list skeleton
export function CustomerListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-6 animate-in fade-in-50 duration-300">
      {/* Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
      {/* Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
      {/* Button */}
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  )
}

// Inline loading spinner
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  }

  return (
    <div
      className={cn(
        "border-primary border-t-transparent rounded-full animate-spin",
        sizeClasses[size]
      )}
    />
  )
}

// Full page loading
export function PageLoading() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground mt-4 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
