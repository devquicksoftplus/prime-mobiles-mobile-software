"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Invoice } from "@/lib/types" // Use frontend types

interface InvoiceDisplayProps {
  invoice: Invoice
  onPay?: () => void
}

export function InvoiceDisplay({ invoice, onPay }: InvoiceDisplayProps) {
  // Safe date formatting
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return 'Invalid Date'
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-primary">INVOICE</h1>
            <p className="text-muted-foreground">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Invoice Date</p>
            <p className="font-semibold">{formatDate(invoice.invoiceDate)}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="border-t border-border pt-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Rate</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b border-border">
                  <td className="py-2">{item.description}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">₹{item.rate.toFixed(2)}</td>
                  <td className="text-right">₹{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between py-2 border-b border-border">
              <span>Subtotal:</span>
              <span>₹{invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.taxPercent > 0 && (
              <div className="flex justify-between py-2 border-b border-border">
                <span>
                  {invoice.taxType.toUpperCase()} ({invoice.taxPercent}%):
                </span>
                <span>₹{invoice.taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-border font-bold text-lg">
              <span>Total:</span>
              <span>₹{invoice.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Amount Paid:</span>
              <span>₹{invoice.amountPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold text-accent">
              <span>Balance Due:</span>
              <span>₹{invoice.balanceDue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        {invoice.balanceDue > 0 && onPay && (
          <Button onClick={onPay} className="w-full">
            Pay ₹{invoice.balanceDue.toFixed(2)} with Stripe
          </Button>
        )}
      </div>
    </Card>
  )
}