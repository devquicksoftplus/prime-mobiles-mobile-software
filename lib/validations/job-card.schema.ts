import { z } from "zod"

// Job card status enum
export const jobCardStatusEnum = z.enum([
  "pending",
  "ready-for-delivery",
  "delivered",
])

// Cost estimate schema
export const costEstimateSchema = z.object({
  laborCost: z.number().min(0, "Labor cost cannot be negative"),
  partsCost: z.number().min(0, "Parts cost cannot be negative"),
  serviceCost: z.number().min(0, "Service cost cannot be negative"),
  total: z.number().min(0, "Total cannot be negative"),
})

// Device info schema (embedded in job card)
export const deviceInfoSchema = z.object({
  type: z.string(),
  brand: z.string(),
  model: z.string(),
})

// Job card schema
export const jobCardSchema = z.object({
  id: z.string().optional(),
  customerId: z.string().min(1, "Customer ID is required"),
  deviceId: z.string().min(1, "Device ID is required"),
  customerName: z.string().optional(),
  deviceInfo: deviceInfoSchema.optional(),
  problemDescription: z
    .string()
    .min(10, "Problem description must be at least 10 characters")
    .max(1000, "Problem description is too long"),
  technicianDiagnosis: z.string().max(1000).optional(),
  requiredParts: z.array(z.string()).optional(),
  costEstimate: costEstimateSchema,
  advanceReceived: z.number().min(0, "Advance cannot be negative"),
  deliveryDate: z.union([z.date(), z.string()]),
  status: jobCardStatusEnum,
  createdAt: z.union([z.date(), z.string()]).optional(),
  updatedAt: z.union([z.date(), z.string()]).optional(),
})

// Form input schema (for creating job cards)
export const jobCardFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  alternatePhone: z.string().optional(),
  address: z.string().optional(),
  deviceType: z.string().min(1, "Device type is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  imei: z.string().optional(),
  condition: z.string().optional(),
  accessories: z.string().optional(),
  problemDescription: z.string().min(10, "Problem description must be at least 10 characters"),
  technicianDiagnosis: z.string().optional(),
  requiredParts: z.string().optional(),
  laborCost: z.string().optional(),
  partsCost: z.string().optional(),
  serviceCost: z.string().optional(),
  advanceReceived: z.string().optional(),
  deliveryDate: z.string().min(1, "Delivery date is required"),
})

// Types derived from schemas
export type JobCardStatus = z.infer<typeof jobCardStatusEnum>
export type CostEstimate = z.infer<typeof costEstimateSchema>
export type DeviceInfo = z.infer<typeof deviceInfoSchema>
export type JobCard = z.infer<typeof jobCardSchema>
export type JobCardFormData = z.infer<typeof jobCardFormSchema>
