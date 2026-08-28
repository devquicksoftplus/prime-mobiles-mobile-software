"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { inventoryFormSchema, type InventoryFormData, type InventoryItem } from "@/lib/validations"
import { useState, useEffect } from "react"

interface EditInventoryFormProps {
  item: InventoryItem & { id: string }
  onSubmit: (data: Partial<InventoryItem>) => Promise<void>
  onClose: () => void
}

export function EditInventoryForm({ item, onSubmit, onClose }: EditInventoryFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      partName: item.partName || "",
      category: item.category || "",
      quantity: item.quantity || 0,
      buyingPrice: item.buyingPrice || 0,
      sellingPrice: item.sellingPrice || 0,
      gst: item.gst || 18,
      supplierName: item.supplierName || "",
      supplierPhone: item.supplierPhone || "",
      warranty: item.warranty || "",
    },
  })

  // Reset form when item changes
  useEffect(() => {
    form.reset({
      partName: item.partName || "",
      category: item.category || "",
      quantity: item.quantity || 0,
      buyingPrice: item.buyingPrice || 0,
      sellingPrice: item.sellingPrice || 0,
      gst: item.gst || 18,
      supplierName: item.supplierName || "",
      supplierPhone: item.supplierPhone || "",
      warranty: item.warranty || "",
    })
  }, [item, form])

  const handleSubmit = async (data: InventoryFormData) => {
    try {
      setIsLoading(true)
      await onSubmit(data)
      onClose()
    } catch (error) {
      console.error("[Firebase] Error updating product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update the product details</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="partName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., iPhone 14 Screen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Screens" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buyingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buying Price *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          className="pl-7"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          className="pl-7"
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST (%)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          min={0}
                          max={100}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-2.5 text-muted-foreground">%</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warranty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 6 months" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supplierName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ABC Electronics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 9876543210" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
