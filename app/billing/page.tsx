import { PageLayout } from "@/components/page-layout"
import { BillingContent } from "@/components/billing-content"

export default function BillingPage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <BillingContent />
      </div>
    </PageLayout>
  )
}
