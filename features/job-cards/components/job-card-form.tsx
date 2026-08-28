"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { firebaseService, COLLECTIONS } from "@/lib/firebase-service"
import { jobCardFormSchema, type JobCardFormData } from "@/lib/validations"
import { CustomerInfoSection } from "./customer-info-section"
import { DeviceInfoSection } from "./device-info-section"
import { ProblemDiagnosisSection } from "./problem-diagnosis-section"
import { CostEstimateSection } from "./cost-estimate-section"
import { CustomerHistoryCard } from "./customer-history-card"
import { ImageUpgradeCard } from "./image-upgrade-card"
import { User, Smartphone, Wrench, IndianRupee, CheckCircle2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedImage {
  url: string
  publicId: string
}

interface InitialData {
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
  conditionImages?: UploadedImage[]
  customerId?: string
  deviceId?: string
}

interface JobCardFormProps {
  onSuccess?: () => void
  onFormChange?: () => void
  initialData?: InitialData
  mode?: "create" | "edit"
}

const defaultFormValues: JobCardFormData = {
  customerName: "",
  phone: "",
  alternatePhone: "",
  address: "",
  deviceType: "mobile",
  brand: "",
  model: "",
  imei: "",
  condition: "",
  accessories: "",
  problemDescription: "",
  technicianDiagnosis: "",
  requiredParts: "",
  laborCost: "",
  partsCost: "",
  serviceCost: "",
  advanceReceived: "",
  deliveryDate: "",
}


export function JobCardForm({ onSuccess, onFormChange, initialData, mode = "create" }: JobCardFormProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [conditionImages, setConditionImages] = useState<UploadedImage[]>([])
  // Initialize with initial data phone immediately for edit mode to prevent wrong history showing
  const [selectedCustomerPhone, setSelectedCustomerPhone] = useState<string | null>(
    mode === "edit" && initialData?.phone ? initialData.phone : null
  )

  const form = useForm<JobCardFormData>({
    resolver: zodResolver(jobCardFormSchema),
    defaultValues: defaultFormValues,
  })

  // Populate form with initial data for edit mode
  useEffect(() => {
    if (initialData && mode === "edit") {
      form.reset({
        customerName: initialData.customerName || "",
        phone: initialData.phone || "",
        alternatePhone: initialData.alternatePhone || "",
        address: initialData.address || "",
        deviceType: initialData.deviceInfo?.type || "mobile",
        brand: initialData.deviceInfo?.brand || "",
        model: initialData.deviceInfo?.model || "",
        imei: initialData.imei || "",
        condition: initialData.condition || "",
        accessories: initialData.accessories || "",
        problemDescription: initialData.problemDescription || "",
        technicianDiagnosis: initialData.technicianDiagnosis || "",
        requiredParts: initialData.requiredParts?.join(", ") || "",
        laborCost: initialData.costEstimate?.laborCost?.toString() || "",
        partsCost: initialData.costEstimate?.partsCost?.toString() || "",
        serviceCost: initialData.costEstimate?.serviceCost?.toString() || "",
        advanceReceived: initialData.advanceReceived?.toString() || "",
        deliveryDate: initialData.deliveryDate || "",
      })
      if (initialData.conditionImages) {
        setConditionImages(initialData.conditionImages)
      }
      if (initialData.phone) {
        setSelectedCustomerPhone(initialData.phone)
      }
    }
  }, [initialData, mode, form])

  // Track form changes
  const handleFormChange = () => {
    onFormChange?.()
  }

  const handleImagesChange = (images: UploadedImage[]) => {
    setConditionImages(images)
    onFormChange?.()
  }

  const onSubmit = async (data: JobCardFormData) => {
    if (!user?.uid) {
      toast.error("Please log in")
      return
    }

    setIsLoading(true)

    try {
      // Calculate costs
      const laborCost = parseFloat(data.laborCost || "0")
      const partsCost = parseFloat(data.partsCost || "0")
      const serviceCost = parseFloat(data.serviceCost || "0")
      const total = laborCost + partsCost + serviceCost

      const jobCardData = {
        customerName: data.customerName,
        phone: data.phone,
        alternatePhone: data.alternatePhone || "",
        address: data.address || "",
        deviceInfo: {
          type: data.deviceType,
          brand: data.brand,
          model: data.model,
        },
        imei: data.imei || "",
        condition: data.condition || "",
        accessories: data.accessories || "",
        conditionImages: conditionImages,
        problemDescription: data.problemDescription,
        technicianDiagnosis: data.technicianDiagnosis || "",
        requiredParts: data.requiredParts
          ? data.requiredParts.split(",").map((p) => p.trim())
          : [],
        costEstimate: {
          laborCost,
          partsCost,
          serviceCost,
          total,
        },
        advanceReceived: parseFloat(data.advanceReceived || "0"),
        deliveryDate: data.deliveryDate,
      }

      if (mode === "edit" && initialData?.id) {
        // Update existing job card
        await firebaseService.update(user.uid, COLLECTIONS.JOB_CARDS, initialData.id, jobCardData)
        toast.success("Service details updated successfully")
      } else {
        // Create new entries
        const customerId = await firebaseService.create(user.uid, COLLECTIONS.CUSTOMERS, {
          name: data.customerName,
          phone: data.phone,
          alternatePhone: data.alternatePhone || "",
          address: data.address || "",
        })

        const deviceId = await firebaseService.create(user.uid, COLLECTIONS.DEVICES, {
          customerId,
          deviceType: data.deviceType,
          brand: data.brand,
          model: data.model,
          imei: data.imei || "",
          condition: data.condition || "",
          accessories: data.accessories || "",
          conditionImages: conditionImages,
        })

        await firebaseService.create(user.uid, COLLECTIONS.JOB_CARDS, {
          customerId,
          deviceId,
          ...jobCardData,
          status: "pending",
        })

        // Reduce inventory quantities for used parts
        if (jobCardData.requiredParts.length > 0) {
          try {
            // Get all inventory items
            const inventoryItems = await firebaseService.getAll(user.uid, COLLECTIONS.INVENTORY)
            
            // For each required part, find and reduce quantity
            for (const partName of jobCardData.requiredParts) {
              const inventoryItem = inventoryItems.find(
                (item: any) => item.partName.toLowerCase() === partName.toLowerCase()
              ) as (any & { id: string; partName: string; quantity: number }) | undefined
              
              if (inventoryItem && inventoryItem.id) {
                const currentQty = inventoryItem.quantity || 0
                if (currentQty > 0) {
                  // Reduce quantity by 1
                  await firebaseService.update(user.uid, COLLECTIONS.INVENTORY, inventoryItem.id, {
                    quantity: currentQty - 1
                  })
                  console.log(`[Inventory] Reduced ${partName} quantity: ${currentQty} → ${currentQty - 1}`)
                } else {
                  console.warn(`[Inventory] ${partName} is out of stock`)
                  toast.warning(`${partName} is out of stock`, {
                    description: "Please update inventory"
                  })
                }
              }
            }
          } catch (invError) {
            console.error("[Inventory] Error reducing quantities:", invError)
            // Don't fail the job card creation if inventory update fails
            toast.warning("Job card created but inventory may not be updated")
          }
        }

        toast.success("Service details created successfully")
      }

      onSuccess?.()
      if (mode === "create") {
        form.reset(defaultFormValues)
        setConditionImages([])
      }
    } catch (error) {
      console.error("[Firebase] Form error:", error)
      toast.error(mode === "edit" ? "Failed to update" : "Failed to create")
    } finally {
      setIsLoading(false)
    }
  }

  const isEditMode = mode === "edit"

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Form */}
      <div className="flex-1">
        <Card className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onChange={handleFormChange}
              className="space-y-8"
            >
              {/* Section 1: Customer Information */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Customer Information
                </h2>
                <CustomerInfoSection 
                  form={form} 
                  onCustomerPhoneChange={setSelectedCustomerPhone}
                />
              </div>
              
              {/* Section 2: Device Details */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  Device Details
                </h2>
                <DeviceInfoSection
                  form={form}
                  conditionImages={conditionImages}
                  onImagesChange={handleImagesChange}
                  isLoading={isLoading}
                />
              </div>
              
              {/* Section 3: Problem & Diagnosis */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-primary" />
                  Problem & Diagnosis
                </h2>
                <ProblemDiagnosisSection form={form} />
              </div>
              
              {/* Section 4: Cost Estimate */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-primary" />
                  Cost & Delivery
                </h2>
                <CostEstimateSection form={form} />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading} 
                size="lg"
                className="w-full h-12 text-base font-semibold gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {isEditMode ? "Update Service Details" : "Create Service Entry"}
                  </>
                )}
              </Button>
              
              {/* Image Upgrade Card - Mobile Only (below submit button) */}
              <div className="lg:hidden mt-4">
                <ImageUpgradeCard />
              </div>
            </form>
          </Form>
        </Card>
      </div>
      
      {/* Sidebar - Desktop: Right side with sticky positioning */}
      <div className="w-full lg:w-80 shrink-0 order-first lg:order-last">
        <div className="lg:sticky lg:top-4 flex flex-col gap-4">
          <CustomerHistoryCard 
            customerPhone={selectedCustomerPhone} 
            excludeJobId={mode === "edit" ? initialData?.id : null}
          />
          {/* Image Upgrade Card - Desktop Only (in sidebar) */}
          <div className="hidden lg:block">
            <ImageUpgradeCard />
          </div>
        </div>
      </div>
    </div>
  )
}


