import { z } from "zod"

// Inventory/Product item schema
export const inventoryItemSchema = z.object({
  id: z.string().optional(),
  partName: z.string().min(1, "Part name is required").max(100),
  category: z.string().min(1, "Category is required").max(50),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
  buyingPrice: z.number().min(0, "Buying price cannot be negative"),
  sellingPrice: z.number().min(0, "Selling price cannot be negative"),
  gst: z.number().min(0).max(100, "GST must be between 0-100%").default(18),
  supplierName: z.string().max(100).optional(),
  supplierPhone: z.string().max(15).optional(),
  warranty: z.string().max(50).optional(),
  createdAt: z.union([z.date(), z.string()]).optional(),
})

// Form input schema
export const inventoryFormSchema = inventoryItemSchema.omit({
  id: true,
  createdAt: true,
})

// Types derived from schemas
export type InventoryItem = z.infer<typeof inventoryItemSchema>
export type InventoryFormData = z.infer<typeof inventoryFormSchema>

// Stock status helper
export const stockStatusSchema = z.enum(["low", "running-low", "in-stock"])
export type StockStatus = z.infer<typeof stockStatusSchema>
