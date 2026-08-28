"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaymentButton } from "@/components/payment-button"
import { DashboardStatsSkeleton, DataTableSkeleton } from "@/components/loading-skeletons"
import { EmptyInvoices } from "@/components/empty-state"
import { toast } from "sonner"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useFirestore } from "@/hooks/use-firestore"
import type { Invoice } from "@/lib/db-schemas"

export function BillingContent() {
  const { isAuthenticated } = useAuth()
  const { getInvoices } = useFirestore()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!isAuthenticated) {
        setIsLoading(false)
        return
      }

      try {
        const data = await getInvoices()
        setInvoices(data as Invoice[])
      } catch (error) {
        console.error("[Firebase] Error fetching invoices:", error)
        const errorMsg = "Error loading invoices. Please check your connection."
        setError(errorMsg)
        toast.error("Failed to load invoices")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [isAuthenticated, getInvoices])

  const totalRevenue = invoices.filter((i) => i.paymentStatus === "paid").reduce((sum, i) => sum + i.totalAmount, 0)
  const pendingPayment = invoices
    .filter((i) => i.paymentStatus === "pending" || i.paymentStatus === "partial")
    .reduce((sum, i) => sum + i.balanceDue, 0)
  const paidInvoices = invoices.filter((i) => i.paymentStatus === "paid").length

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold text-primary">Billing & Invoices</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage invoices and payments</p>
        </div>
        <Link href="/intake">
          <Button className="bg-primary hover:bg-primary/90 rounded-lg">New Job Card</Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <p className="text-destructive text-sm">{error}</p>
          <p className="text-muted-foreground text-xs mt-2">
            Please check your Firebase configuration and try again.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
        <Card className="rounded-2xl border-border/50 shadow-sm bg-card/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">₹{totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-2">{paidInvoices} paid invoices</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm bg-card/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">₹{pendingPayment.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-2">Awaiting collection</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm bg-card/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{invoices.length}</p>
            <p className="text-xs text-muted-foreground mt-2">All time</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <DashboardStatsSkeleton />
          <DataTableSkeleton columns={7} rows={5} />
        </div>
      ) : invoices.length > 0 ? (
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-6 pb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Invoices</h2>
            <p className="text-sm text-muted-foreground">All invoices and payment status</p>
          </div>
          <div className="px-6 pb-6">
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full text-sm">
                <thead className="border-b border-border/30">
                  <tr>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Invoice #</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Amount</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Paid</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Balance</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id?.toString()} className="border-b border-border/30 hover:bg-[var(--row-hover)] transition-colors">
                      <td className="py-3 px-4 font-mono text-sm">{invoice.invoiceNumber}</td>
                      <td className="py-3 px-4">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right font-semibold">₹{invoice.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-green-600">₹{invoice.amountPaid.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-primary">₹{invoice.balanceDue.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            invoice.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : invoice.paymentStatus === "partial"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-600"
                          }`}
                        >
                          {invoice.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <PaymentButton invoice={invoice} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <EmptyInvoices />
      )}
    </div>
  )
}
