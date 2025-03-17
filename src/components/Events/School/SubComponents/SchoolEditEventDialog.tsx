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
import imageCompression from "browser-image-compression"

interface SchoolEditEventDialogProps {
  event: Event
  onClose: () => void
  onSave: (updatedEvent: Event) => Promise<void>
  isLoading: boolean
}

export function SchoolEditEventDialog({ event, onClose, onSave, isLoading }: SchoolEditEventDialogProps) {
  const router = useRouter()
  const [preview, setPreview] = React.useState<string | null>(event.image || null)
  const [error, setError] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    event_name: event.event_name,
    description: event.description,
    date: event.date,
    time_from: event.time_from,
    time_to: event.time_to,
    location: event.location,
    image: event.image || undefined,
    imagePreview: event.imageUrl || null // Update 1
  })

  const compressImage = async (file: File) => {
    try {
      const options = { maxSizeMB: 0.8, useWebWorker: true }
      const compressedFile = await imageCompression(file, options)

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Image = reader.result as string
        setFormData(prev => ({ 
          ...prev, 
          image: base64Image,
          imagePreview: base64Image // Update 3
        }))
      }
      reader.readAsDataURL(compressedFile)
      setError(null)
    } catch (err) {
      console.error('Error compressing image:', err)
      setError("Failed to compress and upload the image.")
    }
  }

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      setError("Please drop or attach only one image.")
      return
    }

    if (acceptedFiles.length === 1) {
      const file = acceptedFiles[0]
      compressImage(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const confirmCreate = window.confirm("Are you sure you want to create the FAQ?");
    if (confirmCreate) {
      try {
        const updatedEvent: Event = {
          ...event,
          event_name: formData.event_name,
          description: formData.description,
          date: formData.date,
          time_from: formData.time_from,
          time_to: formData.time_to,
          location: formData.location,
          image: formData.image
        }
        await onSave(updatedEvent)
        router.refresh()

        window.location.reload();
        onClose()
      } catch (error) {
        console.error('Error updating event:', error)
        setError('Failed to update event. Please try again.')
      }
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
                {formData.imagePreview ? ( // Update 2
                  <img src={formData.imagePreview} alt="Preview" className="max-w-full max-h-40 object-cover mt-2" />
                ) : (
                  <Skeleton className="h-[125px] w-full rounded-lg" />
                )}
                {error && <p className="text-red-500">{error}</p>}
              </div>
            </div>

            <div className="grid grid-cols-[3fr,2fr] gap-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="event-name" className="text-sm font-medium">Event Name</label>
                  <Input
                    id="event-name"
                    value={formData.event_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_name: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="event-description" className="text-sm font-medium">Description</label>
                  <Textarea
                    id="event-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    className="mt-1 h-[100px] resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="event-date" className="text-sm font-medium">Date</label>
                  <Input
                    id="event-date"
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
                      id="event-time-from"
                      type="time"
                      value={formData.time_from}
                      onChange={(e) => setFormData(prev => ({ ...prev, time_from: e.target.value }))}
                      required
                      className="mt-1 w-[125px]"
                    />
                    <span className="text-sm text-muted-foreground">to</span>
                    <Input
                      id="event-time-to"
                      type="time"
                      value={formData.time_to}
                      onChange={(e) => setFormData(prev => ({ ...prev, time_to: e.target.value }))}
                      required
                      className="mt-1 w-[125px]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="event-location" className="text-sm font-medium">Location</label>
                  <Input
                    id="event-location"
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
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-white" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

