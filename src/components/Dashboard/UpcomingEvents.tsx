'use client'

import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getEvents, EventResponse } from '@/components/Dashboard/_actions/actions'
import Link from 'next/link';

type CardProps = React.ComponentProps<typeof Card>

export function UpcomingEventsComponents({ className, ...props }: CardProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<EventResponse[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getEvents();
      if (Array.isArray(events)) {
        const upcoming = events.filter(event => event.status === 'upcoming');
        setUpcomingEvents(upcoming);
      }
    };

    fetchEvents();
  }, []);

  const scrollbarStyle = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `;

  return (
    <Card className={`w-full max-w-auto sm:w-auto mx-auto ${className}`} {...props}>
      <CardHeader className="rounded-t-lg bg-ys">
        <CardTitle className="flex justify-between pr-20 text-black items-center">
          <CalendarDays color="black" />Upcoming Events
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="grid gap-4 py-5 max-h-[300px] overflow-y-auto custom-scrollbar">
        <style jsx>{scrollbarStyle}</style>
        <div>
          {upcomingEvents.map((event) => (
            <div key={event.event_id} className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{event.event_name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} - {event.time_from} to {event.time_to}
                </p>
                <p className="text-sm text-muted-foreground">
                  {event.event_type?.name === 'CSO' ? 'CSO' :
                   event.event_type?.name === 'School' ? `${event.event_type.name} - ${event.school?.school_name}` :
                   `${event.event_type?.name} - ${event.barangay?.baranggay_name}`}
                </p>
              </div>
            </div>
          ))}
          {!upcomingEvents?<></>:<p className='text-center'>No Upcoming Events...</p>}
        </div>
      </CardContent>
      <CardFooter className='mt-5'>
        <Link href={''} className="rounded-md py-2 text-sm text-center w-full bg-ys text-black hover:bg-yellow-300">
          View All
        </Link>
      </CardFooter>
    </Card>
  )
}

