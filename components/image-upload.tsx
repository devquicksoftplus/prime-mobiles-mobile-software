"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Upload, X, Image as ImageIcon, Loader2, Lock, Crown } from "lucide-react"
import Image from "next/image"
import { compressImage, formatFileSize } from "@/lib/image-compression"
import { useAuth } from "@/contexts/auth-context"
import { uploadToFirebaseStorage, deleteFromFirebaseStorage } from "@/lib/firebase-storage"
import { useSubscription } from "@/hooks/use-subscription"
import Link from "next/link"

interface UploadedImage {
  url: string
  publicId: string
}

interface ImageUploadProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxImages?: number
  disabled?: boolean
  useSubscriptionLimit?: boolean // When true, uses subscription limit instead of maxImages
}

export function ImageUpload({ 
  value = [], 
  onChange, 
  maxImages = 5, 
  disabled,
  useSubscriptionLimit = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { isAuthenticated } = useAuth()
  const { getMaxJobImages, canUploadJobImages, isSubscribed, planId } = useSubscription()

  // Determine actual max images based on subscription or prop
  const actualMaxImages = useSubscriptionLimit ? getMaxJobImages() : maxImages
  const canUpload = useSubscriptionLimit ? canUploadJobImages() : true

  // If subscription-based and user can't upload, show locked state
  if (useSubscriptionLimit && !canUpload) {
    return (
      <div className="border-2 border-dashed border-amber-200 rounded-xl p-6 bg-amber-50/50">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
              <Crown className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">Image Uploads Locked</p>
            <p className="text-xs text-amber-600 mt-1">
              Upgrade to Pro or Elite to add device condition photos
            </p>
          </div>
          <Link href="/subscription">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
              <Crown className="w-3 h-3 mr-2" />
              Upgrade Plan
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error("Please login to upload images")
      return
    }

    if (value.length >= actualMaxImages) {
      // Show upgrade prompt for Pro users
      if (useSubscriptionLimit && planId === 'pro') {
        toast.error('Image limit reached!', {
          description: 'Upgrade to Elite plan to upload up to 4 images per job.',
          action: {
            label: 'Upgrade',
            onClick: () => window.location.href = '/subscription'
          }
        })
      } else {
        toast.error(`Maximum ${actualMaxImages} images allowed${useSubscriptionLimit ? ' on your plan' : ''}`)
      }
      return
    }

    const remainingSlots = actualMaxImages - value.length
    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    setIsUploading(true)
    const uploadedImages: UploadedImage[] = []

    for (const file of filesToUpload) {
      try {
        // Compress image before upload (target: ~150KB, format: WebP)
        const compressionResult = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1080,
          targetSizeKB: 150, // Optimal balance between quality and storage
          outputFormat: 'webp',
        })

        const compressedFile = compressionResult.file
        
        // Log compression stats for debugging
        console.log(
          `[Image Compression] ${file.name}: ${formatFileSize(compressionResult.originalSize)} → ${formatFileSize(compressionResult.compressedSize)} (${compressionResult.compressionRatio.toFixed(1)}x reduction)`
        )

        // Upload directly to Firebase Storage (client-side)
        const result = await uploadToFirebaseStorage(compressedFile, "device-conditions")

        uploadedImages.push({
          url: result.url,
          publicId: result.path,
        })

        console.log(`[Upload] Successfully uploaded: ${result.path}`)
      } catch (error) {
        console.error("Upload error:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        toast.error(`Failed to upload ${file.name}: ${errorMessage}`)
      }
    }

    if (uploadedImages.length > 0) {
      onChange([...value, ...uploadedImages])
      toast.success(`${uploadedImages.length} image(s) uploaded successfully`)
    }

    setIsUploading(false)
  }, [value, onChange, actualMaxImages, isAuthenticated, useSubscriptionLimit])

  const handleRemove = useCallback(async (index: number) => {
    const imageToRemove = value[index]
    
    try {
      // Delete directly from Firebase Storage (client-side)
      await deleteFromFirebaseStorage(imageToRemove.publicId)
      console.log(`[Delete] Successfully deleted: ${imageToRemove.publicId}`)
    } catch (error) {
      console.error("Delete error:", error)
      // Continue to remove from local state even if delete fails
    }

    // Remove from local state
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
    toast.success("Image removed")
  }, [value, onChange])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files)
    }
  }, [handleUpload])

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
          ${dragActive 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 hover:bg-muted/30"
          }
          ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && !isUploading) {
            document.getElementById("image-upload-input")?.click()
          }
        }}
      >
        <input
          id="image-upload-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          disabled={disabled || isUploading}
          onChange={(e) => handleUpload(e.target.files)}
        />
        
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drop images here or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPEG, PNG, WebP, GIF • Max 10MB ({value.length}/{actualMaxImages} images)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {value.map((image, index) => (
            <div 
              key={image.publicId} 
              className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
            >
              <Image
                src={image.url}
                alt={`Device condition ${index + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(index)
                }}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {index + 1} of {value.length}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upgrade Banner - Show when Pro user is at limit */}
      {useSubscriptionLimit && planId === 'pro' && value.length >= actualMaxImages && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <Crown className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">Want more photos?</p>
            <p className="text-xs text-amber-600">Upgrade to Elite for 4 images per job</p>
          </div>
          <Link href="/subscription">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
              Upgrade
            </Button>
          </Link>
        </div>
      )}

      {/* Empty State */}
      {value.length === 0 && !isUploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          <span>No images uploaded. Add photos of the device condition for documentation.</span>
        </div>
      )}
    </div>
  )
}

