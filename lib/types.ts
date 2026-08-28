// Frontend types (Firebase-compatible with string IDs)
export interface Customer {
  id?: string
  name: string
  phone: string
  alternatePhone?: string
  address?: string
  email?: string
  createdAt: string
}

export interface Device {
  id?: string
  customerId: string
  deviceType: string
  brand: string
  model: string
  imei?: string
  condition?: string
  accessories?: string
  createdAt: string
}

export interface JobCard {
  id?: string
  customerId: string
  deviceId: string
  customerName?: string
  deviceInfo?: {
    type: string
    brand: string
    model: string
  }
  problemDescription: string
  technicianDiagnosis?: string
  requiredParts?: string[]
  costEstimate: {
    laborCost: number
    partsCost: number
    serviceCost: number
    total: number
  }
  advanceReceived: number
  deliveryDate: string
  status: "pending" | "in-progress" | "completed" | "paid"
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id?: string
  jobCardId: string
  customerId: string
  invoiceNumber: string
  items: {
    description: string
    quantity: number
    rate: number
    amount: number
  }[]
  subtotal: number
  taxType: "none" | "gst" | "vat"
  taxPercent: number
  taxAmount: number
  totalAmount: number
  amountPaid: number
  balanceDue: number
  paymentStatus: "pending" | "partial" | "paid"
  invoiceDate: string
  dueDate: string
}

export interface RepairTicket {
  id?: string
  customerName: string
  phoneNumber: string
  alternatePhone?: string
  deviceType: "mobile" | "laptop" | "tablet" | "other"
  brand: string
  model: string
  serialNumber?: string
  conditionNotes?: string
  repairReason: string
  problemDescription: string
  estimatedCost: number
  status: "pending" | "in-progress" | "completed" | "paid"
  createdAt?: string
}

// Expense Tracker Types
export type ExpenseCategory = 
  | "Rent" 
  | "Salary" 
  | "Inventory" 
  | "Electricity" 
  | "Tea/Snacks" 
  | "Maintenance" 
  | "Equipment" 
  | "Marketing" 
  | "Transport"
  | "Other"

export type ExpenseSource = "shop_drawer" | "personal_wallet" | "bank_account"
export type PaymentMethod = "cash" | "upi" | "card" | "bank_transfer"

export interface Expense {
  id?: string
  amount: number
  category: ExpenseCategory
  description: string
  source: ExpenseSource
  paymentMethod: PaymentMethod
  date: string
  attachments?: string[]
  createdBy: string
  createdAt: string
  updatedAt?: string
}

// Monthly Budget Interface
export interface MonthlyBudget {
  id?: string
  month: string // Format: "YYYY-MM"
  shopDrawerBudget: number
  personalBudget: number
  bankBudget: number
  totalBudget: number
  createdBy: string
  createdAt: string
  updatedAt?: string
}

// User Subscription Interface
export interface UserSubscription {
  planId: "basic" | "pro" | "elite" | null
  status: "active" | "expired" | "cancelled" | "trial"
  startDate: string
  endDate: string
  paymentId?: string
}