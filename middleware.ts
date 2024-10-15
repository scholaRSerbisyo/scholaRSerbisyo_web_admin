import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ['/dashboard', '/dashboard/profile'];
const publicRoutes = ['/'];
const userControllerRoutes = ['/login', '/register'];

export default async function middleware(req:NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoutes = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);
    const isUserCreateRoutes = userControllerRoutes.includes(path);

    const isSign = cookies().get('isSign')?.value;

}