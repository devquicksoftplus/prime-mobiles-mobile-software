"use client"

import { useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { firebaseService, COLLECTIONS } from "@/lib/firebase-service"
import type { Customer, Device, JobCard, Invoice } from "@/lib/db-schemas"

interface InventoryItem {
  partName: string
  category: string
  quantity: number
  unitPrice: number
  supplier?: string
  reorderLevel: number
}

export function useFirestore() {
  const { user } = useAuth()

  const checkAuth = useCallback(() => {
    if (!user?.uid) {
      throw new Error("User not authenticated")
    }
    return user.uid
  }, [user?.uid])

  // Customers
  const createCustomer = useCallback(
    async (data: Omit<Customer, "id" | "createdAt">) => {
      const userId = checkAuth()
      return firebaseService.create(userId, COLLECTIONS.CUSTOMERS, data)
    },
    [checkAuth]
  )

  const getCustomers = useCallback(async () => {
    const userId = checkAuth()
    return firebaseService.getAll<Customer>(userId, COLLECTIONS.CUSTOMERS)
  }, [checkAuth])

  // Devices
  const createDevice = useCallback(
    async (data: Omit<Device, "id" | "createdAt">) => {
      const userId = checkAuth()
      return firebaseService.create(userId, COLLECTIONS.DEVICES, data)
    },
    [checkAuth]
  )

  const getDevices = useCallback(async () => {
    const userId = checkAuth()
    return firebaseService.getAll<Device>(userId, COLLECTIONS.DEVICES)
  }, [checkAuth])

  // Job Cards
  const createJobCard = useCallback(
    async (data: Omit<JobCard, "id" | "createdAt" | "updatedAt" | "status">) => {
      const userId = checkAuth()
      return firebaseService.create(userId, COLLECTIONS.JOB_CARDS, {
        ...data,
        status: "pending",
      })
    },
    [checkAuth]
  )

  const getJobCards = useCallback(async () => {
    const userId = checkAuth()
    return firebaseService.getAll<JobCard>(userId, COLLECTIONS.JOB_CARDS)
  }, [checkAuth])

  // Tiered Dashboard Optimizations
  const getActiveJobCards = useCallback(async () => {
    const userId = checkAuth()
    return firebaseService.getActiveJobs<JobCard>(userId, COLLECTIONS.JOB_CARDS)
  }, [checkAuth])

  const getMonthlyJobCards = useCallback(async () => {
    const userId = checkAuth()
    return firebaseService.getMonthlyJobs<JobCard>(userId, COLLECTIONS.JOB_CARDS)
  }, [checkAuth])

  const updateJobCard = useCallback(
    async (id: string, data: Partial<JobCard>) => {
      const userId = checkAuth()
      return firebaseService.update(userId, COLLECTIONS.JOB_CARDS, id, data)
    },
    [checkAuth]
  )

  const deleteJobCard = useCallback(
    async (id: string) => {
      const userId = checkAuth()
      return firebaseService.delete(userId, COLLECTIONS.JOB_CARDS, id)
    },
    [checkAuth]
  )

  // Invoices
  const createInvoice = useCallback(
    async (data: Omit<Invoice, "id">) => {
      const userId = checkAuth()
      return firebaseService.create(userId, COLLECTIONS.INVOICES, data)
    },
    [checkAuth]
  )

  const getInvoices = useCallback(async () => {
    const userId = checkAuth()
    return firebaseService.getAll<Invoice>(userId, COLLECTIONS.INVOICES, "invoiceDate")
  }, [checkAuth])

  const updateInvoice = useCallback(
    async (id: string, data: Partial<Invoice>) => {
      const userId = checkAuth()
      return firebaseService.update(userId, COLLECTIONS.INVOICES, id, data)
    },
    [checkAuth]
  )

  // Inventory
  const createInventoryItem = useCallback(
    async (data: InventoryItem) => {
      const userId = checkAuth()
      return firebaseService.create(userId, COLLECTIONS.INVENTORY, data)
    },
    [checkAuth]
  )

  const getInventory = useCallback(async () => {
    const userId = checkAuth()
    return firebaseService.getAll<InventoryItem>(userId, COLLECTIONS.INVENTORY)
  }, [checkAuth])

  const updateInventoryItem = useCallback(
    async (id: string, data: Partial<InventoryItem>) => {
      const userId = checkAuth()
      return firebaseService.update(userId, COLLECTIONS.INVENTORY, id, data)
    },
    [checkAuth]
  )

  return {
    // Auth state
    isAuthenticated: !!user?.uid,
    userId: user?.uid,

    // Customers
    createCustomer,
    getCustomers,

    // Devices
    createDevice,
    getDevices,

    // Job Cards
    createJobCard,
    getJobCards,
    getActiveJobCards,
    getMonthlyJobCards,
    updateJobCard,
    deleteJobCard,

    // Invoices
    createInvoice,
    getInvoices,
    updateInvoice,

    // Inventory
    createInventoryItem,
    getInventory,
    updateInventoryItem,
  }
}
