"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import AddEventButtonComponent from "@/components/Static/AddEventFunction/AddEventButton"
import { EventSection } from "@/components/Events/CSO/SubComponents/EventSection"
import { EventDetailsDialog } from "@/components/Events/CSO/SubComponents/EventDetailsDialog"
import type { Event } from "@/components/types"
import { useTheme } from "next-themes"
import { parseISO, isBefore, isWithinInterval, getYear, getMonth } from "date-fns"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export const dynamic = "force-dynamic"

interface CSOEventProps {
  events: Event[]
  admintype: number
}

export default function CSOComponent({ events, admintype }: CSOEventProps) {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null)
  const [timeFilter, setTimeFilter] = React.useState<string>("all")
  const [periodFilter, setPeriodFilter] = React.useState<string>("all")

  const determineEventStatus = (event: Event): "ongoing" | "upcoming" | "previous" => {
    const now = new Date()
    const eventDate = parseISO(event.date)
    const [fromHours, fromMinutes] = event.time_from.split(":").map(Number)
    const [toHours, toMinutes] = event.time_to.split(":").map(Number)

    const eventStartDateTime = new Date(eventDate)
    eventStartDateTime.setHours(fromHours, fromMinutes)

    const eventEndDateTime = new Date(eventDate)
    eventEndDateTime.setHours(toHours, toMinutes)

    if (isBefore(eventEndDateTime, now)) {
      return "previous"
    } else if (isWithinInterval(now, { start: eventStartDateTime, end: eventEndDateTime })) {
      return "ongoing"
    } else {
      return "upcoming"
    }
  }

  const eventsWithStatus = events.map((event) => ({
    ...event,
    status: determineEventStatus(event),
  }))

  // Filter events based on the selected filters
  const filteredEvents = React.useMemo(() => {
    const now = new Date()
    const currentYear = getYear(now)

    return eventsWithStatus.filter((event) => {
      const eventDate = parseISO(event.date)
      const eventYear = getYear(eventDate)
      const eventMonth = getMonth(eventDate)

      // First apply time-based filter
      const passesTimeFilter = timeFilter === "all" ? true : event.status === timeFilter

      // Then apply period filter
      let passesPeriodFilter = true
      switch (periodFilter) {
        case "current-year":
          passesPeriodFilter = eventYear === currentYear
          break
        case "first-semester":
          passesPeriodFilter = eventYear === currentYear && eventMonth >= 6 && eventMonth <= 11
          break
        case "second-semester":
          passesPeriodFilter = eventYear === currentYear && eventMonth >= 0 && eventMonth <= 5
          break
        case "all":
          passesPeriodFilter = true
          break
      }

      return passesTimeFilter && passesPeriodFilter
    })
  }, [eventsWithStatus, timeFilter, periodFilter])

  // Reset filters
  const handleResetFilters = () => {
    setTimeFilter("all")
    setPeriodFilter("all")
  }

  const ongoingEvents = filteredEvents.filter((event) => event.status === "ongoing")
  const upcomingEvents = filteredEvents.filter((event) => event.status === "upcoming")
  const previousEvents = filteredEvents.filter((event) => event.status === "previous")

  return (
    <main className="flex min-h-screen flex-col gap-6 p-4 md:p-2">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">City Scholar Office (CSO)</h1>
        <AddEventButtonComponent admintype={admintype} />
      </header>

      {/* Enhanced filter section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-muted/50 p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time Filter</SelectLabel>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="ongoing">Ongoing Only</SelectItem>
                <SelectItem value="upcoming">Upcoming Only</SelectItem>
                <SelectItem value="previous">Previous Only</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Period Filter</SelectLabel>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="current-year">Current Year</SelectItem>
                <SelectItem value="first-semester">First Semester</SelectItem>
                <SelectItem value="second-semester">Second Semester</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={handleResetFilters} className="w-full sm:w-auto">
          <Filter className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr,220px]">
        <div className={`space-y-5 border-2 rounded-lg p-3 ${theme == "light" ? "bg-gray-100" : ""}`}>
          <p className="font-bold text-lg">Registered Events</p>
          <EventSection
            title="Ongoing Events"
            events={ongoingEvents}
            isLoading={isLoading}
            onEventSelect={setSelectedEvent}
          />
          <EventSection
            title="Upcoming Events"
            events={upcomingEvents}
            isLoading={isLoading}
            onEventSelect={setSelectedEvent}
          />
          <EventSection
            title="Previous Events"
            events={previousEvents}
            isLoading={isLoading}
            onEventSelect={setSelectedEvent}
          />
        </div>
        <aside className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="bg-[#191851] border border-t rounded-t-lg flex justify-center w-full">
                <h2 className="font-semibold text-white p-2">Overview</h2>
              </div>
              <div className="w-full px-4 py-2 bg-[#191851] bg-opacity-5">
                <ul className="mt-2 space-y-1">
                  <li>Ongoing: {ongoingEvents.length}</li>
                  <li>Upcoming: {upcomingEvents.length}</li>
                  <li>Previous: {previousEvents.length}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <div className="bg-[#191851] border border-t rounded-t-lg flex justify-center w-full">
                <h2 className="font-semibold text-white p-2">Events History</h2>
              </div>
              <div className="w-full px-4 py-2 bg-[#191851] bg-opacity-5">
                <p className="mt-2">Total events: {filteredEvents.length}</p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
      {selectedEvent && <EventDetailsDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </main>
  )
}

