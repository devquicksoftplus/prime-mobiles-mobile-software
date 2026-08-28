// Re-export all inventory feature components
export { InventoryPage } from "./components/inventory-page"
export { InventoryTable } from "./components/inventory-table"
export { InventoryForm } from "./components/inventory-form"
export { EditInventoryForm } from "./components/edit-inventory-form"
export { StockStatusBadge, getStockStatus, type StockStatus } from "./components/stock-status-badge"

// Re-export hooks
export { useInventory } from "./hooks/use-inventory"

// Re-export types from validation schemas
export type { InventoryItem, InventoryFormData } from "@/lib/validations"

