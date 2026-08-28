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
import { useEffect, useState } from "react"

interface CostEstimateSectionProps {
  form: UseFormReturn<JobCardFormData>
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

export function CostEstimateSection({ form }: CostEstimateSectionProps) {
  // Calculate total from individual costs
  const laborCost = parseFloat(form.watch("laborCost") || "0")
  const partsCost = parseFloat(form.watch("partsCost") || "0")
  const serviceCost = parseFloat(form.watch("serviceCost") || "0")
  const total = laborCost + partsCost + serviceCost
  
  // State for 12-hour time format
  const deliveryDateValue = form.watch("deliveryDate")
  const [timeState, setTimeState] = useState(() => parseDeliveryDateTime(deliveryDateValue))
  
  // Sync state when deliveryDate changes from external source
  useEffect(() => {
    const parsed = parseDeliveryDateTime(deliveryDateValue)
    setTimeState(parsed)
  }, [deliveryDateValue])
  
  // Update form when time state changes
  const updateDeliveryDate = (newState: { date: string; hour: string; minute: string; period: string }) => {
    setTimeState(newState)
    const combined = combineDateTime(newState.date, newState.hour, newState.minute, newState.period)
    form.setValue("deliveryDate", combined, { shouldValidate: true })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="laborCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Labor Cost</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="partsCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parts Cost</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Cost</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Total Display */}
      <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
        <span className="font-medium text-muted-foreground">Estimated Total</span>
        <span className="text-xl font-semibold text-primary">₹{total.toFixed(2)}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="advanceReceived"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Advance Received</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="deliveryDate"
          render={() => (
            <FormItem className="col-span-1 md:col-span-2">
              <FormLabel>Delivery Date & Time *</FormLabel>
              <FormControl>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Date Input - Full width on mobile */}
                  <Input
                    type="date"
                    value={timeState.date}
                    onChange={(e) => updateDeliveryDate({ ...timeState, date: e.target.value })}
                    className="w-full sm:w-auto sm:min-w-[160px]"
                  />
                  
                  {/* Time inputs - Full row on mobile */}
                  <div className="flex items-center gap-2">
                    {/* Hour Select (1-12) */}
                    <Select
                      value={timeState.hour}
                      onValueChange={(value) => updateDeliveryDate({ ...timeState, hour: value })}
                    >
                      <SelectTrigger className="w-[70px] sm:w-[80px]">
                        <SelectValue placeholder="Hr" />
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
                      onValueChange={(value) => updateDeliveryDate({ ...timeState, minute: value })}
                    >
                      <SelectTrigger className="w-[70px] sm:w-[80px]">
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
                      onValueChange={(value) => updateDeliveryDate({ ...timeState, period: value })}
                    >
                      <SelectTrigger className="w-[70px] sm:w-[80px]">
                        <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
