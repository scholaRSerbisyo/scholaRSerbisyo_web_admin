"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { currentAdmin, getAdmins, getEventTypes } from "./_actions/adminaction";
import { createEventImageUseCase } from "@/use-case/event-image";

const formSchema = z.object({
  event_name: z.string().min(2, "Event Title must be at least 2 characters").max(50),
  description: z.string().max(80),
  date: z.string().nullable(),
  time: z.string({ message: "Event Time is required!" }),
  location: z.string({ message: "Event Location is required!" }).max(50),
  organizer: z.any(),
  event_type: z.any(),
});

export type EventFormValues = z.infer<typeof formSchema>;

export function AddEventButtonComponent() {
  const { toast } = useToast();
  const [image, setImage] = React.useState<File>();
  const [preview, setPreview] = React.useState<string | null>(null);
  const [organizer, setOrganizer] = React.useState([]);
  const [eventType, setEventType] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentAdminId, setCurrentAdminId] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      setError("Please upload only one image.");
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
      const compressedDataUrl = await imageCompression.getDataUrlFromFile(compressedFile);

      setImage(compressedFile);
      setPreview(compressedDataUrl);
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
        const admins = await getAdmins();
        setOrganizer(admins.map((admin: any) => ({
          admin_id: admin.admin_id,
          admin_name: admin.admin_name,
        })));

        const eventTypes = await getEventTypes();
        setEventType(eventTypes.map((type: any) => ({
          event_type_id: type.event_type_id,
          event_type_name: type.event_type_name,
        })));
      } catch (error) {
        console.error("Error fetching data!", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_name: "",
      description: "",
      date: null,
      time: "",
      location: "",
      organizer: 1,
      event_type: 1,
    },
  });

  React.useEffect(() => {
    if (currentAdminId !== null) {
      form.reset({ ...form.getValues(), organizer: currentAdminId });
    }
  }, [currentAdminId]);

  const onSubmit = async (values: EventFormValues) => {
    setIsLoading(true);

    if (!image) {
      setError("Please upload an image before submitting.");
      setIsLoading(false);
      return;
    }
  
    try {
      await createEventImageUseCase(values, image);
      console.log("Form data:", values);
    } catch (error) {
      setError("Failed to upload the event data.");
    } finally {
      setIsLoading(false);
    }
};


  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full overflow-auto">
          <div className="grid gap-4 py-2 px-4">
            <div
              {...getRootProps()}
              className="flex flex-col gap-4 justify-center items-center p-4 border border-dashed rounded-lg cursor-pointer"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <p>Drag 'n' drop an image here, or click to select one</p>
              )}
              <div className="flex justify-center items-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="max-w-xs max-h-40 object-cover mt-2" />
                ) : (
                  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                )}
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <FormField
              control={form.control}
              name="event_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Scholar's Cup" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Event details" {...field} />
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
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} value={field.value || "00:00"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organizer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizer.map((org: any) => (
                        <SelectItem key={org.admin_id} value={String(org.admin_id)}>
                          {org.admin_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventType.map((type: any) => (
                        <SelectItem key={type.event_type_id} value={String(type.event_type_id)}>
                          {type.event_type_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit" className="rounded">
                Add Event
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </>
  );
}
