"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, Wallet, CreditCard, Building2 } from "lucide-react"
import { formatCurrency } from "../lib/expense-helpers"

interface ExpenseStatsProps {
  totalThisMonth: number
  totalShopDrawer: number
  totalPersonal: number
  totalBank: number
}

export function ExpenseStats({
  totalThisMonth,
  totalShopDrawer,
  totalPersonal,
  totalBank,
}: ExpenseStatsProps) {
  const stats = [
    {
      title: "Total This Month",
      value: formatCurrency(totalThisMonth),
      icon: TrendingDown,
      description: "All expenses combined",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Shop Drawer",
      value: formatCurrency(totalShopDrawer),
      icon: Wallet,
      description: "From daily sales",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Personal",
      value: formatCurrency(totalPersonal),
      icon: CreditCard,
      description: "From your pocket",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
    {
      title: "Bank Account",
      value: formatCurrency(totalBank),
      icon: Building2,
      description: "Direct transfers",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
