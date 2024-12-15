"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import AddEventButtonComponent from "@/components/Static/AddEventFunction/AddEventButton"
import { CommunityEventSection } from "./CommunityEventSection"
import { EventDetailsDialog } from "@/components/Events/CSO/SubComponents/EventDetailsDialog"
import { Event } from "@/components/types"
import { useTheme } from "next-themes"
import { CommunityEventDetailsDialog } from "./CommunityEventDetails"
import { parseISO, isBefore, isAfter, isWithinInterval } from 'date-fns'

interface CommunityEventProps {
    type: string
    events: Event[]
    admintype: number
}

export default function CommunityEvent({type, events, admintype}: CommunityEventProps) {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  const determineEventStatus = (event: Event): 'ongoing' | 'upcoming' | 'previous' => {
    const now = new Date()
    const eventDate = parseISO(event.date)
    const [fromHours, fromMinutes] = event.time_from.split(':').map(Number)
    const [toHours, toMinutes] = event.time_to.split(':').map(Number)

    const eventStartDateTime = new Date(eventDate)
    eventStartDateTime.setHours(fromHours, fromMinutes)

    const eventEndDateTime = new Date(eventDate)
    eventEndDateTime.setHours(toHours, toMinutes)

    if (isBefore(eventEndDateTime, now)) {
      return 'previous'
    } else if (isWithinInterval(now, { start: eventStartDateTime, end: eventEndDateTime })) {
      return 'ongoing'
    } else {
      return 'upcoming'
    }
  }

  const eventsWithStatus = events.map(event => ({
    ...event,
    status: determineEventStatus(event)
  }))

  const ongoingEvents = eventsWithStatus.filter(event => event.status === 'ongoing');
  const upcomingEvents = eventsWithStatus.filter(event => event.status === 'upcoming');
  const previousEvents = eventsWithStatus.filter(event => event.status === 'previous');

  return (
    <main className="flex min-h-screen flex-col gap-6 p-4 md:p-2">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{type}</h1>
        <AddEventButtonComponent admintype={admintype} />
      </header>
      <div className="grid gap-6 md:grid-cols-[1fr,220px]">
        <div className={`space-y-5 border-2 rounded-lg p-3 ${theme == 'light'?'bg-gray-100':''}`}>
          <p className="font-bold text-lg">Registered Events</p>
          <CommunityEventSection 
            barangayname={type}
            title="Ongoing Events" 
            events={ongoingEvents}
            isLoading={isLoading}
            onEventSelect={setSelectedEvent}
          />
          <CommunityEventSection 
            barangayname={type}
            title="Upcoming Events" 
            events={upcomingEvents}
            isLoading={isLoading}
            onEventSelect={setSelectedEvent}
          />
          <CommunityEventSection 
            barangayname={type}
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
                <p className="mt-2">
                  Total events: {events.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
      {selectedEvent && (
        <CommunityEventDetailsDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </main>
  )
}