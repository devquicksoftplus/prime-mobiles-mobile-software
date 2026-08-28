"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { InvoiceDisplay } from "@/components/invoice-display"
import { useAuth } from "@/contexts/auth-context"
import { useFirestore } from "@/hooks/use-firestore"
import type { Invoice } from "@/lib/types"

export default function InvoicesPage() {
  const { isAuthenticated } = useAuth()
  const { getInvoices } = useFirestore()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchInvoices() {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        const data = await getInvoices()
        setInvoices(data as Invoice[])
      } catch (error) {
        console.error("[Firebase] Error fetching invoices:", error)
        setError("Error loading invoices. Please check your connection.")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [isAuthenticated, getInvoices])

  const handlePay = async (invoiceId: string) => {
    console.log("Processing payment for invoice:", invoiceId)
    // Add Stripe payment logic here
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-background p-8">
          <div className="text-center">Loading invoices...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground">Manage and view all invoices</p>
          </div>
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg overflow-hidden">
                <InvoiceDisplay 
                  invoice={invoice} 
                  onPay={invoice.balanceDue > 0 ? () => handlePay(invoice.id!) : undefined}
                />
              </div>
            ))}
            
            {invoices.length === 0 && !error && (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground mb-4">No invoices found</p>
                <p className="text-sm text-muted-foreground">
                  Create your first invoice from a job card
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}