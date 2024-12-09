{/*"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Edit2Icon, MapPin } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";
import { Event } from "@/components/types";
import { EventImage } from "./EventImage";
import { EditEventDialog } from './EditEventDialog';

interface ViewAllEventsProps {
    events: Event[]
}

export default function ViewAllEvents({events}: ViewAllEventsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const title = searchParams.get('title') || '';
    const status = searchParams.get('status') || '';
    const filteredEvents = events.filter(event => event.status === status);

    const handleEditClick = (event: Event) => {
        setSelectedEvent(event);
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedEvent(null);
    };

    const handleSaveEvent = async (updatedEvent: Event) => {
        setIsLoading(true);
        try {
            // Here you would typically call an API to update the event
            console.log('Updating event:', updatedEvent);
            // For now, we'll just update the local state
            const updatedEvents = events.map(e => 
                e.event_id === updatedEvent.event_id ? updatedEvent : e
            );
            // You might want to update the events state here if it's managed by a parent component
            // For now, we'll just log the updated events
            console.log('Updated events:', updatedEvents);
            setIsLoading(false);
            handleCloseEditDialog();
        } catch (error) {
            console.error('Error updating event:', error);
            setIsLoading(false);
        }
    };

    if (filteredEvents.length === 0) {
        return (
            <>
                <div className="px-5">
                    <Button className="bg-primary-foreground text-primary" onClick={() => router.back()}>
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
                <Button className="bg-primary-foreground text-primary" onClick={() => router.back()}>
                    <ArrowLeft /> Go Back
                </Button>
            </div>
            <div className='px-12 flex flex-col gap-4 mt-4'>
                {title === 'Ongoing Events' ? (
                    <div className="bg-green-500 text-primary-foreground p-3 rounded-t-lg">
                        <h2 className="text-lg font-semibold">{title}</h2>
                    </div>
                ) : title === 'Upcoming Events' ? (
                    <div className="bg-primary text-primary-foreground p-3 rounded-t-lg">
                        <h2 className="text-lg font-semibold">{title}</h2>
                    </div>
                ) : (
                    <div className="bg-yellow-300 text-primary-foreground p-3 rounded-t-lg">
                        <h2 className="text-lg font-semibold">{title}</h2>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {isLoading ? (
                        <p>Loading events...</p>
                    ) : filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
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
                                        <Button size="sm" variant="secondary" className="text-xs" onClick={() => {}}>
                                            View
                                        </Button>
                                        <Button size="sm" variant="secondary" className="text-xs" onClick={() => handleEditClick(event)}>
                                            <Edit2Icon className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p>No events available</p>
                    )}
                </div>
            </div>
            {selectedEvent && (
                <EditEventDialog
                    event={selectedEvent}
                    onClose={handleCloseEditDialog}
                    onSave={handleSaveEvent}
                />
            )}
        </div>
    );
}*/}