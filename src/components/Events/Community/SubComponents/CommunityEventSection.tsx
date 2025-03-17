import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2Icon, Calendar, Clock, MapPin, ListCollapse, ArrowRight } from "lucide-react"
import type { Event } from "@/components/types"
import { CommunityEditEventDialog } from "./CommunityEditEventDialog"
import { useTheme } from "next-themes"
import { updateEvent } from "../../_actions/events"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { isBefore, isWithinInterval } from "date-fns"
import { CommunityEventImage } from "./CommunityEventImage"
import { useSidebar } from "@/components/ui/sidebar"

interface CommunityEventSectionProps {
  barangayname: string
  admintype: number
  title: string
  events: Event[]
  isLoading: boolean
  onEventSelect: (event: Event) => void
}

export function CommunityEventSection({
  barangayname,
  admintype,
  title,
  events,
  isLoading,
  onEventSelect,
}: CommunityEventSectionProps) {
  const router = useRouter()
  const { theme } = useTheme()
  const [isUpdateLoading, setIsUpdateLoading] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [localEvents, setLocalEvents] = useState<Event[]>(events)
  const { state: sidebarState } = useSidebar()

  // Update localEvents when events prop changes
  React.useEffect(() => {
    setLocalEvents(events)
  }, [events])

  const handleViewAll = () => {
    router.push(
      `/events/community/viewevents?type=${encodeURIComponent(barangayname)}&title=${encodeURIComponent(title)}&status=${encodeURIComponent(events[0]?.status || "")}`,
    )
  }

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event)
    setIsEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedEvent(null)
  }

  const determineEventStatus = (eventDate: string, timeFrom: string, timeTo: string): string => {
    const now = new Date()
    const eventDateTime = new Date(eventDate)
    const [fromHours, fromMinutes] = timeFrom.split(":").map(Number)
    const [toHours, toMinutes] = timeTo.split(":").map(Number)
    eventDateTime.setHours(fromHours, fromMinutes)
    const eventEndDateTime = new Date(eventDate)
    eventEndDateTime.setHours(toHours, toMinutes)

    if (isBefore(eventEndDateTime, now)) {
      return "previous"
    } else if (isWithinInterval(now, { start: eventDateTime, end: eventEndDateTime })) {
      return "ongoing"
    } else {
      return "upcoming"
    }
  }

  const handleSaveUpdateEvent = async (updatedEvent: Event) => {
    setIsUpdateLoading(true)
    try {
      const status = determineEventStatus(updatedEvent.date, updatedEvent.time_from, updatedEvent.time_to)

      const eventToUpdate = {
        ...updatedEvent,
        status,
      }

      const updatedEventFromServer = await updateEvent(eventToUpdate)

      setLocalEvents((prevEvents) =>
        prevEvents.map((e) => (e.event_id === updatedEventFromServer.event_id ? updatedEventFromServer : e)),
      )
      toast({
        title: "Event Updated",
        description: "The event has been successfully updated.",
      })

      handleCloseEditDialog()
    } catch (error) {
      console.error("Error updating event:", error)
      toast({
        title: "Update Failed",
        description: "There was an error updating the event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdateLoading(false)
    }
  }

  return (
    <section
      className={`space-y-4 border rounded-lg ${theme == "light" ? "border-gray-300" : ""} ${
        sidebarState === "collapsed" ? "w-[62.4rem] transition-all duration-200 delay-100 ease-in-out" : "w-[49.4rem]"
      } overflow-hidden`}
    >
      <div className={`bg-[#191851] text-primary-foreground p-3 rounded-t-lg`}>
        <h2 className="text-lg font-semibold text-white text-center">{title}</h2>
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar pr-[100px]">
          {isLoading ? (
            <p className="text-center w-full">Loading events...</p>
          ) : localEvents && localEvents.length > 0 ? (
            <>
              {localEvents.map((event) => (
                <Card key={event.event_id} className="shadow-md flex-shrink-0 w-[200px] first:ml-0 rounded-none">
                  <CardHeader className="p-0">
                    <CommunityEventImage event={event} title={title} />
                  </CardHeader>
                  <CardContent className="p-3">
                    <CardTitle className="text-sm mb-2 line-clamp-2">{event.event_name}</CardTitle>
                    <div className="flex flex-col gap-1 mb-2">
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                        {event.date}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                        {event.time_from}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                        {event.time_to}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </p>
                    </div>
                    <div className={`flex ${admintype !== 2 ? "justify-between" : "justify-center"}`}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className={`text-xs bg-[#191851] text-white hover:bg-blue-800 ${admintype !== 2 ? "" : "w-full"} ${title === "Ongoing Events" ? "w-full" : title === "Upcoming Events" ? "" : "w-full"}`}
                        onClick={() => onEventSelect(event)}
                      >
                        <ListCollapse />
                        Details
                      </Button>
                      {admintype !== 2 ? (
                        <>
                          {title === "Ongoing Events" ? (
                            <></>
                          ) : title === "Upcoming Events" ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="text-xs bg-ys text-white hover:bg-yellow-300"
                              onClick={() => handleEditClick(event)}
                            >
                              <Edit2Icon className="w-3 h-3" />
                              Edit
                            </Button>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <p className="text-center w-full">No events available</p>
          )}
        </div>
        {localEvents && localEvents.length > 3 && (
          <div className="absolute right-0 pr-5 top-0 bottom-0 mb-3 w-[150px] flex items-center justify-center bg-gradient-to-l from-background to-transparent">
            <Button
              variant="secondary"
              className="w-full text-xs bg-primary text-primary-foreground hover:bg-primary/90 flex flex-col items-center bg-ys text-white hover:bg-yellow-200"
              onClick={handleViewAll}
            >
              <span className="flex">
                View All ({localEvents.length})
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </div>
        )}
        {selectedEvent && (
          <CommunityEditEventDialog
            event={selectedEvent}
            onClose={handleCloseEditDialog}
            onSave={handleSaveUpdateEvent}
            isLoading={isUpdateLoading}
          />
        )}
      </div>
    </section>
  )
}

