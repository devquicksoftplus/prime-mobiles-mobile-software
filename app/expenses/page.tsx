"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Filter, TrendingDown, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useExpenses } from "@/features/expenses/hooks/use-expenses"
import { useBudget } from "@/features/expenses/hooks/use-budget"
import { BudgetOverview } from "@/features/expenses/components/budget-overview"
import { BudgetDialog } from "@/features/expenses/components/budget-dialog"
import { ExpenseChart } from "@/features/expenses/components/expense-chart"
import { ExpenseList } from "@/features/expenses/components/expense-list"
import { ExpenseFormDialog } from "@/features/expenses/components/expense-form-dialog"
import { getCategoryOptions, formatCurrency } from "@/features/expenses/lib/expense-helpers"
import { Expense, ExpenseCategory } from "@/lib/types"
import { ProtectedRoute } from "@/components/protected-route"
import { PageLayout } from "@/components/page-layout"
import { useSubscription } from "@/hooks/use-subscription"
import { UpgradeAlert } from "@/components/upgrade-alert"

function ExpensesContent() {
  const { canAccessExpenses } = useSubscription()
  const { expenses, isLoading, addExpense, updateExpense, deleteExpense } = useExpenses()
  
  // Check subscription access
  if (!canAccessExpenses()) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <UpgradeAlert feature="Expense Tracker" requiredPlan="pro" />
      </div>
    )
  }
  
  // Month selection state
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })
  
  // Budget hook
  const { budget, saveBudget } = useBudget(selectedMonth)
  
  // Dialog states
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Get month name for display
  const getMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split("-")
    const date = new Date(parseInt(year), parseInt(month) - 1, 1)
    return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
  }

  // Navigate months
  const navigateMonth = (direction: "prev" | "next") => {
    const [year, month] = selectedMonth.split("-").map(Number)
    let newYear = year
    let newMonth = month + (direction === "next" ? 1 : -1)
    
    if (newMonth > 12) {
      newMonth = 1
      newYear++
    } else if (newMonth < 1) {
      newMonth = 12
      newYear--
    }
    
    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, "0")}`)
  }

  // Filter expenses by selected month
  const monthlyExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseMonth = expense.date.substring(0, 7)
      return expenseMonth === selectedMonth
    })
  }, [expenses, selectedMonth])

  // Calculate spent amounts by source for the selected month
  const spentBySource = useMemo(() => {
    const result = {
      shopDrawer: 0,
      personal: 0,
      bank: 0,
      total: 0,
    }
    
    monthlyExpenses.forEach((expense) => {
      result.total += expense.amount
      if (expense.source === "shop_drawer") {
        result.shopDrawer += expense.amount
      } else if (expense.source === "personal_wallet") {
        result.personal += expense.amount
      } else if (expense.source === "bank_account") {
        result.bank += expense.amount
      }
    })
    
    return result
  }, [monthlyExpenses])

  // Apply search and category filters
  const filteredExpenses = useMemo(() => {
    return monthlyExpenses.filter((expense) => {
      const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [monthlyExpenses, searchQuery, categoryFilter])
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage)
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredExpenses.slice(startIndex, endIndex)
  }, [filteredExpenses, currentPage, itemsPerPage])
  
  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, selectedMonth])

  const handleAddExpense = async (data: Omit<Expense, "id" | "createdAt" | "createdBy">) => {
    await addExpense(data)
  }

  const handleEditExpense = async (data: Omit<Expense, "id" | "createdAt" | "createdBy">) => {
    if (editingExpense?.id) {
      await updateExpense(editingExpense.id, data)
    }
  }

  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setIsExpenseDialogOpen(true)
  }

  const handleCloseExpenseDialog = (open: boolean) => {
    setIsExpenseDialogOpen(open)
    if (!open) {
      setEditingExpense(null)
    }
  }

  // Check if current month
  const isCurrentMonth = useMemo(() => {
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    return selectedMonth === currentMonth
  }, [selectedMonth])

  return (
    <div className="flex-1 space-y-8 pb-8 bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <TrendingDown className="h-6 w-6 text-slate-700" />
            Financial Overview
          </h1>
          <p className="text-slate-500 mt-1 text-sm max-w-2xl">
            Monitor expenditure, track budget utilization, and analyze spending patterns across your accounts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center bg-white rounded-md border border-slate-300 shadow-sm overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth("prev")}
              className="h-9 w-9 hover:bg-slate-100 text-slate-600 rounded-none border-r border-slate-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2 px-4 min-w-[140px] justify-center h-9 bg-slate-50/50">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="font-semibold text-sm text-slate-900">{getMonthName(selectedMonth)}</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth("next")}
              className="h-9 w-9 hover:bg-slate-100 text-slate-600 rounded-none border-l border-slate-200"
              disabled={isCurrentMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button 
            onClick={() => setIsExpenseDialogOpen(true)} 
            className="w-full sm:w-auto gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </div>

      <div className="px-6 lg:px-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column: Budget & Stats (2/3 width) */}
          <div className="xl:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Budget Analytics</h2>
                {budget && (
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    Cycle: Monthly
                  </span>
                )}
              </div>
              <BudgetOverview
                budget={budget}
                spentShopDrawer={spentBySource.shopDrawer}
                spentPersonal={spentBySource.personal}
                spentBank={spentBySource.bank}
                totalSpent={spentBySource.total}
                onEditBudget={() => setIsBudgetDialogOpen(true)}
              />
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Transaction History</h2>
              </div>
              
              <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="bg-white border-b border-slate-100 py-4 px-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative flex-1 w-full max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-all h-9 text-sm"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-white border-slate-200 h-9 text-sm">
                        <Filter className="h-3.5 w-3.5 mr-2 text-slate-500" />
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {getCategoryOptions().map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ExpenseList
                    expenses={paginatedExpenses}
                    onEdit={handleOpenEdit}
                    onDelete={deleteExpense}
                    isLoading={isLoading}
                  />
                  
                  {/* Pagination Controls */}
                  {filteredExpenses.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
                      <div className="text-sm text-slate-600">
                        Showing <span className="font-medium text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                        <span className="font-medium text-slate-900">
                          {Math.min(currentPage * itemsPerPage, filteredExpenses.length)}
                        </span>{" "}
                        of <span className="font-medium text-slate-900">{filteredExpenses.length}</span> results
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="h-8 text-sm border-slate-300 hover:bg-slate-100"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first page, last page, current page, and pages around current
                            const showPage = 
                              page === 1 || 
                              page === totalPages || 
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            
                            const showEllipsis = 
                              (page === currentPage - 2 && currentPage > 3) ||
                              (page === currentPage + 2 && currentPage < totalPages - 2)
                            
                            if (showEllipsis) {
                              return <span key={page} className="px-2 text-slate-400">...</span>
                            }
                            
                            if (!showPage) return null
                            
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`h-8 w-8 p-0 text-sm ${
                                  currentPage === page
                                    ? "bg-slate-900 text-white hover:bg-slate-800"
                                    : "border-slate-300 hover:bg-slate-100"
                                }`}
                              >
                                {page}
                              </Button>
                            )
                          })}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="h-8 text-sm border-slate-300 hover:bg-slate-100"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Right Column: Analytics & Quick Stats (1/3 width) */}
          <div className="space-y-8">
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">Distribution</h2>
              </div>
              <ExpenseChart 
                expenses={monthlyExpenses} 
                title={`Category Breakdown`}
              />
            </section>
            
            <section>
               <Card className="h-full border border-slate-200 shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-lg font-bold text-slate-900">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Debit</p>
                      <p className="text-xl font-bold text-slate-900">
                        {formatCurrency(spentBySource.total)}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Available Funds</p>
                      {budget ? (
                        <p className={`text-xl font-bold ${(budget.totalBudget - spentBySource.total) < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {formatCurrency(Math.max(0, budget.totalBudget - spentBySource.total))}
                        </p>
                      ) : (
                         <span className="text-slate-400 text-lg font-medium">—</span>
                      )}
                    </div>
                  </div>

                  {/* Top Categories List - Tabular Style */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Highest Spending</p>
                    <div className="space-y-0 text-sm border rounded-lg border-slate-100 overflow-hidden">
                      {Object.entries(
                        monthlyExpenses.reduce((acc, exp) => {
                          acc[exp.category] = (acc[exp.category] || 0) + exp.amount
                          return acc
                        }, {} as Record<string, number>)
                      )
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 4)
                        .map(([category, amount], index) => (
                          <div key={category} className="flex items-center justify-between p-3 bg-white border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                            <div className="flex items-center gap-3">
                              <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-500">
                                {index + 1}
                              </span>
                              <span className="text-slate-700 font-medium">{category}</span>
                            </div>
                            <span className="font-semibold text-slate-900tabular-nums">{formatCurrency(amount)}</span>
                          </div>
                        ))}
                      {monthlyExpenses.length === 0 && (
                        <div className="p-4 text-center text-slate-400 text-sm bg-slate-50/50">
                          No expense data available for this period.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>

      {/* Add/Edit Expense Dialog */}
      <ExpenseFormDialog
        open={isExpenseDialogOpen}
        onOpenChange={handleCloseExpenseDialog}
        expense={editingExpense}
        onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
      />

      {/* Budget Dialog */}
      <BudgetDialog
        open={isBudgetDialogOpen}
        onOpenChange={setIsBudgetDialogOpen}
        budget={budget}
        selectedMonth={selectedMonth}
        onSave={saveBudget}
      />
    </div>
  )
}

export default function ExpensesPage() {
  return (
    <ProtectedRoute>
      <PageLayout>
        <ExpensesContent />
      </PageLayout>
    </ProtectedRoute>
  )
}
