import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const secret = process.env.AUTH_SECRET

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ['/auth', '/api/auth']
// Define routes that should redirect when authenticated
const AUTH_ROUTES = ['/auth']

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some(route => pathname === route)
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  // Handle root path redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
  
  try {
    const token = await getToken({ req, secret })
    // Handle token expiration
    if (token?.exp) {
      const currentTime = Math.floor(Date.now() / 1000)
      const timeUntilExpiry = token.exp - currentTime
      
      // If token is expired or about to expire (e.g., within 1 minute)
      if (timeUntilExpiry <= 60) {
        // Clear auth cookies
        const response = NextResponse.redirect(new URL("/auth", req.url))
        response.cookies.delete("next-auth.session-token")
        response.cookies.delete("next-auth.callback-url")
        response.cookies.delete("next-auth.csrf-token")
        response.cookies.delete("next-auth.jwt")
        
        return response
      }
    }

    // Authenticated user tries to access auth pages
    if (token && isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Non-authenticated user tries to access protected routes
    if (!token && !isPublicRoute(pathname)) {
      const searchParams = new URLSearchParams({
        callbackUrl: pathname
      })
      return NextResponse.redirect(new URL(`/auth?${searchParams}`, req.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to auth page
    return NextResponse.redirect(new URL("/auth", req.url))
  }
}

// Configure middleware matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}