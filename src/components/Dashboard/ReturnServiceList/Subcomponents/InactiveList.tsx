"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    lastname: "rairu",
    firstname: "success",
    yearlevel: "ken99@yahoo.com",
    school: "yooo",
    baranggay: "lapasan",
    RSNumber: 2,
    status: 'complete'
  },
  {
    id: "3u1reuv4",
    lastname: "asds",
    firstname: "success",
    yearlevel: "Abe45@gmail.com",
    school: "gfgyooo",
    baranggay: "lapasan",
    RSNumber: 2,
    status: 'incomplete'
  },
  {
    id: "derv1ws0",
    lastname: "hen",
    firstname: "processing",
    yearlevel: "Monserrat44@gmail.com",
    school: "asdyasdooo",
    baranggay: "lapasan",
    RSNumber: 2,
    status: 'complete'
  },
  {
    id: "5kma53ae",
    lastname: "crau",
    firstname: "success",
    yearlevel: "Silas22@gmail.com",
    school: "ddyoasdoo",
    baranggay: "lapasan",
    RSNumber: 2,
    status: 'complete'
  },
  {
    id: "bhqecj4p",
    lastname: "krawkraw",
    firstname: "failed",
    yearlevel: "carmella@hotmail.com",
    school: "qweyooo",
    baranggay: "lapasan",
    RSNumber: 2,
    status: 'complete'
  },
  {
    id: "bhqecj4p",
    lastname: "krawkraw",
    firstname: "failed",
    yearlevel: "carmella@hotmail.com",
    school: "qweyooo",
    baranggay: "lapasan",
    RSNumber: 2,
    status: 'complete'
  },
  {
    id: "bhqecj4p",
    lastname: "krawkraw",
    firstname: "failed",
    yearlevel: "carmella@hotmail.com",
    school: "qweyooo",
    baranggay: "lapasan",
    RSNumber: 2,
    status: 'complete'
  },
  {
    id: "bhqecj4p",
    lastname: "krawkraw",
    firstname: "failed",
    yearlevel: "carmella@hotmail.com",
    school: "qweyooo",
    baranggay: "lapasan",
    RSNumber: 2,
    status: 'complete'
  },
  {
    id: "bhqecj4p",
    lastname: "krawkraw",
    firstname: "failed",
    yearlevel: "carmella@hotmail.com",
    school: "qweyooo",
    baranggay: "lapasan",
    RSNumber: 2,
    status: 'complete'
  },
  {
    id: "bhqecj4p",
    lastname: "krawkraw",
    firstname: "failed",
    yearlevel: "carmella@hotmail.com",
    school: "qweyooo",
    baranggay: "lapasan",
    RSNumber: 2,
    status: 'complete'
  },
  {
    id: "bhqecj4p",
    lastname: "krawkraw",
    firstname: "failed",
    yearlevel: "carmella@hotmail.com",
    school: "qweyooo",
    baranggay: "lapasan",
    RSNumber: 2,
    status: 'complete'
  },
  {
    id: "bhqecj4p",
    lastname: "krawkraw",
    firstname: "failed",
    yearlevel: "carmella@hotmail.com",
    school: "qweyooo",
    baranggay: "lapasan",
    RSNumber: 2,
    status: 'complete'
  },
  {
    id: "bhqecj4p",
    lastname: "krawkraw",
    firstname: "failed",
    yearlevel: "carmella@hotmail.com",
    school: "qweyooo",
    baranggay: "lapasan",
    RSNumber: 2,
    status: 'complete'
  },
];

export type Payment = {
  id: string
  lastname: string
  firstname: string
  yearlevel: string,
  school: string,
  baranggay: string,
  RSNumber: Number,
  status: string
};

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "lastname",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Lastname
                <ArrowUpDown className="ml-2" />
            </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("lastname")}</div>,
    },
    {
        accessorKey: "firstname",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                Firstname
                <ArrowUpDown className="ml-2" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("firstname")}</div>,
    },
    {
        accessorKey: "yearlevel",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Year Level
                <ArrowUpDown className="ml-2" />
            </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("yearlevel")}</div>,
    },
    {
        accessorKey: "school",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                School
                <ArrowUpDown className="ml-2" />
            </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("school")}</div>,
    },
    {
        accessorKey: "baranggay",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Baranggay
                <ArrowUpDown className="ml-2" />
            </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("baranggay")}</div>,
    },
    {
        accessorKey: "RSNumber",
        accessorFn: (row) => row?.RSNumber?.toString(),
        filterFn: (row, columnId, filterValue) => {
            console.log(row.getValue(columnId), filterValue);
            return row.getValue(columnId) === parseInt(filterValue);
        },
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                <div className="text-right">No. of Return Service</div>,
                <ArrowUpDown className="ml-2" />
            </Button>
            )
        }, 
        cell: ({ row }) => {
            const RSNumber = parseFloat(row.getValue("RSNumber"))
        
            // Format the RSNumber as a dollar RSNumber
            const formatted = new Intl.NumberFormat().format(RSNumber)
        
            return <div className="text-center font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Status
                <ArrowUpDown className="ml-2" />
            </Button>
            )
        },
        cell: ({ row }) => row.getValue("status") == 'complete'?<div className="lowercase bg-green-500 text-black text-center border">{row.getValue("status")}</div>:<div className="lowercase bg-red-500 text-black text-center border">{row.getValue("status")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original

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
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];

export function InactiveListSubComponent() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  
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
                pageSize: 6, // Set initial page size to 6
            },
        },
    });
  
    return (
        <div className="flex flex-col gap-6 max-w-full">
            <div className="flex items-center">
                <Input
                    placeholder="Filter year level..."
                    value={(table.getColumn("yearlevel")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("yearlevel")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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

            {/* Wrapper for responsive scrolling */}
            <div className="rounded-md border flex flex-col gap-6 w-full overflow-x-auto">
                <Table className="w-full">
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
                                <TableRow key={row.id}>
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

            <div>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>

            <div className="flex items-center justify-end space-x-2">
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
    )
};
  