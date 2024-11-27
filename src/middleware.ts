import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const publicRoutes = ['/'];
const protectedRoutes = ['/dashboard', '/events/baranggay', '/events/school', '/events/cso', '/users'];
const userControllerRoutes = ['/login', '/register'];

export default async function middleware(req:NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublicRoutes = publicRoutes.includes(path);
    const isUserCreateRoutes = userControllerRoutes.includes(path);
    const isProtectedRoutes = protectedRoutes.includes(path);

    const isSign = cookies().get('isSign')?.value;

    if (isUserCreateRoutes && isSign) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    if (isProtectedRoutes && !isSign) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    if (isPublicRoutes && isSign) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    return NextResponse.next();
}