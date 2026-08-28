"use client"

import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import type { JobCardFormData } from "@/lib/validations"
import { ImageUpload } from "@/components/image-upload"
import { useSubscription } from "@/hooks/use-subscription"

interface DeviceInfoSectionProps {
  form: UseFormReturn<JobCardFormData>
  conditionImages: { url: string; publicId: string }[]
  onImagesChange: (images: { url: string; publicId: string }[]) => void
  isLoading?: boolean
}

const deviceTypes = [
  { value: "mobile", label: "Mobile" },
  { value: "laptop", label: "Laptop" },
  { value: "tablet", label: "Tablet" },
  { value: "earbuds", label: "Earbuds" },
  { value: "smartwatch", label: "Smartwatch" },
  { value: "others", label: "Others" },
]

export function DeviceInfoSection({
  form,
  conditionImages,
  onImagesChange,
  isLoading = false,
}: DeviceInfoSectionProps) {
  const { canUploadJobImages } = useSubscription()
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="deviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {deviceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand *</FormLabel>
              <FormControl>
                <Input placeholder="Brand" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model *</FormLabel>
              <FormControl>
                <Input placeholder="Model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="imei"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IMEI / Serial Number</FormLabel>
              <FormControl>
                <Input placeholder="IMEI or Serial" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition Received</FormLabel>
              <FormControl>
                <Input placeholder="Good, Fair, Poor, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Device Condition Images - Only show for Pro/Elite plans */}
      {canUploadJobImages() && (
        <div className="space-y-2">
          <FormLabel>Device Condition Photos</FormLabel>
          <p className="text-xs text-muted-foreground">
            Upload photos showing the current condition of the device (scratches, dents, screen damage, etc.)
          </p>
          <ImageUpload
            value={conditionImages}
            onChange={onImagesChange}
            useSubscriptionLimit={true}
            disabled={isLoading}
          />
        </div>
      )}

      <FormField
        control={form.control}
        name="accessories"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Accessories Given</FormLabel>
            <FormControl>
              <Input placeholder="Charger, Cable, Bag, etc. (comma separated)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
