"use server";

import { cookies } from "next/headers";
import API_URL from "@/constants/constants";
import { getUser } from "@/auth/user";

const token = cookies().get("session")?.value

export const getEventTypes = async () => {
    try {
        const req: any = await fetch(`${API_URL}/api/events/geteventtypes`, {
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

export const currentAdmin = async () => {

    const user = await getUser();

    return user.admin.admin_id
}

export const addEvent = async (eventData: any) => {
    const token = cookies().get("session")?.value
  
    try {
      const response = await fetch(`${API_URL}/api/events/createevent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add event')
      }
  
      return [data.message, response.status, data.event.event_id]
    } catch (error) {
      console.error('Error adding event:', error)
      return [(error as Error).message, 500, null]
    }
  }

export const getSchools = async () => { 
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