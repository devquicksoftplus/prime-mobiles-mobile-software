"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Wallet, CreditCard, Building2, Settings2, TrendingDown, AlertTriangle } from "lucide-react"
import { MonthlyBudget } from "@/lib/types"
import { formatCurrency } from "../lib/expense-helpers"

interface BudgetOverviewProps {
  budget: MonthlyBudget | null
  spentShopDrawer: number
  spentPersonal: number
  spentBank: number
  totalSpent: number
  onEditBudget: () => void
}

export function BudgetOverview({
  budget,
  spentShopDrawer,
  spentPersonal,
  spentBank,
  totalSpent,
  onEditBudget,
}: BudgetOverviewProps) {
  const getPercentage = (spent: number, total: number) => {
    if (total === 0) return 0
    return Math.min((spent / total) * 100, 100)
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-amber-600"
    return "text-emerald-600"
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 70) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const budgetItems = [
    {
      label: "Shop Drawer",
      icon: Wallet,
      budget: budget?.shopDrawerBudget || 0,
      spent: spentShopDrawer,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Personal",
      icon: CreditCard,
      budget: budget?.personalBudget || 0,
      spent: spentPersonal,
      color: "text-violet-600",
      bgColor: "bg-violet-500/10",
      iconBg: "bg-violet-100",
    },
    {
      label: "Bank Account",
      icon: Building2,
      budget: budget?.bankBudget || 0,
      spent: spentBank,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      iconBg: "bg-blue-100",
    },
  ]

  const totalBudget = budget?.totalBudget || 0
  const remaining = totalBudget - totalSpent
  const overallPercentage = getPercentage(totalSpent, totalBudget)

  // If no budget is set
  if (!budget) {
    return (
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="p-3 rounded-full bg-slate-100 text-slate-600">
              <Wallet className="h-6 w-6" />
            </div>
            <div className="max-w-md">
              <h3 className="text-lg font-semibold text-slate-900">Monthly Budget Setup</h3>
              <p className="text-sm text-slate-500 mt-1">
                Define your financial limits for Shop, Personal, and Bank accounts to enable tracking.
              </p>
            </div>
            <Button onClick={onEditBudget} variant="outline" className="mt-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
              <Settings2 className="mr-2 h-4 w-4" />
              Configure Budget
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Total Overview Card - Enterprise/Clean Look */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">Total Budget</p>
                <div className="flex items-baseline gap-3 mt-1">
                  <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                    {formatCurrency(totalBudget)}
                  </h2>
                  <span className={`text-sm font-medium px-2 py-0.5 rounded border ${
                    remaining < 0 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {remaining < 0 ? 'Over Limit' : 'On Track'}
                  </span>
                </div>
              </div>

              {/* Main Progress Bar */}
              <div className="space-y-2 max-w-2xl">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700">Utilization</span>
                  <span className="text-slate-900">{overallPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      remaining < 0 ? 'bg-red-600' : overallPercentage > 85 ? 'bg-amber-500' : 'bg-slate-900'
                    }`}
                    style={{ width: `${Math.min(overallPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-8 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8 min-w-[200px]">
              <div>
                <p className="text-slate-500 text-xs uppercase font-semibold tracking-wider mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalSpent)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase font-semibold tracking-wider mb-1">Remaining</p>
                <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {remaining < 0 ? '-' : ''}{formatCurrency(Math.abs(remaining))}
                </p>
                <div className="mt-2">
                   <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onEditBudget}
                    className="h-auto p-0 text-slate-400 hover:text-slate-900 font-normal text-xs flex items-center gap-1"
                  >
                    <Settings2 className="h-3 w-3" />
                    Edit Limits
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Source Cards - Clean Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {budgetItems.map((item) => {
          const percentage = getPercentage(item.spent, item.budget)
          const remaining = item.budget - item.spent
          const isOver = remaining < 0

          return (
            <div key={item.label} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-50 rounded-md text-slate-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{item.label}</h4>
                  <p className="text-xs text-slate-500">Cap: {formatCurrency(item.budget)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold text-slate-900">{formatCurrency(item.spent)}</span>
                  <span className={`text-sm font-medium ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                    {isOver ? '-' : ''}{formatCurrency(Math.abs(remaining))} left
                  </span>
                </div>

                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-red-600' : percentage > 85 ? 'bg-amber-500' : 'bg-slate-600'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
