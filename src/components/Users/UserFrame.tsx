"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Settings2Icon, Download } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { exportData } from "@/lib/utils/export"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { ScholarEventsDialog } from "./ScholarEventDialog"
import { ScholarProfileDialog } from "./scholar-profile-dialog"

export interface Scholar {
  id: number;
  firstname: string;
  lastname: string;
  mobilenumber: string;
  age: number;
  yearLevel: string;
  scholarType: {
    id: number;
    name: string;
  };
  school: {
    id: number;
    name: string;
  };
  barangay: {
    id: number;
    name: string;
  };
  returnServiceCount: number;
}

export interface ScholarProps {
  scholars: Scholar[];
}

const columns: ColumnDef<Scholar>[] = [
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lastname
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Firstname
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "yearLevel",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Year Level
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "school.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        School
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "barangay.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Barangay
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "returnServiceCount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Return Services
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const count = row.getValue("returnServiceCount") as number
      return (
        <div className="text-center">
          {count} / 5
        </div>
      )
    },
  },
  {
    accessorKey: "returnServiceStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const count = row.getValue("returnServiceCount") as number
      const status = count >= 5 ? "Complete" : "Incomplete"
      return (
        <div
          className={`text-center px-2 py-1 rounded-full text-xs font-medium ${
            status === "Complete" ? "bg-green-100 text-green-800" : 
            "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const scholar = row.original
      const [isEventsOpen, setIsEventsOpen] = React.useState(false)
      const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
                View Scholar Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEventsOpen(true)}>
                View Events Attended
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ScholarEventsDialog 
            scholar={scholar}
            open={isEventsOpen}
            onClose={() => setIsEventsOpen(false)}
          />

          <ScholarProfileDialog
            scholar={scholar}
            open={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
          />
        </>
      )
    },
  },
]

function ScholarTable({ data }: { data: Scholar[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  })

  const handleExport = React.useCallback(async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      await exportData(data, format)
      toast({
        title: "Export Successful",
        description: `Data exported as ${format.toUpperCase()} successfully.`,
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive",
      })
    }
  }, [data])

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter Lastname..."
          value={(table.getColumn("lastname")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("lastname")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings2Icon className="mr-2 h-4 w-4" /> View <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) total.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ScholarTableWithTabs({ scholars }: ScholarProps) {
  const [activeTab, setActiveTab] = React.useState("all")
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const filteredData = React.useMemo(() => {
    if (activeTab === "all") return scholars
    const status = activeTab === "complete" ? "Complete" : "Incomplete"
    return scholars.filter(scholar => scholar.returnServiceCount >= 5 ? "Complete" : "Incomplete" === status)
  }, [scholars, activeTab])

  const statusCounts = React.useMemo(() => {
    return {
      all: scholars.length,
      complete: scholars.filter(s => s.returnServiceCount >= 5).length,
      incomplete: scholars.filter(s => s.returnServiceCount < 5).length,
    }
  }, [scholars])

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#191851] data-[state=active]:text-white">
            All ({isLoading ? '-' : statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="complete" className="data-[state=active]:bg-[#191851] data-[state=active]:text-white">
            Complete ({isLoading ? '-' : statusCounts.complete})
          </TabsTrigger>
          <TabsTrigger value="incomplete" className="data-[state=active]:bg-[#191851] data-[state=active]:text-white">
            Incomplete ({isLoading ? '-' : statusCounts.incomplete})
          </TabsTrigger>
        </TabsList>
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <>
            <TabsContent value="all">
              <ScholarTable data={filteredData} />
            </TabsContent>
            <TabsContent value="complete">
              <ScholarTable data={filteredData} />
            </TabsContent>
            <TabsContent value="incomplete">
              <ScholarTable data={filteredData} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {Array(7).fill(0).map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-8 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(6).fill(0).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array(7).fill(0).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-[200px]" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-[80px]" />
          <Skeleton className="h-8 w-[80px]" />
        </div>
      </div>
    </div>
  )
}

