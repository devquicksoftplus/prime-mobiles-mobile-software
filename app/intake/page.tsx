"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { JobCardForm } from "@/features/job-cards"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
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

export default function IntakePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleSuccess = () => {
    setHasUnsavedChanges(false)
    toast({
      title: "Success",
      description: "Service details created successfully",
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
          <h1 className="text-2xl font-semibold text-primary">Add Service Details</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Register a new device repair request
          </p>
        </div>

        <JobCardForm
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
              entered data will be lost.
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
