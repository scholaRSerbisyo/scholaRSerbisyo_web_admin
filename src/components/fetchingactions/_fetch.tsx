"use server"

import { cookies } from "next/headers";
import { getBaranggays } from "../Events/_actions/barangays";
import { getCommunityEvents, getCSOEvents, getEvent, getImage, getSchoolEvents } from "../Events/_actions/events";
import { getSchool, getSchools } from "../Events/_actions/schools";
import { Baranggay, Event, ExtendedEvent, School } from "../types";

export async function fetchEvents(): Promise<Event[]> {
  try {
    const fetchedEvents = await getCSOEvents();
    if (Array.isArray(fetchedEvents)) {
      const eventsWithImages = await Promise.all(
        fetchedEvents.map(async (event) => {
          const imageUrl = await getImage(event.event_image_uuid);
          return { ...event, imageUrl };
        })
      );
      return eventsWithImages;
    } else {
      console.error("Fetched events is not an array:", fetchedEvents);
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function fetchSchoolEvents(): Promise<ExtendedEvent[]> {
  try {
    const fetchedEvents = await getSchoolEvents();
    if (Array.isArray(fetchedEvents)) {
      const eventsWithImages = await Promise.all(
        fetchedEvents.map(async (event) => {
          const imageUrl = await getImage(event.event_image_uuid);
          return { ...event, imageUrl };
        })
      );
      return eventsWithImages;
    } else {
      console.error("Fetched events is not an array:", fetchedEvents);
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function fetchCommunityEvents(): Promise<ExtendedEvent[]> {
  try {
    const fetchedEvents = await getCommunityEvents();
    if (Array.isArray(fetchedEvents)) {
      const eventsWithImages = await Promise.all(
        fetchedEvents.map(async (event) => {
          const imageUrl = await getImage(event.event_image_uuid);
          return { ...event, imageUrl };
        })
      );
      console.log(eventsWithImages)
      return eventsWithImages;
    } else {
      console.error("Fetched events is not an array:", fetchedEvents);
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function fetchEvent(event_id: number): Promise<Event | null> {
  try {
    const fetchedEvent = await getEvent(event_id);
    if (!fetchedEvent) {
      console.warn(`No event found with id: ${event_id}`);
      return null;
    }
    return fetchedEvent;
  } catch (error) {
    console.error(`Error fetching event with id ${event_id}:`, error);
    return null;
  }
}

export async function fetchSchools(): Promise<School[]> {
    try {
        const fetchedSchools = await getSchools();
        if (Array.isArray(fetchedSchools)) {
            return fetchedSchools;
        } else {
            console.error("Error fetching schools:", fetchedSchools.message);
            return [];
        }
    } catch (error) {
        console.error("Error in fetchSchools:", error);
        return [];
    }
}


export async function fetchBarangays(): Promise<Baranggay[]> {
  const token = cookies().get("session")?.value;
  try {
      if (!token) throw new Error("Authentication token not found");

      const fetchedBaranggays = await getBaranggays();
      if (Array.isArray(fetchedBaranggays)) {
          return fetchedBaranggays;
          console.log(fetchBarangays)
      } else {
          console.error("Error fetching schools:", fetchedBaranggays.message);
          return [];
      }
  } catch (error) {
      console.error("Error in fetchSchools:", error);
      return [];
  }
}

export async function fetchEventsForView(): Promise<Event[]> {
  try {
    const allEvents = await fetchEvents();
    const filteredEvents = allEvents.filter(event => event.status === status);
    return filteredEvents; 
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function fetchImageWithRetry(imageUuid: string, maxRetries: number = 3): Promise<string | null> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const imageUrl = await getImage(imageUuid);
      if (imageUrl) {
        return imageUrl;
      } else {
        throw new Error("Failed to fetch image URL");
      }
    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed for image UUID ${imageUuid}:`, error);
      if (attempt >= maxRetries) {
        console.error(`Max retries reached for image UUID ${imageUuid}`);
        return null;
      }
    }
  }
  return null;
}
