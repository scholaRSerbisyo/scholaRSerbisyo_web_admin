"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import imageCompression from "browser-image-compression"
import { Button } from "@/components/ui/button"
import {
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  addEvent,
  createEventValidation,
  getEventTypes,
  getSchools,
  getBaranggays,
  currentAdmin,
} from "./_actions/adminaction"
import { PlusIcon } from "lucide-react"
import { createUUID } from "@/util/uuid"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import type { EventType, School, Baranggay } from "@/components/types/event-validation"
import { sendPushNotification } from "./_actions/notifications"

const formSchema = z.object({
  event_name: z.string().min(2, "Event Title must be at least 2 characters").max(50),
  description: z.string().max(80),
  date: z.string().min(1, "Date is required"),
  time_from: z.string().min(1, "Start time is required"),
  time_to: z.string().min(1, "Time to is required"),
  location: z.string().min(1, "Location is required").max(50),
  event_type_id: z.number().min(1, "Event type is required"),
  school_id: z.number().optional().nullable(),
  baranggay_id: z.number().optional().nullable(),
})

interface AddEventProps {
  admintype: number
}

export type EventFormValues = z.infer<typeof formSchema>

export default function AddEventButton({ admintype }: AddEventProps) {
  const router = useRouter()
  const { theme } = useTheme()
  const { toast } = useToast()
  const [image, setImage] = React.useState<string>("")
  const [preview, setPreview] = React.useState<string | null>(null)
  const [eventTypes, setEventTypes] = React.useState<EventType[]>([])
  const [schools, setSchools] = React.useState<School[]>([])
  const [baranggays, setBaranggays] = React.useState<Baranggay[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [fixedEventType, setFixedEventType] = React.useState<number | null>(null)
  const [adminId, setAdminId] = React.useState<number | null>(null)
  const [pendingValues, setPendingValues] = React.useState<EventFormValues | null>(null)

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_name: "",
      description: "",
      date: "",
      time_from: "",
      time_to: "",
      location: "",
      event_type_id: undefined,
      school_id: null,
      baranggay_id: null,
    },
  })

  React.useEffect(() => {
    if (admintype === 2) {
      setFixedEventType(1)
      form.setValue("event_type_id", 1)
    } else if (admintype === 3) {
      setFixedEventType(2)
      form.setValue("event_type_id", 2)
    } else if (admintype === 4) {
      setFixedEventType(3)
      form.setValue("event_type_id", 3)
    }
  }, [admintype, form])

  React.useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const id = await currentAdmin()
        setAdminId(id)
      } catch (error) {
        console.error("Error fetching admin info:", error)
        toast({
          title: "Error",
          description: "Failed to fetch admin information",
          variant: "destructive",
        })
      }
    }

    fetchAdminInfo()
  }, [toast])

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

  const compressImage = async (file: File) => {
    try {
      setIsLoading(true)
      const options = { maxSizeMB: 0.8, useWebWorker: true }
      const compressedFile = await imageCompression(file, options)

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Image = reader.result as string
        setImage(base64Image)
        setPreview(base64Image)
      }
      reader.readAsDataURL(compressedFile)
      setError(null)
    } catch (err) {
      setError("Failed to compress and upload the image.")
    } finally {
      setIsLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  })

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventTypesData, schoolsData, baranggaysData] = await Promise.all([
          getEventTypes(),
          getSchools(),
          getBaranggays(),
        ])
        setEventTypes(eventTypesData || [])
        setSchools(schoolsData || [])
        setBaranggays(baranggaysData || [])
      } catch (error) {
        console.error("Error fetching data!", error)
        toast({
          title: "Error",
          description: "Failed to fetch necessary data",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  const onSubmit = async (values: EventFormValues) => {
    if (!image) {
      setError("Please upload an image before submitting.")
      return
    }

    setPendingValues(values)
    setShowConfirmDialog(true)
  }

  const handleConfirmedSubmit = async () => {
    if (!pendingValues) return

    setIsLoading(true)
    try {
      const image_uuid: string = createUUID()

      const baseData = {
        event_image_uuid: image_uuid,
        event_name: pendingValues.event_name,
        description: pendingValues.description,
        date: pendingValues.date,
        time_from: pendingValues.time_from,
        time_to: pendingValues.time_to,
        location: pendingValues.location,
        event_type_id: pendingValues.event_type_id,
        school_id: pendingValues.school_id || null,
        baranggay_id: pendingValues.baranggay_id || null,
        image: image,
      }

      if (admintype === 1 || admintype === 2) {
        const resultData = await addEvent({
          ...baseData,
          status: "ongoing",
        })

        if (resultData.status !== 201) {
          throw new Error(resultData.message)
        }

        toast({
          title: "Success",
          description: resultData.message,
        })

        try {
          const eventType = eventTypes.find((et) => et.event_type_id === pendingValues.event_type_id)
          const notificationData = {
            event_id: resultData.event,
            event_name: pendingValues.event_name,
            event_type_name: eventType?.name || "Unknown",
            description: pendingValues.description,
            date: pendingValues.date,
            time_from: pendingValues.time_from,
            time_to: pendingValues.time_to,
            event_image_uuid: image_uuid,
          }

          await sendPushNotification(notificationData)
        } catch (error) {
          console.error("Failed to send push notification:", error)
          toast({
            title: "Warning",
            description: "Event created successfully, but there was an issue sending notifications.",
          })
        }
      } else {
        if (!adminId) {
          throw new Error("Admin ID not found. Please try again.")
        }

        const validationData = {
          ...baseData,
          admin_id: adminId,
          admin_type_name: admintype === 3 ? "School Admin" : "Barangay Admin",
        }

        const result = await createEventValidation(validationData)

        if (result.status !== 201) {
          throw new Error(result.message || "Failed to submit event for validation")
        }

        toast({
          title: "Success",
          description: "Event submitted for validation successfully",
        })
      }

      router.refresh()
      setIsDialogOpen(false)
      setShowConfirmDialog(false)
      form.reset()
      setImage("")
      setPreview(null)
    } catch (error) {
      console.error("Error submitting event:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit event",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const buttonText = admintype === 1 || admintype === 2 ? "Add Event" : "Submit Event for Validation"
  const dialogTitle = admintype === 1 || admintype === 2 ? "Add Event" : "Submit Event for Validation"

  return (
    <>
      <Toaster />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-ys text-white hover:bg-yellow-300"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        </DialogTrigger>
        <DialogContent
          className={`z-50 w-full h-full max-w-4xl max-h-[85vh] bg-background text-primary p-6 ${
            theme === "light" ? "text-blue-950" : "text-blue-400"
          }`}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{dialogTitle}</DialogTitle>
            <DialogDescription className="text-sm">
              {admintype === 1 || admintype === 2
                ? "Create an event for City Scholars"
                : "Submit an event for validation by administrators"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-y-auto p-5">
              <div
                {...getRootProps()}
                className="flex flex-col gap-4 justify-center items-center p-4 border border-dashed rounded-lg cursor-pointer mb-4"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here...</p>
                ) : (
                  <p>Drag 'n' drop an image here for the Event's Image, or click to select one</p>
                )}
                {preview ? (
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-40 object-cover mt-2"
                  />
                ) : (
                  <Skeleton className="h-[125px] w-full rounded-lg" />
                )}
                {error && <p className="text-red-500">{error}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="event_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Scholar's Cup" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Event details" {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {admintype === 1 ? (
                  <FormField
                    control={form.control}
                    name="event_type_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(Number(value))
                            form.setValue("school_id", null)
                            form.setValue("baranggay_id", null)
                          }}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eventTypes.map((type) => (
                              <SelectItem key={type.event_type_id} value={type.event_type_id.toString()}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Input
                      value={eventTypes.find((type) => type.event_type_id === fixedEventType)?.name || "Unknown"}
                      disabled
                      className="bg-muted"
                    />
                  </FormItem>
                )}
              </div>

              {(admintype === 3 || (admintype === 1 && form.watch("event_type_id") === 2)) && (
                <FormField
                  control={form.control}
                  name="school_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select school" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schools.map((school) => (
                            <SelectItem key={school.school_id} value={school.school_id.toString()}>
                              {school.school_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {(admintype === 4 || (admintype === 1 && form.watch("event_type_id") === 3)) && (
                <FormField
                  control={form.control}
                  name="baranggay_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select baranggay" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {baranggays.map((baranggay) => (
                            <SelectItem key={baranggay.baranggay_id} value={baranggay.baranggay_id.toString()}>
                              {baranggay.baranggay_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset()
                    setIsDialogOpen(false)
                    setImage("")
                    setPreview(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-yellow-500 text-white rounded">
                  {isLoading ? "Submitting..." : admintype === 1 || admintype === 2 ? "Save" : "Submit for Validation"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-white" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Event Creation</DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {admintype === 1 || admintype === 2 ? "create this event" : "submit this event for validation"}?
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Event Name:</strong> {pendingValues?.event_name}
                </p>
                <p>
                  <strong>Date:</strong> {pendingValues?.date}
                </p>
                <p>
                  <strong>Time:</strong> {pendingValues?.time_from} - {pendingValues?.time_to}
                </p>
                <p>
                  <strong>Location:</strong> {pendingValues?.location}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmedSubmit}
              disabled={isLoading}
              className="bg-yellow-500 text-white hover:bg-yellow-600"
            >
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

