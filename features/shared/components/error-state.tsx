"use client"

import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  message: string
  className?: string
}

export function ErrorState({
  title = "Error",
  message,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-destructive/30 bg-destructive/5 p-6",
        className
      )}
    >
      <p className="text-destructive text-sm font-medium">{title}</p>
      <p className="text-muted-foreground text-sm mt-1">{message}</p>
    </div>
  )
}
