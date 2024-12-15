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

export const getEvents = async () => {
  const token = cookies().get('session')?.value
  try {
    const req = await fetch(`${API_URL}/api/events/getevents`, {
      cache: 'no-store',
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })

    const res = await req.json()

    if (!req.ok) {
      const message = res?.message
      return { message }
    }

    const timeZone = 'Asia/Manila'  
    const currentDate = new Date()
    const zonedDate = toZonedTime(currentDate, timeZone)

    const formattedCurrentDate = format(zonedDate, 'yyyy-MM-dd', { timeZone })
    const currentTime = format(zonedDate, 'HH:mm', { timeZone })

    const eventsWithStatus = (res as EventResponse[]).map(event => {
      if (event.date < formattedCurrentDate) {
        event.status = 'previous';
      } else if (event.date === formattedCurrentDate) {
        if (currentTime >= event.time_from && currentTime <= event.time_to) {
          event.status = 'ongoing';
        } else if (currentTime < event.time_from) {
          event.status = 'upcoming';
        } else {
          event.status = 'previous';
        }
      } else {
        event.status = 'upcoming';
      }
      return event;
    });

    return eventsWithStatus;
  } catch (error) {
    return { message: error }
  }
}

