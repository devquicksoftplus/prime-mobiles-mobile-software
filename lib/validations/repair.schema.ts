import { z } from "zod"

// Repair device type enum
export const repairDeviceTypeEnum = z.enum(["mobile", "laptop", "tablet", "other"])

// Repair status enum
export const repairStatusEnum = z.enum(["pending", "in-progress", "completed", "paid"])

// Repair ticket schema
export const repairTicketSchema = z.object({
  id: z.string().optional(),
  customerName: z.string().min(1, "Customer name is required").max(100),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15),
  alternatePhone: z.string().max(15).optional(),
  deviceType: repairDeviceTypeEnum,
  brand: z.string().min(1, "Brand is required").max(50),
  model: z.string().min(1, "Model is required").max(100),
  serialNumber: z.string().max(50).optional(),
  conditionNotes: z.string().max(500).optional(),
  repairReason: z.string().min(1, "Repair reason is required").max(200),
  problemDescription: z
    .string()
    .min(10, "Problem description must be at least 10 characters")
    .max(1000),
  estimatedCost: z.number().min(0, "Estimated cost cannot be negative"),
  status: repairStatusEnum,
  createdAt: z.union([z.date(), z.string()]).optional(),
})

// Form input schema
export const repairFormSchema = repairTicketSchema.omit({
  id: true,
  status: true,
  createdAt: true,
})

// Types derived from schemas
export type RepairDeviceType = z.infer<typeof repairDeviceTypeEnum>
export type RepairStatus = z.infer<typeof repairStatusEnum>
export type RepairTicket = z.infer<typeof repairTicketSchema>
export type RepairFormData = z.infer<typeof repairFormSchema>
