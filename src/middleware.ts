import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const secret = process.env.AUTH_SECRET

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const token = await getToken({ req, secret })

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Redirect logged-in users away from the auth page
  if (token && pathname === "/auth") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Restrict access to protected routes if no session exists
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth", req.url))
  }

  // Allow the request to proceed
  return NextResponse.next()
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/:path*", // Protect dashboard routes
    "/auth", // Protect auth route redirection
    "/((?!api|_next/static|_next/image|favicon.ico).*)" // Apply middleware to other routes
  ]
}
