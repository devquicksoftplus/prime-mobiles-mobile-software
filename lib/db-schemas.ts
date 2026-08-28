// Firebase-compatible schemas - Re-export from new Zod validation schemas
// This file is kept for backwards compatibility with existing imports

export * from "./validations"

// Re-export specific types that components might be importing
export type {
  Customer,
  Device,
  JobCard,
  Invoice,
  RepairTicket,
  InventoryItem,
  CostEstimate,
  DeviceInfo,
  InvoiceItem,
  UploadedImage,
} from "./validations"
