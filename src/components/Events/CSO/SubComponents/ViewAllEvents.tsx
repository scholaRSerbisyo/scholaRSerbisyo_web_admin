"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Edit2Icon, ListCollapse, MapPin } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";
import { Event } from "@/components/types";
import { EventImage } from "./EventImage";
import { ViewAllEditEventDialog } from './ViewAllEditDialog';
import { ViewEventDetailsDialog } from './ViewEventDetailsDialog';
import { toast } from '@/hooks/use-toast';
import { updateEvent } from '../../_actions/events';
import { format, isBefore, isAfter, isWithinInterval } from 'date-fns';

const determineEventStatus = (event: Event): string => {
  const now = new Date();
  const eventDate = new Date(event.date);
  const [fromHours, fromMinutes] = event.time_from.split(':').map(Number);
  const [toHours, toMinutes] = event.time_to.split(':').map(Number);

  const eventStartDateTime = new Date(eventDate);
  eventStartDateTime.setHours(fromHours, fromMinutes);

  const eventEndDateTime = new Date(eventDate);
  eventEndDateTime.setHours(toHours, toMinutes);

  if (isBefore(eventEndDateTime, now)) {
    return 'previous';
  } else if (isWithinInterval(now, { start: eventStartDateTime, end: eventEndDateTime })) {
    return 'ongoing';
  } else {
    return 'upcoming';
  }
};

interface ScholarViewAllEventsProps {
    events: Event[]
}

export default function ScholarViewAllEvents({ events }: ScholarViewAllEventsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [localEvents, setLocalEvents] = useState<Event[]>(events);

    const title = searchParams.get('title') || '';
    const status = searchParams.get('status') || '';

    useEffect(() => {
      const updatedEvents = events.map(event => ({
        ...event,
        status: determineEventStatus(event)
      }));
      
      const filteredEvents = status 
        ? updatedEvents.filter(event => event.status === status)
        : updatedEvents;

      console.log(filteredEvents);
      setLocalEvents(filteredEvents);
    }, [events, status]);

    const handleEditClick = (event: Event) => {
        setSelectedEvent(event);
        setIsEditDialogOpen(true);
        setIsDetailsDialogOpen(false);
    };

    const handleDetailsClick = (event: Event) => {
        setSelectedEvent(event);
        setIsDetailsDialogOpen(true);
        setIsEditDialogOpen(false);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedEvent(null);
    };

    const handleCloseDetailsDialog = () => {
        setIsDetailsDialogOpen(false);
        setSelectedEvent(null);
    };

    const handleSaveUpdateEvent = async (updatedEvent: Event) => {
        setIsUpdateLoading(true);
        try {
            const updatedEventFromServer = await updateEvent(updatedEvent);
            setLocalEvents(prevEvents => 
                prevEvents.map(e => e.event_id === updatedEventFromServer.event_id ? updatedEventFromServer : e)
            );
            toast({
                title: "Event Updated",
                description: "The event has been successfully updated.",
            });
            router.refresh();
            handleCloseEditDialog();
        } catch (error) {
            console.error('Error updating event:', error);
            toast({
                title: "Update Failed",
                description: "There was an error updating the event. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUpdateLoading(false);
        }
    };

    if (localEvents.length === 0) {
        return (
            <>
                <div className="px-5">
                    <Button className="bg-primary-foreground text-primary" onClick={() => router.push('/events/cso')}>
                        <ArrowLeft /> Go Back
                    </Button>
                </div>
                <p>No events available to display.</p>
            </>
        );
    }

    return (
        <div>
            <div className="px-5">
                <Button className="bg-[#304295] text-white" onClick={() => router.back()}>
                    <ArrowLeft /> Go Back
                </Button>
            </div>
            <div className='mx-4 flex flex-col gap-4 mt-4 border rounded-md'>
                <div className="bg-[#304295] text-primary-foreground p-3 rounded-t-lg">
                    <h2 className="text-lg font-semibold">{title}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-3">
                    {localEvents.map((event) => (
                        <Card key={event.event_id} className="shadow-md">
                            <CardHeader className="p-0">
                                <EventImage event={event} title={title} />
                            </CardHeader>
                            <CardContent className="p-2">
                                <CardTitle className="text-sm mb-2">{event.event_name}</CardTitle>
                                <div className="flex flex-col gap-1 mb-2">
                                    <p className="text-xs text-muted-foreground flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {event.date}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {event.time_from}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {event.time_to}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {event.location}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <Button size="sm" variant="secondary" className={`text-xs bg-[#191851] text-white hover:bg-blue-800 ${title === 'Ongoing Events'?'w-full':title === 'Upcoming Events'?'':'w-full'}`} onClick={() => handleDetailsClick(event)}>
                                        <ListCollapse />
                                        Details
                                    </Button>
                                    {
                                        title === "Ongoing Events"?
                                        <></>:
                                        title === "Upcoming Events"?
                                        <Button size="sm" variant="secondary" className="text-xs bg-ys text-white hover:bg-yellow-300" onClick={() => handleEditClick(event)}>
                                            <Edit2Icon className="w-3 h-3" />
                                            Edit
                                        </Button>:
                                        <></>
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <ViewEventDetailsDialog
                event={selectedEvent}
                onClose={handleCloseDetailsDialog}
                isOpen={isDetailsDialogOpen}
            />
            <ViewAllEditEventDialog
                event={selectedEvent}
                onClose={handleCloseEditDialog}
                onSave={handleSaveUpdateEvent}
                isLoading={isUpdateLoading}
                isOpen={isEditDialogOpen}
            />
        </div>
    );
}

