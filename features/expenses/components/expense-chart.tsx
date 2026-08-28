"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import { Expense, ExpenseCategory } from "@/lib/types"
import { EXPENSE_CATEGORIES, formatCurrency } from "../lib/expense-helpers"

interface ExpenseChartProps {
  expenses: Expense[]
  title?: string
}

// Professional Muted Palette
const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Rent: "#475569", // Slate-600
  Salary: "#334155", // Slate-700
  Inventory: "#0f766e", // Teal-700
  Electricity: "#d97706", // Amber-600
  "Tea/Snacks": "#c026d3", // Fuchsia-600
  Maintenance: "#be123c", // Rose-700
  Equipment: "#4338ca", // Indigo-700
  Marketing: "#0369a1", // Sky-700
  Transport: "#15803d", // Green-700
  Other: "#64748b", // Slate-500
}

export function ExpenseChart({ expenses, title = "Spending by Category" }: ExpenseChartProps) {
  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {}
    
    expenses.forEach((expense) => {
      const cat = expense.category
      categoryTotals[cat] = (categoryTotals[cat] || 0) + expense.amount
    })

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name as ExpenseCategory] || "#94a3b8",
        icon: EXPENSE_CATEGORIES[name as ExpenseCategory]?.icon || "📝",
      }))
      .sort((a, b) => b.value - a.value)
  }, [expenses])

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0)
  }, [expenses])

  if (expenses.length === 0) {
    return (
      <Card className="h-full border border-slate-200 shadow-sm bg-slate-50/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">{title}</CardTitle>
          <CardDescription>No expense data</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[350px]">
          <div className="text-center text-slate-400">
            <div className="text-4xl mb-3 opacity-20 grayscale">📊</div>
            <p className="font-medium text-sm">No expenses recorded yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full border border-slate-200 shadow-sm overflow-hidden bg-white">
      <CardHeader className="pb-2 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">{title}</CardTitle>
            <CardDescription className="font-medium text-slate-500 mt-1">
              Total: <span className="text-slate-900 font-bold">{formatCurrency(totalSpent)}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-6 pt-6">
        <div className="h-[300px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    const percentage = ((data.value / totalSpent) * 100).toFixed(1)
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded shadow-xl border border-slate-800 text-sm">
                        <p className="font-medium mb-1 flex items-center gap-2">
                          <span className="opacity-70">{data.icon}</span> {data.name}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="font-bold">{formatCurrency(data.value)}</p>
                          <p className="text-xs text-slate-400">({percentage}%)</p>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-slate-900">{chartData.length}</span>
            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Categories</span>
          </div>
        </div>

        {/* Professional Legend */}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm py-1 border-b border-slate-50 last:border-0">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate flex-1 font-medium text-slate-700">
                {item.name}
              </span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Bar Chart variant for daily/weekly view
export function ExpenseBarChart({ expenses }: { expenses: Expense[] }) {
  const chartData = useMemo(() => {
    const dailyTotals: Record<string, number> = {}
    
    expenses.forEach((expense) => {
      const date = expense.date
      dailyTotals[date] = (dailyTotals[date] || 0) + expense.amount
    })

    return Object.entries(dailyTotals)
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        amount,
      }))
      .slice(-7) // Last 7 days
  }, [expenses])

  if (chartData.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Daily Spending</CardTitle>
        <CardDescription>Last 7 days of expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="date" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border">
                        <p className="font-semibold">{payload[0].payload.date}</p>
                        <p className="text-red-600 font-bold">
                          {formatCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
