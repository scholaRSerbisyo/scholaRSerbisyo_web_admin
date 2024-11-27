"use server";

import { cookies } from "next/headers";
import API_URL from "@/constants/constants";

const token = cookies().get("session")?.value

export const getCSOEvents = async () => { 
    try {
        const req: any = await fetch(`${API_URL}/api/events/getcsoevents`, {
            cache: 'no-store',
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })

        const res = await req.json()

        if(!req.ok) {
            const message = res?.message
            return { message }
        }
        else
        {
            return res
        }
    } catch (error) {
        const message = error
        return { message }
    }
}

export async function getImage(imageUuid: string) {
    try {
        const response = await fetch(`${API_URL}/api/events/getimage`, {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ image_uuid: imageUuid })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching image URL:', errorData.error || 'Unknown error');
            return null;
        }

        const data = await response.json();
        if (!data.url) {
            console.error('Image URL not found in response');
            return null;
        }
        return data.url;
    } catch (error) {
        console.error('Error fetching image URL:', error);
        return null;
    }
}

export async function updateEvent(event: Event): Promise<Event> {
    try {
      const response = await fetch(`${API_URL}/api/events/updateevent`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'application/json',
        },
        body: JSON.stringify(event),
      });
  
        if (!response.ok) {
            throw new Error('Failed to update event');
        }
  
        return await response.json();
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }