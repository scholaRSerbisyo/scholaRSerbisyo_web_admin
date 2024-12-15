import React, { useState } from 'react'
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Event } from "@/components/types"
import { CheckAttendeesDialog } from "@/components/Events/CSO/SubComponents/CheckAttendeesDialog"
import { EditEventDialog } from "@/components/Events/CSO/SubComponents/EditEventDialog"
import { useTheme } from 'next-themes'
import { updateEvent } from '../../_actions/events'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, Edit2Icon } from 'lucide-react'
import { format, isBefore, isAfter, isWithinInterval } from 'date-fns'

interface EventDetailsDialogProps {
    event: Event
    onClose: () => void
}

export function EventDetailsDialog({ event, onClose }: EventDetailsDialogProps) {
    const router = useRouter();
    const { theme } = useTheme();
    const [showAttendees, setShowAttendees] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isUpdateLoading, setIsUpdateLoading] = useState(false)
    const [localEvent, setLocalEvent] = useState<Event>(event)

    const determineEventStatus = (eventDate: string, timeFrom: string, timeTo: string): string => {
        const now = new Date();
        const eventDateTime = new Date(eventDate);
        const [fromHours, fromMinutes] = timeFrom.split(':').map(Number);
        const [toHours, toMinutes] = timeTo.split(':').map(Number);

        eventDateTime.setHours(fromHours, fromMinutes);
        const eventEndDateTime = new Date(eventDate);
        eventEndDateTime.setHours(toHours, toMinutes);

        if (isBefore(eventEndDateTime, now)) {
            return 'previous';
        } else if (isWithinInterval(now, { start: eventDateTime, end: eventEndDateTime })) {
            return 'ongoing';
        } else {
            return 'upcoming';
        }
    };

    const handleSaveUpdateEvent = async (updatedEvent: Event) => {
        setIsUpdateLoading(true);
        try {
            const status = determineEventStatus(updatedEvent.date, updatedEvent.time_from, updatedEvent.time_to);
            
            const eventToUpdate = {
                ...updatedEvent,
                status,
            };

            const updatedEventFromServer = await updateEvent(eventToUpdate);
            
            setLocalEvent(updatedEventFromServer);
            toast({
                title: "Event Updated",
                description: "The event has been successfully updated.",
            });
            window.location.reload()
            setIsEditDialogOpen(false);
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

    if (showAttendees) {
        return <CheckAttendeesDialog eventId={localEvent.event_id} eventName={localEvent.event_name} onClose={() => setShowAttendees(false)} />
    }

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={`sm:max-w-[700px] bg-primary-foreground text-white [&>button]:text-black [&>button]:dark:text-white`}>
                <DialogHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DialogTitle className={`text-xl font-semibold ${theme === 'light' ? 'text-black' : ''}`}>{localEvent.event_name}</DialogTitle>
                        {new Date(localEvent.created_at || "") > new Date() && (
                            <span className="bg-yellow-400 text-xs px-2 py-0.5 rounded-full font-medium text-black">NEW</span>
                        )}
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-[minmax(0,400px),1fr] gap-6 mt-4">
                    {/* Left column - Image */}
                    <div className="border border-dashed border-gray-600 rounded-lg p-6">
                        {localEvent.imageUrl ? (
                            <div className="relative w-full aspect-square flex items-center justify-center">
                                <Image
                                    src={localEvent.imageUrl}
                                    alt={localEvent.event_name}
                                    width={300}
                                    height={300}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/placeholder.svg";
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="aspect-square w-full bg-gray-800 flex items-center justify-center rounded-lg">
                                <span className={`text-gray-400 ${theme === 'light' ? 'text-black' : ''}`}>No Image</span>
                            </div>
                        )}
                    </div>

                    {/* Right column - Event Details */}
                    <div className="space-y-6">
                        <div>
                            <h3 className={`font-medium mb-2 ${theme === 'light' ? 'text-black' : ''}`}>Event Description</h3>
                            <p className={`text-sm ${theme === 'light' ? 'text-black' : 'text-gray-300'}`}>{localEvent.description}</p>
                        </div>

                        <div>
                            <h3 className={`font-medium mb-2 ${theme === 'light' ? 'text-black' : ''}`}>Time</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span className={`text-sm ${theme === 'light' ? 'text-black' : 'text-gray-300'}`}>from</span>
                                    <div className="border border-gray-700 bg-gray-800 rounded px-3 py-1 text-sm">
                                        {localEvent.time_from}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span className={`text-sm ${theme === 'light' ? 'text-black' : 'text-gray-300'}`}>to</span>
                                    <div className="border border-gray-700 bg-gray-800 rounded px-3 py-1 text-sm">
                                        {localEvent.time_to}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className={`font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-gray-300'}`}>Date</h3>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <div className="border border-gray-700 bg-gray-800 rounded px-3 py-1 text-sm w-fit">
                                    {localEvent.date}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className={`font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-gray-300'}`}>Location</h3>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <div className="border border-gray-700 bg-gray-800 rounded px-3 py-1 text-sm w-fit">
                                    {localEvent.location}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button 
                                className="bg-yellow-400 hover:bg-yellow-500 text-black"
                                onClick={() => setShowAttendees(true)}
                            >
                                Check Attendees
                            </Button>
                            <Button 
                                variant="outline" 
                                className={`border-gray-700 hover:bg-gray-800 ${theme === 'light' ? 'text-black' : ''}`}
                                onClick={() => setIsEditDialogOpen(true)}
                            >
                                <Edit2Icon className="w-4 h-4 mr-2" />
                                Edit Event
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
            {isEditDialogOpen && (
                <EditEventDialog
                    event={localEvent}
                    onClose={() => setIsEditDialogOpen(false)}
                    onSave={handleSaveUpdateEvent}
                    isLoading={isUpdateLoading}
                />
            )}
        </Dialog>
    )
}

