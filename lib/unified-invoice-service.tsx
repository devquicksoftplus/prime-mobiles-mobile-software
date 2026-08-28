"use client"

import { pdf } from "@react-pdf/renderer"
import { getTemplateComponent } from "@/features/invoice-templates/templates"
import { DEFAULT_TEMPLATE } from "@/features/invoice-templates/template-registry"
import type { InvoiceData, TemplateId, InvoiceCompanyInfo } from "@/features/invoice-templates/types"
import { buildTermsString } from "@/lib/validations/company.schema"
import { uploadToFirebaseStorage } from "@/lib/firebase-storage"
import { toast } from "sonner"

const STORAGE_KEY = "selected-invoice-template"

// Get selected template from localStorage
function getSelectedTemplateId(): TemplateId {
  if (typeof window === "undefined") return DEFAULT_TEMPLATE
  const saved = localStorage.getItem(STORAGE_KEY)
  return (saved as TemplateId) || DEFAULT_TEMPLATE
}

// Company info interface matching what job cards store
interface CompanyInfo {
  name: string
  tagline?: string
  phone: string
  alternatePhone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  gstNumber?: string
  logoUrl?: string | null
  website?: string
  selectedTerms?: string[]
  customTerms?: string[]
  termsAndConditions?: string
}

// Job card data structure
interface JobCardData {
  id: string
  customerName?: string
  phone?: string
  alternatePhone?: string
  address?: string
  deviceInfo?: {
    type: string
    brand: string
    model: string
  }
  imei?: string
  condition?: string
  accessories?: string
  conditionImages?: Array<{ url: string; publicId: string }> // Device condition photos
  problemDescription?: string
  technicianDiagnosis?: string
  requiredParts?: string[]
  costEstimate?: {
    laborCost?: number
    partsCost?: number
    serviceCost?: number
    total?: number
  }
  advanceReceived?: number
  deliveryDate?: string | Date
  status?: string
  createdAt?: string | Date
  notes?: string
  companyInfo?: CompanyInfo
}

// Helper to format full address
function formatFullAddress(company: CompanyInfo): string {
  const parts = [company.address]
  if (company.city) parts.push(company.city)
  if (company.state) parts.push(company.state)
  if (company.pincode) parts.push(`- ${company.pincode}`)
  return parts.filter(Boolean).join(", ") || ""
}

// Safe number conversion
function safeNumber(value: unknown): number {
  if (typeof value === "number" && !isNaN(value)) return value
  if (typeof value === "string") {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

// Convert image URLs to base64 via server-side API (bypasses CORS)
async function convertImagesToBase64(urls: string[]): Promise<string[]> {
  if (!urls || urls.length === 0) return []
  
  try {
    const response = await fetch('/api/image-to-base64', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls }),
    })
    
    if (!response.ok) {
      console.error('Image conversion API failed:', response.status)
      return []
    }
    
    const data = await response.json()
    console.log(`Converted ${data.converted}/${data.total} images to base64`)
    return data.images || []
  } catch (error) {
    console.error('Failed to convert images to base64:', error)
    return []
  }
}

// Format currency
function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`
}

// Default company info fallback
const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: "Mobile Service Center",
  tagline: "Professional Device Repair Services",
  phone: "+91 98765 43210",
  email: "info@mobileservice.com",
  address: "123, Main Street, City - 600001",
}

// Get company info with fallback
function getCompanyInfo(data: JobCardData): CompanyInfo {
  if (data.companyInfo && data.companyInfo.name) {
    return data.companyInfo
  }
  return DEFAULT_COMPANY_INFO
}

// Convert job card data to InvoiceData format for templates
async function jobCardToInvoiceData(jobCard: JobCardData): Promise<InvoiceData> {
  // Convert condition images to base64 via server-side API (bypasses CORS)
  let deviceImages: string[] | undefined
  if (jobCard.conditionImages && jobCard.conditionImages.length > 0) {
    const urls = jobCard.conditionImages.map(img => img.url)
    console.log('[Invoice] Processing condition images:', urls.length, 'images')
    console.log('[Invoice] Image URLs:', urls)
    deviceImages = await convertImagesToBase64(urls)
    console.log('[Invoice] Converted images:', deviceImages?.length || 0, 'of', urls.length)
    
    // Log if any images failed to convert
    if (!deviceImages || deviceImages.length === 0) {
      console.warn('[Invoice] Warning: No images were converted successfully')
    } else if (deviceImages.length < urls.length) {
      console.warn('[Invoice] Warning: Some images failed to convert')
    }
  } else {
    console.log('[Invoice] No condition images found in job card')
  }
  const company = getCompanyInfo(jobCard)
  const costs = jobCard.costEstimate || {}
  const laborCost = safeNumber(costs.laborCost)
  const partsCost = safeNumber(costs.partsCost)
  const serviceCost = safeNumber(costs.serviceCost)
  const subtotal = laborCost + partsCost + serviceCost
  const total = safeNumber(costs.total) || subtotal
  const advance = safeNumber(jobCard.advanceReceived)
  const balance = total - advance

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    const d = new Date(date)
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  const companyData: InvoiceCompanyInfo = {
    name: company.name,
    address: formatFullAddress(company),
    phone: company.phone,
    email: company.email,
    website: company.website,
    gstNumber: company.gstNumber,
    logoUrl: company.logoUrl || undefined,
  }

  return {
    invoiceNumber: `INV-${jobCard.id.slice(0, 8).toUpperCase()}`,
    invoiceDate: formatDate(jobCard.createdAt),
    company: companyData,
    customer: {
      name: jobCard.customerName || "Customer",
      phone: jobCard.phone || "",
      alternatePhone: jobCard.alternatePhone,
      address: jobCard.address,
    },
    device: jobCard.deviceInfo ? {
      type: jobCard.deviceInfo.type,
      brand: jobCard.deviceInfo.brand,
      model: jobCard.deviceInfo.model,
      imei: jobCard.imei,
      condition: jobCard.condition,
      accessories: jobCard.accessories,
      images: deviceImages, // Use base64 converted images
    } : undefined,
    problemDescription: jobCard.problemDescription,
    diagnosis: jobCard.technicianDiagnosis,
    costs: {
      laborCost,
      partsCost,
      serviceCost,
      subtotal,
      total,
    },
    advanceReceived: advance,
    balanceDue: balance,
    paymentStatus: advance >= total ? "paid" : advance > 0 ? "partial" : "pending",
    deliveryDate: jobCard.deliveryDate ? formatDate(jobCard.deliveryDate) : undefined,
    notes: jobCard.notes,
    // Build terms from structured data or fall back to legacy string
    termsAndConditions: (company.selectedTerms?.length || company.customTerms?.length)
      ? buildTermsString(company.selectedTerms, company.customTerms)
      : company.termsAndConditions,
  }
}

// Generate PDF blob using selected template
export async function generateInvoiceBlob(jobCard: JobCardData): Promise<Blob> {
  const templateId = getSelectedTemplateId()
  const TemplateComponent = getTemplateComponent(templateId)
  const invoiceData = await jobCardToInvoiceData(jobCard)
  
  const doc = <TemplateComponent data={invoiceData} />
  const blob = await pdf(doc).toBlob()
  return blob
}

// Download single invoice
export async function downloadInvoice(jobCard: JobCardData): Promise<void> {
  try {
    const blob = await generateInvoiceBlob(jobCard)
    const fileName = `Invoice_${jobCard.id.slice(0, 8)}_${jobCard.customerName?.replace(/\s+/g, "_") || "Customer"}.pdf`
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error generating invoice:", error)
    throw error
  }
}

// Download multiple invoices
export async function downloadMultipleInvoices(jobCards: JobCardData[]): Promise<void> {
  for (let i = 0; i < jobCards.length; i++) {
    await new Promise(resolve => setTimeout(resolve, i * 500)) // Stagger downloads
    await downloadInvoice(jobCards[i])
  }
}



// Share invoice on WhatsApp with PDF link
export async function shareOnWhatsApp(jobCard: JobCardData): Promise<void> {
  try {
    const company = getCompanyInfo(jobCard)
    const costs = jobCard.costEstimate || {}
    const total = (costs.laborCost || 0) + (costs.partsCost || 0) + (costs.serviceCost || 0)
    const advance = jobCard.advanceReceived || 0
    const balance = total - advance
    
    // 1. Notify user
    toast.loading("Generating invoice PDF...")
    
    // 2. Generate PDF Blob
    const pdfBlob = await generateInvoiceBlob(jobCard)
    
    // 3. Create File object
    const filename = `Invoice_${jobCard.id.substring(0, 6)}_${Date.now()}.pdf`
    const pdfFile = new File([pdfBlob], filename, { type: "application/pdf" })
    
    // 4. Upload to Firebase
    toast.dismiss() // Dismiss loading
    toast.loading("Uploading invoice to share...")
    
    const uploadResult = await uploadToFirebaseStorage(pdfFile, "invoices")
    
    // 5. Try to create short URL, fall back to direct URL if it fails
    let invoiceUrl = uploadResult.url // Default to direct Firebase URL
    
    try {
      const shortId = jobCard.id.substring(0, 8).toUpperCase()
      
      // Import Firestore dynamically to avoid SSR issues
      const { doc, setDoc } = await import("firebase/firestore")
      const { db } = await import("@/lib/firebase")
      
      await setDoc(doc(db, "invoiceLinks", shortId), {
        pdfUrl: uploadResult.url,
        jobCardId: jobCard.id,
        customerName: jobCard.customerName,
        shopName: company.name,
        createdAt: new Date().toISOString(),
      })
      
      // Generate descriptive URL: /invoice/{shop-name}/{customer-name}/{id}
      const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
      
      // Convert names to URL-friendly slugs (lowercase, replace spaces with hyphens)
      const shopSlug = (company.name || "shop").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      const customerSlug = (jobCard.customerName || "customer").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      
      invoiceUrl = `${baseUrl}/invoice/${shopSlug}/${customerSlug}/${shortId}`
      console.log("[WhatsApp] Using custom URL:", invoiceUrl)
    } catch (linkError) {
      console.warn("[WhatsApp] Could not create short URL, using direct link:", linkError)
      // Keep using uploadResult.url as fallback
    }
    
    toast.dismiss() // Dismiss uploading
    toast.success("Ready to share!")
    
    // 6. Construct Message with Link
    const statusLabel = jobCard.status === "delivered" ? "Delivered" : "Ready"
    
    let message = `*${company.name}*

📄 *SERVICE INVOICE*

*Customer:* ${jobCard.customerName || "N/A"}
*Device:* ${jobCard.deviceInfo?.brand || ""} ${jobCard.deviceInfo?.model || ""}
*Status:* ${statusLabel}

💰 *Total:* ${formatCurrency(total)}
💵 *Balance:* ${formatCurrency(balance)}

🔗 *Download Invoice:*
${invoiceUrl}

📞 ${company.phone}`

    const encodedMessage = encodeURIComponent(message)
    const phoneNumber = jobCard.phone?.replace(/\D/g, "") || ""
    
    // Format phone number for India
    let formattedPhone = phoneNumber
    if (phoneNumber && phoneNumber.length === 10) {
      formattedPhone = "91" + phoneNumber
    }
    
    // Detect if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    
    let whatsappUrl: string
    if (isMobile) {
      whatsappUrl = formattedPhone
        ? `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`
        : `whatsapp://send?text=${encodedMessage}`
    } else {
      whatsappUrl = formattedPhone
        ? `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`
        : `https://web.whatsapp.com/send?text=${encodedMessage}`
    }

    // Open WhatsApp
    window.open(whatsappUrl, "_blank")
    
  } catch (error) {
    console.error("Error sharing invoice:", error)
    toast.dismiss()
    toast.error("Failed to share invoice")
    
    // Fallback to just text if upload fails
    const costs = jobCard.costEstimate || {}
    const total = (costs.laborCost || 0) + (costs.partsCost || 0) + (costs.serviceCost || 0)
    const balance = total - (jobCard.advanceReceived || 0)
    
    const message = `Invoice for ${jobCard.customerName || "Customer"}\nTotal: ${formatCurrency(total)}\nBalance: ${formatCurrency(balance)}`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, "_blank")
  }
}
