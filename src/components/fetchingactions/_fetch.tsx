"use server"

import { getBarangays } from "../Events/_actions/barangays";
import { getCSOEvents, getImage } from "../Events/_actions/events";
import { getSchool, getSchools } from "../Events/_actions/schools";
import { Baranggay, Event, School } from "../types";

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

export async function fetchSchools(): Promise<School[]> {
  try {
    const fetchedschools = await getSchools();
    return fetchedschools;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function fetchBarangays(): Promise<Baranggay[]> {
  try {
    const fetchedbarangays = await getBarangays();
    return fetchedbarangays;
  } catch (error) {
    console.error("Error fetching events:", error);
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
