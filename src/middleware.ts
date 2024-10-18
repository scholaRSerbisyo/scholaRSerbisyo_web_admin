import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdmin } from "@/auth/userAction";

const protectedRoutes = ['/dashboard', '/dashboard/profile'];
const publicRoutes = ['/'];
const userControllerRoutes = ['/login', '/register'];

export default async function middleware(req:NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoutes = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);
    const isUserCreateRoutes = userControllerRoutes.includes(path);

    const isSign = cookies().get('isSign')?.value;

    /*if (isUserCreateRoutes && isSign) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }*/

    if (req.nextUrl.pathname.startsWith('/dashboard') && !isSign) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    if (req.nextUrl.pathname.startsWith('/login') && isSign) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    return NextResponse.next();
}