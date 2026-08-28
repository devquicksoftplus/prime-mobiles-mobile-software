"use client"

import { useCallback, useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { firebaseService, COLLECTIONS } from "@/lib/firebase-service"
import type { InventoryItem, InventoryFormData } from "@/lib/validations"
import { toast } from "sonner"

interface UseInventoryReturn {
  items: (InventoryItem & { id: string })[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  createItem: (data: InventoryFormData) => Promise<string>
  updateItem: (id: string, data: Partial<InventoryItem>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

export function useInventory(): UseInventoryReturn {
  const { user } = useAuth()
  const [items, setItems] = useState<(InventoryItem & { id: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkAuth = useCallback(() => {
    if (!user?.uid) {
      throw new Error("User not authenticated")
    }
    return user.uid
  }, [user?.uid])

  const fetchItems = useCallback(async () => {
    if (!user?.uid) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await firebaseService.getAll<InventoryItem>(user.uid, COLLECTIONS.INVENTORY)
      setItems(data)
    } catch (err: any) {
      console.error("[Firebase] Error fetching products:", err)
      setError(err.message || "Failed to load products")
      toast.error("Error loading products")
    } finally {
      setIsLoading(false)
    }
  }, [user?.uid])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const createItem = useCallback(
    async (data: InventoryFormData) => {
      const userId = checkAuth()
      const id = await firebaseService.create(userId, COLLECTIONS.INVENTORY, data)
      await fetchItems()
      toast.success("Product added")
      return id
    },
    [checkAuth, fetchItems]
  )

  const updateItem = useCallback(
    async (id: string, data: Partial<InventoryItem>) => {
      const userId = checkAuth()
      await firebaseService.update(userId, COLLECTIONS.INVENTORY, id, data)
      await fetchItems()
      toast.success("Product updated")
    },
    [checkAuth, fetchItems]
  )

  const deleteItem = useCallback(
    async (id: string) => {
      const userId = checkAuth()
      await firebaseService.delete(userId, COLLECTIONS.INVENTORY, id)
      await fetchItems()
      toast.success("Product deleted")
    },
    [checkAuth, fetchItems]
  )

  return {
    items,
    isLoading,
    error,
    refetch: fetchItems,
    createItem,
    updateItem,
    deleteItem,
  }
}
