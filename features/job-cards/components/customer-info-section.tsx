"use client"

import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import type { JobCardFormData } from "@/lib/validations"
import { CustomerAutocomplete } from "./customer-autocomplete"
import { useCallback } from "react"

interface CustomerInfoSectionProps {
  form: UseFormReturn<JobCardFormData>
  onCustomerPhoneChange?: (phone: string | null) => void
}

interface Customer {
  id: string
  name: string
  phone: string
  alternatePhone?: string
  address?: string
}

export function CustomerInfoSection({ form, onCustomerPhoneChange }: CustomerInfoSectionProps) {
  // Handle customer selection from autocomplete
  const handleCustomerSelect = useCallback(
    (customer: Customer | null) => {
      if (customer) {
        // Prefill all customer details
        form.setValue("customerName", customer.name, { shouldValidate: true })
        form.setValue("phone", customer.phone, { shouldValidate: true })
        form.setValue("alternatePhone", customer.alternatePhone || "", { shouldValidate: true })
        form.setValue("address", customer.address || "", { shouldValidate: true })
        // Notify parent about customer selection for history display
        onCustomerPhoneChange?.(customer.phone)
      } else {
        // New customer - clear history
        onCustomerPhoneChange?.(null)
      }
    },
    [form, onCustomerPhoneChange]
  )

  return (
    <div className="space-y-4">
      {/* Customer Name - Full width to prevent overlap with autocomplete dropdown */}
      <FormField
        control={form.control}
        name="customerName"
        render={({ field }) => (
          <FormItem className="relative z-20">
            <FormLabel>Customer Name *</FormLabel>
            <CustomerAutocomplete
              value={field.value}
              onChange={field.onChange}
              onSelect={handleCustomerSelect}
              placeholder="Search or enter customer name..."
            />
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Phone numbers - 2 column grid on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Phone number" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    // Update customer history when phone changes
                    onCustomerPhoneChange?.(e.target.value || null)
                  }}
                />
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
                <Input placeholder="Alternate number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Address - Full width */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="Full address" className="w-full" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
