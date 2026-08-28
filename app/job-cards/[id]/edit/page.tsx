"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { JobCardForm } from "@/features/job-cards"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { firebaseService, COLLECTIONS } from "@/lib/firebase-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface JobCardData {
  id: string
  customerName?: string
  phone?: string
  alternatePhone?: string
  address?: string
  deviceInfo?: {
    type: string
    brand: string
    model: string
  }
  imei?: string
  condition?: string
  accessories?: string
  problemDescription?: string
  technicianDiagnosis?: string
  requiredParts?: string[]
  costEstimate?: {
    laborCost: number
    partsCost: number
    serviceCost: number
    total: number
  }
  advanceReceived?: number
  deliveryDate?: string
  conditionImages?: Array<{ url: string; publicId: string }>
  customerId?: string
  deviceId?: string
}

export default function EditJobCardPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { user } = useAuth()
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [jobCard, setJobCard] = useState<JobCardData | null>(null)

  const id = params?.id as string

  useEffect(() => {
    const fetchJobCard = async () => {
      if (!user?.uid || !id) {
        setIsLoading(false)
        return
      }

      try {
        const data = await firebaseService.getById<JobCardData>(user.uid, COLLECTIONS.JOB_CARDS, id)
        if (data) {
          setJobCard({ ...data, id })
        } else {
          toast({
            title: "Error",
            description: "Service details not found",
            variant: "destructive",
          })
          router.back()
        }
      } catch (error) {
        console.error("[Firebase] Error fetching job card:", error)
        toast({
          title: "Error",
          description: "Failed to load service details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobCard()
  }, [user?.uid, id, router, toast])

  const handleSuccess = () => {
    setHasUnsavedChanges(false)
    toast({
      title: "Success",
      description: "Service details updated successfully",
    })
    router.back()
  }

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true)
    } else {
      router.back()
    }
  }

  const handleConfirmExit = () => {
    setShowExitDialog(false)
    router.back()
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50/80 via-background to-teal-50/40">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        </div>
      </main>
    )
  }

  if (!jobCard) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50/80 via-background to-teal-50/40">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-muted-foreground">Service details not found</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50/80 via-background to-teal-50/40">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-primary">Edit Service Details</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update customer and device information
          </p>
        </div>

        <JobCardForm
          mode="edit"
          initialData={jobCard}
          onSuccess={handleSuccess}
          onFormChange={() => setHasUnsavedChanges(true)}
        />
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your
              changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmExit}
              className="bg-destructive hover:bg-destructive/90 rounded-xl"
            >
              Leave without saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
