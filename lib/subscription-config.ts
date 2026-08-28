// Subscription Plan Configuration

export type PlanId = "basic" | "pro" | "elite"

export interface SubscriptionPlan {
  id: PlanId
  name: string
  price: number
  currency: string
  period: "monthly"
  features: {
    inventory: boolean
    productListing: boolean
    companyPage: boolean
    profile: boolean
    dashboard: boolean
    expenseTracker: boolean
    maxThemes: number
    maxJobImages: number
    maxTemplates: number
  }
  highlights: string[]
  recommended?: boolean
}

export const SUBSCRIPTION_PLANS: Record<PlanId, SubscriptionPlan> = {
  basic: {
    id: "basic",
    name: "Basic",
    price: 400,
    currency: "INR",
    period: "monthly",
    features: {
      inventory: true,
      productListing: true,
      companyPage: true,
      profile: true,
      dashboard: true,
      expenseTracker: false,
      maxThemes: 5,
      maxJobImages: 0,
      maxTemplates: 1,
    },
    highlights: [
      "Inventory Management",
      "Product Listing",
      "Company Page",
      "Profile Management",
      "Dashboard Access",
      "5 Themes",
      "Default Invoice Template",
      "No Image Uploads",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 700,
    currency: "INR",
    period: "monthly",
    features: {
      inventory: true,
      productListing: true,
      companyPage: true,
      profile: true,
      dashboard: true,
      expenseTracker: true,
      maxThemes: 10,
      maxJobImages: 2,
      maxTemplates: 5,
    },
    highlights: [
      "Everything in Basic",
      "Expense Tracker",
      "10 Themes",
      "5 Invoice Templates",
      "2 Images per Job Card",
      "Priority Support",
    ],
    recommended: true,
  },
  elite: {
    id: "elite",
    name: "Elite",
    price: 999,
    currency: "INR",
    period: "monthly",
    features: {
      inventory: true,
      productListing: true,
      companyPage: true,
      profile: true,
      dashboard: true,
      expenseTracker: true,
      maxThemes: 20,
      maxJobImages: 4,
      maxTemplates: 10,
    },
    highlights: [
      "Everything in Pro",
      "20 Premium Themes",
      "10 Invoice Templates",
      "4 Images per Job Card",
      "Advanced Analytics",
      "White-label Options",
      "Dedicated Support",
    ],
  },
}

export function getPlan(planId: PlanId | undefined): SubscriptionPlan | null {
  if (!planId) return null
  return SUBSCRIPTION_PLANS[planId] || null
}

export function hasFeature(
  planId: PlanId | undefined,
  feature: keyof SubscriptionPlan["features"]
): boolean {
  const plan = getPlan(planId)
  if (!plan) return false
  return !!plan.features[feature]
}

export function getFeatureLimit(
  planId: PlanId | undefined,
  feature: "maxThemes" | "maxJobImages" | "maxTemplates"
): number {
  const plan = getPlan(planId)
  if (!plan) return 0
  return plan.features[feature]
}

export function formatPrice(price: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}
