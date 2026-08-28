import { z } from "zod"

// Device type enum
export const deviceTypeEnum = z.enum([
  "mobile",
  "laptop",
  "tablet",
  "earbuds",
  "smartwatch",
  "others",
])

// Uploaded image schema
export const uploadedImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
})

// Device schema
export const deviceSchema = z.object({
  id: z.string().optional(),
  customerId: z.string().min(1, "Customer ID is required"),
  deviceType: deviceTypeEnum,
  brand: z.string().min(1, "Brand is required").max(50, "Brand is too long"),
  model: z.string().min(1, "Model is required").max(100, "Model is too long"),
  imei: z.string().max(20, "IMEI is too long").optional(),
  condition: z.string().max(200, "Condition description is too long").optional(),
  accessories: z.string().max(500, "Accessories description is too long").optional(),
  conditionImages: z.array(uploadedImageSchema).optional(),
  createdAt: z.union([z.date(), z.string()]).optional(),
})

// Form input schema
export const deviceFormSchema = deviceSchema.omit({
  id: true,
  createdAt: true,
})

// Types derived from schemas
export type DeviceType = z.infer<typeof deviceTypeEnum>
export type UploadedImage = z.infer<typeof uploadedImageSchema>
export type Device = z.infer<typeof deviceSchema>
export type DeviceFormData = z.infer<typeof deviceFormSchema>
