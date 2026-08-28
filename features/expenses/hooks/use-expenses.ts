"use client"

import { useState, useEffect, useCallback } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { Expense, ExpenseCategory, ExpenseSource } from "@/lib/types"

interface ExpenseFilters {
  startDate?: string
  endDate?: string
  category?: ExpenseCategory
  source?: ExpenseSource
}

interface ExpenseStats {
  totalThisMonth: number
  totalShopDrawer: number
  totalPersonal: number
  totalBank: number
  categoryBreakdown: Record<string, number>
}

export function useExpenses() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get current month's date range
  const getCurrentMonthRange = useCallback(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return {
      startDate: startOfMonth.toISOString().split("T")[0],
      endDate: endOfMonth.toISOString().split("T")[0],
    }
  }, [])

  // Calculate stats from expenses
  const calculateStats = useCallback((expenseList: Expense[]): ExpenseStats => {
    const { startDate, endDate } = getCurrentMonthRange()
    
    const thisMonthExpenses = expenseList.filter(e => {
      const expenseDate = e.date
      return expenseDate >= startDate && expenseDate <= endDate
    })

    const stats: ExpenseStats = {
      totalThisMonth: 0,
      totalShopDrawer: 0,
      totalPersonal: 0,
      totalBank: 0,
      categoryBreakdown: {},
    }

    thisMonthExpenses.forEach(expense => {
      stats.totalThisMonth += expense.amount

      // Track by source
      if (expense.source === "shop_drawer") {
        stats.totalShopDrawer += expense.amount
      } else if (expense.source === "personal_wallet") {
        stats.totalPersonal += expense.amount
      } else if (expense.source === "bank_account") {
        stats.totalBank += expense.amount
      }

      // Track by category
      const cat = expense.category
      stats.categoryBreakdown[cat] = (stats.categoryBreakdown[cat] || 0) + expense.amount
    })

    return stats
  }, [getCurrentMonthRange])

  // Fetch expenses with real-time updates
  useEffect(() => {
    if (!user?.uid) {
      setExpenses([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const expensesRef = collection(db, "users", user.uid, "expenses")
    const q = query(expensesRef, orderBy("date", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const expenseData: Expense[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Expense[]
        setExpenses(expenseData)
        setIsLoading(false)
      },
      (err) => {
        console.error("Error fetching expenses:", err)
        setError("Failed to load expenses")
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user?.uid])

  // Add new expense
  const addExpense = async (expense: Omit<Expense, "id" | "createdAt" | "createdBy">) => {
    if (!user?.uid) throw new Error("Not authenticated")

    const expensesRef = collection(db, "users", user.uid, "expenses")
    const newExpense = {
      ...expense,
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
    }

    const docRef = await addDoc(expensesRef, newExpense)
    return docRef.id
  }

  // Update expense
  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    if (!user?.uid) throw new Error("Not authenticated")

    const expenseRef = doc(db, "users", user.uid, "expenses", id)
    await updateDoc(expenseRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  }

  // Delete expense
  const deleteExpense = async (id: string) => {
    if (!user?.uid) throw new Error("Not authenticated")

    const expenseRef = doc(db, "users", user.uid, "expenses", id)
    await deleteDoc(expenseRef)
  }

  // Filter expenses
  const getFilteredExpenses = useCallback((filters: ExpenseFilters) => {
    return expenses.filter(expense => {
      if (filters.startDate && expense.date < filters.startDate) return false
      if (filters.endDate && expense.date > filters.endDate) return false
      if (filters.category && expense.category !== filters.category) return false
      if (filters.source && expense.source !== filters.source) return false
      return true
    })
  }, [expenses])

  return {
    expenses,
    isLoading,
    error,
    stats: calculateStats(expenses),
    addExpense,
    updateExpense,
    deleteExpense,
    getFilteredExpenses,
  }
}
