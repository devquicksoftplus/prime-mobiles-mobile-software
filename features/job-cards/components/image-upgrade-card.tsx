"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Crown, ImagePlus } from "lucide-react"
import { useSubscription } from "@/hooks/use-subscription"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ImageUpgradeCardProps {
  className?: string
}

export function ImageUpgradeCard({ className }: ImageUpgradeCardProps) {
  const { canUploadJobImages, currentPlan } = useSubscription()

  // Don't show if user can already upload images
  if (canUploadJobImages()) {
    return null
  }

  return (
    <Card className={cn("border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2 text-amber-800">
          <Camera className="h-4 w-4 text-amber-600" />
          Device Photos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <ImagePlus className="w-5 h-5 text-amber-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
              <Crown className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              Upgrade to Pro
            </p>
            <p className="text-xs text-amber-600">
              Add device condition photos
            </p>
          </div>
        </div>
        
        <p className="text-xs text-amber-700/80 leading-relaxed">
          Document device conditions with photos. Pro plan allows 2 images, Elite allows 4 images per job.
        </p>
        
        <Link href="/subscription" className="block">
          <Button 
            size="sm" 
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Crown className="w-3 h-3 mr-2" />
            Upgrade Plan
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
