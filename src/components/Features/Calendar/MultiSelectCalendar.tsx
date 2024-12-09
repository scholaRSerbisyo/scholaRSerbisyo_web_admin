"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { getEvents, EventResponse } from "@/components/Features/Calendar/_actions/actions"
import { DayContentProps } from "react-day-picker"
import { parseISO, isSameDay, startOfDay } from 'date-fns'
import { toZonedTime, format } from 'date-fns-tz'

const TIMEZONE = 'Asia/Manila' // You can make this configurable if needed

export default function CalendarEvents() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [events, setEvents] = React.useState<EventResponse[]>([])
  const [selectedEvent, setSelectedEvent] = React.useState<EventResponse | null>(null)

  React.useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = await getEvents()
      if (Array.isArray(fetchedEvents)) {
        setEvents(fetchedEvents)
      }
    }
    fetchEvents()
  }, [])

  const getEventColor = (status: string) => {
    switch (status) {
      case 'previous':
        return 'bg-red-500 hover:bg-red-300'
      case 'ongoing':
        return 'bg-[#4ADE80] hover:bg-green-300'
      case 'upcoming':
        return 'bg-[#60A5FA] hover:bg-blue-300'
      default:
        return 'bg-gray-200'
    }
  }

  const handleDayClick = (day: Date, events: EventResponse[]) => {
    if (events.length === 1) {
      setSelectedEvent(events[0])
    }
  }

  const CustomDayContent = (props: DayContentProps) => {
    const { date, displayMonth } = props
    const zonedDate = toZonedTime(date, TIMEZONE)
    const dayEvents = events.filter(event => isSameDay(parseISO(event.date), zonedDate))
    const isSunday = zonedDate.getDay() === 0
    const isOutsideMonth = zonedDate.getMonth() !== displayMonth?.getMonth()

    if (dayEvents.length > 0) {
      return (
        <div 
          className={`w-7 h-7 rounded-full ${getEventColor(dayEvents[0].status)} cursor-pointer flex items-center justify-center`}
          onClick={(e) => {
            e.stopPropagation()
            handleDayClick(zonedDate, dayEvents)
          }}
        >
          <span className="text-black font-medium">{zonedDate.getDate()}</span>
        </div>
      )
    }

    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className={cn(
          "text-sm",
          isSunday && "text-red-500",
          isOutsideMonth && "text-slate-400"
        )}>
          {zonedDate.getDate()}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="border rounded-md p-3"
        classNames={{
          months: "space-y-4",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-slate-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-slate-400",
          row: "flex w-full mt-2",
          cell: "text-center text-sm relative p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex items-center justify-center",
          day: "h-9 w-9 p-0 font-normal flex items-center justify-center",
          day_selected: "",
          day_today: "bg-slate-100 rounded-md text-slate-900 dark:bg-slate-800 dark:text-slate-50",
          day_outside: "text-slate-500 opacity-50 dark:text-slate-400",
          day_disabled: "text-slate-500 opacity-50 dark:text-slate-400",
          day_range_middle: "aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50",
          day_hidden: "invisible",
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
          DayContent: CustomDayContent
        }}
      />

      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium">Categories</h3>
        <div className="flex gap-2">
          <div className="bg-red-500 text-xs px-4 py-1 rounded-full">Previous</div>
          <div className="bg-[#4ADE80] text-xs px-4 py-1 rounded-full">Ongoing</div>
          <div className="bg-[#60A5FA] text-xs px-4 py-1 rounded-full">Upcoming</div>
        </div>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.event_name}</DialogTitle>
            <DialogDescription>
              <div className="space-y-2 mt-2">
                <p><strong>Date:</strong> {selectedEvent?.date}</p>
                <p><strong>Time:</strong> {selectedEvent?.time_from} - {selectedEvent?.time_to}</p>
                <p><strong>Location:</strong> {selectedEvent?.location}</p>
                <p><strong>Description:</strong> {selectedEvent?.description}</p>
                <p><strong>Status:</strong> {selectedEvent?.status}</p>
                {selectedEvent?.school && (
                  <p><strong>School:</strong> {selectedEvent.school.school_name}</p>
                )}
                {selectedEvent?.barangay && (
                  <p><strong>Barangay:</strong> {selectedEvent.barangay.baranggay_name}</p>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

