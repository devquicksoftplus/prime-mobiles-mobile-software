// Stripe utility functions for payment processing
export async function createPaymentIntent(amount: number, invoiceId: string) {
  const response = await fetch("/api/payments/create-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, invoiceId }),
  })

  if (!response.ok) throw new Error("Failed to create payment intent")
  return response.json()
}

export async function confirmPayment(paymentIntentId: string, invoiceId: string) {
  const response = await fetch("/api/payments/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentIntentId, invoiceId }),
  })

  if (!response.ok) throw new Error("Failed to confirm payment")
  return response.json()
}
