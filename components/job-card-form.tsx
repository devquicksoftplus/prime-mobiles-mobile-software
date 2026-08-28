"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { useFirestore } from "@/hooks/use-firestore"

interface UploadedImage {
  url: string
  publicId: string
}

interface JobCardFormProps {
  onSuccess?: () => void
  onFormChange?: () => void
}

// Helper function to parse existing datetime string
function parseDeliveryDateTime(dateTimeStr: string) {
  if (!dateTimeStr) {
    return { date: "", hour: "12", minute: "00", period: "PM" }
  }
  
  try {
    const dateObj = new Date(dateTimeStr)
    if (isNaN(dateObj.getTime())) {
      return { date: "", hour: "12", minute: "00", period: "PM" }
    }
    
    const date = dateTimeStr.split("T")[0] || ""
    let hours = dateObj.getHours()
    const minutes = dateObj.getMinutes()
    const period = hours >= 12 ? "PM" : "AM"
    
    // Convert to 12-hour format
    if (hours === 0) hours = 12
    else if (hours > 12) hours = hours - 12
    
    return {
      date,
      hour: hours.toString(),
      minute: minutes.toString().padStart(2, "0"),
      period,
    }
  } catch {
    return { date: "", hour: "12", minute: "00", period: "PM" }
  }
}

// Helper function to combine date and time into datetime string
function combineDateTime(date: string, hour: string, minute: string, period: string): string {
  if (!date) return ""
  
  let hours24 = parseInt(hour)
  if (period === "PM" && hours24 !== 12) {
    hours24 += 12
  } else if (period === "AM" && hours24 === 12) {
    hours24 = 0
  }
  
  return `${date}T${hours24.toString().padStart(2, "0")}:${minute}:00`
}

export function JobCardForm({ onSuccess, onFormChange }: JobCardFormProps) {
  const { isAuthenticated } = useAuth()
  const { createCustomer, createDevice, createJobCard } = useFirestore()
  const [loading, setLoading] = useState(false)
  const [conditionImages, setConditionImages] = useState<UploadedImage[]>([])
  const [formData, setFormData] = useState({
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
  })
  
  // State for 12-hour time format
  const [timeState, setTimeState] = useState(() => parseDeliveryDateTime(formData.deliveryDate))
  
  // Sync timeState when deliveryDate changes
  useEffect(() => {
    const parsed = parseDeliveryDateTime(formData.deliveryDate)
    setTimeState(parsed)
  }, [formData.deliveryDate])
  
  // Update delivery date when time state changes
  const updateDeliveryTime = (newState: { date: string; hour: string; minute: string; period: string }) => {
    setTimeState(newState)
    const combined = combineDateTime(newState.date, newState.hour, newState.minute, newState.period)
    setFormData(prev => ({ ...prev, deliveryDate: combined }))
    onFormChange?.()
  }

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    onFormChange?.()
  }

  const handleImagesChange = (images: UploadedImage[]) => {
    setConditionImages(images)
    onFormChange?.()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error("Please log in to create job cards")
      return
    }
    
    setLoading(true)

    try {
      // Create customer
      const customerId = await createCustomer({
        name: formData.customerName,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        address: formData.address,
      })

      // Create device
      const deviceId = await createDevice({
        customerId,
        deviceType: formData.deviceType,
        brand: formData.brand,
        model: formData.model,
        imei: formData.imei,
        condition: formData.condition,
        accessories: formData.accessories,
        conditionImages: conditionImages,
      })

      // Create job card
      await createJobCard({
        customerId,
        deviceId,
        customerName: formData.customerName,
        deviceInfo: {
          type: formData.deviceType,
          brand: formData.brand,
          model: formData.model,
        },
        problemDescription: formData.problemDescription,
        technicianDiagnosis: formData.technicianDiagnosis,
        requiredParts: formData.requiredParts ? formData.requiredParts.split(",").map(p => p.trim()) : [],
        laborCost: formData.laborCost,
        partsCost: formData.partsCost,
        serviceCost: formData.serviceCost,
        advanceReceived: formData.advanceReceived,
        deliveryDate: formData.deliveryDate,
      })
      
      toast.success("Job card created successfully")
      onSuccess?.()
      setConditionImages([])
      setFormData({
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
      })
    } catch (error) {
      console.error("[Firebase] Form error:", error)
      toast.error("Failed to create job card")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                required
                value={formData.customerName}
                onChange={(e) => updateFormData({ customerName: e.target.value })}
                placeholder="Full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alternatePhone">Alternate Phone</Label>
              <Input
                id="alternatePhone"
                value={formData.alternatePhone}
                onChange={(e) => updateFormData({ alternatePhone: e.target.value })}
                placeholder="Alternate number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateFormData({ address: e.target.value })}
                placeholder="Address"
              />
            </div>
          </div>
        </div>

        {/* Device Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Device Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deviceType">Device Type *</Label>
              <Select
                value={formData.deviceType}
                onValueChange={(value) => updateFormData({ deviceType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="earbuds">Earbuds</SelectItem>
                  <SelectItem value="smartwatch">Smartwatch</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                required
                value={formData.brand}
                onChange={(e) => updateFormData({ brand: e.target.value })}
                placeholder="Brand"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                required
                value={formData.model}
                onChange={(e) => updateFormData({ model: e.target.value })}
                placeholder="Model"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imei">IMEI / Serial Number</Label>
              <Input
                id="imei"
                value={formData.imei}
                onChange={(e) => updateFormData({ imei: e.target.value })}
                placeholder="IMEI or Serial"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition Received</Label>
              <Input
                id="condition"
                value={formData.condition}
                onChange={(e) => updateFormData({ condition: e.target.value })}
                placeholder="Good, Fair, Poor, etc."
              />
            </div>
          </div>

          {/* Device Condition Images */}
          <div className="space-y-2">
            <Label>Device Condition Photos</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Upload photos showing the current condition of the device (scratches, dents, screen damage, etc.)
            </p>
            <ImageUpload
              value={conditionImages}
              onChange={handleImagesChange}
              maxImages={5}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessories">Accessories Given</Label>
            <Input
              id="accessories"
              value={formData.accessories}
              onChange={(e) => updateFormData({ accessories: e.target.value })}
              placeholder="Charger, Cable, Bag, etc. (comma separated)"
            />
          </div>
        </div>

        {/* Problem & Diagnosis */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Problem & Diagnosis</h2>
          <div className="space-y-2">
            <Label htmlFor="problemDescription">Problem Description *</Label>
            <Textarea
              id="problemDescription"
              required
              value={formData.problemDescription}
              onChange={(e) => updateFormData({ problemDescription: e.target.value })}
              placeholder="Describe the issue..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technicianDiagnosis">Technician Diagnosis</Label>
            <Textarea
              id="technicianDiagnosis"
              value={formData.technicianDiagnosis}
              onChange={(e) => updateFormData({ technicianDiagnosis: e.target.value })}
              placeholder="Technician findings..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiredParts">Required Parts / Materials</Label>
            <Input
              id="requiredParts"
              value={formData.requiredParts}
              onChange={(e) => updateFormData({ requiredParts: e.target.value })}
              placeholder="Parts needed (comma separated)"
            />
          </div>
        </div>

        {/* Cost Estimate */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Estimated Cost Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="laborCost">Labor Cost</Label>
              <Input
                id="laborCost"
                type="number"
                step="0.01"
                value={formData.laborCost}
                onChange={(e) => updateFormData({ laborCost: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partsCost">Parts Cost</Label>
              <Input
                id="partsCost"
                type="number"
                step="0.01"
                value={formData.partsCost}
                onChange={(e) => updateFormData({ partsCost: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceCost">Service Cost</Label>
              <Input
                id="serviceCost"
                type="number"
                step="0.01"
                value={formData.serviceCost}
                onChange={(e) => updateFormData({ serviceCost: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="advanceReceived">Advance Received</Label>
              <Input
                id="advanceReceived"
                type="number"
                step="0.01"
                value={formData.advanceReceived}
                onChange={(e) => updateFormData({ advanceReceived: e.target.value })}
                placeholder="0.00"
              />
            </div>


            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="deliveryDate">Delivery Date & Time *</Label>
              <div className="flex flex-wrap gap-3 items-center">
                {/* Date Input */}
                <Input
                  type="date"
                  value={timeState.date}
                  onChange={(e) => updateDeliveryTime({ ...timeState, date: e.target.value })}
                  className="w-auto min-w-[160px]"
                  required
                />
                
                {/* Hour Select (1-12) */}
                <Select
                  value={timeState.hour}
                  onValueChange={(value) => updateDeliveryTime({ ...timeState, hour: value })}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <span className="text-muted-foreground font-medium">:</span>
                
                {/* Minute Select */}
                <Select
                  value={timeState.minute}
                  onValueChange={(value) => updateDeliveryTime({ ...timeState, minute: value })}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* AM/PM Select */}
                <Select
                  value={timeState.period}
                  onValueChange={(value) => updateDeliveryTime({ ...timeState, period: value })}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Job Card"}
        </Button>
      </form>
    </Card>
  )
}
