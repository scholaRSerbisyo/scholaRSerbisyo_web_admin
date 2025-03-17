"use server";

import { cookies } from "next/headers";
import API_URL from "@/constants/constants";
import { getUser } from "@/auth/user";

export const getEventTypes = async () => {
    const token = cookies().get("session")?.value;

    try {
        const response = await fetch(`${API_URL}/api/events/geteventtypes`, {
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
            console.error('Error fetching event types:', errorData.message);
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];

    } catch (error) {
        console.error('Error fetching event types:', error);
        return [];
    }
}

export const currentAdmin = async () => {

    const user = await getUser();

    return user.admin.admin_id
}

interface EventResponse {
  message: string;
  event?: {
    event_id: number;
  };
  status?: number;
}

export const addEvent = async (eventData: any) => {
  const token = cookies().get("session")?.value;

  if (!token) {
    throw new Error("Authentication token not found");
  }

  try {
    const response = await fetch(`${API_URL}/api/events/createevent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    // First try to get the response as text
    const responseText = await response.text();
    
    // Log the raw response for debugging
    console.log('Raw API Response:', responseText);

    let data: EventResponse;
    
    try {
      // Attempt to parse the response text as JSON
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse API response:', responseText);
      throw new Error(
        'Invalid response from server. Please check your API endpoint and authentication.'
      );
    }

    if (!response.ok) {
      // If we have a proper error message from the server, use it
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    // Return a properly typed response
    return {
      status: response.status,
      message: data.message || 'Event created successfully',
      event: data.event?.event_id
    };
  } catch (error) {
      console.error('Error creating event:', error);
      throw error instanceof Error ? error : new Error('An unknown error occurred');
    }
  }

  export const createEventValidation = async (eventData: any) => {
    const token = cookies().get("session")?.value;
  
    try {
      // Match exactly what the database schema and EventValidationStoreRequest expects
      const formattedData = {
        admin_id: eventData.admin_id,
        admin_type_name: eventData.admin_type_name,
        event_image_uuid: eventData.event_image_uuid,
        event_name: eventData.event_name,
        description: eventData.description,
        date: eventData.date,
        time_from: eventData.time_from,
        time_to: eventData.time_to,
        location: eventData.location,
        event_type_id: eventData.event_type_id, // Required field
        school_id: eventData.school_id || null,
        baranggay_id: eventData.baranggay_id || null,
        image: eventData.image // for R2 upload
      };
  
      // Log the formatted data for debugging (excluding image)
      console.log('Sending event validation data:', {
        ...formattedData,
        image: '[base64 string]'
      });
  
      const response = await fetch(`${API_URL}/api/events/validation/createevent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });
  
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Failed to create event validation');
      }
      
      return {
        status: response.status,
        message: responseData.message || 'Event validation created successfully',
        event: responseData.event
      };
  
    } catch (error) {
      console.error('Error creating event validation:', error);
      throw error instanceof Error ? error : new Error('An unknown error occurred');
    }
  };

export const getSchools = async () => { 

  const token = cookies().get("session")?.value
    try {
        const req: any = await fetch(`${API_URL}/api/school/getschools`, {
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
            const data = res

            return data
        }
    } catch (error) {
        const message = error

        return { message }
    }
}

export const getBaranggays = async () => { 

  const token = cookies().get("session")?.value
    try {
        const req: any = await fetch(`${API_URL}/api/baranggay/getbaranggays`, {
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
            const data = res

            return data
        }
    } catch (error) {
        const message = error

        return { message }
    }
}