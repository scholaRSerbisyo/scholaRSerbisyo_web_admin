import { EventFormValues } from "@/components/Static/AddEventFunction/AddEventButton";
import { uploadFileToBucket } from "@/lib/files";
import { createUUID } from "@/util/uuid";

export async function createEventImageUseCase(
  data: EventFormValues,
  image: File
) {
  const image_uuid: string = createUUID();

  const newEvent = {
    ...data,
    event_image_uuid: image_uuid,
  };

  // const event = await createEvent(newEvent);

  await uploadFileToBucket(image, image_uuid);

  return event;
}
