"use server";

import { cookies } from "next/headers";
import API_URL from "@/constants/constants";

const token = cookies().get("session")?.value

export const getScholars = async () => {
    try {
        const req: any = await fetch(`${API_URL}/api/user/scholars`, {
            cache: 'no-store',
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })

        const res = await req.json()

        console.log(res)

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