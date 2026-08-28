"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RepairTicket } from "@/lib/schemas"

interface RepairFormProps {
  onSubmit: (data: Partial<RepairTicket>) => Promise<void>
  isLoading?: boolean
}

export function RepairForm({ onSubmit, isLoading }: RepairFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    alternatePhone: "",
    deviceType: "mobile" as const,
    brand: "",
    model: "",
    serialNumber: "",
    conditionNotes: "",
    repairReason: "",
    problemDescription: "",
    estimatedCost: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      ...formData,
      estimatedCost: Number.parseFloat(formData.estimatedCost) || 0,
    })
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Device Repair Intake Form</CardTitle>
        <CardDescription>Enter the device and repair details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Full Name</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="alternatePhone">Alternate Phone</Label>
                <Input
                  id="alternatePhone"
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Device Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Device Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deviceType">Device Type</Label>
                <Select
                  value={formData.deviceType}
                  onValueChange={(value: any) => setFormData({ ...formData, deviceType: value })}
                >
                  <SelectTrigger id="deviceType" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile">Mobile Phone</SelectItem>
                    <SelectItem value="laptop">Laptop</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                  className="mt-1"
                  placeholder="e.g., Apple, Samsung, Dell"
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                  className="mt-1"
                  placeholder="e.g., iPhone 14, Galaxy S22"
                />
              </div>
              <div>
                <Label htmlFor="serialNumber">Serial Number (Optional)</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Repair Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Repair Details</h3>
            <div>
              <Label htmlFor="conditionNotes">Current Condition</Label>
              <Textarea
                id="conditionNotes"
                value={formData.conditionNotes}
                onChange={(e) => setFormData({ ...formData, conditionNotes: e.target.value })}
                placeholder="Describe the device's current condition (scratches, damage, etc.)"
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="repairReason">Reason for Repair</Label>
              <Input
                id="repairReason"
                value={formData.repairReason}
                onChange={(e) => setFormData({ ...formData, repairReason: e.target.value })}
                required
                className="mt-1"
                placeholder="e.g., Screen repair, Battery replacement"
              />
            </div>
            <div>
              <Label htmlFor="problemDescription">Problem Description</Label>
              <Textarea
                id="problemDescription"
                value={formData.problemDescription}
                onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                placeholder="Detailed description of the problem"
                required
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="estimatedCost">Estimated Cost</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="estimatedCost"
                  type="number"
                  step="0.01"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                  required
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Repair Ticket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
