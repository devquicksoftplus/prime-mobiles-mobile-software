"use client"

import jsPDF from "jspdf"

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
  termsAndConditions?: string
}

interface InvoiceData {
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
  problemDescription?: string
  technicianDiagnosis?: string
  requiredParts?: string[]
  costEstimate?: {
    laborCost: number
    partsCost: number
    serviceCost: number
    total: number
  }
  advanceReceived?: number
  deliveryDate?: string | Date
  status?: string
  createdAt?: string | Date
  conditionImages?: Array<{ url: string; publicId: string }>
  companyInfo?: CompanyInfo
}

// Default business info - used as fallback
const DEFAULT_BUSINESS_INFO: CompanyInfo = {
  name: "Mobile Service Center",
  tagline: "Professional Device Repair Services",
  phone: "+91 98765 43210",
  email: "info@mobileservice.com",
  address: "123, Main Street, City - 600001",
}

// Helper to get company info with fallback
function getCompanyInfo(data: InvoiceData): CompanyInfo {
  if (data.companyInfo && data.companyInfo.name) {
    return data.companyInfo
  }
  return DEFAULT_BUSINESS_INFO
}

// Helper to format full address
function formatFullAddress(company: CompanyInfo): string {
  const parts = [company.address]
  if (company.city) parts.push(company.city)
  if (company.state) parts.push(company.state)
  if (company.pincode) parts.push(`- ${company.pincode}`)
  return parts.filter(Boolean).join(", ") || "N/A"
}

function safeNumber(value: unknown): number {
  if (typeof value === "number" && !isNaN(value)) return value
  if (typeof value === "string") {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

function formatDate(date: string | Date | undefined): string {
  if (!date) return "N/A"
  const d = new Date(date)
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`
}

export function generateInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20
  const company = getCompanyInfo(data)
  const fullAddress = formatFullAddress(company)

  // Colors
  const primaryColor = [41, 128, 185] as const // Blue
  const textColor = [51, 51, 51] as const // Dark gray
  const mutedColor = [128, 128, 128] as const // Gray
  const successColor = [39, 174, 96] as const // Green
  const warningColor = [230, 126, 34] as const // Orange

  // ===== HEADER =====
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, pageWidth, 40, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text(company.name, 15, 18)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(company.tagline || "Professional Device Repair Services", 15, 26)

  // GST Number if available
  if (company.gstNumber) {
    doc.setFontSize(8)
    doc.text(`GSTIN: ${company.gstNumber}`, 15, 33)
  }

  // Business contact on right
  doc.setFontSize(9)
  doc.text(company.phone, pageWidth - 15, 14, { align: "right" })
  doc.text(company.email || "", pageWidth - 15, 20, { align: "right" })
  doc.text(fullAddress, pageWidth - 15, 26, { align: "right" })
  if (company.website) {
    doc.text(company.website, pageWidth - 15, 32, { align: "right" })
  }

  yPos = 45

  // ===== INVOICE INFO =====
  doc.setTextColor(...textColor)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("SERVICE INVOICE", 15, yPos)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...mutedColor)
  doc.text(`Invoice #: ${data.id.slice(0, 8).toUpperCase()}`, pageWidth - 15, yPos - 5, { align: "right" })
  doc.text(`Date: ${formatDate(data.createdAt || new Date())}`, pageWidth - 15, yPos + 2, { align: "right" })

  // Status badge
  const status = data.status || "pending"
  const statusLabel = status === "delivered" ? "DELIVERED" : status === "ready-for-delivery" ? "READY" : "PENDING"
  const statusColor = status === "delivered" ? successColor : status === "ready-for-delivery" ? primaryColor : warningColor
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
  doc.setFont("helvetica", "bold")
  doc.text(statusLabel, pageWidth - 15, yPos + 10, { align: "right" })

  yPos += 25

  // ===== CUSTOMER DETAILS =====
  doc.setFillColor(245, 245, 245)
  doc.rect(15, yPos - 5, pageWidth - 30, 35, "F")

  doc.setTextColor(...primaryColor)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("CUSTOMER DETAILS", 20, yPos + 3)

  doc.setTextColor(...textColor)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  yPos += 12

  doc.text(`Name: ${data.customerName || "N/A"}`, 20, yPos)
  doc.text(`Phone: ${data.phone || "N/A"}`, 110, yPos)
  yPos += 7
  doc.text(`Address: ${data.address || "N/A"}`, 20, yPos)
  if (data.alternatePhone) {
    doc.text(`Alt Phone: ${data.alternatePhone}`, 110, yPos)
  }

  yPos += 20

  // ===== DEVICE DETAILS =====
  doc.setFillColor(245, 245, 245)
  doc.rect(15, yPos - 5, pageWidth - 30, 40, "F")

  doc.setTextColor(...primaryColor)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("DEVICE DETAILS", 20, yPos + 3)

  doc.setTextColor(...textColor)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  yPos += 12

  doc.text(`Type: ${data.deviceInfo?.type || "N/A"}`, 20, yPos)
  doc.text(`Brand: ${data.deviceInfo?.brand || "N/A"}`, 80, yPos)
  doc.text(`Model: ${data.deviceInfo?.model || "N/A"}`, 140, yPos)
  yPos += 7
  doc.text(`IMEI: ${data.imei || "N/A"}`, 20, yPos)
  doc.text(`Condition: ${data.condition || "N/A"}`, 110, yPos)
  yPos += 7
  doc.text(`Accessories: ${data.accessories || "None"}`, 20, yPos)

  // Note about device images if available
  if (data.conditionImages && data.conditionImages.length > 0) {
    yPos += 7
    doc.setTextColor(41, 128, 185)
    doc.text(`📷 ${data.conditionImages.length} device photo(s) on file`, 20, yPos)
    doc.setTextColor(...textColor)
  }

  yPos += 20

  // ===== SERVICE DETAILS =====
  doc.setTextColor(...primaryColor)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("SERVICE DETAILS", 20, yPos)
  yPos += 8

  doc.setTextColor(...textColor)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  doc.text("Problem:", 20, yPos)
  const problemLines = doc.splitTextToSize(data.problemDescription || "N/A", pageWidth - 60)
  doc.text(problemLines, 50, yPos)
  yPos += problemLines.length * 5 + 5

  doc.text("Diagnosis:", 20, yPos)
  const diagnosisLines = doc.splitTextToSize(data.technicianDiagnosis || "Pending", pageWidth - 60)
  doc.text(diagnosisLines, 50, yPos)
  yPos += diagnosisLines.length * 5 + 5

  doc.text("Parts Required:", 20, yPos)
  doc.text(data.requiredParts?.length ? data.requiredParts.join(", ") : "None", 60, yPos)
  yPos += 5

  doc.text("Expected Delivery:", 20, yPos)
  doc.text(formatDate(data.deliveryDate), 70, yPos)

  yPos += 15

  // ===== COST BREAKDOWN TABLE =====
  doc.setFillColor(...primaryColor)
  doc.rect(15, yPos, pageWidth - 30, 10, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("DESCRIPTION", 20, yPos + 7)
  doc.text("AMOUNT", pageWidth - 30, yPos + 7, { align: "right" })

  yPos += 12

  const laborCost = safeNumber(data.costEstimate?.laborCost)
  const partsCost = safeNumber(data.costEstimate?.partsCost)
  const serviceCost = safeNumber(data.costEstimate?.serviceCost)
  const total = safeNumber(data.costEstimate?.total)
  const advance = safeNumber(data.advanceReceived)
  const balance = total - advance

  doc.setTextColor(...textColor)
  doc.setFont("helvetica", "normal")

  // Cost rows
  const costItems = [
    { label: "Labor Charges", amount: laborCost },
    { label: "Parts Cost", amount: partsCost },
    { label: "Service Charges", amount: serviceCost },
  ]

  costItems.forEach((item) => {
    doc.text(item.label, 20, yPos + 5)
    doc.text(formatCurrency(item.amount), pageWidth - 30, yPos + 5, { align: "right" })
    doc.setDrawColor(220, 220, 220)
    doc.line(15, yPos + 8, pageWidth - 15, yPos + 8)
    yPos += 10
  })

  // Total row
  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 10, "F")
  doc.setFont("helvetica", "bold")
  doc.text("TOTAL", 20, yPos + 7)
  doc.text(formatCurrency(total), pageWidth - 30, yPos + 7, { align: "right" })
  yPos += 12

  // Advance & Balance
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...successColor)
  doc.text("Advance Paid", 20, yPos + 5)
  doc.text(formatCurrency(advance), pageWidth - 30, yPos + 5, { align: "right" })
  yPos += 10

  doc.setFont("helvetica", "bold")
  if (balance > 0) {
    doc.setTextColor(...warningColor)
  } else {
    doc.setTextColor(...successColor)
  }
  doc.text("Balance Due", 20, yPos + 5)
  doc.text(formatCurrency(balance), pageWidth - 30, yPos + 5, { align: "right" })

  yPos += 25

  // ===== TERMS & CONDITIONS =====
  if (company.termsAndConditions) {
    doc.setFontSize(8)
    doc.setTextColor(...mutedColor)
    doc.setFont("helvetica", "italic")
    const termsLines = doc.splitTextToSize(company.termsAndConditions, pageWidth - 40)
    doc.text(termsLines.slice(0, 3), 20, yPos) // Limit to 3 lines
    yPos += termsLines.slice(0, 3).length * 4 + 10
  }

  // ===== FOOTER =====
  doc.setDrawColor(...primaryColor)
  doc.line(15, yPos, pageWidth - 15, yPos)
  yPos += 10

  doc.setTextColor(...mutedColor)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text("Thank you for choosing our services!", pageWidth / 2, yPos, { align: "center" })
  yPos += 5
  doc.text("For any queries, please contact us at " + company.phone, pageWidth / 2, yPos, { align: "center" })

  return doc
}

export function downloadInvoice(data: InvoiceData) {
  const doc = generateInvoicePDF(data)
  const fileName = `Invoice_${data.id.slice(0, 8)}_${data.customerName?.replace(/\s+/g, "_") || "Customer"}.pdf`
  doc.save(fileName)
}

export function downloadMultipleInvoices(dataList: InvoiceData[]) {
  dataList.forEach((data, index) => {
    setTimeout(() => {
      downloadInvoice(data)
    }, index * 500) // Stagger downloads to prevent browser blocking
  })
}

export async function shareOnWhatsApp(data: InvoiceData) {
  const company = getCompanyInfo(data)
  const laborCost = safeNumber(data.costEstimate?.laborCost)
  const partsCost = safeNumber(data.costEstimate?.partsCost)
  const serviceCost = safeNumber(data.costEstimate?.serviceCost)
  const total = safeNumber(data.costEstimate?.total)
  const advance = safeNumber(data.advanceReceived)
  const balance = total - advance
  const status = data.status || "pending"
  const statusLabel = status === "delivered" ? "DELIVERED ✅" : status === "ready-for-delivery" ? "READY 📦" : "PENDING ⏳"

  // Create invoice HTML for image conversion
  const invoiceHtml = `
    <div id="invoice-image" style="width: 400px; padding: 20px; background: white; font-family: Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #2980b9, #1a5276); color: white; padding: 15px; margin: -20px -20px 20px -20px; text-align: center;">
        <h2 style="margin: 0; font-size: 18px;">${company.name}</h2>
        <p style="margin: 5px 0 0 0; font-size: 11px;">${company.tagline || ""}</p>
        <p style="margin: 5px 0 0 0; font-size: 10px;">📞 ${company.phone}</p>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px; align-items: center;">
        <div>
          <strong style="color: #2980b9; font-size: 14px;">SERVICE INVOICE</strong>
          <p style="margin: 5px 0; font-size: 11px; color: #666;">Invoice #: ${data.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <div>
          <span style="background: ${status === "delivered" ? "#27ae60" : status === "ready-for-delivery" ? "#2980b9" : "#e67e22"}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: bold;">${statusLabel}</span>
        </div>
      </div>

      <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 12px; border-left: 3px solid #2980b9;">
        <h4 style="margin: 0 0 8px 0; color: #2980b9; font-size: 11px; text-transform: uppercase;">Customer</h4>
        <p style="margin: 3px 0; font-size: 13px; font-weight: bold;">${data.customerName || "N/A"}</p>
        <p style="margin: 3px 0; font-size: 11px; color: #555;">📱 ${data.phone || "N/A"}</p>
        <p style="margin: 3px 0; font-size: 11px; color: #555;">📍 ${data.address || "N/A"}</p>
      </div>

      <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 12px; border-left: 3px solid #27ae60;">
        <h4 style="margin: 0 0 8px 0; color: #27ae60; font-size: 11px; text-transform: uppercase;">Device</h4>
        <p style="margin: 3px 0; font-size: 13px; font-weight: bold;">${data.deviceInfo?.brand || ""} ${data.deviceInfo?.model || ""}</p>
        <p style="margin: 3px 0; font-size: 11px; color: #555;">Type: ${data.deviceInfo?.type || "N/A"} | IMEI: ${data.imei || "N/A"}</p>
      </div>

      ${data.conditionImages && data.conditionImages.length > 0 ? `
      <div style="margin-bottom: 12px;">
        <h4 style="margin: 0 0 8px 0; color: #2980b9; font-size: 11px; text-transform: uppercase;">📷 Device Photos</h4>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${data.conditionImages.slice(0, 3).map(img => `
            <img src="${img.url}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd;" crossorigin="anonymous" />
          `).join('')}
        </div>
      </div>
      ` : ''}

      <div style="margin-bottom: 12px; padding: 10px; background: #fff3cd; border-radius: 8px;">
        <h4 style="margin: 0 0 5px 0; color: #856404; font-size: 11px;">Problem</h4>
        <p style="margin: 0; font-size: 11px; color: #333;">${data.problemDescription || "N/A"}</p>
      </div>

      <div style="border: 2px solid #2980b9; border-radius: 8px; overflow: hidden;">
        <div style="background: #2980b9; color: white; padding: 8px 12px; font-size: 11px; font-weight: bold;">COST BREAKDOWN</div>
        <div style="padding: 10px 12px;">
          <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px;">
            <span>Labor Charges</span><span>${formatCurrency(laborCost)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px;">
            <span>Parts Cost</span><span>${formatCurrency(partsCost)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px;">
            <span>Service Charges</span><span>${formatCurrency(serviceCost)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 10px 0 6px 0; padding-top: 8px; border-top: 2px solid #2980b9; font-weight: bold; font-size: 14px;">
            <span>TOTAL</span><span style="color: #2980b9;">${formatCurrency(total)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px; color: #27ae60;">
            <span>✓ Advance Paid</span><span>${formatCurrency(advance)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 6px 0; padding: 8px; background: ${balance > 0 ? "#fff3cd" : "#d4edda"}; border-radius: 5px; font-weight: bold; font-size: 13px; color: ${balance > 0 ? "#856404" : "#155724"};">
            <span>BALANCE DUE</span><span>${formatCurrency(balance)}</span>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 10px; color: #666;">
        Thank you for choosing our services! 🙏
      </div>
    </div>
  `

  // Create a temporary container
  const container = document.createElement("div")
  container.innerHTML = invoiceHtml
  container.style.position = "absolute"
  container.style.left = "-9999px"
  container.style.top = "0"
  document.body.appendChild(container)

  try {
    // Dynamically import html2canvas
    const html2canvas = (await import("html2canvas")).default
    const invoiceElement = container.querySelector("#invoice-image") as HTMLElement
    
    // Wait a bit for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
    })

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b)
        else reject(new Error("Failed to create blob"))
      }, "image/png", 0.95)
    })

    // Try to copy image to clipboard
    let copiedToClipboard = false
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ])
      copiedToClipboard = true
    } catch (err) {
      console.log("Clipboard copy failed, will download instead:", err)
    }

    // Also download the image as backup
    const fileName = `Invoice_${data.id.slice(0, 8)}.png`
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)

    // Prepare WhatsApp message
    const message = copiedToClipboard 
      ? `*${company.name}*

📄 *SERVICE INVOICE*

*Customer:* ${data.customerName || "N/A"}
*Device:* ${data.deviceInfo?.brand || ""} ${data.deviceInfo?.model || ""}

💰 *Total:* ${formatCurrency(total)}
💵 *Balance:* ${formatCurrency(balance)}

📷 *Invoice image copied!* Just press Ctrl+V (or Cmd+V) to paste it here!

📞 ${company.phone}`
      : `*${company.name}*

📄 *SERVICE INVOICE*

*Customer:* ${data.customerName || "N/A"}
*Device:* ${data.deviceInfo?.brand || ""} ${data.deviceInfo?.model || ""}

💰 *Total:* ${formatCurrency(total)}
💵 *Balance:* ${formatCurrency(balance)}

📷 _Invoice image downloaded - please attach it from your downloads!_

📞 ${company.phone}`

    const encodedMessage = encodeURIComponent(message)
    const phoneNumber = data.phone?.replace(/\D/g, "") || ""
    
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
      // Mobile: Use WhatsApp app URL scheme
      whatsappUrl = formattedPhone
        ? `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`
        : `whatsapp://send?text=${encodedMessage}`
    } else {
      // Desktop: Use WhatsApp Web
      whatsappUrl = formattedPhone
        ? `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`
        : `https://web.whatsapp.com/send?text=${encodedMessage}`
    }

    // Open WhatsApp after a small delay
    setTimeout(() => {
      window.open(whatsappUrl, "_blank")
    }, 500)
    
  } catch (error) {
    console.error("Error generating invoice image:", error)
    // Fallback to just opening WhatsApp with text
    const message = `Invoice for ${data.customerName || "Customer"}\nTotal: ${formatCurrency(total)}\nBalance: ${formatCurrency(balance)}`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, "_blank")
  } finally {
    document.body.removeChild(container)
  }
}
