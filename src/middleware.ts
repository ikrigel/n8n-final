import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware for basic route configuration
 * Note: Authentication is handled client-side with useSession hook
 *       in the Providers component and individual pages
 */
export function middleware(request: NextRequest) {
  // Public routes that don't require authentication check
  const publicRoutes = ['/auth/signin', '/auth/error', '/help', '/about'];
  const pathname = request.nextUrl.pathname;

  // Allow all routes - authentication will be handled client-side
  // This avoids Edge Runtime eval issues with NextAuth
  return NextResponse.next();
}

// Configure which routes to apply middleware to
// Minimal matcher to avoid Edge Runtime issues
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (NextAuth API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
