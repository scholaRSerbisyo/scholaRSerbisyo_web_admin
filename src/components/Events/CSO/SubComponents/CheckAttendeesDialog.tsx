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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Settings2Icon, Search, Download } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
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
import { toast } from "@/hooks/use-toast"
import { fetchCompletedSubmissions, acceptSubmission, declineSubmission } from '@/components/Events/_actions/events'
import { ProofOverlay } from "../../proof-overlay"
import { exportAttendeesData, ScholarAttendees } from '@/lib/utils/export'

interface Submission {
  id: number
  scholar: {
    id: number
    firstname: string
    lastname: string
    yearLevel: string
    school: {
      name: string | null
    }
    barangay: {
      name: string | null
    }
  }
  time_in: string
  time_out: string
  time_in_location: string
  time_out_location: string
  time_in_image_uuid: string
  time_out_image_uuid: string
  created_at: string
  is_accepted: boolean
  onViewProof?: (submission: Submission) => void;
  onAccept?: (submissionId: number) => void;
  onDecline?: (submissionId: number) => void;
}

interface CheckAttendeesDialogProps {
  eventId: number
  eventName: string
  onClose: () => void
}

const columns: ColumnDef<Submission>[] = [
  {
    accessorKey: "scholar.lastname",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.scholar.lastname,
  },
  {
    accessorKey: "scholar.firstname",
    header: "First Name",
  },
  {
    accessorKey: "scholar.yearLevel",
    header: "Year Level",
  },
  {
    accessorKey: "scholar.school.name",
    header: "School",
  },
  {
    accessorKey: "scholar.barangay.name",
    header: "Barangay",
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => format(new Date(row.getValue("created_at")), 'M/d/yyyy'),
  },
  {
    id: "proof",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => row.original.onViewProof && row.original.onViewProof(row.original)}
        className="text-black underline rounded-none border-none bg-[#D9D9D9] hover:bg-blue-400"
      >
        View Proof
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const submission = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-transparent hover:text-black" disabled={submission.is_accepted}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => submission.onAccept?.(submission.id)}
              disabled={submission.is_accepted}
            >
              Accept
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => submission.onDecline?.(submission.id)}
              disabled={submission.is_accepted}
            >
              Decline
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function CheckAttendeesDialog({ eventId, eventName, onClose }: CheckAttendeesDialogProps) {
  const [submissions, setSubmissions] = React.useState<Submission[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [selectedSubmission, setSelectedSubmission] = React.useState<Submission | null>(null)
  const [isProofOverlayOpen, setIsProofOverlayOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const fetchSubmissions = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchCompletedSubmissions(eventId, 1)
      setSubmissions(data.submissions.map((submission: Omit<Submission, 'onViewProof' | 'onAccept' | 'onDecline'>) => ({
        ...submission,
        onViewProof: () => handleViewProof(submission),
        onAccept: () => handleAccept(submission.id),
        onDecline: () => handleDecline(submission.id),
      })))
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast({
        title: "Error",
        description: "Failed to fetch submissions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  React.useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  const handleViewProof = (submission: Submission) => {
    setSelectedSubmission(submission)
    setIsProofOverlayOpen(true)
  }

  const handleAccept = async (submissionId: number) => {
    try {
      await acceptSubmission(submissionId)
      setSubmissions(prevSubmissions =>
        prevSubmissions.map(sub =>
          sub.id === submissionId ? { ...sub, is_accepted: true } : sub
        )
      )
      toast({
        title: "Success",
        description: "Submission accepted successfully.",
      })
    } catch (error) {
      console.error('Error accepting submission:', error)
      toast({
        title: "Error",
        description: "Failed to accept submission. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDecline = async (submissionId: number) => {
    try {
      await declineSubmission(submissionId)
      setSubmissions(prevSubmissions =>
        prevSubmissions.filter(sub => sub.id !== submissionId)
      )
      toast({
        title: "Success",
        description: "Submission declined successfully.",
      })
    } catch (error) {
      console.error('Error declining submission:', error)
      toast({
        title: "Error",
        description: "Failed to decline submission. Please try again.",
        variant: "destructive",
      })
    }
  }

  const table = useReactTable({
    data: submissions,
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
      globalFilter: searchQuery,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string;
      return value.toLowerCase().includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const handleExport = React.useCallback(async (fileType: 'csv' | 'xlsx' | 'pdf') => {
    try {
      const exportData: ScholarAttendees[] = submissions.map(submission => ({
        id: submission.scholar.id,
        firstname: submission.scholar.firstname,
        lastname: submission.scholar.lastname,
        mobilenumber: '', // Add this if available in your data
        age: '', // Add this if available in your data
        yearLevel: submission.scholar.yearLevel,
        school: {
          name: submission.scholar.school.name || '' // Use empty string as fallback
        },
        barangay: {
          name: submission.scholar.barangay.name || '' // Use empty string as fallback
        },
        date: submission.created_at,
      }))

      await exportAttendeesData(exportData, eventName, submissions.length, fileType)
      toast({
        title: "Export Successful",
        description: `Data exported as ${fileType.toUpperCase()} successfully.`,
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive",
      })
    }
  }, [submissions, eventName])

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[1000px] bg-[#191851] text-white">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4">
              <div>
                <h2 className="text-xl font-semibold">Total Attendees for "{eventName}"</h2>
                <p className="text-sm text-gray-300">List of attendees for this event.</p>
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white text-black hover:bg-white hover:text-gray-500">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={() => handleExport('csv')} className="text-black">
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('xlsx')} className="text-black">
                      Export as Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('pdf')} className="text-black">
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Filter last name..."
                    value={searchQuery}
                    onChange={(event) => {
                      const value = event.target.value;
                      setSearchQuery(value);
                      table.getColumn("scholar.lastname")?.setFilterValue(value);
                    }}
                    className="pl-8 bg-white text-black w-[250px]"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white text-black hover:bg-white hover:text-gray-500">
                      <Settings2Icon className="mr-2 h-4 w-4" /> View <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuLabel className="text-black">Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize text-black"
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

            <div className="rounded-md border border-gray-600 overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className="bg-gray-100 hover:bg-gray-100">
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="text-black font-semibold">
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center text-black">
                          Loading attendees...
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} className="hover:bg-gray-50">
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="text-black">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center text-black">
                          No attendees found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex-1 text-sm">
                <div className="flex gap-x-2">
                  <p>Total Attendees:</p>
                  <p className="text-ys font-bold">{table.getFilteredRowModel().rows.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <select
                    className="bg-transparent text-sm outline-none"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value))
                    }}
                  >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-100 hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to first page</span>
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-100 h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-100 h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-100 hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to last page</span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProofOverlay
        isOpen={isProofOverlayOpen}
        onClose={() => {
          setIsProofOverlayOpen(false)
          setSelectedSubmission(null)
        }}
        submission={selectedSubmission}
      />
    </>
  )
}

