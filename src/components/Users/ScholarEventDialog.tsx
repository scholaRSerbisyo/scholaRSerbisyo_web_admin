"use client"

import * as React from "react"
import { format } from "date-fns"
import { ArrowLeft, Search, ChevronLeft } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getScholarEvents, getImage } from "./_actions/action"
import { Scholar } from "./UserFrame"
import { cn } from "@/lib/utils"

interface Event {
  id: number
  event_name: string
  event_type_id: number
  event_type_name: string
  date: string
  time_from: string
  time_to: string
  location: string
  description: string
  event_image_uuid: string
  status: string
  completed_at: string | null
  year: number
}

interface EventDetailsDialogProps {
  event: Event
  onClose: () => void
}

interface ScholarEventsDialogProps {
  scholar: Scholar
  open: boolean
  onClose: () => void
}

function EventDetailsDialog({ event, onClose }: EventDetailsDialogProps) {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchImage() {
      const url = await getImage(event.event_image_uuid);
      setImageUrl(url);
    }
    fetchImage();
  }, [event.event_image_uuid]);

  return (
    <div className="relative">
      <button 
        onClick={onClose}
        className="absolute left-0 top-0 p-2 hover:bg-gray-100 rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-semibold text-center">{event.event_name} Proof</h2>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Date:</span> {format(new Date(event.date), "MM/dd/yyyy")}
            </div>
            <div>
              <span className="font-medium">Time:</span> {event.time_from} - {event.time_to}
            </div>
            <div>
              <span className="font-medium">Location:</span> {event.location}
            </div>
            <div>
              <span className="font-medium">Event Type:</span> {event.event_type_name}
            </div>
          </div>
          <div>
            <p className="text-sm mt-2">Description: {event.description}</p>
          </div>
        </div>
        {imageUrl && (
          <div className="relative overflow-hidden rounded-lg border" style={{ maxHeight: "300px" }}>
            <img
              src={imageUrl}
              alt="Event Image"
              className="object-contain w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function ScholarEventsDialog({ scholar, open, onClose }: ScholarEventsDialogProps) {
  const [events, setEvents] = React.useState<Event[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null)
  const [filterType, setFilterType] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    async function fetchEvents() {
      if (open) {
        setLoading(true)
        const result = await getScholarEvents(scholar.id)
        if (!result.error && result.events) {
          setEvents(result.events)
        }
        setLoading(false)
      }
    }
    fetchEvents()
  }, [open, scholar.id])

  const filteredEvents = React.useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.event_name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === "all" || event.event_type_name === filterType
      return matchesSearch && matchesType
    })
  }, [events, searchQuery, filterType])

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        {!selectedEvent ? (
          <div className="space-y-4">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle>Return Service Status</DialogTitle>
              </div>
            </DialogHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="CSO">CSO</SelectItem>
                  <SelectItem value="School">School</SelectItem>
                  <SelectItem value="Community">Community</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Event Name</TableHead>
                    <TableHead className="w-[150px]">Event Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Loading events...
                      </TableCell>
                    </TableRow>
                  ) : filteredEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No events found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEvents.map((event) => (
                      <TableRow 
                        key={event.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <TableCell>{format(new Date(event.date), "MM/dd/yyyy")}</TableCell>
                        <TableCell>{event.event_name}</TableCell>
                        <TableCell>{event.event_type_name}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <EventDetailsDialog
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

