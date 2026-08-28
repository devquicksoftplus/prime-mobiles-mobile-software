"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Wallet, CreditCard, Building2 } from "lucide-react"
import { Expense, ExpenseCategory, ExpenseSource, PaymentMethod } from "@/lib/types"
import {
  EXPENSE_CATEGORIES,
  EXPENSE_SOURCES,
  getCategoryOptions,
  getPaymentMethodOptions,
} from "../lib/expense-helpers"

const expenseSchema = z.object({
  amount: z.number().min(1, "Amount must be at least ₹1"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(1, "Please add a description"),
  source: z.enum(["shop_drawer", "personal_wallet", "bank_account"]),
  paymentMethod: z.enum(["cash", "upi", "card", "bank_transfer"]),
  date: z.string().min(1, "Please select a date"),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense?: Expense | null
  onSubmit: (data: Omit<Expense, "id" | "createdAt" | "createdBy">) => Promise<void>
}

const sourceIcons = {
  shop_drawer: Wallet,
  personal_wallet: CreditCard,
  bank_account: Building2,
}

export function ExpenseFormDialog({
  open,
  onOpenChange,
  expense,
  onSubmit,
}: ExpenseFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!expense

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      category: "",
      description: "",
      source: "shop_drawer",
      paymentMethod: "cash",
      date: new Date().toISOString().split("T")[0],
    },
  })

  // Reset form values when expense changes or dialog opens
  useEffect(() => {
    if (open) {
      if (expense) {
        form.reset({
          amount: expense.amount || 0,
          category: expense.category || "",
          description: expense.description || "",
          source: expense.source || "shop_drawer",
          paymentMethod: expense.paymentMethod || "cash",
          date: expense.date || new Date().toISOString().split("T")[0],
        })
      } else {
        form.reset({
          amount: 0,
          category: "",
          description: "",
          source: "shop_drawer",
          paymentMethod: "cash",
          date: new Date().toISOString().split("T")[0],
        })
      }
    }
  }, [open, expense, form])

  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit({
        amount: data.amount,
        category: data.category as ExpenseCategory,
        description: data.description,
        source: data.source as ExpenseSource,
        paymentMethod: data.paymentMethod as PaymentMethod,
        date: data.date,
      })
      toast.success(isEditing ? "Expense updated!" : "Expense added!")
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving expense:", error)
      toast.error("Failed to save expense")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Expense" : "Add Expense"}</DialogTitle>
          <DialogDescription>
            Record your shop expense with details about where the money came from.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="text-2xl font-bold h-14"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Source of Money - Key Feature */}
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Where did the money come from?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid gap-3"
                    >
                      {Object.entries(EXPENSE_SOURCES).map(([key, { label, description, color }]) => {
                        const Icon = sourceIcons[key as ExpenseSource]
                        return (
                          <Label
                            key={key}
                            htmlFor={key}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 ${
                              field.value === key 
                                ? "border-primary bg-primary/5" 
                                : "border-border"
                            }`}
                          >
                            <RadioGroupItem value={key} id={key} className="sr-only" />
                            <div className={`p-2 rounded-lg ${color.split(" ")[0]}`}>
                              <Icon className={`h-5 w-5 ${color.split(" ")[1]}`} />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{label}</div>
                              <div className="text-sm text-muted-foreground">{description}</div>
                            </div>
                            {field.value === key && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </Label>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getCategoryOptions().map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <span className="flex items-center gap-2">
                              <span>{EXPENSE_CATEGORIES[cat.value].icon}</span>
                              <span>{cat.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getPaymentMethodOptions().map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What was this expense for?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
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
                {isEditing ? "Update" : "Add Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
