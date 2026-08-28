"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
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
import { repairFormSchema, type RepairFormData, type RepairDeviceType } from "@/lib/validations"
import { useState } from "react"

interface RepairFormProps {
  onSubmit: (data: RepairFormData) => Promise<void>
  isLoading?: boolean
}

const deviceTypes: { value: RepairDeviceType; label: string }[] = [
  { value: "mobile", label: "Mobile Phone" },
  { value: "laptop", label: "Laptop" },
  { value: "tablet", label: "Tablet" },
  { value: "other", label: "Other" },
]

const defaultValues: RepairFormData = {
  customerName: "",
  phoneNumber: "",
  alternatePhone: "",
  deviceType: "mobile",
  brand: "",
  model: "",
  serialNumber: "",
  conditionNotes: "",
  repairReason: "",
  problemDescription: "",
  estimatedCost: 0,
}

export function RepairForm({ onSubmit, isLoading: externalLoading }: RepairFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isLoading = externalLoading || isSubmitting

  const form = useForm<RepairFormData>({
    resolver: zodResolver(repairFormSchema),
    defaultValues,
  })

  const handleSubmit = async (data: RepairFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      form.reset(defaultValues)
    } catch (error) {
      console.error("[Firebase] Repair form error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Device Repair Intake Form</CardTitle>
        <CardDescription>Enter the device and repair details below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alternatePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Device Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Device Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Input placeholder="e.g., Apple, Samsung, Dell" {...field} />
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
                        <Input placeholder="e.g., iPhone 14, Galaxy S22" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Repair Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Repair Details</h3>
              <FormField
                control={form.control}
                name="conditionNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Condition</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the device's current condition (scratches, damage, etc.)"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repairReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Repair *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Screen repair, Battery replacement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="problemDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problem Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the problem"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimatedCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Cost *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                        <Input
                          type="number"
                          step="0.01"
                          className="pl-7"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Repair Ticket"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
