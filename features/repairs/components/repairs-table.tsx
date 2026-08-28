"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableSkeleton } from "@/components/loading-skeletons"
import { useRepairs } from "../hooks/use-repairs"
import { Eye, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RepairStatus } from "@/lib/validations"

const statusConfig: Record<RepairStatus, { label: string; className: string }> = {
  pending: {
    label: "PENDING",
    className: "bg-amber-100 text-amber-800",
  },
  "in-progress": {
    label: "IN PROGRESS",
    className: "bg-blue-100 text-blue-800",
  },
  completed: {
    label: "COMPLETED",
    className: "bg-green-100 text-green-800",
  },
  paid: {
    label: "PAID",
    className: "bg-primary/10 text-primary",
  },
}

export function RepairsTable() {
  const { repairs, isLoading, error, deleteRepair } = useRepairs()

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this repair ticket?")) {
      await deleteRepair(id)
    }
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-destructive text-sm">{error}</p>
        <p className="text-muted-foreground text-xs mt-2">
          Please check your Firebase configuration and try again.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return <DataTableSkeleton columns={7} rows={5} />
  }

  if (repairs.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <p className="text-muted-foreground">No repair tickets found.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new repair ticket to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/30">
              <TableHead className="text-muted-foreground font-medium">
                Customer
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Phone
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Device
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Reason
              </TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">
                Est. Cost
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Status
              </TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repairs.map((repair) => {
              const status = statusConfig[repair.status] || statusConfig.pending
              return (
                <TableRow
                  key={repair.id}
                  className="border-b border-border/30 hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">{repair.customerName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {repair.phoneNumber}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{repair.deviceType}</span>
                    <span className="text-muted-foreground ml-1">
                      ({repair.brand} {repair.model})
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {repair.repairReason}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ₹{repair.estimatedCost.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("rounded-full font-medium", status.className)}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(repair.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
