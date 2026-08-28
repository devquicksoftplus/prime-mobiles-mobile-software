"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Crown, Sparkles, Zap, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/hooks/use-subscription"
import { SUBSCRIPTION_PLANS, PlanId, formatPrice } from "@/lib/subscription-config"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"

export function SubscriptionGate() {
  const router = useRouter()
  const { user } = useAuth()
  const { isActive, needsSubscription } = useSubscription()
  const [processingPlan, setProcessingPlan] = useState<PlanId | null>(null)
  const [dismissed, setDismissed] = useState(false)

  // Don't show if user has active subscription or has dismissed
  if (isActive || dismissed || !user) {
    return null
  }

  const handleSubscribe = async (planId: PlanId) => {
    if (!user) return

    setProcessingPlan(planId)

    try {
      const plan = SUBSCRIPTION_PLANS[planId]

      // 1. Create order on the server
      const apiUrl = `${window.location.origin}/api/razorpay/order`
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: plan.price, planId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Server error: ${response.status} ${JSON.stringify(errorData)}`)
      }

      const order = await response.json()

      // 2. Load Razorpay script
      const res = await new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
      })

      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?")
        return
      }

      // 3. Open Razorpay checkout
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

      if (!razorpayKey) {
        toast.error("Razorpay Key is missing in configuration.")
        return
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Asrock Mobile Services",
        description: `${plan.name} Subscription`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 4. Verify payment
            const verifyRes = await fetch(`${window.location.origin}/api/razorpay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: user?.email,
                userName: user?.name,
                planName: plan.name,
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              // 5. Update user's subscription in Firestore
              const startDate = new Date().toISOString()
              const endDate = new Date()
              endDate.setMonth(endDate.getMonth() + 1)

              await setDoc(
                doc(db, "users", user.uid),
                {
                  subscription: {
                    planId,
                    status: "active",
                    startDate,
                    endDate: endDate.toISOString(),
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                  },
                },
                { merge: true }
              )

              toast.success(`Welcome! You're now on the ${plan.name} plan!`)

              setTimeout(() => {
                window.location.reload()
              }, 1500)
            } else {
              toast.error("Payment verification failed")
            }
          } catch (error) {
            console.error("Verification error:", error)
            toast.error("Error verifying payment")
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment failed: " + response.error.description)
      })
      rzp.open()
    } catch (error) {
      console.error("Subscription error:", error)
      toast.error("Failed to process subscription. Please try again.")
    } finally {
      setProcessingPlan(null)
    }
  }

  const planIcons: Record<PlanId, typeof Zap> = {
    basic: Zap,
    pro: Sparkles,
    elite: Crown,
  }

  const planColors: Record<PlanId, { bg: string; border: string; badge: string }> = {
    basic: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      badge: "bg-slate-100 text-slate-700",
    },
    pro: {
      bg: "bg-blue-50/50",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-700",
    },
    elite: {
      bg: "bg-amber-50/50",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-700",
    },
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0" showCloseButton={false}>
        <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/80 text-white p-6 z-10">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    Welcome to Asrock Mobile Services!
                  </DialogTitle>
                  <DialogDescription className="text-white/80 mt-1">
                    Choose a plan to get started with all features
                  </DialogDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                onClick={() => setDismissed(true)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Get started in seconds!
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Select a plan below to unlock inventory management, service tracking, invoicing, and more.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(SUBSCRIPTION_PLANS) as PlanId[]).map((planId) => {
              const plan = SUBSCRIPTION_PLANS[planId]
              const Icon = planIcons[planId]
              const colors = planColors[planId]
              const isProcessing = processingPlan === planId

              return (
                <Card
                  key={planId}
                  className={`relative overflow-hidden transition-all duration-300 ${colors.bg} ${colors.border} ${
                    plan.recommended ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-xs font-bold text-center py-1">
                      RECOMMENDED
                    </div>
                  )}

                  <CardHeader className={`pb-3 ${plan.recommended ? "pt-8" : ""}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1.5 rounded-lg ${colors.badge}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <CardTitle className="text-lg font-bold text-slate-900">{plan.name}</CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900">{formatPrice(plan.price)}</span>
                      <span className="text-sm text-slate-500">/month</span>
                    </div>

                    {/* Key Features */}
                    <ul className="space-y-2">
                      {plan.highlights.slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs">
                          <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-600">{feature}</span>
                        </li>
                      ))}
                      {plan.highlights.length > 5 && (
                        <li className="text-xs text-slate-400">
                          +{plan.highlights.length - 5} more features
                        </li>
                      )}
                    </ul>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleSubscribe(planId)}
                      disabled={!!processingPlan}
                      className={`w-full ${
                        plan.recommended
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Get ${plan.name}`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-slate-500">
              Secure payment processing by Razorpay. Cancel anytime.
            </p>
            <Button
              variant="link"
              className="text-xs text-slate-400 hover:text-slate-600"
              onClick={() => setDismissed(true)}
            >
              Skip for now (limited access)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
