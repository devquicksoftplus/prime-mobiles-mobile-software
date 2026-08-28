"use client"

import { useCallback, useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { firebaseService, COLLECTIONS } from "@/lib/firebase-service"
import type { JobCard } from "@/lib/validations"
import { toast } from "sonner"

interface UseJobCardsReturn {
  jobCards: (JobCard & { id: string })[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  createJobCard: (data: Omit<JobCard, "id" | "createdAt" | "updatedAt" | "status">) => Promise<string>
  updateJobCard: (id: string, data: Partial<JobCard>) => Promise<void>
  deleteJobCard: (id: string) => Promise<void>
}

export function useJobCards(): UseJobCardsReturn {
  const { user } = useAuth()
  const [jobCards, setJobCards] = useState<(JobCard & { id: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkAuth = useCallback(() => {
    if (!user?.uid) {
      throw new Error("User not authenticated")
    }
    return user.uid
  }, [user?.uid])

  const fetchJobCards = useCallback(async () => {
    if (!user?.uid) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await firebaseService.getAll<JobCard>(user.uid, COLLECTIONS.JOB_CARDS)
      setJobCards(data)
    } catch (err: any) {
      console.error("[Firebase] Error fetching job cards:", err)
      setError(err.message || "Failed to load job cards")
      toast.error("Error loading job cards")
    } finally {
      setIsLoading(false)
    }
  }, [user?.uid])

  useEffect(() => {
    fetchJobCards()
  }, [fetchJobCards])

  const createJobCard = useCallback(
    async (data: Omit<JobCard, "id" | "createdAt" | "updatedAt" | "status">) => {
      const userId = checkAuth()
      const id = await firebaseService.create(userId, COLLECTIONS.JOB_CARDS, {
        ...data,
        status: "pending",
      })
      await fetchJobCards()
      toast.success("Job card created successfully")
      return id
    },
    [checkAuth, fetchJobCards]
  )

  const updateJobCard = useCallback(
    async (id: string, data: Partial<JobCard>) => {
      const userId = checkAuth()
      await firebaseService.update(userId, COLLECTIONS.JOB_CARDS, id, data)
      await fetchJobCards()
      toast.success("Job card updated")
    },
    [checkAuth, fetchJobCards]
  )

  const deleteJobCard = useCallback(
    async (id: string) => {
      const userId = checkAuth()
      await firebaseService.delete(userId, COLLECTIONS.JOB_CARDS, id)
      await fetchJobCards()
      toast.success("Job card deleted")
    },
    [checkAuth, fetchJobCards]
  )

  return {
    jobCards,
    isLoading,
    error,
    refetch: fetchJobCards,
    createJobCard,
    updateJobCard,
    deleteJobCard,
  }
}
