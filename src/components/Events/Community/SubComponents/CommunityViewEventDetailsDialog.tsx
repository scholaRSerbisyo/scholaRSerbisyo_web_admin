import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Event } from "@/components/types";

interface CommunityViewEventDetailsDialogProps {
    event: Event | null;
    onClose: () => void;
    isOpen: boolean;
}

export function CommunityViewEventDetailsDialog({ event, onClose, isOpen }: CommunityViewEventDetailsDialogProps) {
    if (!event) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{event.event_name}</DialogTitle>
                    <DialogDescription>Event Details</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Clock className="h-4 w-4" />
                        <span>{event.time_from} - {event.time_to}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                    </div>
                    <div>
                        <h4 className="mb-2 font-semibold">Description</h4>
                        <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

