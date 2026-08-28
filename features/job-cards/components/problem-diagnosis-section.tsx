"use client"

import { useState, useEffect, useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import type { JobCardFormData } from "@/lib/validations"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select"
import { useInventory } from "@/features/inventory/hooks/use-inventory"
import { Loader2 } from "lucide-react"

interface ProblemDiagnosisSectionProps {
  form: UseFormReturn<JobCardFormData>
}

export function ProblemDiagnosisSection({ form }: ProblemDiagnosisSectionProps) {
  const { items: inventoryItems, isLoading: isLoadingInventory } = useInventory()
  const [selectedParts, setSelectedParts] = useState<string[]>([])

  // Convert inventory items to multi-select options
  const productOptions: MultiSelectOption[] = useMemo(() => {
    return inventoryItems.map((item) => ({
      value: item.id,
      label: `${item.partName} (₹${item.sellingPrice || 0})`,
      category: item.category,
    }))
  }, [inventoryItems])

  // Initialize selected parts from form value
  useEffect(() => {
    const currentValue = form.getValues("requiredParts")
    if (currentValue) {
      // Parse existing comma-separated values and try to match with inventory
      const parts = currentValue.split(",").map((p) => p.trim()).filter(Boolean)
      
      // Try to find matching inventory item IDs
      const matchedIds = parts.map((partName) => {
        // Check if it's already an ID
        const byId = inventoryItems.find((item) => item.id === partName)
        if (byId) return byId.id
        
        // Check by part name
        const byName = inventoryItems.find(
          (item) => item.partName.toLowerCase() === partName.toLowerCase()
        )
        return byName?.id || partName
      })
      
      setSelectedParts(matchedIds)
    }
  }, [inventoryItems, form])

  // Update form value when selection changes
  const handleSelectionChange = (selected: string[]) => {
    setSelectedParts(selected)
    
    // Convert selected IDs to part names for storage
    const partNames = selected.map((id) => {
      const item = inventoryItems.find((i) => i.id === id)
      return item?.partName || id
    })
    
    form.setValue("requiredParts", partNames.join(", "), { shouldDirty: true })
  }

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="problemDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Problem Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the issue..."
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
        name="technicianDiagnosis"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Technician Diagnosis</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Technician findings..."
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
        name="requiredParts"
        render={() => (
          <FormItem>
            <FormLabel>Required Parts / Materials</FormLabel>
            <FormControl>
              <div className="relative">
                {isLoadingInventory ? (
                  <div className="flex items-center justify-center h-10 border rounded-md bg-muted/50">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Loading products...
                    </span>
                  </div>
                ) : productOptions.length === 0 ? (
                  <div className="flex items-center justify-center h-10 border rounded-md bg-muted/50">
                    <span className="text-sm text-muted-foreground">
                      No products available. Add products in Inventory.
                    </span>
                  </div>
                ) : (
                  <MultiSelect
                    options={productOptions}
                    selected={selectedParts}
                    onChange={handleSelectionChange}
                    placeholder="Select required parts from inventory..."
                    emptyMessage="No products found. Try a different search."
                  />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
