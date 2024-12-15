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
import { useSidebar } from "@/components/ui/sidebar"

const TIMEZONE = 'Asia/Manila' // You can make this configurable if needed

export default function CalendarEvents() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [events, setEvents] = React.useState<EventResponse[]>([])
  const [selectedEvents, setSelectedEvents] = React.useState<EventResponse[]>([])
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const { state: sidebarState } = useSidebar();

  React.useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = await getEvents()
      if (Array.isArray(fetchedEvents)) {
        setEvents(fetchedEvents)
      }
    }
    fetchEvents()
  }, [])

  const getEventColor = (events: EventResponse[]) => {
    if (events.some(event => event.status === 'ongoing')) {
      return 'bg-[#4ADE80] hover:bg-green-300 rounded-full'
    }
    if (events.some(event => event.status === 'upcoming')) {
      return 'bg-[#304295] hover:bg-blue-300 rounded-full'
    }
    return 'bg-[#F3BC00] hover:bg-red-300 rounded-full'
  }

  const handleDayClick = (day: Date, dayEvents: EventResponse[]) => {
    setSelectedEvents(dayEvents)
    setIsDialogOpen(true)
  }

  const CustomDayContent = (props: DayContentProps) => {
    const { date, displayMonth } = props
    const zonedDate = toZonedTime(date, TIMEZONE)
    const dayEvents = events.filter(event => isSameDay(parseISO(event.date), zonedDate))
    const isSunday = zonedDate.getDay() === 0
    const isOutsideMonth = zonedDate.getMonth() !== displayMonth?.getMonth()
    const hasOngoingEvent = dayEvents.some(event => event.status === 'ongoing')

    if (dayEvents.length > 0) {
      return (
        <div 
          className={cn(
            "w-full h-full rounded-md flex items-center justify-center",
            hasOngoingEvent && "bg-green-100",
            getEventColor(dayEvents)
          )}
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
        className={`border rounded-lg p-3 ${
          sidebarState === 'collapsed' ? 'sm:w-[22rem]' : 'sm:w-[20rem]'
        }`}
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
          head_cell: `text-slate-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-slate-400 ${
            sidebarState === 'collapsed' ? 'sm:px-[1.4rem]' : 'sm:px-[1.27rem]'
          }`,
          row: "flex w-full mt-2",
          cell: `text-center text-sm relative p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg ${
            sidebarState === 'collapsed' ? 'sm:px-[0.32rem]' : 'sm:px-[0.2rem]'
          }`,
          day: `h-7 w-7 m-1 p-0 font-normal aria-selected:opacity-100`,
          day_selected: "bg-slate-400 rounded-md text-slate-50 hover:bg-slate-400 hover:text-slate-50 focus:bg-slate-900 focus:text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50 dark:hover:text-slate-900 dark:focus:bg-slate-50 dark:focus:text-slate-900",
          day_today: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
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
        <div className="flex gap-2 justify-center">
          <div className="bg-[#F3BC00] text-xs px-4 py-1 rounded-full">Previous</div>
          <div className="bg-[#4ADE80] text-xs px-4 py-1 rounded-full">Ongoing</div>
          <div className="bg-[#304295] text-xs px-4 py-1 rounded-full">Upcoming</div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Events for {selectedEvents.length > 0 ? format(parseISO(selectedEvents[0].date), 'MMMM d, yyyy') : ''}</DialogTitle>
            <DialogDescription>
              {selectedEvents.map((event, index) => (
                <div key={index} className="space-y-2 mt-4 pb-4 border-b last:border-b-0">
                  <h3 className="font-semibold">{event.event_name}</h3>
                  <p><strong>Time:</strong> {event.time_from} - {event.time_to}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Description:</strong> {event.description}</p>
                  <p><strong>Status:</strong> {event.status}</p>
                  {event.school && (
                    <p><strong>School:</strong> {event.school.school_name}</p>
                  )}
                  {event.barangay && (
                    <p><strong>Barangay:</strong> {event.barangay.baranggay_name}</p>
                  )}
                </div>
              ))}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

