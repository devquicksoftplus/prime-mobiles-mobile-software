"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableSkeleton } from "@/components/loading-skeletons"
import { EmptyInventory } from "@/components/empty-state"
import { InventoryForm } from "./inventory-form"
import { EditInventoryForm } from "./edit-inventory-form"
import { useInventory } from "../hooks/use-inventory"
import type { InventoryFormData, InventoryItem } from "@/lib/validations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Filter,
  X
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type StockLevel = "low" | "medium" | "high"

const getStockLevel = (quantity: number): StockLevel => {
  if (quantity < 10) return "low"
  if (quantity < 20) return "medium"
  return "high"
}

const stockLevelConfig: Record<StockLevel, { label: string; className: string }> = {
  low: {
    label: "Low Stock",
    className: "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400",
  },
  medium: {
    label: "Medium Stock",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  high: {
    label: "In Stock",
    className: "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
  },
}

export function InventoryTable() {
  const { items, isLoading, error, createItem, updateItem, deleteItem } = useInventory()
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")
  
  // Edit dialog state
  const [editingItem, setEditingItem] = useState<(InventoryItem & { id: string }) | null>(null)
  
  // Delete confirmation state
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; name: string } | null>(null)

  // Get unique categories from items
  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category))
    return Array.from(cats).sort()
  }, [items])

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = !searchQuery || 
        item.partName.toLowerCase().includes(searchLower) ||
        (item.supplierName?.toLowerCase().includes(searchLower) ?? false)
      
      // Category filter
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      
      // Stock filter
      const stockLevel = getStockLevel(item.quantity)
      const matchesStock = stockFilter === "all" || stockLevel === stockFilter
      
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [items, searchQuery, categoryFilter, stockFilter])

  const handleAddItem = async (data: InventoryFormData) => {
    await createItem(data)
  }

  const handleEditItem = async (data: Partial<InventoryItem>) => {
    if (editingItem) {
      await updateItem(editingItem.id, data)
      setEditingItem(null)
    }
  }

  const handleDeleteItem = async () => {
    if (deleteConfirmItem) {
      await deleteItem(deleteConfirmItem.id)
      setDeleteConfirmItem(null)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setStockFilter("all")
  }

  const hasActiveFilters = searchQuery || categoryFilter !== "all" || stockFilter !== "all"

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-destructive text-sm">{error}</p>
        <p className="text-muted-foreground text-xs mt-2">
          Please check your Firebase configuration and try again.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold text-primary">All Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage spare parts and equipment
          </p>
        </div>
        <InventoryForm onSubmit={handleAddItem} disabled={!!error} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by part name or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Stock Filter */}
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Stock Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock Levels</SelectItem>
            <SelectItem value="low">Low Stock (&lt;10)</SelectItem>
            <SelectItem value="medium">Medium Stock (&lt;20)</SelectItem>
            <SelectItem value="high">In Stock (≥20)</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Results count */}
      {hasActiveFilters && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredItems.length} of {items.length} products
        </p>
      )}

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden animate-in fade-in-50 duration-300">
        {isLoading ? (
          <DataTableSkeleton columns={9} rows={5} />
        ) : items.length === 0 ? (
          <EmptyInventory />
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <Search className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/30">
                  <TableHead className="text-muted-foreground font-medium">
                    Part Name
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium">
                    Category
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-center">
                    Qty
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">
                    Buying Price
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">
                    Selling Price
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-center">
                    GST
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium">
                    Supplier
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium">
                    Stock Status
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const stockLevel = getStockLevel(item.quantity)
                  const stockConfig = stockLevelConfig[stockLevel]
                  
                  return (
                    <TableRow
                      key={item.id}
                      className="border-b border-border/30 hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">{item.partName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ₹{(item.buyingPrice || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{(item.sellingPrice || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {item.gst || 0}%
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex flex-col">
                          <span>{item.supplierName || "-"}</span>
                          {item.supplierPhone && (
                            <span className="text-xs text-muted-foreground/70">{item.supplierPhone}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`rounded-full font-medium ${stockConfig.className}`}>
                          {stockConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingItem(item)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeleteConfirmItem({ id: item.id, name: item.partName })}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {editingItem && (
        <EditInventoryForm
          item={editingItem}
          onSubmit={handleEditItem}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmItem} onOpenChange={() => setDeleteConfirmItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteConfirmItem?.name}&quot;? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteItem}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
