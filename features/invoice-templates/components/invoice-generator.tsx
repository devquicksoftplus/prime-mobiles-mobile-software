'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Download } from 'lucide-react'
import { InvoiceData, TemplateId } from '../types'
import { getTemplateComponent } from '../templates'
import { DEFAULT_TEMPLATE } from '../template-registry'

const STORAGE_KEY = 'selected-invoice-template'

// Dynamically import PDFDownloadLink to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { 
    ssr: false, 
    loading: () => (
      <Button disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }
) as any

interface InvoiceGeneratorProps {
  invoiceData: InvoiceData
  className?: string
  buttonText?: string
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost'
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon'
}

export function InvoiceGenerator({
  invoiceData,
  className,
  buttonText = 'Download Invoice',
  buttonVariant = 'default',
  buttonSize = 'default',
}: InvoiceGeneratorProps) {
  const [templateId, setTemplateId] = useState<TemplateId>(DEFAULT_TEMPLATE)
  const [isReady, setIsReady] = useState(false)
  
  // Load template on client side using useEffect
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setTemplateId(saved as TemplateId)
    }
    setIsReady(true)
  }, [])
  
  // Get template component based on selected ID
  const TemplateComponent = getTemplateComponent(templateId)

  // Don't render until template is loaded
  if (!isReady) {
    return (
      <Button disabled size={buttonSize}>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <PDFDownloadLink
        document={<TemplateComponent data={invoiceData} />}
        fileName={`invoice-${invoiceData.invoiceNumber}.pdf`}
      >
        {({ loading }: { loading: boolean }) => (
          <Button variant={buttonVariant} size={buttonSize} disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {buttonText}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  )
}

// Helper function to convert job card data to invoice data
export function jobCardToInvoiceData(
  jobCard: {
    id: string
    customerName?: string
    phone?: string
    alternatePhone?: string
    address?: string
    deviceInfo?: { type: string; brand: string; model: string }
    imei?: string
    condition?: string
    accessories?: string
    problemDescription?: string
    technicianDiagnosis?: string
    costEstimate?: { laborCost?: number; partsCost?: number; serviceCost?: number; total?: number }
    advanceReceived?: number
    deliveryDate?: string
    createdAt: string
    notes?: string
  },
  companyInfo: {
    name: string
    address: string
    phone: string
    email?: string
    gstNumber?: string
    logoUrl?: string
  },
  termsAndConditions?: string
): InvoiceData {
  const costs = jobCard.costEstimate || {}
  const subtotal = (costs.laborCost || 0) + (costs.partsCost || 0) + (costs.serviceCost || 0)
  
  return {
    invoiceNumber: `INV-${jobCard.id.slice(0, 8).toUpperCase()}`,
    invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    company: companyInfo,
    customer: {
      name: jobCard.customerName || 'Customer',
      phone: jobCard.phone || '',
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
    } : undefined,
    problemDescription: jobCard.problemDescription,
    diagnosis: jobCard.technicianDiagnosis,
    costs: {
      laborCost: costs.laborCost || 0,
      partsCost: costs.partsCost || 0,
      serviceCost: costs.serviceCost || 0,
      subtotal,
      total: costs.total || subtotal,
    },
    advanceReceived: jobCard.advanceReceived,
    balanceDue: (costs.total || subtotal) - (jobCard.advanceReceived || 0),
    paymentStatus: jobCard.advanceReceived && jobCard.advanceReceived >= (costs.total || subtotal) 
      ? 'paid' 
      : jobCard.advanceReceived && jobCard.advanceReceived > 0 
        ? 'partial' 
        : 'pending',
    deliveryDate: jobCard.deliveryDate 
      ? new Date(jobCard.deliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : undefined,
    notes: jobCard.notes,
    termsAndConditions,
  }
}
