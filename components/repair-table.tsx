"use client"

import type { RepairTicket } from "@/lib/schemas"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface RepairTableProps {
  repairs: RepairTicket[]
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  paid: "bg-gray-100 text-gray-800",
}

export function RepairTable({ repairs }: RepairTableProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Estimated Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repairs.map((repair) => (
            <TableRow key={repair.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{repair.customerName}</p>
                  <p className="text-sm text-muted-foreground">{repair.phoneNumber}</p>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-medium">
                  {repair.brand} {repair.model}
                </p>
                <p className="text-sm text-muted-foreground capitalize">{repair.deviceType}</p>
              </TableCell>
              <TableCell>
                <p className="text-sm line-clamp-2">{repair.repairReason}</p>
              </TableCell>
              <TableCell className="font-medium">${repair.estimatedCost.toFixed(2)}</TableCell>
              <TableCell>
                <Badge className={statusColors[repair.status]}>{repair.status}</Badge>
              </TableCell>
              <TableCell>
                <Link href={`/ticket/${repair.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
