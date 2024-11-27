"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import AddEventButtonComponent from "@/components/Static/AddEventFunction/AddEventButton"
import { EventSection } from "@/components/Events/CSO/SubComponents/EventSection"
import { EventDetailsDialog } from "@/components/Events/CSO/SubComponents/EventDetailsDialog"
import { Event } from "@/components/types"
import { useTheme } from "next-themes"
export const dynamic = "force-dynamic"

interface CSOEventProps {
  events: Event[]
}

export default function CSOComponent({events}: CSOEventProps) {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  const ongoingEvents = events.filter(event => event.status === 'on-going');
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const previousEvents = events.filter(event => event.status === 'previous');

  return (
    <main className="flex min-h-screen flex-col gap-6 p-4 md:p-2">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">City Scholar Office (CSO)</h1>
        <AddEventButtonComponent />
      </header>
      <div className="grid gap-6 md:grid-cols-[1fr,220px]">
        <div className={`space-y-5 border-2 rounded-lg p-3 ${theme == 'light'?'bg-gray-100':''}`}>
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
            <CardContent className="p-4">
              <h2 className="font-semibold">Overview</h2>
              <ul className="mt-2 space-y-1">
                <li>Ongoing: {ongoingEvents.length}</li>
                <li>Upcoming: {upcomingEvents.length}</li>
                <li>Previous: {previousEvents.length}</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold">Events History</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Total events: {events.length}
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
      {selectedEvent && (
        <EventDetailsDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </main>
  )
}