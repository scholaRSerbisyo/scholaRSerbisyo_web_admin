"use server";

import API_URL from "@/constants/constants";
import { createSession, destroySession } from "./stateless";
import { redirect } from "next/navigation";

export async function signIn(data: any) {
    const req: any = await fetch(`${API_URL}/api/user/admin/login`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    const res = await req.json();

    const dt = {
        message: res.message,
        status: req.status
    };

    if (!req.ok) {
        console.log(dt)
        return {dt};
    }
    else
    {
        await createSession(res.token, res.role);
    }
}

export async function signUp(data: any) {
    const req: any = await fetch(`${API_URL}/api/user/signup`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const res = await req.json();

    if (!res.ok) {
        const message = res.message;
        return {message};
    }
    else
    {
        redirect('/login');
    }
}

export async function signOut() {
    const result = await destroySession();
    const message = result === "No active session" || result === "Logout failed" || result === "Logout request failed"
        ? "Logout encountered an issue"
        : "Logged Out";
    return { message };
}
