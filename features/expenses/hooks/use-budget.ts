"use client"

import { useState, useEffect, useCallback } from "react"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { MonthlyBudget } from "@/lib/types"

export function useBudget(selectedMonth: string) {
  const { user } = useAuth()
  const [budget, setBudget] = useState<MonthlyBudget | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Format: "YYYY-MM"
  const getMonthKey = useCallback((month: string) => {
    return month.substring(0, 7) // "2026-01"
  }, [])

  // Fetch budget for selected month with real-time updates
  useEffect(() => {
    if (!user?.uid || !selectedMonth) {
      setBudget(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const monthKey = getMonthKey(selectedMonth)
    const budgetRef = doc(db, "users", user.uid, "budgets", monthKey)

    const unsubscribe = onSnapshot(
      budgetRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setBudget({ id: snapshot.id, ...snapshot.data() } as MonthlyBudget)
        } else {
          setBudget(null)
        }
        setIsLoading(false)
      },
      (err) => {
        console.error("Error fetching budget:", err)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user?.uid, selectedMonth, getMonthKey])

  // Save or update budget
  const saveBudget = async (budgetData: {
    shopDrawerBudget: number
    personalBudget: number
    bankBudget: number
  }) => {
    if (!user?.uid) throw new Error("Not authenticated")

    const monthKey = getMonthKey(selectedMonth)
    const budgetRef = doc(db, "users", user.uid, "budgets", monthKey)
    
    const totalBudget = budgetData.shopDrawerBudget + budgetData.personalBudget + budgetData.bankBudget

    const budgetDoc: Omit<MonthlyBudget, "id"> = {
      month: monthKey,
      shopDrawerBudget: budgetData.shopDrawerBudget,
      personalBudget: budgetData.personalBudget,
      bankBudget: budgetData.bankBudget,
      totalBudget,
      createdBy: user.uid,
      createdAt: budget?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await setDoc(budgetRef, budgetDoc)
  }

  return {
    budget,
    isLoading,
    saveBudget,
  }
}
