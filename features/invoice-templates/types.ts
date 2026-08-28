// Invoice data interface for PDF generation
export interface InvoiceCompanyInfo {
  name: string
  address: string
  phone: string
  email?: string
  website?: string
  gstNumber?: string
  logoUrl?: string
}

export interface InvoiceCustomerInfo {
  name: string
  phone: string
  alternatePhone?: string
  address?: string
  email?: string
}

export interface InvoiceDeviceInfo {
  type: string
  brand: string
  model: string
  imei?: string
  condition?: string
  accessories?: string
  images?: string[] // Device condition photos
}

export interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
  imageUrl?: string // Product/part image
}

export interface InvoiceCostBreakdown {
  laborCost: number
  partsCost: number
  serviceCost: number
  subtotal: number
  taxRate?: number
  taxAmount?: number
  discount?: number
  total: number
}

export interface InvoiceData {
  // Invoice metadata
  invoiceNumber: string
  invoiceDate: string
  dueDate?: string
  
  // Company info (from settings)
  company: InvoiceCompanyInfo
  
  // Customer info
  customer: InvoiceCustomerInfo
  
  // Device info (for service invoices)
  device?: InvoiceDeviceInfo
  
  // Problem & service details
  problemDescription?: string
  diagnosis?: string
  repairNotes?: string
  
  // Cost breakdown
  costs: InvoiceCostBreakdown
  
  // Payment info
  advanceReceived?: number
  balanceDue?: number
  paymentMethod?: string
  paymentStatus?: 'paid' | 'partial' | 'pending'
  
  // Dates
  deliveryDate?: string
  warrantyPeriod?: string
  
  // Additional
  termsAndConditions?: string
  notes?: string
}

export interface TemplateInfo {
  id: string
  name: string
  description: string
  thumbnail: string // Preview image path or color
  primaryColor: string
  secondaryColor: string
  style: 'modern' | 'classic' | 'minimal' | 'bold' | 'creative'
}

export type TemplateId = 
  | 'modern-minimalist'
  | 'corporate-pro'
  | 'creative-studio'
  | 'executive-suite'
  | 'tech-forward'
  | 'bold-impact'
  | 'industrial-tech'
  | 'classic-professional'
  | 'retail-receipt'
  | 'soft-elegance'
