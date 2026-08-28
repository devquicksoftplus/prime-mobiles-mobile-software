import { z } from "zod"

// Predefined terms and conditions commonly used by mobile shops
export const PREDEFINED_TERMS = [
  { id: "warranty_7", label: "7 days service warranty on repairs" },
  { id: "warranty_15", label: "15 days service warranty on repairs" },
  { id: "warranty_30", label: "30 days service warranty on repairs" },
  { id: "warranty_90", label: "90 days warranty on replaced parts" },
  { id: "no_physical_damage", label: "Warranty void if physical or water damage occurs" },
  { id: "no_refund", label: "No refund after service completion" },
  { id: "no_responsibility_data", label: "Not responsible for data loss during repair" },
  { id: "backup_advised", label: "Customer advised to backup data before service" },
  { id: "collect_7_days", label: "Device must be collected within 7 days of completion" },
  { id: "collect_15_days", label: "Device must be collected within 15 days of completion" },
  { id: "storage_charges", label: "Storage charges may apply for uncollected devices after 15 days" },
  { id: "no_original_parts", label: "Original parts may not be available; compatible parts may be used" },
  { id: "advance_required", label: "Advance payment required before starting repair" },
  { id: "full_payment", label: "Full payment required before device handover" },
  { id: "estimate_subject_change", label: "Estimate subject to change upon inspection" },
  { id: "customer_consent", label: "Customer consent required for additional repairs" },
  { id: "screen_replacement", label: "Screen replacement may affect touch ID/Face ID functionality" },
  { id: "software_issues", label: "Software issues may recur and are not covered under service warranty" },
  { id: "locked_device", label: "We are not responsible for unlocking locked devices (iCloud/FRP)" },
  { id: "receipt_mandatory", label: "Original receipt mandatory for warranty claims" },
] as const

export type PredefinedTermId = typeof PREDEFINED_TERMS[number]['id']

export const companySchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  companyName: z.string().min(1, "Company name is required").max(100, "Company name is too long"),
  tagline: z.string().max(150, "Tagline is too long").optional(),
  phone: z.string().min(10, "Phone number is required").max(15, "Invalid phone number"),
  alternatePhone: z.string().max(15, "Invalid phone number").optional(),
  email: z.string().email("Invalid email address").optional(),
  address: z.string().max(250, "Address is too long").optional(),
  city: z.string().max(50, "City name is too long").optional(),
  state: z.string().max(50, "State name is too long").optional(),
  pincode: z.string().max(10, "Invalid pincode").optional(),
  gstNumber: z.string().max(20, "Invalid GST number").optional(),
  logoUrl: z.string().url("Invalid logo URL").optional().nullable(),
  logoPublicId: z.string().optional().nullable(),
  website: z.string().url("Invalid website URL").optional(),
  // Structured terms and conditions
  selectedTerms: z.array(z.string()).optional(), // Array of predefined term IDs
  customTerms: z.array(z.string()).optional(), // Array of custom term strings
  // Legacy field for backward compatibility
  termsAndConditions: z.string().max(1000, "Terms too long").optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type Company = z.infer<typeof companySchema>

export const companyFormSchema = companySchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
})

export type CompanyFormData = z.infer<typeof companyFormSchema>

// Helper function to build terms and conditions string for invoices
export function buildTermsString(
  selectedTerms?: string[],
  customTerms?: string[]
): string {
  const terms: string[] = []
  
  // Add selected predefined terms
  if (selectedTerms && selectedTerms.length > 0) {
    selectedTerms.forEach((termId) => {
      const term = PREDEFINED_TERMS.find(t => t.id === termId)
      if (term) {
        terms.push(term.label)
      }
    })
  }
  
  // Add custom terms
  if (customTerms && customTerms.length > 0) {
    terms.push(...customTerms)
  }
  
  // Join with bullet points or newlines
  return terms.map((term, index) => `${index + 1}. ${term}`).join('\n')
}
