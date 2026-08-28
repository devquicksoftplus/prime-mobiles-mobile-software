"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTableSkeleton } from "@/components/loading-skeletons"
import { EmptyInventory } from "@/components/empty-state"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { useFirestore } from "@/hooks/use-firestore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface InventoryItem {
  id?: string
  partName: string
  category: string
  quantity: number
  unitPrice: number
  supplier?: string
  reorderLevel: number
}

export function InventoryTable() {
  const { isAuthenticated } = useAuth()
  const { getInventory, createInventoryItem } = useFirestore()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [formData, setFormData] = useState<InventoryItem>({
    partName: "",
    category: "",
    quantity: 0,
    unitPrice: 0,
    supplier: "",
    reorderLevel: 5,
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  async function fetchItems() {
    try {
      const data = await getInventory()
      setItems(data as InventoryItem[])
    } catch (error) {
      console.error("[Firebase] Error fetching inventory:", error)
      const errorMsg = "Error loading inventory. Please check your connection."
      setError(errorMsg)
      toast.error("Failed to load inventory")
    } finally {
      setLoading(false)
    }
  }

  async function handleAddItem() {
    try {
      await createInventoryItem(formData)
      setFormData({
        partName: "",
        category: "",
        quantity: 0,
        unitPrice: 0,
        supplier: "",
        reorderLevel: 5,
      })
      toast.success("Item added to inventory")
      fetchItems()
    } catch (error) {
      console.error("[Firebase] Error adding item:", error)
      toast.error("Failed to add item")
      setError("Error adding item to inventory")
    }
  }

  const getLowStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.reorderLevel) {
      return <Badge className="bg-red-100 text-red-700 rounded-full">Low Stock</Badge>
    }
    if (item.quantity <= item.reorderLevel + 5) {
      return <Badge className="bg-amber-100 text-amber-700 rounded-full">Running Low</Badge>
    }
    return <Badge className="bg-green-100 text-green-700 rounded-full">In Stock</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold text-primary">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage spare parts and equipment</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={!!error} className="bg-primary hover:bg-primary/90 rounded-lg">Add Item</Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
              <DialogDescription>Add a new part or equipment to your inventory</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <input
                placeholder="Part Name"
                value={formData.partName}
                onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              <input
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              <input
                type="number"
                placeholder="Unit Price"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              <input
                placeholder="Supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              <input
                type="number"
                placeholder="Reorder Level"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              <Button onClick={handleAddItem} className="w-full bg-primary hover:bg-primary/90 rounded-lg">
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <p className="text-destructive text-sm">{error}</p>
          <p className="text-muted-foreground text-xs mt-2">
            Please check your Firebase configuration and try again.
          </p>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden animate-in fade-in-50 duration-300">
        {loading ? (
          <DataTableSkeleton columns={6} rows={5} />
        ) : items.length === 0 ? (
          <EmptyInventory />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border/30">
                <tr>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Part Name</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Category</th>
                  <th className="text-center py-4 px-6 text-muted-foreground font-medium">Quantity</th>
                  <th className="text-right py-4 px-6 text-muted-foreground font-medium">Unit Price</th>
                  <th className="text-right py-4 px-6 text-muted-foreground font-medium">Total Value</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id?.toString()} className="border-b border-border/30 hover:bg-[var(--row-hover)] transition-colors">
                    <td className="py-4 px-6 font-medium">{item.partName}</td>
                    <td className="py-4 px-6 text-muted-foreground">{item.category}</td>
                    <td className="py-4 px-6 text-center">{item.quantity}</td>
                    <td className="py-4 px-6 text-right">₹{item.unitPrice.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right font-semibold">
                      ₹{(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                    <td className="py-4 px-6">{getLowStockStatus(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
