import { z } from "zod"

// Customer schema
export const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[\d+\-\s]+$/, "Invalid phone number format"),
  alternatePhone: z
    .string()
    .max(15)
    .regex(/^[\d+\-\s]*$/, "Invalid phone number format")
    .optional(),
  address: z.string().max(500, "Address is too long").optional(),
  email: z.string().email("Invalid email address").nullable().optional(),
  createdAt: z.union([z.date(), z.string()]).optional(),
})

// Form input schema (for creating/updating)
export const customerFormSchema = customerSchema.omit({
  id: true,
  createdAt: true,
})

// Types derived from schemas
export type Customer = z.infer<typeof customerSchema>
export type CustomerFormData = z.infer<typeof customerFormSchema>
