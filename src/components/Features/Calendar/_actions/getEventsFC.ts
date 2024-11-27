import { getEventsForCalendar } from "./actions";


export async function fetchEvents(): Promise<Event[]> {
    try {
      const fetchedEvents = await getEventsForCalendar();
      return fetchedEvents
    } catch (error) {
      console.error("Error fetching events:", error);
      return []; // Return an empty array in case of an error
    }
  }