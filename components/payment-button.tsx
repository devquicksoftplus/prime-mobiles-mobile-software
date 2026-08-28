"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Invoice } from "@/lib/db-schemas"

interface PaymentButtonProps {
  invoice: Invoice
  onSuccess?: () => void
}

export function PaymentButton({ invoice, onSuccess }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: invoice.balanceDue,
          invoiceId: invoice.id?.toString(),
          description: `Payment for invoice ${invoice.invoiceNumber}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment")
      }

      // When Stripe is integrated, open Stripe payment modal here
      toast.success(`Payment intent created for invoice ${invoice.invoiceNumber}`)

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred"
      setError(errorMsg)
      toast.error(errorMsg)
      console.error("[v0] Payment button error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (invoice.paymentStatus === "paid") {
    return <span className="px-2 py-1 rounded text-xs font-medium bg-accent/10 text-accent">PAID</span>
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handlePayment}
        disabled={isLoading || invoice.balanceDue <= 0}
        className="bg-primary hover:bg-primary/90 text-sm"
        size="sm"
      >
        {isLoading ? "Processing..." : `Pay ₹${invoice.balanceDue.toFixed(2)}`}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
