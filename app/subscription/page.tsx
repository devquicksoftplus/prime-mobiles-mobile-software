"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Crown, Sparkles, Zap, Loader2, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/hooks/use-subscription"
import { SUBSCRIPTION_PLANS, PlanId, formatPrice } from "@/lib/subscription-config"
import { ProtectedRoute } from "@/components/protected-route"
import { PageLayout } from "@/components/page-layout"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"

function SubscriptionContent() {
  const router = useRouter()
  const { user } = useAuth()
  const { planId: currentPlanId, isActive } = useSubscription()
  const [processingPlan, setProcessingPlan] = useState<PlanId | null>(null)
  const [trialPlan, setTrialPlan] = useState<PlanId | null>(null)

  // Check if user is new (no subscription history)
  const isNewUser = !user?.subscription

  const handleSubscribe = async (planId: PlanId) => {
    if (!user) return

    setProcessingPlan(planId)

    try {
      const plan = SUBSCRIPTION_PLANS[planId]

      // 1. Create order on the server
      const apiUrl = `${window.location.origin}/api/razorpay/order`;
      console.log(`Creating Razorpay order at ${apiUrl}...`);
      let response;
      try {
        response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: plan.price, planId }),
        })
      } catch (fetchErr: any) {
        console.error("Fetch call failed:", fetchErr);
        toast.error(`Network error: ${fetchErr.message}. Are you on http://localhost:3001?`);
        throw fetchErr;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Order creation failed:", response.status, errorData);
        throw new Error(`Server error: ${response.status} ${JSON.stringify(errorData)}`)
      }

      const order = await response.json()
      console.log("Order created:", order);

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
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        toast.error("Razorpay Key is missing in configuration. Please check your .env file and restart the server.");
        return;
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
            // 4. Verify payment on the server
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

              toast.success(`Successfully subscribed to ${plan.name} plan!`)

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

  const handleActivateTrial = async (planId: PlanId) => {
    if (!user) return

    setTrialPlan(planId)

    try {
      const plan = SUBSCRIPTION_PLANS[planId]
      // Calculate trial dates (1 month free)
      const startDate = new Date().toISOString()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1)

      // Set trial subscription with selected plan
      await setDoc(
        doc(db, "users", user.uid),
        {
          subscription: {
            planId,
            status: "trial",
            startDate,
            endDate: endDate.toISOString(),
            trialUsed: true,
            paymentId: null,
            orderId: null,
          },
        },
        { merge: true }
      )

      toast.success(`🎉 Free trial activated for ${plan.name} plan!`, {
        description: "Enjoy 1 month free. After trial ends, you'll be charged " + formatPrice(plan.price) + "/month."
      })

      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Trial activation error:", error)
      toast.error("Failed to activate trial. Please try again.")
    } finally {
      setTrialPlan(null)
    }
  }

  const planIcons: Record<PlanId, typeof Zap> = {
    basic: Zap,
    pro: Sparkles,
    elite: Crown,
  }

  const planColors: Record<PlanId, { bg: string; border: string; badge: string }> = {
    basic: {
      bg: "bg-background",
      border: "border-border",
      badge: "bg-muted text-muted-foreground",
    },
    pro: {
      bg: "bg-primary/5",
      border: "border-primary/20",
      badge: "bg-primary/10 text-primary",
    },
    elite: {
      bg: "bg-accent/5",
      border: "border-accent/20",
      badge: "bg-accent/10 text-accent",
    },
  }

  return (
    <div className="flex-1 pb-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
          <Crown className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {isNewUser ? "Welcome! Choose Your Plan" : "Manage Subscription"}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {isNewUser ? "Start with 1 Month Free Trial" : "Simple, Transparent Pricing"}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isNewUser 
            ? "Choose your plan and get 1 month free. After trial, you'll be charged automatically."
            : "Select the plan that fits your business needs. Upgrade or downgrade anytime."
          }
        </p>
        {isNewUser && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
            <Gift className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">
              1 Month Free Trial on Any Plan • No Card Required
            </span>
          </div>
        )}
      </div>

      {/* Current Plan Badge */}
      {isActive && currentPlanId && (
        <div className="flex justify-center mb-8">
          <Badge variant="outline" className="text-sm py-2 px-4 bg-accent/10 border-accent/20 text-accent">
            <Check className="w-4 h-4 mr-2" />
            Current Plan: {SUBSCRIPTION_PLANS[currentPlanId].name}
          </Badge>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {(Object.keys(SUBSCRIPTION_PLANS) as PlanId[]).map((planId) => {
          const plan = SUBSCRIPTION_PLANS[planId]
          const Icon = planIcons[planId]
          const colors = planColors[planId]
          const isCurrentPlan = currentPlanId === planId && isActive
          const isProcessing = processingPlan === planId

          return (
            <Card
              key={planId}
              className={`relative overflow-hidden transition-all duration-300 ${colors.bg} ${colors.border} ${plan.recommended ? "ring-2 ring-primary shadow-lg scale-105" : "hover:shadow-md"
                }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-xs font-bold text-center py-1">
                  MOST POPULAR
                </div>
              )}

              <CardHeader className={plan.recommended ? "pt-8" : ""}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${colors.badge}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{plan.name}</CardTitle>
                </div>
                <CardDescription className="text-slate-600">
                  Perfect for {planId === "basic" ? "getting started" : planId === "pro" ? "growing businesses" : "enterprises"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{formatPrice(plan.price)}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.highlights.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {/* Free Trial Button - Only for new users */}
                  {isNewUser && (
                    <Button
                      onClick={() => handleActivateTrial(planId)}
                      disabled={!!trialPlan || !!processingPlan}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      {trialPlan === planId ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Activating...
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4 mr-2" />
                          Start Free Trial
                        </>
                      )}
                    </Button>
                  )}
                  
                  {/* Subscribe Button */}
                  <Button
                    onClick={() => handleSubscribe(planId)}
                    disabled={isCurrentPlan || !!processingPlan || !!trialPlan}
                    variant={isNewUser ? "outline" : "default"}
                    className={`w-full ${isCurrentPlan
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : isNewUser
                        ? "border-border text-foreground hover:bg-muted"
                        : plan.recommended
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                      }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : isNewUser ? (
                      `Pay ${formatPrice(plan.price)}/month Now`
                    ) : (
                      `Subscribe to ${plan.name}`
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Features Comparison Note */}
      <div className="mt-12 text-center">
        <p className="text-sm text-slate-500">
          All plans include: Inventory Management, Product Listing, Company Page, Profile, and Dashboard.
        </p>
        <p className="text-xs text-slate-400 mt-2">
          {isNewUser 
            ? "Free trial for 1 month. After trial, auto-payment starts. Yearly renewal thereafter."
            : "Secure payment processing by Razorpay."
          }
        </p>
      </div>
    </div>
  )
}

export default function SubscriptionPage() {
  return (
    <ProtectedRoute>
      <PageLayout>
        <SubscriptionContent />
      </PageLayout>
    </ProtectedRoute>
  )
}
