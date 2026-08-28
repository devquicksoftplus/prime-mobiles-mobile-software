"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Pencil, Trash2, Wallet, CreditCard, Building2 } from "lucide-react"
import { Expense } from "@/lib/types"
import { 
  EXPENSE_CATEGORIES, 
  EXPENSE_SOURCES, 
  PAYMENT_METHODS,
  formatCurrency 
} from "../lib/expense-helpers"

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => Promise<void>
  isLoading?: boolean
}

const sourceIcons = {
  shop_drawer: Wallet,
  personal_wallet: CreditCard,
  bank_account: Building2,
}

export function ExpenseList({ expenses, onEdit, onDelete, isLoading }: ExpenseListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      setIsDeleting(true)
      await onDelete(deleteId)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-pulse text-muted-foreground">Loading expenses...</div>
      </div>
    )
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center">
        <div className="text-4xl mb-2">📝</div>
        <h3 className="text-lg font-medium">No expenses yet</h3>
        <p className="text-sm text-muted-foreground">
          Add your first expense to start tracking
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => {
              const categoryConfig = EXPENSE_CATEGORIES[expense.category]
              const sourceConfig = EXPENSE_SOURCES[expense.source]
              const SourceIcon = sourceIcons[expense.source]

              return (
                <TableRow key={expense.id} className="group">
                  <TableCell className="font-medium">
                    {formatDate(expense.date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={categoryConfig?.color}>
                      <span className="mr-1">{categoryConfig?.icon}</span>
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {expense.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <SourceIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{sourceConfig?.label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-red-600">
                    -{formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(expense)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(expense.id!)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
