"use client"

import * as React from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Event } from "@/components/types"
import { useDropzone } from "react-dropzone"
import { useRouter } from "next/navigation"

interface EditEventDialogProps {
  event: Event
  onClose: () => void
  onSave: (updatedEvent: Event) => Promise<void>
}

export function EditEventDialog({ event, onClose, onSave }: EditEventDialogProps) {
    const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false)
  const [preview, setPreview] = React.useState<string | null>(event.imageUrl || null)
  const [error, setError] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    event_name: event.event_name,
    description: event.description,
    date: event.date,
    time_from: event.time_from,
    time_to: event.time_to,
    location: event.location,
    image: null as File | null
  })

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setFormData(prev => ({ ...prev, image: file }))
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const updatedEvent: Event = {
        ...event,
        event_name: formData.event_name,
        description: formData.description,
        date: formData.date,
        time_from: formData.time_from,
        time_to: formData.time_to,
        location: formData.location,
      }
      await onSave(updatedEvent)
      router.refresh();
      onClose()
    } catch (error) {
      console.error('Error updating event:', error)
      setError('Failed to update event. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-[850px] max-h-[80vh] p-0 flex flex-col">
            <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Edit Event</h2>
                <p className="text-sm text-muted-foreground">Make changes for this event.</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Event Image</label>
                    <div
                        {...getRootProps()}
                        className="flex flex-col gap-3 text-sm justify-center items-center p-4 border border-dashed rounded-lg cursor-pointer mb-4"
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? <p>Drop the image here...</p> : <p>Drag 'n' drop an image here for the Event's Image, or click to select one</p>}
                        {preview ? (
                        <img src={preview} alt="Preview" className="max-w-full max-h-40 object-cover mt-2" />
                        ) : (
                        <Skeleton className="h-[125px] w-full rounded-lg" />
                        )}
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                    </div>

                    <div className="grid grid-cols-[3fr,2fr] gap-4">
                    <div className="space-y-4">
                        <div>
                        <label className="text-sm font-medium">Event Name</label>
                        <Input
                            value={formData.event_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, event_name: e.target.value }))}
                            required
                            className="mt-1"
                        />
                        </div>

                        <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            required
                            className="mt-1 h-[100px] resize-none"
                        />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                        <label className="text-sm font-medium">Date</label>
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            required
                            className="mt-1"
                        />
                        </div>

                        <div>
                        <label className="text-sm font-medium">Time</label>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">from</span>
                            <Input
                            type="time"
                            value={formData.time_from}
                            onChange={(e) => setFormData(prev => ({ ...prev, time_from: e.target.value }))}
                            required
                            className="mt-1 w-[125px]"
                            />
                            <span className="text-sm text-muted-foreground">to</span>
                            <Input
                            type="time"
                            value={formData.time_to}
                            onChange={(e) => setFormData(prev => ({ ...prev, time_to: e.target.value }))}
                            required
                            className="mt-1 w-[125px]"
                            />
                        </div>
                        </div>

                        <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            required
                            className="mt-1"
                        />
                        </div>
                    </div>
                    </div>

                    <div className="flex justify-start gap-4 pt-2">
                    <Button 
                        type="submit" 
                        className="bg-yellow-400 hover:bg-yellow-500 text-black" 
                        disabled={isLoading}
                    >
                        Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    </div>
                </form>
            </div>
        </DialogContent>
    </Dialog>
  )
}