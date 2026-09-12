import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const url = request.nextUrl;
    const pathname = url.pathname;

    const isAuthPage =
        pathname.startsWith("/login") ||
        pathname.startsWith("/SignUp") ||
        pathname.startsWith("/verify") ||
        pathname === "/";

    const isProtectedPage =
        pathname.startsWith("/dashboard");

    // Authenticated user trying to access login/signup/verify/home
    if (token && isAuthPage) {
        return NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
    }

    // Unauthenticated user trying to access dashboard
    if (!token && isProtectedPage) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/SignUp",
        "/verify/:path*",
        "/dashboard/:path*",
    ],
};