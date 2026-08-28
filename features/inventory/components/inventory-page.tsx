"use client"

import { PageLayout } from "@/components/page-layout"
import { InventoryTable } from "./inventory-table"

export function InventoryPage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <InventoryTable />
      </div>
    </PageLayout>
  )
}
