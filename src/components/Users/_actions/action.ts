"use server";

import { cookies } from "next/headers";
import API_URL from "@/constants/constants";

const token = cookies().get("session")?.value;

export const getScholars = async () => {
    try {
        const response = await fetch(`${API_URL}/api/events/scholars/return-service-count`, {
            cache: 'no-store',
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            const message = data?.message || 'An error occurred while fetching scholars';
            return { error: message };
        }

        return {
            scholars: data.scholars,
            total: data.total
        };
    } catch (error) {
        console.error('Error fetching scholars:', error);
        return { error: 'An unexpected error occurred' };
    }
}

