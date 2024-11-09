"use client";

import * as React from "react";
import { format, isSameDay, startOfMonth, endOfMonth, setDate } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";

// Define the EventDay type
type EventDay = {
  date: Date;
  category: "previous" | "today" | "upcoming";
  title: string;
};

// Define the props for the Day component
interface DayProps {
  date: Date;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  displayMonth?: Date; // Updated type to match react-day-picker's expected type
}


export default function FullEventCalendar() {
  const today = new Date();
  const currentday = new Date().getDate();
  const [currentMonth, setCurrentMonth] = React.useState<Date>(today);
  const [eventDays, setEventDays] = React.useState<EventDay[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<EventDay | null>(null);

  React.useEffect(() => {
    const days = [
      {
        date: setDate(currentMonth, 2),
        category: "previous" as const,
        title: "Previous Event 1",
      },
      {
        date: setDate(currentMonth, 10),
        category: "previous" as const,
        title: "Previous Event 2",
      },
      {
        date: setDate(currentMonth, 14),
        category: "previous" as const,
        title: "Previous Event 3",
      },
      {
        date: setDate(currentMonth, currentday),
        category: "today" as const,
        title: "Today's Event",
      },
      {
        date: setDate(currentMonth, 27),
        category: "upcoming" as const,
        title: "Upcoming Event 1",
      },
      {
        date: setDate(currentMonth, 28),
        category: "upcoming" as const,
        title: "Upcoming Event 2",
      },
      {
        date: setDate(currentMonth, 31),
        category: "upcoming" as const,
        title: "Upcoming Event 3",
      },
    ].map((event) => ({
      ...event,
      date: new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        event.date.getDate()
      ),
    })) as EventDay[];
  
    setEventDays(days);
  }, [currentMonth]);

  const getCategoryBgColor = (category: "previous" | "today" | "upcoming") => {
    switch (category) {
      case "previous":
        return "bg-red-500 text-black hover:bg-red-600 rounded-full w-6 h-6 mt-2 mx-2";
      case "today":
        return "bg-blue-500 text-black hover:bg-blue-600 rounded-full w-6 h-6 mt-2 mx-2";
      case "upcoming":
        return "bg-green-500 text-black hover:bg-green-600 rounded-full w-6 h-6 mt-2 mx-2";
    }
  };

  const handleDayClick = (eventDay: EventDay) => {
    setSelectedEvent(eventDay);
  };

  const closeOverlay = () => {
    setSelectedEvent(null);
  };

  return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Event Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 items-center">
          <TooltipProvider>
            <Calendar
              mode="multiple"
              selected={eventDays.map((event) => event.date)}
              onMonthChange={setCurrentMonth}
              className="grid grid-cols-7 gap-2 px-2 w-full sm:w-[300px] mx-auto rounded-md border"
              components={{
                Day: ({ date, className, displayMonth, ...props }: DayProps) => { // Destructure displayMonth
                  const startOfMonthDate = startOfMonth(currentMonth);
                  const startDayIndex = startOfMonthDate.getDay();
                  const eventDay = eventDays.find((event) =>
                    isSameDay(event.date, date),
                  );
              
                  // Adjust index to align with the weekday start
                  const dayIndex = date.getDate() + startDayIndex - 1;
              
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          {...props} // `displayMonth` is removed here
                          onClick={() => eventDay && handleDayClick(eventDay)}
                          className={cn(
                            "flex items-center justify-center h-10 w-10 font-normal rounded-full",
                            eventDay ? getCategoryBgColor(eventDay.category) : "text-foreground",
                            "hover:bg-white hover:text-primary-foreground focus:bg-yellow-300 focus:text-primary-foreground",
                            className,
                            dayIndex % 7 === 0 ? "ml-auto" : "",
                            dayIndex % 7 === 6 ? "mr-auto" : ""
                          )}
                        >
                          <time dateTime={format(date, "yyyy-MM-dd")}>
                            {format(date, "d")}
                          </time>
                        </button>
                      </TooltipTrigger>
                      {eventDay && (
                        <TooltipContent className={cn(getCategoryBgColor(eventDay.category), 'flex flex-col py-5 w-full justify-center items-center rounded-sm')}>
                          <p>{eventDay.title}</p>
                          <p className="text-xs capitalize">
                            {eventDay.category} event
                          </p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                },
              }}
            />
          </TooltipProvider>
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium">Event Categories:</h3>
            <div className="flex gap-8">
              <Badge
                className={cn(
                  "text-primary-foreground font-normal bg-red-500 hover:bg-yellow-600",
                )}
              >
                Previous
              </Badge>
              <Badge
                className={cn(
                  "text-primary-foreground font-normal bg-blue-500 hover:bg-green-600",
                )}
              >
                Today
              </Badge>
              <Badge
                className={cn(
                  "text-primary-foreground font-normal bg-green-500 hover:bg-blue-600",
                )}
              >
                Upcoming
              </Badge>
            </div>
          </div>
        </CardContent>

        {/* Overlay for Event Details */}
        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg max-w-xs w-full">
              <h4 className="text-lg font-semibold text-black mb-2">
                {selectedEvent.title}
              </h4>
              <p className="text-black">{format(selectedEvent.date, "MMMM d, yyyy")}</p>
              <p className="text-sm text-black capitalize">{selectedEvent.category} event</p>
              <Button
                onClick={closeOverlay}
                className="mt-5 text-primary bg-background hover:bg-ys hover:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Card>
  );
}
