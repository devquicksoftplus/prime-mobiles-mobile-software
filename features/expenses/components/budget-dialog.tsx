"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Wallet, CreditCard, Building2, Calculator } from "lucide-react"
import { MonthlyBudget } from "@/lib/types"
import { formatCurrency } from "../lib/expense-helpers"

interface BudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget: MonthlyBudget | null
  selectedMonth: string
  onSave: (data: {
    shopDrawerBudget: number
    personalBudget: number
    bankBudget: number
  }) => Promise<void>
}

export function BudgetDialog({
  open,
  onOpenChange,
  budget,
  selectedMonth,
  onSave,
}: BudgetDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shopDrawer, setShopDrawer] = useState(0)
  const [personal, setPersonal] = useState(0)
  const [bank, setBank] = useState(0)

  // Get month name for display
  const getMonthName = (monthStr: string) => {
    const date = new Date(monthStr + "-01")
    return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
  }

  // Reset form when budget changes or dialog opens
  useEffect(() => {
    if (open) {
      setShopDrawer(budget?.shopDrawerBudget || 0)
      setPersonal(budget?.personalBudget || 0)
      setBank(budget?.bankBudget || 0)
    }
  }, [open, budget])

  const total = shopDrawer + personal + bank

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await onSave({
        shopDrawerBudget: shopDrawer,
        personalBudget: personal,
        bankBudget: bank,
      })
      toast.success("Budget saved successfully!")
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving budget:", error)
      toast.error("Failed to save budget")
    } finally {
      setIsSubmitting(false)
    }
  }

  const budgetItems = [
    {
      label: "Shop Drawer",
      description: "Cash available in daily sales drawer",
      icon: Wallet,
      value: shopDrawer,
      onChange: setShopDrawer,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-200",
    },
    {
      label: "Personal Wallet",
      description: "Your personal funds for shop expenses",
      icon: CreditCard,
      value: personal,
      onChange: setPersonal,
      color: "text-violet-600",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-200",
    },
    {
      label: "Bank Account",
      description: "Available balance in business account",
      icon: Building2,
      value: bank,
      onChange: setBank,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-200",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Set Monthly Budget
          </DialogTitle>
          <DialogDescription>
            Enter the available funds for {getMonthName(selectedMonth)}. Your expenses will be tracked against these amounts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {budgetItems.map((item) => (
            <div
              key={item.label}
              className={`p-4 rounded-xl border-2 ${item.borderColor} ${item.bgColor} transition-all`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <Label className={`font-semibold ${item.color}`}>{item.label}</Label>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">₹</span>
                <Input
                  type="number"
                  value={item.value || ""}
                  onChange={(e) => item.onChange(parseFloat(e.target.value) || 0)}
                  className="pl-8 text-xl font-bold h-12 bg-white"
                  placeholder="0"
                />
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Available</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(total)}</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Budget
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
