"use client"

import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Search, Download, ChevronLeft, ChevronRight, Plus, MoreVertical, Edit, Trash2, Eye, FileDown, Share2 } from "lucide-react"
import { useState } from "react"
import { DataTableSkeleton } from "@/components/loading-skeletons"
import { EmptyJobCards } from "@/components/empty-state"
import { StatusBadge } from "./status-badge"
import { useJobCards } from "../hooks/use-job-cards"
import { useCompany } from "@/contexts/company-context"
import type { JobCard, JobCardStatus } from "@/lib/validations"
import { downloadInvoice, downloadMultipleInvoices, shareOnWhatsApp } from "@/lib/unified-invoice-service"

// Extended type to include all form fields stored in job card
interface ExtendedJobCard extends JobCard {
  id: string
  phone?: string
  alternatePhone?: string
  address?: string
  imei?: string
  condition?: string
  accessories?: string
  conditionImages?: Array<{ url: string; publicId: string }>
}

// Helper function to safely parse numbers (handles strings from Firebase)
function safeNumber(value: unknown): number {
  if (typeof value === "number" && !isNaN(value)) return value
  if (typeof value === "string") {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

// Helper function to format currency
function formatCurrency(value: unknown): string {
  return `₹${safeNumber(value).toFixed(2)}`
}

export function JobCardsTable() {
  const router = useRouter()
  const { jobCards, isLoading, error, updateJobCard, deleteJobCard } = useJobCards()
  const { company } = useCompany()
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState("10")
  const [activeTab, setActiveTab] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedItem, setSelectedItem] = useState<ExtendedJobCard | null>(null)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)

  // Helper to add company info to job card for invoice
  const withCompanyInfo = (item: ExtendedJobCard) => ({
    ...item,
    companyInfo: company ? {
      name: company.companyName,
      tagline: company.tagline,
      phone: company.phone,
      alternatePhone: company.alternatePhone,
      email: company.email,
      address: company.address,
      city: company.city,
      state: company.state,
      pincode: company.pincode,
      gstNumber: company.gstNumber,
      logoUrl: company.logoUrl,
      website: company.website,
      selectedTerms: company.selectedTerms,
      customTerms: company.customTerms,
      termsAndConditions: company.termsAndConditions,
    } : undefined
  })

  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const toggleAll = () => {
    if (selectedRows.size === jobCards.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(jobCards.map((item) => item.id || "")))
    }
  }

  // Get unique device types for filter dropdown
  const uniqueTypes = Array.from(
    new Set(jobCards.map((item) => item.deviceInfo?.type).filter(Boolean))
  ).sort() as string[]

  // Filter data based on search and brand
  const filteredData = jobCards
    .filter((item) => {
      const extItem = item as ExtendedJobCard
      
      // Device type filter
      if (typeFilter !== "all" && item.deviceInfo?.type !== typeFilter) {
        return false
      }
      
      // Status filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false
      }
      
      // Search filter
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        item.customerName?.toLowerCase().includes(query) ||
        item.problemDescription?.toLowerCase().includes(query) ||
        item.id?.toLowerCase().includes(query) ||
        extItem.phone?.toLowerCase().includes(query) ||
        extItem.imei?.toLowerCase().includes(query) ||
        item.deviceInfo?.model?.toLowerCase().includes(query) ||
        item.deviceInfo?.brand?.toLowerCase().includes(query) ||
        item.requiredParts?.some(part => part.toLowerCase().includes(query))
      )
    })
    .sort((a, b) => {
      const extA = a as ExtendedJobCard
      const extB = b as ExtendedJobCard
      
      switch (sortBy) {
        case "newest":
          return new Date(extB.createdAt || 0).getTime() - new Date(extA.createdAt || 0).getTime()
        case "oldest":
          return new Date(extA.createdAt || 0).getTime() - new Date(extB.createdAt || 0).getTime()
        case "a-z":
          return (a.customerName || "").localeCompare(b.customerName || "")
        case "z-a":
          return (b.customerName || "").localeCompare(a.customerName || "")
        default:
          return 0
      }
    })

  // Pagination
  const perPage = parseInt(rowsPerPage)
  const totalPages = Math.ceil(filteredData.length / perPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  ) as ExtendedJobCard[]

  const handleRowClick = (item: ExtendedJobCard) => {
    router.push(`/job-cards/${item.id}`)
  }

  if (isLoading) {
    return <DataTableSkeleton rows={5} columns={6} />
  }

  if (error) {
    return (
      <div className="bg-card rounded-2xl border border-destructive/20 p-6 animate-in fade-in-50 duration-300">
        <p className="text-destructive text-sm">{error}</p>
        <p className="text-muted-foreground text-xs mt-2">
          Please check your Firebase configuration and try again.
        </p>
      </div>
    )
  }

  if (jobCards.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border">
        <EmptyJobCards onCreateClick={() => router.push("/intake")} />
      </div>
    )
  }

  // All Details - Compact Table View
  const AllDetailsView = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-transparent border-b border-border/30 hover:bg-transparent">
          <TableHead className="w-12">
            <Checkbox
              checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
              onCheckedChange={toggleAll}
              className="border-muted-foreground/30"
            />
          </TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Customer</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Phone</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Type</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Brand</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Total</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Status</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm text-center">View</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedData.map((item) => {
          const isSelected = selectedRows.has(item.id)
          const total = safeNumber(item.costEstimate?.total)
          return (
            <TableRow
              key={item.id}
              data-state={isSelected ? "selected" : undefined}
              className="hover:bg-muted/50"
            >
              <TableCell>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleRow(item.id)}
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary"
                />
              </TableCell>
              <TableCell className="font-medium">{item.customerName || "N/A"}</TableCell>
              <TableCell>{item.phone || "N/A"}</TableCell>
              <TableCell className="capitalize">{item.deviceInfo?.type || "N/A"}</TableCell>
              <TableCell>{item.deviceInfo?.brand || "N/A"}</TableCell>
              <TableCell className="font-semibold text-primary">{formatCurrency(total)}</TableCell>
              <TableCell>
                <StatusBadge 
                  status={item.status} 
                  onStatusChange={(newStatus: JobCardStatus) => updateJobCard(item.id, { status: newStatus })}
                />
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                  onClick={() => setSelectedItem(item)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => downloadInvoice(withCompanyInfo(item))}>
                      <FileDown className="w-4 h-4 mr-2" />
                      Download Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => shareOnWhatsApp(withCompanyInfo(item))}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share on WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/job-cards/${item.id}/edit`)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setItemToDelete(item.id)
                        setDeleteDialogOpen(true)
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
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
  )

  // Device Info Table (Customer + Device details)
  const DeviceInfoTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-transparent border-b border-border/30 hover:bg-transparent">
          <TableHead className="w-12">
            <Checkbox
              checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
              onCheckedChange={toggleAll}
              className="border-muted-foreground/30"
            />
          </TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Customer</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Phone</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Address</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Device Type</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Brand</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Model</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">IMEI</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Condition</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedData.map((item) => {
          const isSelected = selectedRows.has(item.id)
          return (
            <TableRow
              key={item.id}
              data-state={isSelected ? "selected" : undefined}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(item)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleRow(item.id)}
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </TableCell>
              <TableCell className="font-medium">{item.customerName || "N/A"}</TableCell>
              <TableCell>{item.phone || "N/A"}</TableCell>
              <TableCell>
                <span className="max-w-[120px] truncate block">{item.address || "N/A"}</span>
              </TableCell>
              <TableCell>{item.deviceInfo?.type || "N/A"}</TableCell>
              <TableCell>{item.deviceInfo?.brand || "N/A"}</TableCell>
              <TableCell>{item.deviceInfo?.model || "N/A"}</TableCell>
              <TableCell className="font-mono text-xs">{item.imei || "N/A"}</TableCell>
              <TableCell>
                <span className="max-w-[100px] truncate block">{item.condition || "N/A"}</span>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )

  // Problem Table (Customer + Problem details)
  const ProblemTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-transparent border-b border-border/30 hover:bg-transparent">
          <TableHead className="w-12">
            <Checkbox
              checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
              onCheckedChange={toggleAll}
              className="border-muted-foreground/30"
            />
          </TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Customer</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Phone</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Device</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Problem Description</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Technician Diagnosis</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Required Parts</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedData.map((item) => {
          const isSelected = selectedRows.has(item.id)
          return (
            <TableRow
              key={item.id}
              data-state={isSelected ? "selected" : undefined}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(item)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleRow(item.id)}
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </TableCell>
              <TableCell className="font-medium">{item.customerName || "N/A"}</TableCell>
              <TableCell>{item.phone || "N/A"}</TableCell>
              <TableCell>
                {item.deviceInfo?.brand} {item.deviceInfo?.model}
              </TableCell>
              <TableCell>
                <span className="max-w-[200px] truncate block">{item.problemDescription}</span>
              </TableCell>
              <TableCell>
                <span className="max-w-[180px] truncate block">{item.technicianDiagnosis || "Pending"}</span>
              </TableCell>
              <TableCell>
                <span className="max-w-[120px] truncate block">
                  {item.requiredParts?.length ? item.requiredParts.join(", ") : "None"}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge 
                  status={item.status} 
                  onStatusChange={(newStatus: JobCardStatus) => updateJobCard(item.id, { status: newStatus })}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )

  // Cost Breakdown Table (Customer + Cost details)
  const CostBreakdownTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-transparent border-b border-border/30 hover:bg-transparent">
          <TableHead className="w-12">
            <Checkbox
              checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
              onCheckedChange={toggleAll}
              className="border-muted-foreground/30"
            />
          </TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Customer</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Phone</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Device</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Labor Cost</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Parts Cost</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Service Cost</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Total</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Advance Paid</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm">Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedData.map((item) => {
          const isSelected = selectedRows.has(item.id)
          const laborCost = safeNumber(item.costEstimate?.laborCost)
          const partsCost = safeNumber(item.costEstimate?.partsCost)
          const serviceCost = safeNumber(item.costEstimate?.serviceCost)
          const total = safeNumber(item.costEstimate?.total)
          const advance = safeNumber(item.advanceReceived)
          const balance = total - advance
          return (
            <TableRow
              key={item.id}
              data-state={isSelected ? "selected" : undefined}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(item)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleRow(item.id)}
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </TableCell>
              <TableCell className="font-medium">{item.customerName || "N/A"}</TableCell>
              <TableCell>{item.phone || "N/A"}</TableCell>
              <TableCell>
                {item.deviceInfo?.brand} {item.deviceInfo?.model}
              </TableCell>
              <TableCell>₹{laborCost.toFixed(2)}</TableCell>
              <TableCell>₹{partsCost.toFixed(2)}</TableCell>
              <TableCell>₹{serviceCost.toFixed(2)}</TableCell>
              <TableCell className="font-semibold text-primary">₹{total.toFixed(2)}</TableCell>
              <TableCell className="text-green-600">₹{advance.toFixed(2)}</TableCell>
              <TableCell className={balance > 0 ? "text-orange-600 font-medium" : "text-green-600"}>
                ₹{balance.toFixed(2)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )

  return (
    <>
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-primary">Service Details</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filteredData.length} of {jobCards.length} Items
            </p>
          </div>
          {/* Bulk Actions - Show when items selected */}
          {selectedRows.size > 0 && (
            <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-primary">
                {selectedRows.size} selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm(`Delete ${selectedRows.size} selected items? This action cannot be undone.`)) {
                    selectedRows.forEach(id => deleteJobCard(id))
                    setSelectedRows(new Set())
                  }
                }}
                className="gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          {/* Search - Full width */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search name, phone, IMEI..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 w-full bg-muted/50 border-0"
            />
          </div>

          {/* Filters Row - Flex wrap for responsive */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            {/* Device Type Filter */}
            <Select value={typeFilter} onValueChange={(value) => {
              setTypeFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-full sm:w-auto sm:min-w-[140px] bg-muted/50 border-0">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-full sm:w-auto sm:min-w-[160px] bg-muted/50 border-0">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="ready-for-delivery">Ready for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-auto sm:min-w-[130px] bg-muted/50 border-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="a-z">A to Z</SelectItem>
                <SelectItem value="z-a">Z to A</SelectItem>
              </SelectContent>
            </Select>

            {/* Spacer for desktop */}
            <div className="hidden sm:flex sm:flex-1" />

            {/* Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              {/* Download Button with Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-lg"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      if (selectedRows.size === 0) {
                        alert("Please select at least one entry to download")
                        return
                      }
                      const selectedItems = filteredData.filter(item => selectedRows.has(item.id)) as ExtendedJobCard[]
                      downloadMultipleInvoices(selectedItems.map(withCompanyInfo))
                    }}
                    disabled={selectedRows.size === 0}
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Download Selected ({selectedRows.size})
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      downloadMultipleInvoices((filteredData as ExtendedJobCard[]).map(withCompanyInfo))
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All ({filteredData.length})
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Add Service Details Button */}
              <Button
                onClick={() => router.push("/intake")}
                className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service Details
              </Button>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Details</TabsTrigger>
            <TabsTrigger value="device">Device Info</TabsTrigger>
            <TabsTrigger value="problem">Problem</TabsTrigger>
            <TabsTrigger value="cost">Cost Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="rounded-xl overflow-hidden overflow-x-auto">
              <AllDetailsView />
            </div>
          </TabsContent>

          <TabsContent value="device" className="mt-0">
            <div className="rounded-xl overflow-hidden overflow-x-auto">
              <DeviceInfoTable />
            </div>
          </TabsContent>

          <TabsContent value="problem" className="mt-0">
            <div className="rounded-xl overflow-hidden overflow-x-auto">
              <ProblemTable />
            </div>
          </TabsContent>

          <TabsContent value="cost" className="mt-0">
            <div className="rounded-xl overflow-hidden overflow-x-auto">
              <CostBreakdownTable />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border/30 flex items-center justify-end gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page:</span>
          <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
            <SelectTrigger className="w-16 h-8 border-0 bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>
            {(currentPage - 1) * perPage + 1}-
            {Math.min(currentPage * perPage, filteredData.length)} of{" "}
            {filteredData.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service Details</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (itemToDelete) {
                  deleteJobCard(itemToDelete)
                  setItemToDelete(null)
                }
                setDeleteDialogOpen(false)
              }}
              className="bg-destructive hover:bg-destructive/90 rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail Sheet - Slides from right */}
      <Sheet 
        open={!!selectedItem} 
        onOpenChange={(open) => {
          // Don't close the sheet if we're viewing a fullscreen image
          if (!open && fullscreenImage) return
          if (!open) setSelectedItem(null)
        }}
      >
        <SheetContent className="w-full sm:max-w-md overflow-y-auto p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Service Details</SheetTitle>
          </SheetHeader>
          {selectedItem && (() => {
            const total = safeNumber(selectedItem.costEstimate?.total)
            const advance = safeNumber(selectedItem.advanceReceived)
            const balance = total - advance
            
            return (
              <>
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-5">
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge 
                      status={selectedItem.status} 
                      onStatusChange={(newStatus: JobCardStatus) => {
                        updateJobCard(selectedItem.id, { status: newStatus })
                        setSelectedItem({ ...selectedItem, status: newStatus })
                      }}
                    />
                    <div className="flex gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                        onClick={() => {
                          router.push(`/job-cards/${selectedItem.id}/edit`)
                          setSelectedItem(null)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-primary-foreground/80 hover:text-red-300 hover:bg-white/10"
                        onClick={() => {
                          setItemToDelete(selectedItem.id)
                          setDeleteDialogOpen(true)
                          setSelectedItem(null)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold">{selectedItem.customerName || "Customer"}</h2>
                  <p className="text-primary-foreground/80 text-sm">{selectedItem.phone || "No phone"}</p>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => downloadInvoice(withCompanyInfo(selectedItem))}>
                      <FileDown className="w-4 h-4 mr-1.5" />
                      Invoice
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => shareOnWhatsApp(withCompanyInfo(selectedItem))}>
                      <Share2 className="w-4 h-4 mr-1.5" />
                      WhatsApp
                    </Button>
                  </div>

                  {/* Device Photos */}
                  {selectedItem.conditionImages && selectedItem.conditionImages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Photos</h4>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {selectedItem.conditionImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img.url}
                            alt={`Device ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-border flex-shrink-0 cursor-pointer hover:border-primary transition-colors"
                            onClick={() => setFullscreenImage(img.url)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Device */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Device</h4>
                    <div className="bg-muted/40 rounded-lg p-3 space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium capitalize">{selectedItem.deviceInfo?.type || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Brand / Model</span>
                        <span className="font-medium">{selectedItem.deviceInfo?.brand} {selectedItem.deviceInfo?.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IMEI</span>
                        <span className="font-mono text-xs">{selectedItem.imei || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Condition</span>
                        <span>{selectedItem.condition || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Problem */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Problem</h4>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-sm">
                      {selectedItem.problemDescription || "No description"}
                    </div>
                  </div>

                  {/* Diagnosis */}
                  {selectedItem.technicianDiagnosis && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Diagnosis</h4>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm">
                        {selectedItem.technicianDiagnosis}
                      </div>
                    </div>
                  )}

                  {/* Parts & Delivery */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Parts</h4>
                      <p className="text-sm">{selectedItem.requiredParts?.length ? selectedItem.requiredParts.join(", ") : "None"}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Delivery</h4>
                      <p className="text-sm">{selectedItem.deliveryDate ? new Date(selectedItem.deliveryDate).toLocaleDateString() : "Not set"}</p>
                    </div>
                  </div>

                  {/* Cost Summary Card */}
                  <div className="bg-gradient-to-br from-muted/60 to-muted/30 rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Cost Summary</h4>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Labor</span>
                        <span>{formatCurrency(selectedItem.costEstimate?.laborCost)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Parts</span>
                        <span>{formatCurrency(selectedItem.costEstimate?.partsCost)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Service</span>
                        <span>{formatCurrency(selectedItem.costEstimate?.serviceCost)}</span>
                      </div>
                      <div className="flex justify-between pt-2 mt-2 border-t border-border font-semibold text-base">
                        <span>Total</span>
                        <span className="text-primary">{formatCurrency(total)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Advance</span>
                        <span>- {formatCurrency(advance)}</span>
                      </div>
                      <div className={`flex justify-between font-bold text-lg pt-1 ${balance > 0 ? "text-orange-500" : "text-green-600"}`}>
                        <span>Balance</span>
                        <span>{formatCurrency(balance)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Address if available */}
                  {selectedItem.address && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address</h4>
                      <p className="text-sm text-muted-foreground">{selectedItem.address}</p>
                    </div>
                  )}
                </div>
              </>
            )
          })()}
        </SheetContent>
      </Sheet>

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <>
          {/* Backdrop - clicking this closes the image only, not the sheet */}
          <div 
            className="fixed inset-0 z-[9999] bg-black"
            style={{ pointerEvents: 'auto' }}
            onPointerDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setFullscreenImage(null)
            }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          />
          {/* Image container */}
          <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center"
            style={{ pointerEvents: 'none' }}
          >
            <img
              src={fullscreenImage}
              alt="Device photo"
              className="max-w-[95vw] max-h-[95vh] object-contain"
              style={{ pointerEvents: 'auto' }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {/* Close button */}
          <button 
            type="button"
            className="fixed top-4 right-4 z-[10001] bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all"
            style={{ pointerEvents: 'auto' }}
            onPointerDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setFullscreenImage(null)
            }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Hint text */}
          <p 
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[10001] text-white/50 text-sm"
            style={{ pointerEvents: 'none' }}
          >
            Tap anywhere to close
          </p>
        </>
      )}
    </>
  )
}
