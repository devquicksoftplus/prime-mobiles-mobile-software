"use client"

import Link from "next/link"
import { Crown, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface UpgradeAlertProps {
  feature: string
  requiredPlan?: "pro" | "elite"
  className?: string
}

export function UpgradeAlert({ 
  feature, 
  requiredPlan = "pro",
  className = "" 
}: UpgradeAlertProps) {
  return (
    <Card className={`border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 ${className}`}>
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center text-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Lock className="w-10 h-10 text-amber-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="max-w-md space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">
              Upgrade to Unlock {feature}
            </h3>
            <p className="text-slate-600">
              This feature is available on the <span className="font-semibold text-amber-700 capitalize">{requiredPlan}</span> plan and above. 
              Upgrade now to access {feature.toLowerCase()} and boost your productivity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/subscription">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-200">
                <Crown className="w-4 h-4 mr-2" />
                View Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-slate-300">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <p className="text-xs text-slate-500">
            Start with the {requiredPlan === "pro" ? "Pro plan at ₹700/month" : "Elite plan at ₹999/month"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
