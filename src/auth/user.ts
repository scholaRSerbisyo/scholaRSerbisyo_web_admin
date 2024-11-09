"server only";

import { cookies } from "next/headers";
import API_URL from "@/constants/constants";

const token = cookies().get("session")?.value;

type User = {
    user_id: number;
    email: string;
    email_verified_at: string | undefined;
    role_id: number;
    admin: {
        admin_id: number;
        admin_name: string;
    };
};

export const getUser = async (): Promise<User> => {
    if (!token) {
        throw new Error("Unauthenticated: No session token found");
    }

    try {
        const req = await fetch(`${API_URL}/api/user/me`, {
            cache: 'no-store',
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const res = await req.json();

        if (!req.ok) {
            throw new Error(res?.message || 'Failed to fetch user data');
        }

        // Validate response structure
        if (
            !res ||
            typeof res.user_id !== 'number' ||
            typeof res.email !== 'string' ||
            typeof res.role_id !== 'number' ||
            !res.admin ||
            typeof res.admin.admin_id !== 'number' ||
            typeof res.admin.admin_name !== 'string'
        ) {
            throw new Error("Invalid user data format");
        }

        return res as User;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error; // Ensures the calling component can handle this error
    }
};
