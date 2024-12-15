"use server";

import { cookies } from "next/headers";
import API_URL from "@/constants/constants";
import { School, School2, Event } from "@/components/types";
import { getImage } from "./events";

export const getSchools = async () => {
    const token = cookies().get("session")?.value
    try {
        const req = await fetch(`${API_URL}/api/school/getschools`, {
            cache: 'no-store',
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        const res = await req.json();

        if (!req.ok) {
            const message = res?.message || "Failed to fetch schools";
            return { message };
        }

        return res as School[];
    } catch (error: any) {
        console.error("Error fetching schools:", error);
        return { message: error.message || "An error occurred" };
    }
};

export async function getSchool(id: string): Promise<School2> {
    const token = cookies().get("session")?.value;
    if (!token) {
        throw new Error("Authentication token is missing");
    }

    try {
        const response = await fetch(`${API_URL}/api/school/schools/${id}`, {
            cache: 'no-store',
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch school details");
        }

        const school: School2 = await response.json();

        if (Array.isArray(school.events)) {
            const eventsWithImages = await Promise.all(
                school.events.map(async (event: Event) => {
                    try {
                        const imageUrl = await getImage(event.event_image_uuid);
                        return { ...event, imageUrl };
                    } catch (error) {
                        console.error(`Error fetching image for event ${event.event_id}:`, error);
                        return event; // Return the event without imageUrl if there's an error
                    }
                })
            );

            school.events = eventsWithImages;
        }

        return school;
    } catch (error) {
        console.error("Error fetching school:", error);
        throw new Error(`Failed to fetch school data: ${error}`);
    }
}

export async function updateEvent(event: Event): Promise<Event> {
    const token = cookies().get("session")?.value
      try {
        const response = await fetch(`${API_URL}/api/events/updateevent/${event.event_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(event),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData)
          throw new Error(errorData.message || 'Failed to update event');
        }
    
        const updatedEvent = await response.json();
        return updatedEvent.event;
      } catch (error) {
        console.error('Error updating event:', error);
        throw error;
      }
    }