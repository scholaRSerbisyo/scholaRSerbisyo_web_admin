"use server";

import { cookies } from "next/headers";
import API_URL from "@/constants/constants";

const token = cookies().get("session")?.value

export async function getEventsForCalendar() {
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
            return {message}
        }
        else
        {
            return res
        }
    } catch (error) {
        const message = error
        return {message}
    }
}