"use server";

import API_URL from "@/constants/constants";

export const isAdmin = (async () => {
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