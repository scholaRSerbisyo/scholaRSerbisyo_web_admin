import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Edit2Icon, Calendar, Clock, MapPin } from 'lucide-react'
import { EventImage } from "@/components/Events/CSO/SubComponents/EventImage"
import { Event } from "@/components/types"
import { useRouter } from 'next/navigation'
import { EditEventDialog } from './EditEventDialog'
import { useTheme } from 'next-themes'

interface EventSectionProps {
  title: string
  events: Event[]
  isLoading: boolean
  onEventSelect: (event: Event) => void
}

export function EventSection({ title, events, isLoading, onEventSelect }: EventSectionProps) {
    const router = useRouter();
    const { theme } = useTheme();
    const [isUpdateLoading, setIsUpdateLoading] = React.useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

    const handleViewAll = () => {
        router.push(`/events/cso/viewevents?title=${encodeURIComponent(title)}&status=${encodeURIComponent(events[0].status)}`);
    }

    const handleEditClick = (event: Event) => {
        setSelectedEvent(event);
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedEvent(null);
    };

    const handleSaveEvent = async (updatedEvent: Event) => {
        setIsUpdateLoading(true);
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
            setIsUpdateLoading(false);
            handleCloseEditDialog();
        } catch (error) {
            console.error('Error updating event:', error);
            setIsUpdateLoading(false);
        }
    };

    const headerColorClass = 
        title === 'Ongoing Events' ? "bg-green-500" :
        title === 'Upcoming Events' ? "bg-primary" :
        "bg-yellow-300";

    return (
        <section className={`space-y-4 border rounded-lg ${theme == 'light'?'border-gray-300':''}`}>
            <div className="relative w-full sm:max-w-[200px] md:max-w-[300px] lg:max-w-[300px] xl:max-w-[782px] mx-auto overflow-hidden">
                <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar pr-[100px]">
                    {isLoading ? (
                        <p className="text-center w-full">Loading events...</p>
                    ) : events && events.length > 0 ? (
                        <>
                            {events.map((event) => (
                                <Card 
                                    key={event.event_id} 
                                    className="shadow-md flex-shrink-0 w-[200px] first:ml-0"
                                >
                                    <CardHeader className="p-0">
                                        <EventImage event={event} title={title} />
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
                                        <div className="flex justify-between">
                                            <Button size="sm" variant="secondary" className="text-xs bg-[#191851] text-white hover:bg-blue-600" onClick={() => onEventSelect(event)}>
                                                View
                                            </Button>
                                            <Button size="sm" variant="secondary" className="text-xs bg-green-800 text-white hover:bg-green-500" onClick={() => handleEditClick(event)}>
                                                <Edit2Icon className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </>
                    ) : (
                        <p className="text-center w-full">No events available</p>
                    )}
                </div>
                {events && events.length > 4 && (
                    <div className="absolute right-0 top-0 bottom-0 mb-3 w-[200px] flex items-center justify-center bg-gradient-to-l from-background to-transparent">
                        <Button 
                            variant="secondary" 
                            className="w-full text-xs bg-primary text-primary-foreground hover:bg-primary/90 flex flex-col items-center bg-[#191851] text-white hover:bg-blue-600"
                            onClick={handleViewAll}
                        >
                            <span className='flex'>View All ({events.length})
                                <ChevronRight className="h-4 w-4" />
                            </span>
                        </Button>
                    </div>
                )}
                {selectedEvent && (
                    <EditEventDialog
                        event={selectedEvent}
                        onClose={handleCloseEditDialog}
                        onSave={(handleSaveEvent)}
                    />
                )}
            </div>
        </section>
    )
}