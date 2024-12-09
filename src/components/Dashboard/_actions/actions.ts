"use server"

import { cookies } from "next/headers"
import { parseISO, isBefore, isEqual, isAfter, startOfDay } from 'date-fns'
import { toZonedTime, format } from 'date-fns-tz'
import API_URL from "@/constants/constants"

export type School = {
  school_id: number;
  school_name: string;
  created_at: string;
  updated_at: string;
}

export type Barangay = {
  baranggay_id: number;
  baranggay_name: string;
  created_at: string;
  updated_at: string;
}

export type EventType = {
  event_type_id: number;
  name: string;
  description: string;
}

export type EventResponse = {
  event_id: number;
  event_name: string;
  description: string;
  date: string;
  time_from: string;
  time_to: string;
  location: string;
  status: 'ongoing' | 'upcoming' | 'previous';
  event_type_id: number;
  school_id?: number;
  baranggay_id?: number;
  admin_id: number;
  event_image_uuid?: string;
  created_at: string;
  updated_at: string;
  event_type?: EventType;
  school?: School;
  barangay?: Barangay;
}

export type EventsResult = EventResponse[] | { message: string };

export const getEvents = async (timezone: string = 'Asia/Manila'): Promise<EventsResult> => {
  const token = cookies().get("session")?.value;

  if (!token) {
    return { message: "Authentication token not found" };
  }

  try {
    const response = await fetch(`${API_URL}/api/events/getevents`, {
      cache: 'no-store',
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { message: errorData.message || `HTTP error! status: ${response.status}` };
    }

    const events: EventResponse[] = await response.json();

    const currentDate = toZonedTime(new Date(), timezone);
    const currentDateStart = startOfDay(currentDate);

    const eventsWithStatus: EventResponse[] = events.map(event => {
      const eventDate = toZonedTime(parseISO(event.date), timezone);
      const eventDateStart = startOfDay(eventDate);
      const eventStartTime = toZonedTime(parseISO(`${event.date}T${event.time_from}`), timezone);
      const eventEndTime = toZonedTime(parseISO(`${event.date}T${event.time_to}`), timezone);

      let status: 'ongoing' | 'upcoming' | 'previous';

      if (isBefore(eventDateStart, currentDateStart)) {
        status = 'previous';
      } else if (isEqual(eventDateStart, currentDateStart)) {
        if (isBefore(currentDate, eventStartTime)) {
          status = 'upcoming';
        } else if (isBefore(currentDate, eventEndTime)) {
          status = 'ongoing';
        } else {
          status = 'previous';
        }
      } else {
        status = 'upcoming';
      }

      return { 
        ...event, 
        status,
        date: format(eventDate, 'yyyy-MM-dd', { timeZone: timezone }),
        time_from: format(eventStartTime, 'HH:mm', { timeZone: timezone }),
        time_to: format(eventEndTime, 'HH:mm', { timeZone: timezone })
      };
    });

    return eventsWithStatus;
  } catch (error) {
    console.error('Error fetching events:', error);
    return { message: 'An unexpected error occurred while fetching events' };
  }
}

