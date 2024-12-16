"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";
import { 
  DialogFooter, 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  addEvent, 
  getEventTypes, 
  getSchools, 
  getBaranggays 
} from "./_actions/adminaction";
import { PlusIcon } from 'lucide-react';
import { createUUID } from "@/util/uuid";
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";
import { EventType, School, Baranggay } from "@/components/types"
import { sendPushNotification } from "./_actions/notifications";

const formSchema = z.object({
  event_name: z.string().min(2, "Event Title must be at least 2 characters").max(50),
  description: z.string().max(80),
  date: z.string().min(1, "Date is required"),
  time_from: z.string().min(1, "Start time is required"),
  time_to: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required").max(50),
  event_type_id: z.number().min(1, "Event type is required"),
  school_id: z.number().optional(),
  baranggay_id: z.number().optional(),
});

interface AddEventProps {
  admintype: number;
}

export type EventFormValues = z.infer<typeof formSchema>;

export default function AddEventButtonComponent({ admintype }: AddEventProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [image, setImage] = React.useState<string>("");
  const [preview, setPreview] = React.useState<string | null>(null);
  const [eventTypes, setEventTypes] = React.useState<EventType[]>([]);
  const [schools, setSchools] = React.useState<School[]>([]);
  const [baranggays, setBaranggays] = React.useState<Baranggay[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fixedEventType, setFixedEventType] = React.useState<number | null>(null);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

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
      school_id: undefined,
      baranggay_id: undefined,
    },
  });

  React.useEffect(() => {
    if (admintype === 2) {
      setFixedEventType(1);
      form.setValue('event_type_id', 1);
    } else if (admintype === 3) {
      setFixedEventType(2);
      form.setValue('event_type_id', 2);
    } else if (admintype === 4) {
      setFixedEventType(3);
      form.setValue('event_type_id', 3);
    }
  }, [admintype, form]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      setError("Please drop or attach only one image.");
      return;
    }

    if (acceptedFiles.length === 1) {
      const file = acceptedFiles[0];
      compressImage(file);
    }
  }, []);

  const compressImage = async (file: File) => {
    try {
      setIsLoading(true);
      const options = { maxSizeMB: 0.8, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setImage(base64Image);
        setPreview(base64Image);
      };
      reader.readAsDataURL(compressedFile);
      setError(null);
    } catch (err) {
      setError("Failed to compress and upload the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventTypesData, schoolsData, baranggaysData] = await Promise.all([
          getEventTypes(),
          getSchools(),
          getBaranggays()
        ]);
        setEventTypes(eventTypesData || []);
        setSchools(schoolsData || []);
        setBaranggays(baranggaysData || []);
      } catch (error) {
        console.error("Error fetching data!", error);
        setEventTypes([]);
        setSchools([]);
        setBaranggays([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (values: EventFormValues) => {
    setIsLoading(true);
  
    if (!image) {
      setError("Please upload an image before submitting.");
      setIsLoading(false);
      return;
    }
  
    try {
      const image_uuid: string = createUUID();
  
      const data = {
        event_image_uuid: image_uuid,
        event_name: values.event_name,
        description: values.description,
        date: values.date,
        time_from: values.time_from,
        time_to: values.time_to,
        location: values.location,
        event_type_id: values.event_type_id,
        school_id: values.school_id,
        status: 'ongoing',
        baranggay_id: values.baranggay_id,
        image: image
      };
  
      const [message, status, eventId] = await addEvent(data)
      
      if (status !== 201) {
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Event Added Successfully',
          description: message,
        });
  
        // Send push notification
        try {
          const eventType = eventTypes.find(et => et.event_type_id === values.event_type_id)
          const notificationData = {
            event_id: eventId,
            event_name: values.event_name,
            event_type_name: eventType ? eventType.name : 'Unknown',
            description: values.description,
            date: values.date,
            time_from: values.time_from,
            time_to: values.time_to,
            event_image_uuid: image_uuid,
          }
          
          console.log('Sending notification with data:', notificationData)
          
          const notificationResult = await sendPushNotification(notificationData)
          
          console.log('Push notification result:', notificationResult)
          
          if (notificationResult.success) {
            console.log('Push notification sent successfully')
            toast({
              title: "Success",
              description: "Event created and notification sent successfully.",
              variant: "default",
            })
          } else {
            throw new Error(notificationResult.message || 'Unknown error occurred while sending notification')
          }
        } catch (error) {
          console.error('Failed to send push notification:', error)
          toast({
            title: "Warning",
            description: "Event created successfully, but there was an issue sending notifications. Please check the server logs for more details.",
          })
        }

        window.location.reload();
        setIsDialogOpen(false)
      }
    } catch (error) {
      setError("Failed to upload the event data.");
      console.error(error);
    } finally {
      setIsLoading(false);
      form.reset({
        event_name: "",
        description: "",
        date: "",
        time_from: "",
        time_to: "",
        location: "",
      });
      setImage("");
      setPreview(null);
    }
  };

  return (
    <>
      <Toaster />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-ys text-white hover:bg-yellow-300" 
            onClick={openDialog}
          >
            <PlusIcon /> Add Event
          </Button>
        </DialogTrigger>
        <DialogContent 
          className={`z-50 w-full h-full max-w-4xl max-h-[85vh] bg-background text-primary p-6 ${
            theme === 'light' ? 'text-blue-950' : 'text-blue-400'
          }`}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add Event</DialogTitle>
            <DialogDescription className="text-sm">
              Create an event for City Scholars
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
                    src={preview} 
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
                            field.onChange(Number(value));
                            form.setValue('school_id', undefined);
                            form.setValue('baranggay_id', undefined);
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
                              <SelectItem 
                                key={type.event_type_id} 
                                value={type.event_type_id.toString()}
                              >
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
                      value={eventTypes.find((type) => type.event_type_id === fixedEventType)?.name || 'Unknown'}
                      disabled 
                      className="bg-muted"
                    />
                  </FormItem>
                )}
              </div>

              {(admintype === 3 || (admintype === 1 && form.watch('event_type_id') === 2)) && (
                <FormField
                  control={form.control}
                  name="school_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))} 
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select school" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schools.map((school) => (
                            <SelectItem 
                              key={school.school_id} 
                              value={school.school_id.toString()}
                            >
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

              {(admintype === 4 || (admintype === 1 && form.watch('event_type_id') === 3)) && (
                <FormField
                  control={form.control}
                  name="baranggay_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))} 
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select baranggay" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {baranggays.map((baranggay) => (
                            <SelectItem 
                              key={baranggay.baranggay_id} 
                              value={baranggay.baranggay_id.toString()}
                            >
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
                    form.reset();
                    closeDialog();
                    setImage("");
                    setPreview(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="bg-yellow-500 text-white rounded"
                >
                  Save
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
    </>
  );
}

