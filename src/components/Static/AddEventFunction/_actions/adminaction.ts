"use server";

import { cookies } from "next/headers";
import API_URL from "@/constants/constants";
import { getUser } from "@/auth/user";

const token = cookies().get("session")?.value


export const getAdmins = async () => { 
    try {
        const req: any = await fetch(`${API_URL}/api/user/admins`, {
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