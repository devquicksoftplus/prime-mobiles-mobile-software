import { z } from "zod"

// Tax type enum
export const taxTypeEnum = z.enum(["none", "gst", "vat"])

// Payment status enum
export const paymentStatusEnum = z.enum(["pending", "partial", "paid"])

// Invoice item schema
export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate cannot be negative"),
  amount: z.number().min(0, "Amount cannot be negative"),
})

// Invoice schema
export const invoiceSchema = z.object({
  id: z.string().optional(),
  jobCardId: z.string().min(1, "Job card ID is required"),
  customerId: z.string().min(1, "Customer ID is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  subtotal: z.number().min(0),
  taxType: taxTypeEnum,
  taxPercent: z.number().min(0).max(100),
  taxAmount: z.number().min(0),
  totalAmount: z.number().min(0),
  amountPaid: z.number().min(0),
  balanceDue: z.number().min(0),
  paymentStatus: paymentStatusEnum,
  invoiceDate: z.union([z.date(), z.string()]),
  dueDate: z.union([z.date(), z.string()]),
})

// Form input schema
export const invoiceFormSchema = invoiceSchema.omit({
  id: true,
  invoiceNumber: true,
})

// Types derived from schemas
export type TaxType = z.infer<typeof taxTypeEnum>
export type PaymentStatus = z.infer<typeof paymentStatusEnum>
export type InvoiceItem = z.infer<typeof invoiceItemSchema>
export type Invoice = z.infer<typeof invoiceSchema>
export type InvoiceFormData = z.infer<typeof invoiceFormSchema>
