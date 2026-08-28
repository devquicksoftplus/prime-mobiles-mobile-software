"use client"

import { PageLayout } from "@/components/page-layout"
import { RepairsTable } from "./repairs-table"
import { RepairForm } from "./repair-form"
import { useRepairs } from "../hooks/use-repairs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RepairsPage() {
  const { createRepair } = useRepairs()

  const handleSubmit = async (data: any) => {
    await createRepair(data)
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Repairs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage repair tickets and track progress
          </p>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">All Repairs</TabsTrigger>
            <TabsTrigger value="new">New Repair</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-6">
            <RepairsTable />
          </TabsContent>
          <TabsContent value="new" className="mt-6">
            <RepairForm onSubmit={handleSubmit} />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}
