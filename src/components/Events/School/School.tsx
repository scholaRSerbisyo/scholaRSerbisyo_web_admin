"use client"

import * as React from "react"
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from "next/navigation"
import Link from "next/link"
import { School } from "@/components/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AddEventButtonComponent from "../../Static/AddEventFunction/AddEventButton"
export const dynamic = "force-dynamic"

interface SchoolProps {
  schools: School[]
  admintype: number
}

export default function SchoolComponent({schools, admintype}: SchoolProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const rowsPerPage = 8

  const filteredSchools = React.useMemo(() => {
    return schools.filter(school =>
      school.school_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [schools, searchQuery])

  const totalPages = Math.ceil(filteredSchools.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentSchools = filteredSchools.slice(startIndex, endIndex)

  const handleCreateEvent = () => {
    router.push("/events/school/create")
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  return (
    <div className="container mx-auto flex flex-col h-[calc(100vh-7rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">School</h1>
          <p className="text-sm text-muted-foreground">
            List of schools in Cagayan De Oro City
          </p>
        </div>
        {admintype !== 2?
          <AddEventButtonComponent admintype={admintype} />
          :
          <></>
        }
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search school..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-grow overflow-hidden border rounded-lg">
        <div className="h-full overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-[#1a1a3c] text-white sticky top-0 z-10">School</TableHead>
                <TableHead className="bg-[#1a1a3c] text-white text-right sticky top-0 z-10">Total Events</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSchools.map((school) => (
                <TableRow 
                  key={school.school_id} 
                  className="hover:bg-muted/50 cursor-pointer"
                >
                  <TableCell>
                    <Link 
                      href={`/events/school/${school.school_id}`}
                      className="block w-full h-full"
                    >
                      {school.school_name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link 
                      href={`/events/school/${school.school_id}`}
                      className="block w-full h-full"
                    >
                      {school.events_count}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredSchools.length)} of {filteredSchools.length} entries
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

