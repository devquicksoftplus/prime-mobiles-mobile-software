"use client"

import * as React from "react"
import { Search, Download, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  title: string
  data: T[]
  columns: Column<T>[]
  totalItems?: number
  showCheckbox?: boolean
  showActions?: boolean
  onRowClick?: (item: T) => void
  isLoading?: boolean
}

export function DataTable<T extends { id?: string }>({
  title,
  data,
  columns,
  totalItems,
  showCheckbox = true,
  showActions = true,
  onRowClick,
  isLoading = false,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState("10")

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
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(data.map((item) => item.id || "")))
    }
  }

  const totalPages = Math.ceil((totalItems || data.length) / parseInt(rowsPerPage))

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-primary">{title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalItems || data.length} Items
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Filter */}
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <Select defaultValue="2024">
                <SelectTrigger className="border-0 bg-transparent h-auto p-0 w-16 text-sm font-medium">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="december">
                <SelectTrigger className="border-0 bg-transparent h-auto p-0 w-24 text-sm font-medium">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="may">May</SelectItem>
                  <SelectItem value="june">June</SelectItem>
                  <SelectItem value="july">July</SelectItem>
                  <SelectItem value="august">August</SelectItem>
                  <SelectItem value="september">September</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                  <SelectItem value="november">November</SelectItem>
                  <SelectItem value="december">December</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48 bg-muted/50 border-0"
              />
            </div>

            {/* Download Button */}
            <Button 
              size="icon" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-transparent border-b border-border/30 hover:bg-transparent">
                {showCheckbox && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.size === data.length && data.length > 0}
                      onCheckedChange={toggleAll}
                      className="border-muted-foreground/30"
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className="text-muted-foreground font-medium text-sm"
                  >
                    {column.header}
                  </TableHead>
                ))}
                {showActions && (
                  <TableHead className="text-muted-foreground font-medium text-sm text-right">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (showCheckbox ? 1 : 0) + (showActions ? 1 : 0)}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (showCheckbox ? 1 : 0) + (showActions ? 1 : 0)}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => {
                  const id = item.id || String(index)
                  const isSelected = selectedRows.has(id)
                  return (
                    <TableRow
                      key={id}
                      data-state={isSelected ? "selected" : undefined}
                      className="cursor-pointer"
                      onClick={() => onRowClick?.(item)}
                    >
                      {showCheckbox && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleRow(id)}
                            className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell
                          key={String(column.key)}
                          className="text-foreground"
                        >
                          {column.render
                            ? column.render(item)
                            : String((item as any)[column.key] ?? "")}
                        </TableCell>
                      ))}
                      {showActions && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              onRowClick?.(item)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
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
            {(currentPage - 1) * parseInt(rowsPerPage) + 1}-
            {Math.min(currentPage * parseInt(rowsPerPage), totalItems || data.length)} of{" "}
            {totalItems || data.length}
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
  )
}
