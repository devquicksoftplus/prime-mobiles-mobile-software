import { ExpenseCategory, ExpenseSource, PaymentMethod } from "@/lib/types"

// Category configuration with colors and icons
export const EXPENSE_CATEGORIES: Record<ExpenseCategory, { label: string; color: string; icon: string }> = {
  "Rent": { label: "Rent", color: "bg-red-500/10 text-red-600 border-red-200", icon: "🏠" },
  "Salary": { label: "Salary", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: "👥" },
  "Inventory": { label: "Inventory", color: "bg-green-500/10 text-green-600 border-green-200", icon: "📦" },
  "Electricity": { label: "Electricity", color: "bg-yellow-500/10 text-yellow-600 border-yellow-200", icon: "⚡" },
  "Tea/Snacks": { label: "Tea/Snacks", color: "bg-orange-500/10 text-orange-600 border-orange-200", icon: "☕" },
  "Maintenance": { label: "Maintenance", color: "bg-purple-500/10 text-purple-600 border-purple-200", icon: "🔧" },
  "Equipment": { label: "Equipment", color: "bg-indigo-500/10 text-indigo-600 border-indigo-200", icon: "🖥️" },
  "Marketing": { label: "Marketing", color: "bg-pink-500/10 text-pink-600 border-pink-200", icon: "📢" },
  "Transport": { label: "Transport", color: "bg-cyan-500/10 text-cyan-600 border-cyan-200", icon: "🚗" },
  "Other": { label: "Other", color: "bg-gray-500/10 text-gray-600 border-gray-200", icon: "📝" },
}

export const EXPENSE_SOURCES: Record<ExpenseSource, { label: string; description: string; color: string }> = {
  "shop_drawer": { 
    label: "Shop Drawer", 
    description: "Money from daily sales cash box",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200"
  },
  "personal_wallet": { 
    label: "Personal Wallet", 
    description: "Your own money (personal investment)",
    color: "bg-violet-500/10 text-violet-600 border-violet-200"
  },
  "bank_account": { 
    label: "Bank Account", 
    description: "Direct bank transfer or UPI",
    color: "bg-blue-500/10 text-blue-600 border-blue-200"
  },
}

export const PAYMENT_METHODS: Record<PaymentMethod, { label: string; icon: string }> = {
  "cash": { label: "Cash", icon: "💵" },
  "upi": { label: "UPI", icon: "📱" },
  "card": { label: "Card", icon: "💳" },
  "bank_transfer": { label: "Bank Transfer", icon: "🏦" },
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Get all category options for select
export function getCategoryOptions(): { value: ExpenseCategory; label: string }[] {
  return Object.entries(EXPENSE_CATEGORIES).map(([key, { label }]) => ({
    value: key as ExpenseCategory,
    label,
  }))
}

// Get all source options for select
export function getSourceOptions(): { value: ExpenseSource; label: string; description: string }[] {
  return Object.entries(EXPENSE_SOURCES).map(([key, { label, description }]) => ({
    value: key as ExpenseSource,
    label,
    description,
  }))
}

// Get all payment method options
export function getPaymentMethodOptions(): { value: PaymentMethod; label: string }[] {
  return Object.entries(PAYMENT_METHODS).map(([key, { label }]) => ({
    value: key as PaymentMethod,
    label,
  }))
}
