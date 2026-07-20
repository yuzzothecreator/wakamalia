import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const protectedPrefixes = [
  "/dashboard",
  "/admin",
  "/wallet",
  "/messages",
  "/settings",
  "/notifications",
]

const authRoutes = ["/login", "/register", "/forgot-password", "/verify"]

function isProtected(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

function isAuthRoute(pathname: string) {
  return authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = getSessionCookie(request)
  const isAuthenticated = Boolean(sessionCookie)

  if (isProtected(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/wallet/:path*",
    "/messages/:path*",
    "/settings/:path*",
    "/notifications/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/verify",
  ],
}
