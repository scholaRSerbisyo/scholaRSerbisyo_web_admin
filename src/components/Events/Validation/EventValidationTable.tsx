"use client"

import { useState } from "react"
import { MoreHorizontal, Check, X, Eye, ImageOff } from "lucide-react"
import { format } from "date-fns"
import { getImage } from "@/components/Events/_actions/events"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { EventValidation, EventValidationTableProps } from "@/components/types/event-validation"

export function EventValidationTable({
  eventValidations = [],
  onAcceptEvent,
  onDeclineEvent,
}: EventValidationTableProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventValidation | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<number | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: "accept" | "decline"; id: number } | null>(null)

  // Ensure eventValidations is an array
  const validEventValidations = Array.isArray(eventValidations) ? eventValidations : []

  const handleAccept = async (id: number) => {
    setPendingAction({ type: "accept", id })
    setShowConfirmDialog(true)
  }

  const handleDecline = async (id: number) => {
    setPendingAction({ type: "decline", id })
    setShowConfirmDialog(true)
  }

  const handleConfirmedAction = async () => {
    if (!pendingAction) return

    try {
      setIsLoading(pendingAction.id)
      if (pendingAction.type === "accept") {
        await onAcceptEvent(pendingAction.id)
      } else {
        await onDeclineEvent(pendingAction.id)
      }
    } finally {
      setIsLoading(null)
      setShowConfirmDialog(false)
      setPendingAction(null)
    }
  }

  const handleViewDetails = async (event: EventValidation) => {
    setSelectedEvent(event)
    setIsDialogOpen(true)
    setImageUrl(null)
    setImageError(null)

    if (event.event_image_uuid) {
      setIsImageLoading(true)
      try {
        const url = await getImage(event.event_image_uuid)
        if (url) {
          setImageUrl(url)
        } else {
          setImageError("Failed to load image")
        }
      } catch (error) {
        console.error("Error loading image:", error)
        setImageError("Failed to load image")
      } finally {
        setIsImageLoading(false)
      }
    }
  }

  const getStatusBadge = (status: EventValidation["status"]) => {
    const variants: Record<EventValidation["status"], "default" | "destructive" | "secondary"> = {
      pending: "secondary",
      accepted: "default",
      declined: "destructive",
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const getEventScope = (event: EventValidation) => {
    if (event.school?.school_name) {
      return `School: ${event.school.school_name}`
    }
    if (event.barangay?.baranggay_name) {
      return `Barangay: ${event.barangay.baranggay_name}`
    }
    return "City-wide"
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validEventValidations.length > 0 ? (
              validEventValidations.map((event) => (
                <TableRow key={event.event_validation_id}>
                  <TableCell className="font-medium">{event.event_name}</TableCell>
                  <TableCell>{event.event_type?.name || "N/A"}</TableCell>
                  <TableCell>{getEventScope(event)}</TableCell>
                  <TableCell>{format(new Date(event.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    {format(new Date(`2000-01-01 ${event.time_from}`), "h:mm a")} -{" "}
                    {format(new Date(`2000-01-01 ${event.time_to}`), "h:mm a")}
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isLoading === event.event_validation_id}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(event)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {event.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleAccept(event.event_validation_id)}
                              className="text-green-600"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Accept Event
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDecline(event.event_validation_id)}
                              className="text-red-600"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Decline Event
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No event validations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.event_name}</DialogTitle>
                <DialogDescription>Event Details</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-full max-h-[calc(80vh-8rem)] pr-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-medium">Status:</span>
                    <div className="col-span-3">{getStatusBadge(selectedEvent.status)}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-medium">Event Type:</span>
                    <span className="col-span-3">{selectedEvent.event_type?.name || "N/A"}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-medium">Scope:</span>
                    <span className="col-span-3">{getEventScope(selectedEvent)}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-medium">Date:</span>
                    <span className="col-span-3">{format(new Date(selectedEvent.date), "MMMM d, yyyy")}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-medium">Time:</span>
                    <span className="col-span-3">
                      {format(new Date(`2000-01-01 ${selectedEvent.time_from}`), "h:mm a")} -{" "}
                      {format(new Date(`2000-01-01 ${selectedEvent.time_to}`), "h:mm a")}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-medium">Location:</span>
                    <span className="col-span-3">{selectedEvent.location}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-medium">Created By:</span>
                    <span className="col-span-3">{selectedEvent.admin_type_name}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-medium">Description:</span>
                    <span className="col-span-3">{selectedEvent.description}</span>
                  </div>
                  {selectedEvent.event_image_uuid && (
                    <div className="grid grid-cols-4 items-start gap-4">
                      <span className="font-medium">Event Image:</span>
                      <div className="col-span-3">
                        {isImageLoading ? (
                          <Skeleton className="w-full h-48 rounded-lg" />
                        ) : imageError ? (
                          <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-lg text-muted-foreground">
                            <ImageOff className="h-8 w-8 mb-2" />
                            <p>{imageError}</p>
                          </div>
                        ) : imageUrl ? (
                          <img
                            src={imageUrl || "/placeholder.svg"}
                            alt={selectedEvent.event_name}
                            className="max-w-full h-auto rounded-lg"
                          />
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              {selectedEvent.status === "pending" && (
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleDecline(selectedEvent.event_validation_id)}
                    className="text-red-600"
                    disabled={isLoading === selectedEvent.event_validation_id}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                  <Button
                    onClick={() => handleAccept(selectedEvent.event_validation_id)}
                    className="bg-green-600 text-white hover:bg-green-700"
                    disabled={isLoading === selectedEvent.event_validation_id}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {pendingAction?.type === "accept" ? "accept" : "decline"} this event? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false)
                setPendingAction(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmedAction}
              disabled={isLoading !== null}
              className={
                pendingAction?.type === "accept"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }
            >
              {isLoading !== null ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

