"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CreditCard,
  RefreshCw,
  Search,
  Filter,
  Download,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Crown,
  Sparkles,
  Zap,
  Gift,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AdminLayout } from "@/features/admin/components/admin-layout"
import { StatCard } from "@/features/admin/components/stat-card"
import { toast } from "sonner"

interface Subscription {
  uid: string
  email: string
  name: string
  subscription?: {
    planId: "basic" | "pro" | "elite"
    status: "active" | "expired" | "cancelled" | "trial"
    startDate: string
    endDate: string
    autoRenew: boolean
  }
}

const planDetails = {
  trial: { name: "Trial", price: 0, icon: Gift, color: "emerald" },
  basic: { name: "Basic", price: 400, icon: Zap, color: "slate" },
  pro: { name: "Pro", price: 700, icon: Sparkles, color: "blue" },
  elite: { name: "Elite", price: 999, icon: Crown, color: "amber" },
}

const statusDetails = {
  active: { label: "Active", icon: CheckCircle, color: "emerald" },
  trial: { label: "Trial", icon: Clock, color: "blue" },
  expired: { label: "Expired", icon: XCircle, color: "red" },
  cancelled: { label: "Cancelled", icon: AlertCircle, color: "slate" },
}

export default function SubscriptionsPage() {
  const router = useRouter()
  const [users, setUsers] = useState<Subscription[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Subscription[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [planFilter, setPlanFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Subscription | null>(null)
  const [editData, setEditData] = useState({
    planId: "basic" as "basic" | "pro" | "elite",
    status: "active" as "active" | "expired" | "cancelled" | "trial",
    endDate: "",
    autoRenew: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    let result = users

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      )
    }

    // Apply plan filter
    if (planFilter !== "all") {
      if (planFilter === "trial") {
        result = result.filter((user) => user.subscription?.status === "trial")
      } else {
        result = result.filter(
          (user) => user.subscription?.planId === planFilter
        )
      }
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (user) => (user.subscription?.status || "active") === statusFilter
      )
    }

    setFilteredUsers(result)
  }, [searchQuery, planFilter, statusFilter, users])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
        setFilteredUsers(data.users || [])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
    setIsLoading(false)
  }

  const getStats = () => {
    const active = users.filter(
      (u) => u.subscription?.status === "active" || u.subscription?.status === "trial"
    ).length
    const expired = users.filter((u) => u.subscription?.status === "expired").length
    const premium = users.filter(
      (u) => u.subscription?.planId === "pro" || u.subscription?.planId === "elite"
    ).length
    const revenue = users.reduce((acc, u) => {
      const planId = u.subscription?.planId
      const status = u.subscription?.status || "active"
      if (status === "active" && planId) {
        return acc + (planDetails[planId]?.price || 0)
      }
      return acc
    }, 0)

    return { active, expired, premium, revenue }
  }

  const stats = getStats()

  const openEditDialog = (user: Subscription) => {
    setSelectedUser(user)
    setEditData({
      planId: user.subscription?.planId || "basic",
      status: user.subscription?.status || "active",
      endDate: user.subscription?.endDate
        ? new Date(user.subscription.endDate).toISOString().split("T")[0]
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      autoRenew: user.subscription?.autoRenew || false,
    })
    setEditDialogOpen(true)
  }

  const handleUpdateSubscription = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/subscriptions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: selectedUser.uid,
          subscription: {
            planId: editData.planId,
            status: editData.status,
            startDate: selectedUser.subscription?.startDate || new Date().toISOString(),
            endDate: new Date(editData.endDate).toISOString(),
            autoRenew: editData.autoRenew,
          },
        }),
      })

      if (response.ok) {
        toast.success("Subscription updated successfully")
        setEditDialogOpen(false)
        fetchUsers()
      } else {
        toast.error("Failed to update subscription")
      }
    } catch (error) {
      console.error("Error updating subscription:", error)
      toast.error("Failed to update subscription")
    }
    setIsSubmitting(false)
  }

  const exportSubscriptions = () => {
    const csvContent = [
      ["Name", "Email", "Plan", "Status", "Start Date", "End Date", "Auto Renew"],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,
        user.subscription?.status === "trial" ? "Trial" : (user.subscription?.planId || "None"),
        user.subscription?.status || "active",
        user.subscription?.startDate
          ? new Date(user.subscription.startDate).toLocaleDateString()
          : "",
        user.subscription?.endDate
          ? new Date(user.subscription.endDate).toLocaleDateString()
          : "",
        user.subscription?.autoRenew ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `subscriptions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout
      title="Subscriptions"
      description="Manage user subscription plans and billing"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Subscriptions"
          value={stats.active}
          icon={CheckCircle}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Expired"
          value={stats.expired}
          icon={XCircle}
          iconClassName="bg-red-50 text-red-600"
        />
        <StatCard
          title="Premium Users"
          value={stats.premium}
          icon={Crown}
          iconClassName="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          icon={CreditCard}
          iconClassName="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-32 bg-white border-slate-200 text-slate-900">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="elite">Elite</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-white border-slate-200 text-slate-900">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchUsers}
            disabled={isLoading}
            className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="outline"
            onClick={exportSubscriptions}
            className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Subscriptions Table */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-600" />
            All Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-slate-50 bg-slate-50/50">
                  <TableHead className="text-slate-600">User</TableHead>
                  <TableHead className="text-slate-600">Plan</TableHead>
                  <TableHead className="text-slate-600">Status</TableHead>
                  <TableHead className="text-slate-600 hidden md:table-cell">Expires</TableHead>
                  <TableHead className="text-slate-600 hidden lg:table-cell">Auto Renew</TableHead>
                  <TableHead className="text-slate-600 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                      Loading subscriptions...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                      No subscriptions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    // Show "trial" as plan if status is trial, otherwise use planId
                    const displayPlan = user.subscription?.status === "trial" ? "trial" : (user.subscription?.planId || "basic")
                    const status = user.subscription?.status || "active"
                    const PlanIcon = planDetails[displayPlan]?.icon || planDetails.basic.icon
                    const StatusIcon = statusDetails[status].icon

                    return (
                      <TableRow
                        key={user.uid}
                        className="border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-${planDetails[displayPlan]?.color || "slate"}-200 text-${planDetails[displayPlan]?.color || "slate"}-700 bg-${planDetails[displayPlan]?.color || "slate"}-50`}
                          >
                            <PlanIcon className="w-3 h-3 mr-1" />
                            {planDetails[displayPlan]?.name || "Basic"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-${statusDetails[status].color}-200 text-${statusDetails[status].color}-700 bg-${statusDetails[status].color}-50`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusDetails[status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-slate-600">
                          {user.subscription?.endDate
                            ? new Date(user.subscription.endDate).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant="outline"
                            className={
                              user.subscription?.autoRenew
                                ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                                : "border-slate-200 text-slate-600 bg-white"
                            }
                          >
                            {user.subscription?.autoRenew ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(user)}
                            className="text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Subscription Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-white border-slate-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900 flex items-center gap-2">
              <Edit className="w-5 h-5 text-indigo-600" />
              Edit Subscription
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Update subscription for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-600">Plan</Label>
              <Select
                value={editData.planId}
                onValueChange={(value: any) => setEditData({ ...editData, planId: value })}
              >
                <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="basic">Basic (₹400/month)</SelectItem>
                  <SelectItem value="pro">Pro (₹700/month)</SelectItem>
                  <SelectItem value="elite">Elite (₹999/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600">Status</Label>
              <Select
                value={editData.status}
                onValueChange={(value: any) => setEditData({ ...editData, status: value })}
              >
                <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600">Expiry Date</Label>
              <Input
                type="date"
                value={editData.endDate}
                onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                className="bg-white border-slate-200 text-slate-900"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRenew"
                checked={editData.autoRenew}
                onChange={(e) => setEditData({ ...editData, autoRenew: e.target.checked })}
                className="rounded border-slate-300 bg-white"
              />
              <Label htmlFor="autoRenew" className="text-slate-600">
                Auto-renew subscription
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSubscription}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              {isSubmitting ? "Updating..." : "Update Subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
