import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { School } from '@/components/types'

interface SchoolEventsProps {
  school: any
}

export default function SchoolEvents({ school }: SchoolEventsProps) {
  return (
    <div className="container mx-auto min-h-[calc(100vh-7em)] py-6">
      <div className="mb-6">
        <Link href="/schools" passHref>
          <Button variant="ghost" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Schools
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-semibold mb-6">{school.school_name}</h1>
      <div className="grid gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          {/* Display upcoming events here */}
          {school.upcoming_events && school.upcoming_events.length > 0 ? (
            <ul>
              {school.upcoming_events.map((event: any, index: number) => (
                <li key={index}>{event.event_name}</li>
              ))}
            </ul>
          ) : (
            <p>No upcoming events</p>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
          {/* Display past events here */}
          {school.past_events && school.past_events.length > 0 ? (
            <ul>
              {school.past_events.map((event: any, index: number) => (
                <li key={index}>{event.event_name}</li>
              ))}
            </ul>
          ) : (
            <p>No past events</p>
          )}
        </div>
      </div>
    </div>
  )
}

