"use server";

import { cookies } from "next/headers";
import API_URL from "@/constants/constants";
import { Event, UpdateEventPayload } from "./types";

export const getCSOEvents = async () => {
  const token = cookies().get("session")?.value 
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

export const getSchoolEvents = async () => {
  const token = cookies().get("session")?.value 
    try {
        const req: any = await fetch(`${API_URL}/api/events/getschoolevents`, {
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

export const getCommunityEvents = async () => {
  const token = cookies().get("session")?.value 
    try {
        const req: any = await fetch(`${API_URL}/api/events/getbarangayevents`, {
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

export const getEvents = async () => {
  const token = cookies().get("session")?.value 
    try {
        const req: any = await fetch(`${API_URL}/api/events/getevents`, {
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

export const getEvent = async (event_id: number) => {
  const token = cookies().get("session")?.value 
    try {
        const req: any = await fetch(`${API_URL}/api/events/getevent/${event_id}`, {
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
  const token = cookies().get("session")?.value
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
  

  export async function fetchCompletedSubmissions(eventId: number, page: number) {
    const token = cookies().get('session')?.value
    const response = await fetch(`${API_URL}/api/events/${eventId}/completed-submissions?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return await response.json()
  }

  export async function acceptSubmission(submissionId: number) {
    const token = cookies().get('session')?.value
    try {
      const response = await fetch(`${API_URL}/api/events/submissions/${submissionId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to accept submission')
      }
      return await response.json()
    } catch (error) {
      console.error('Error accepting submission:', error)
      throw error
    }
  }
  
  export async function declineSubmission(submissionId: number) {
    const token = cookies().get('session')?.value
    try {
      const response = await fetch(`${API_URL}/api/events/submissions/${submissionId}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to decline submission')
      }
      return await response.json()
    } catch (error) {
      console.error('Error declining submission:', error)
      throw error
    }
  }

  export async function fetchEventValidations() {
    const token = cookies().get('session')?.value
    try {
      const response = await fetch(`${API_URL}/api/events/event-validations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching Event Validation', error)
      throw error
    }
  }

  export async function acceptEvent(id: number) {
    const token = cookies().get('session')?.value
    try {
      const response = await fetch(`${API_URL}/api/events/validation/${id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      })
      
      if (!response.ok) throw new Error('Failed to accept event')
      
      return await response.json()
    } catch (error) {
      console.error('Error Accepting Event', error)
      throw error
    }
  }

  export async function handleDeclineEvent(id: number) {
    const token = cookies().get('session')?.value
    try {
      const response = await fetch(`${API_URL}/api/events/validation/${id}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      })
      
      if (!response.ok) throw new Error('Failed to decline event')
      
      return await response.json()
    } catch (error) {
      console.error('Error Declining Event', error)
      throw error
    }
  }