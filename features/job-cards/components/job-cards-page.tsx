"use client"

import { PageLayout } from "@/components/page-layout"
import { JobCardsTable } from "./job-cards-table"

export function JobCardsPage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <JobCardsTable />
      </div>
    </PageLayout>
  )
}
