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

export interface User {
  // Add User interface properties here
}

export interface School {
  school_name: string
  // Add other School interface properties here
}

export interface Baranggay {
  baranggay_name: string
  // Add other Baranggay interface properties here
}

export interface Scholar {
  scholar_id: number
  firstname: string
  lastname: string
  age: number
  address: string
  mobilenumber: string
  yearlevel: string
  scholar_type_id: number
  user_id: number
  school_id: number
  baranggay_id: number
  created_at: string
  updated_at: string
  user: User
  school: School
  baranggay: Baranggay
}

interface ScholarWithStatus extends Scholar {
  status: "Complete" | "Incomplete" | "Inactive"
}

interface ScholarProps {
  scholars: Scholar[]
}

const columns: ColumnDef<ScholarWithStatus>[] = [
  {
    accessorKey: "scholar_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
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
    accessorKey: "age",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Age
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "yearlevel",
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
    accessorKey: "school.school_name",
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
    accessorKey: "baranggay.baranggay_name",
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
    accessorKey: "status",
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
      const status = row.getValue("status") as "Complete" | "Incomplete" | "Inactive"
      return (
        <div
          className={`text-center px-2 py-1 rounded-full text-xs font-medium ${
            status === "Complete" ? "bg-green-100 text-green-800" : 
            status === "Incomplete" ? "bg-red-100 text-red-800" : 
            "bg-gray-100 text-gray-800"
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

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(scholar.scholar_id.toString())}>
              Copy scholar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View scholar details</DropdownMenuItem>
            <DropdownMenuItem>Edit scholar information</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function ScholarTable({ data }: { data: ScholarWithStatus[] }) {
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
  })

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + columns.map(col => col.header as string).join(",") + "\n"
      + data.map(row => 
          columns.map(col => {
            if (col.accessorKey) {
              return row[col.accessorKey as keyof ScholarWithStatus]
            }
            return ''
          }).join(",")
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scholars_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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
          <Button onClick={exportData} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
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

  const data = React.useMemo(() => {
    return scholars.map(scholar => ({
      ...scholar,
      status: Math.random() > 0.6 ? "Complete" : Math.random() > 0.3 ? "Incomplete" : "Inactive" as "Complete" | "Incomplete" | "Inactive"
    }))
  }, [scholars])

  const filteredData = React.useMemo(() => {
    if (activeTab === "all") return data
    return data.filter(scholar => scholar.status.toLowerCase() === activeTab)
  }, [data, activeTab])

  const statusCounts = React.useMemo(() => {
    return {
      all: data.length,
      complete: data.filter(s => s.status === "Complete").length,
      incomplete: data.filter(s => s.status === "Incomplete").length,
      inactive: data.filter(s => s.status === "Inactive").length,
    }
  }, [data])

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="complete">Complete ({statusCounts.complete})</TabsTrigger>
          <TabsTrigger value="incomplete">Incomplete ({statusCounts.incomplete})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({statusCounts.inactive})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ScholarTable data={filteredData} />
        </TabsContent>
        <TabsContent value="complete">
          <ScholarTable data={filteredData} />
        </TabsContent>
        <TabsContent value="incomplete">
          <ScholarTable data={filteredData} />
        </TabsContent>
        <TabsContent value="inactive">
          <ScholarTable data={filteredData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

