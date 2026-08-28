'use client'

import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Download, X } from 'lucide-react'
import { InvoiceData, TemplateId } from '../types'
import { getTemplateComponent } from '../templates'
import { getTemplateInfo } from '../template-registry'

// Dynamically import PDFDownloadLink to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false, loading: () => <Button disabled><Loader2 className="w-4 h-4 mr-2 animate-spin" />Loading...</Button> }
) as any

// Dynamically import BlobProvider for preview
const BlobProvider = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.BlobProvider),
  { ssr: false }
) as any

interface InvoicePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: InvoiceData
  templateId: TemplateId
  onSelect?: () => void
  showSelectButton?: boolean
}

export function InvoicePreviewDialog({
  open,
  onOpenChange,
  data,
  templateId,
  onSelect,
  showSelectButton = false,
}: InvoicePreviewDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const templateInfo = getTemplateInfo(templateId)
  const TemplateComponent = getTemplateComponent(templateId)
  
  const document = useMemo(() => <TemplateComponent data={data} />, [data, templateId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-slate-50 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-lg font-semibold">{templateInfo.name} Preview</DialogTitle>
            <p className="text-sm text-muted-foreground">{templateInfo.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {showSelectButton && onSelect && (
              <Button onClick={onSelect} variant="default">
                Select This Template
              </Button>
            )}
            <PDFDownloadLink
              document={document}
              fileName={`invoice-${data.invoiceNumber}.pdf`}
            >
              {({ loading }: { loading: boolean }) => (
                <Button variant="outline" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download PDF
                </Button>
              )}
            </PDFDownloadLink>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto bg-slate-200 p-6">
          <div className="max-w-[650px] mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
            <BlobProvider document={document}>
              {({ url, loading, error }: { url: string | null; loading: boolean; error: Error | null }) => {
                if (loading) {
                  return (
                    <div className="flex items-center justify-center h-[800px]">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                        <p className="mt-2 text-sm text-muted-foreground">Generating preview...</p>
                      </div>
                    </div>
                  )
                }
                if (error) {
                  return (
                    <div className="flex items-center justify-center h-[800px]">
                      <p className="text-destructive">Error generating preview</p>
                    </div>
                  )
                }
                if (url) {
                  return (
                    <iframe
                      src={url}
                      className="w-full h-[800px] border-0"
                      title="Invoice Preview"
                    />
                  )
                }
                return null
              }}
            </BlobProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Sample data for template preview
export const sampleInvoiceData: InvoiceData = {
  invoiceNumber: 'INV-2024-001',
  invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  company: {
    name: 'Konnect Service Center',
    address: '123 Tech Street, Electronic City, Bangalore - 560100',
    phone: '+91 98765 43210',
    email: 'support@konnect.com',
    gstNumber: '29ABCDE1234F1Z5',
    logoUrl: undefined, // No logo in sample
  },
  customer: {
    name: 'Rahul Sharma',
    phone: '+91 87654 32109',
    alternatePhone: '+91 76543 21098',
    address: '456 Green Park, MG Road, Bangalore - 560001',
  },
  device: {
    type: 'Smartphone',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    imei: '354678901234567',
    condition: 'Minor scratches on back panel',
    accessories: 'Charger, Original Box',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=300&fit=crop',
    ],
  },
  problemDescription: 'Screen flickering and battery draining fast',
  diagnosis: 'Display connector loose, Battery degraded to 75% health',
  costs: {
    laborCost: 800,
    partsCost: 2500,
    serviceCost: 200,
    subtotal: 3500,
    taxRate: 18,
    taxAmount: 630,
    total: 4130,
  },
  advanceReceived: 1000,
  balanceDue: 3130,
  paymentStatus: 'partial',
  deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  notes: 'Warranty: 30 days on parts replaced. Please collect device with original receipt.',
  termsAndConditions: '1. All repairs are subject to availability of parts. 2. Warranty covers only the parts replaced. 3. Payment is due upon completion of service. 4. Device must be collected within 30 days. 5. We are not responsible for data loss during repair.',
}
