"use server";

import { verifySession } from "./stateless";
import { cookies } from "next/headers";
import API_URL from "@/constants/constants";

export const isAdmin = (async () => {
    const session = await verifySession();

    const token: any = cookies().get('session')?.value;

    try {
        const req: any = await fetch(`${API_URL}/api/user/me`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const res = await req.json();

        if (!req.ok) {
            const message = res.message;
            return {message};
        }
        else
        {
            const data = res
            return data;
        }
    } catch (error) {
        console.log(error);
        return null
    }
})

export const updateUser = (
    async (data: any) => {
        
    }
)