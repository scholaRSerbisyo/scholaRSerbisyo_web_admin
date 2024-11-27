import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowLeft } from 'lucide-react'
import { Attendee } from "@/components/types"

interface CheckAttendeesDialogProps {
    eventId: number
    onClose: () => void
}

export function CheckAttendeesDialog({ eventId, onClose }: CheckAttendeesDialogProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [attendees, setAttendees] = useState<Attendee[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAttendees = async () => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setAttendees([])
        } catch (error) {
            console.error('Error fetching attendees:', error)
        } finally {
            setIsLoading(false)
        }
        }

        fetchAttendees()
    }, [eventId])

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[900px] bg-primary-foreground text-white">
            <div className="space-y-4">
            <div className="flex justify-between items-center p-4">
                <div>
                <h2 className="text-xl font-semibold">Check Attendees</h2>
                <p className="text-sm text-gray-300">List of attendees for this event.</p>
                </div>
                <div className="w-72">
                <Input
                    type="search"
                    placeholder="Search"
                    className="bg-white text-black"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
            </div>

            <div className="border rounded-lg border-gray-600">
                <Table>
                <TableHeader>
                    <TableRow className="bg-gray-200 hover:bg-gray-200">
                    <TableHead className="text-black">Last Name</TableHead>
                    <TableHead className="text-black">First Name</TableHead>
                    <TableHead className="text-black">Year Level</TableHead>
                    <TableHead className="text-black">School</TableHead>
                    <TableHead className="text-black">Barangay</TableHead>
                    <TableHead className="text-black">Date</TableHead>
                    <TableHead className="text-black">Food Submission</TableHead>
                    <TableHead className="text-black w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                    {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-black">
                        Loading attendees...
                        </TableCell>
                    </TableRow>
                    ) : attendees.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-black">
                        No attendees found.
                        </TableCell>
                    </TableRow>
                    ) : (
                    attendees.map((attendee, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="text-black">{attendee.lastName}</TableCell>
                        <TableCell className="text-black">{attendee.firstName}</TableCell>
                        <TableCell className="text-black">{attendee.yearLevel}</TableCell>
                        <TableCell className="text-black">{attendee.school}</TableCell>
                        <TableCell className="text-black">{attendee.barangay}</TableCell>
                        <TableCell className="text-black">{attendee.date}</TableCell>
                        <TableCell className="text-black">
                            <Button variant="outline" size="sm">
                            {attendee.foodSubmission}
                            </Button>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-black">
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))
                    )}
                </TableBody>
                </Table>
            </div>

            <div className="flex justify-between items-center">
                <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10"
                onClick={onClose}
                >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
                </Button>
                <div className="flex items-center gap-2">
                <div className="text-sm text-gray-300">Page 1 of 0</div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                    Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                    Next
                    </Button>
                </div>
                </div>
            </div>
            </div>
        </DialogContent>
        </Dialog>
    )
}