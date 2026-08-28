"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { RepairTicket } from "@/lib/schemas"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function TicketPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [ticket, setTicket] = useState<RepairTicket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState<string>("")
  const [actualCost, setActualCost] = useState<string>("")

  const ticketId = Array.isArray(params.id) ? params.id[0] : params.id

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/repairs/${ticketId}`)
        if (response.ok) {
          const data = await response.json()
          setTicket(data)
          setStatus(data.status)
          setActualCost(data.actualCost?.toString() || "")
        }
      } catch (error) {
        console.error("Failed to fetch ticket:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTicket()
  }, [ticketId])

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/repairs/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          actualCost: actualCost ? Number.parseFloat(actualCost) : undefined,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Ticket updated successfully",
        })
        window.location.reload()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-muted-foreground">Loading ticket...</p>
        </div>
      </main>
    )
  }

  if (!ticket) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-muted-foreground">Ticket not found</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Name</Label>
                  <p className="text-lg font-medium">{ticket.customerName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">Primary Phone</Label>
                    <p className="text-lg">{ticket.phoneNumber}</p>
                  </div>
                  {ticket.alternatePhone && (
                    <div>
                      <Label className="text-muted-foreground text-sm">Alternate Phone</Label>
                      <p className="text-lg">{ticket.alternatePhone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">Brand</Label>
                    <p className="text-lg font-medium">{ticket.brand}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Model</Label>
                    <p className="text-lg">{ticket.model}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">Type</Label>
                    <p className="text-lg capitalize">{ticket.deviceType}</p>
                  </div>
                  {ticket.serialNumber && (
                    <div>
                      <Label className="text-muted-foreground text-sm">Serial Number</Label>
                      <p className="text-lg">{ticket.serialNumber}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Repair Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Current Condition</Label>
                  <p className="text-base">{ticket.conditionNotes}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Reason for Repair</Label>
                  <p className="text-base font-medium">{ticket.repairReason}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Problem Description</Label>
                  <p className="text-base">{ticket.problemDescription}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-card sticky top-4">
              <CardHeader>
                <CardTitle>Ticket Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status" className="text-sm">
                    Status
                  </Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="actualCost" className="text-sm">
                    Actual Cost
                  </Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      id="actualCost"
                      type="number"
                      step="0.01"
                      value={actualCost}
                      onChange={(e) => setActualCost(e.target.value)}
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <Button onClick={handleUpdate} className="w-full bg-primary hover:bg-primary/90" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Ticket"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Cost Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated</span>
                  <span className="font-medium">${ticket.estimatedCost.toFixed(2)}</span>
                </div>
                {actualCost && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Actual</span>
                    <span className="font-medium">${Number.parseFloat(actualCost).toFixed(2)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
