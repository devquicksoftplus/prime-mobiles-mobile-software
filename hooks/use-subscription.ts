"use client"

import { useAuth } from "@/contexts/auth-context"
import { 
  SUBSCRIPTION_PLANS, 
  PlanId, 
  SubscriptionPlan,
  hasFeature as checkHasFeature,
  getFeatureLimit
} from "@/lib/subscription-config"

export function useSubscription() {
  const { user } = useAuth()

  const planId = user?.subscription?.planId || null
  const subscription = user?.subscription || null
  const isActive = subscription?.status === "active" || subscription?.status === "trial"

  const currentPlan: SubscriptionPlan | null = planId 
    ? SUBSCRIPTION_PLANS[planId] 
    : null

  const hasFeature = (feature: keyof SubscriptionPlan["features"]): boolean => {
    if (!isActive || !planId) return false
    return checkHasFeature(planId, feature)
  }

  const getLimit = (feature: "maxThemes" | "maxJobImages" | "maxTemplates"): number => {
    if (!isActive || !planId) return 0
    return getFeatureLimit(planId, feature)
  }

  const canAccessExpenses = (): boolean => {
    return hasFeature("expenseTracker")
  }

  const canUploadJobImages = (): boolean => {
    return getLimit("maxJobImages") > 0
  }

  const getMaxJobImages = (): number => {
    return getLimit("maxJobImages")
  }

  const getMaxThemes = (): number => {
    return getLimit("maxThemes")
  }

  const getMaxTemplates = (): number => {
    return getLimit("maxTemplates")
  }

  const isSubscribed = (): boolean => {
    return isActive && !!planId
  }

  const needsSubscription = (): boolean => {
    return !isActive || !planId
  }

  return {
    planId,
    currentPlan,
    subscription,
    isActive,
    hasFeature,
    getLimit,
    canAccessExpenses,
    canUploadJobImages,
    getMaxJobImages,
    getMaxThemes,
    getMaxTemplates,
    isSubscribed,
    needsSubscription,
    allPlans: SUBSCRIPTION_PLANS,
  }
}
