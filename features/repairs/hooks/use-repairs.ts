"use client"

import { useCallback, useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { firebaseService, COLLECTIONS } from "@/lib/firebase-service"
import type { RepairTicket, RepairFormData } from "@/lib/validations"
import { toast } from "sonner"

interface UseRepairsReturn {
  repairs: (RepairTicket & { id: string })[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  createRepair: (data: RepairFormData) => Promise<string>
  updateRepair: (id: string, data: Partial<RepairTicket>) => Promise<void>
  deleteRepair: (id: string) => Promise<void>
}

export function useRepairs(): UseRepairsReturn {
  const { user } = useAuth()
  const [repairs, setRepairs] = useState<(RepairTicket & { id: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkAuth = useCallback(() => {
    if (!user?.uid) {
      throw new Error("User not authenticated")
    }
    return user.uid
  }, [user?.uid])

  const fetchRepairs = useCallback(async () => {
    if (!user?.uid) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await firebaseService.getAll<RepairTicket>(user.uid, COLLECTIONS.REPAIRS)
      setRepairs(data)
    } catch (err: any) {
      console.error("[Firebase] Error fetching repairs:", err)
      setError(err.message || "Failed to load repairs")
      toast.error("Error loading repairs")
    } finally {
      setIsLoading(false)
    }
  }, [user?.uid])

  useEffect(() => {
    fetchRepairs()
  }, [fetchRepairs])

  const createRepair = useCallback(
    async (data: RepairFormData) => {
      const userId = checkAuth()
      const id = await firebaseService.create(userId, COLLECTIONS.REPAIRS, {
        ...data,
        status: "pending",
      })
      await fetchRepairs()
      toast.success("Repair ticket created")
      return id
    },
    [checkAuth, fetchRepairs]
  )

  const updateRepair = useCallback(
    async (id: string, data: Partial<RepairTicket>) => {
      const userId = checkAuth()
      await firebaseService.update(userId, COLLECTIONS.REPAIRS, id, data)
      await fetchRepairs()
      toast.success("Repair ticket updated")
    },
    [checkAuth, fetchRepairs]
  )

  const deleteRepair = useCallback(
    async (id: string) => {
      const userId = checkAuth()
      await firebaseService.delete(userId, COLLECTIONS.REPAIRS, id)
      await fetchRepairs()
      toast.success("Repair ticket deleted")
    },
    [checkAuth, fetchRepairs]
  )

  return {
    repairs,
    isLoading,
    error,
    refetch: fetchRepairs,
    createRepair,
    updateRepair,
    deleteRepair,
  }
}
