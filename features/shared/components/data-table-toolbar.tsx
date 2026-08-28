"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download, X } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
  searchColumn?: string
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  searchColumn,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-1 items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={
              searchColumn
                ? (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
                : ""
            }
            onChange={(event) => {
              if (searchColumn) {
                table.getColumn(searchColumn)?.setFilterValue(event.target.value)
              }
            }}
            className="pl-9 w-48 bg-muted/50 border-0"
          />
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {/* Download Button */}
        <Button
          size="icon"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
