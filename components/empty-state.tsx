"use client"

import { cn } from "@/lib/utils"
import { 
  FileText, 
  Package, 
  Users, 
  Wrench, 
  Search, 
  Inbox,
  type LucideIcon 
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  variant?: "default" | "search" | "error"
}

const defaultIcons = {
  default: Inbox,
  search: Search,
  error: Inbox,
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  const Icon = icon || defaultIcons[variant]

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center animate-in fade-in-50 duration-500",
        className
      )}
    >
      {/* Illustration container */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-10 h-10 text-primary/60" />
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-200/50 animate-pulse" />
        <div className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full bg-teal-200/50 animate-pulse delay-150" />
      </div>

      {/* Text content */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>

      {/* Action button */}
      {action && (
        <Button onClick={action.onClick} className="animate-in slide-in-from-bottom-2 duration-300">
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Pre-configured empty states for common scenarios
export function EmptyJobCards({ onCreateClick }: { onCreateClick?: () => void }) {
  return (
    <EmptyState
      icon={Wrench}
      title="No job cards yet"
      description="Create your first job card to start tracking device repairs and managing your workflow."
      action={onCreateClick ? { label: "Create Job Card", onClick: onCreateClick } : undefined}
    />
  )
}

export function EmptyCustomers({ onCreateClick }: { onCreateClick?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="No customers found"
      description="Add your first customer to start managing their repairs and billing information."
      action={onCreateClick ? { label: "Add Customer", onClick: onCreateClick } : undefined}
    />
  )
}

export function EmptyInvoices({ onCreateClick }: { onCreateClick?: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      title="No invoices yet"
      description="Complete a repair job to generate your first invoice and start tracking payments."
      action={onCreateClick ? { label: "Create Job Card", onClick: onCreateClick } : undefined}
    />
  )
}

export function EmptyInventory({ onCreateClick }: { onCreateClick?: () => void }) {
  return (
    <EmptyState
      icon={Package}
      title="No products yet"
      description="Add spare parts and equipment to track your products and manage stock levels."
      action={onCreateClick ? { label: "Add Product", onClick: onCreateClick } : undefined}
    />
  )
}

export function EmptySearchResults({ query }: { query?: string }) {
  return (
    <EmptyState
      variant="search"
      title="No results found"
      description={
        query
          ? `We couldn't find anything matching "${query}". Try a different search term.`
          : "Try adjusting your search or filters to find what you're looking for."
      }
    />
  )
}
