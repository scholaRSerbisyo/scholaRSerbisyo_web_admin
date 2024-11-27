import React from 'react'
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Event } from "@/components/types"
import { CheckAttendeesDialog } from "@/components/Events/CSO/SubComponents/CheckAttendeesDialog"
import { EditEventDialog } from "@/components/Events/CSO/SubComponents/EditEventDialog"
import { useTheme } from 'next-themes'

interface EventDetailsDialogProps {
    event: Event
    onClose: () => void
}

export function EventDetailsDialog({ event, onClose }: EventDetailsDialogProps) {
    const { theme } = useTheme();
    const [showAttendees, setShowAttendees] = React.useState(false)
    const [showEditDialog, setShowEditDialog] = React.useState(false)

    const handleSaveEvent = async (updatedEvent: Event) => {
        try {
        // TODO: Implement the API call to update the event
        console.log('Updating event:', updatedEvent)
        // After successful update, you might want to refresh the events list
        onClose()
        } catch (error) {
        console.error('Error saving event:', error)
        }
    }

    if (showAttendees) {
        return <CheckAttendeesDialog eventId={event.event_id} onClose={() => setShowAttendees(false)} />
    }

    if (showEditDialog) {
        return <EditEventDialog event={event} onClose={() => setShowEditDialog(false)} onSave={handleSaveEvent} />
    }

    const currentDate = new Date();
    const eventDate = new Date(event.created_at || "");

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className={`sm:max-w-[700px] bg-primary-foreground text-white [&>button]:text-black [&>button]:dark:text-white`}>
            <DialogHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
                <DialogTitle className={`text-xl font-semibold ${theme == 'light'?'text-black':''}`}>{event.event_name}</DialogTitle>
                {eventDate > currentDate?
                    <span className="bg-yellow-400 text-xs px-2 py-0.5 rounded-full font-medium text-black">NEW</span>
                    :
                    <span></span>
                }
            </div>
            </DialogHeader>

            <div className="grid grid-cols-[minmax(0,400px),1fr] gap-6 mt-4">
            {/* Left column - Image */}
            <div className="border border-dashed border-gray-600 rounded-lg p-6">
                {event.imageUrl ? (
                <div className="relative w-full aspect-square flex items-center justify-center">
                    <Image
                    src={event.imageUrl}
                    alt={event.event_name}
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
                    <span className={`text-gray-400 ${theme == 'light'?'text-black':''}`}>No Image</span>
                </div>
                )}
            </div>

            {/* Right column - Event Details */}
            <div className="space-y-6">
                <div>
                <h3 className={`font-medium mb-2 ${theme == 'light'?'text-black':''}`}>Event Description</h3>
                <p className={`text-sm ${theme == 'light'?'text-black':'text-gray-300'}`}>{event.description}</p>
                </div>

                <div>
                <h3 className={`font-medium mb-2 ${theme == 'light'?'text-black':''}`}>Time</h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                    <span className={`text-sm ${theme == 'light'?'text-black':'text-gray-300 '}`}>from</span>
                    <div className="border border-gray-700 bg-gray-800 rounded px-3 py-1 text-sm">
                        {event.time_from}
                    </div>
                    </div>
                    <div className="flex items-center gap-2">
                    <span className={`text-sm ${theme == 'light'?'text-black':'text-gray-300 '}`}>to</span>
                    <div className="border border-gray-700 bg-gray-800 rounded px-3 py-1 text-sm">
                        {event.time_to}
                    </div>
                    </div>
                </div>
                </div>

                <div>
                <h3 className={`font-medium mb-2 ${theme == 'light'?'text-black':'text-gray-300 '}`}>Date</h3>
                <div className="border border-gray-700 bg-gray-800 rounded px-3 py-1 text-sm w-fit">
                    {event.date}
                </div>
                </div>

                <div>
                <h3 className={`font-medium mb-2 ${theme == 'light'?'text-black':'text-gray-300 '}`}>Location</h3>
                <div className="border border-gray-700 bg-gray-800 rounded px-3 py-1 text-sm w-fit">
                    {event.location}
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
                    className={`border-gray-700 hover:bg-gray-800 ${theme == 'light'?'text-black':''}`}
                    onClick={() => setShowEditDialog(true)}
                >
                    Edit Event
                </Button>
                </div>
            </div>
            </div>
        </DialogContent>
        </Dialog>
    )
}