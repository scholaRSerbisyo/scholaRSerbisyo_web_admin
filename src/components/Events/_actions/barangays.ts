"use server";

import API_URL from "@/constants/constants";
import { Baranggay, Baranggay2, Event } from "@/components/types";
import { cookies } from "next/headers";
import { getImage } from "./events";

export const getBaranggays = async () => { 
    const token = cookies().get('session')?.value
    try {
        const req = await fetch(`${API_URL}/api/baranggay/getbaranggays`, {
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
            const message = res?.message || "Failed to fetch barangay";
            return { message };
        }

        return res as Baranggay[];
    } catch (error: any) {
        console.error("Error fetching barangays:", error);
        return { message: error.message || "An error occurred" };
    }
};

  export async function getBaranggay(id: string): Promise<Baranggay2> {
    const token = cookies().get("session")?.value;
    if (!token) {
        throw new Error("Authentication token is missing");
    }

    try {
        const response = await fetch(`${API_URL}/api/baranggay/baranggays/${id}`, {
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

        const barangay: Baranggay2 = await response.json();

        if (Array.isArray(barangay.events)) {
            const eventsWithImages = await Promise.all(
                barangay.events.map(async (event: Event) => {
                    try {
                        const imageUrl = await getImage(event.event_image_uuid);
                        return { ...event, imageUrl };
                    } catch (error) {
                        console.error(`Error fetching image for event ${event.event_id}:`, error);
                        return event; // Return the event without imageUrl if there's an error
                    }
                })
            );

            barangay.events = eventsWithImages;
        }

        return barangay;
    } catch (error) {
        console.error("Error fetching school:", error);
        throw new Error(`Failed to fetch school data: ${error}`);
    }
}