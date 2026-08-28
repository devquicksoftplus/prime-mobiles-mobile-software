"use client"

import { useAuth } from "@/contexts/auth-context"
import { BasicDashboard } from "./basic-dashboard"
import { ProDashboard } from "./pro-dashboard"

interface DashboardSwitcherProps {
  // The Elite dashboard content is passed as children (the original dashboard)
  children: React.ReactNode
}

export function DashboardSwitcher({ children }: DashboardSwitcherProps) {
  const { user } = useAuth()
  
  // Get the user's subscription plan
  const plan = user?.subscription?.planId || null
  const subscriptionStatus = user?.subscription?.status
  
  // Check if subscription is active or trial
  const isActive = subscriptionStatus === 'active' || subscriptionStatus === 'trial'
  
  // If no active subscription, show basic (most restricted)
  if (!isActive) {
    return <BasicDashboard />
  }
  
  // Route to appropriate dashboard based on plan
  switch (plan) {
    case 'elite':
      // Elite users get the full dashboard (passed as children)
      return <>{children}</>
    case 'pro':
      return <ProDashboard />
    case 'basic':
    default:
      return <BasicDashboard />
  }
}
