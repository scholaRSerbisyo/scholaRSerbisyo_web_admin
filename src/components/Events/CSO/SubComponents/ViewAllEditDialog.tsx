"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Event } from "@/components/types";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";

interface ViewAllEditEventDialogProps {
    event: Event | null;
    onClose: () => void;
    onSave: (updatedEvent: Event) => void;
    isLoading: boolean;
    isOpen: boolean;
}

export function ViewAllEditEventDialog({ event, onClose, onSave, isLoading, isOpen }: ViewAllEditEventDialogProps) {
    const router = useRouter();
    const [editedEvent, setEditedEvent] = useState<Event | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (event) {
            setEditedEvent({ ...event, imagePreview: event.image || null });
        }
    }, [event]);

    const compressImage = async (file: File) => {
        try {
            const options = { maxSizeMB: 0.8, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result as string;
                setEditedEvent(prev => ({
                    ...prev!,
                    image: base64Image,
                    imagePreview: base64Image
                }));
            };
            reader.readAsDataURL(compressedFile);
            setError(null);
        } catch (err) {
            console.error('Error compressing image:', err);
            setError("Failed to compress and upload the image.");
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 1) {
            setError("Please drop or attach only one image.");
            return;
        }

        if (acceptedFiles.length === 1) {
            const file = acceptedFiles[0];
            compressImage(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        multiple: false
    });

    if (!editedEvent) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedEvent(prev => ({ ...prev!, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editedEvent) {
            onSave(editedEvent);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[850px] sm:max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                    <DialogDescription>Make changes to the event details here.</DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pr-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label className="text-sm font-medium">Event Image</Label>
                                <div
                                    {...getRootProps()}
                                    className="flex flex-col gap-3 text-sm justify-center items-center p-4 border border-dashed rounded-lg cursor-pointer mb-4"
                                >
                                    <input {...getInputProps()} />
                                    {isDragActive ? <p>Drop the image here...</p> : <p>Drag 'n' drop an image here for the Event's Image, or click to select one</p>}
                                    {editedEvent.imagePreview ? (
                                        <img src={editedEvent.imagePreview} alt="Preview" className="max-w-full max-h-40 object-cover mt-2" />
                                    ) : (
                                        <Skeleton className="h-[125px] w-full rounded-lg" />
                                    )}
                                    {error && <p className="text-red-500">{error}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="event_name">Name</Label>
                                    <Input
                                        id="event_name"
                                        name="event_name"
                                        value={editedEvent.event_name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        name="date"
                                        type="date"
                                        value={editedEvent.date}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="time_from">Start Time</Label>
                                    <Input
                                        id="time_from"
                                        name="time_from"
                                        type="time"
                                        value={editedEvent.time_from}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="time_to">End Time</Label>
                                    <Input
                                        id="time_to"
                                        name="time_to"
                                        type="time"
                                        value={editedEvent.time_to}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={editedEvent.location}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={editedEvent.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

