"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomerListSkeleton } from "@/components/loading-skeletons"
import { EmptyCustomers } from "@/components/empty-state"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { useFirestore } from "@/hooks/use-firestore"

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  createdAt: string
}

export function CustomersList() {
  const { isAuthenticated } = useAuth()
  const { getCustomers } = useFirestore()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCustomers() {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        const data = await getCustomers()
        setCustomers(data as Customer[])
      } catch (error) {
        console.error("[Firebase] Error fetching customers:", error)
        toast.error("Failed to load customers")
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [isAuthenticated, getCustomers])

  if (loading) {
    return <CustomerListSkeleton />
  }

  if (customers.length === 0) {
    return (
      <Card className="rounded-2xl border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyCustomers />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl border-border/50 animate-in fade-in-50 duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.slice(0, 5).map((customer, index) => (
            <div 
              key={customer.id} 
              className="flex items-start justify-between border-b pb-3 last:border-0 hover:bg-muted/30 -mx-2 px-2 py-2 rounded-lg transition-colors"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="space-y-1">
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
                {customer.email && <p className="text-sm text-muted-foreground">{customer.email}</p>}
              </div>
              <div className="text-sm text-muted-foreground text-right">
                {new Date(customer.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
