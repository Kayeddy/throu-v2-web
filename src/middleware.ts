import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

// Create intl middleware with error handling
const intlMiddleware = createIntlMiddleware(routing);

// Safe middleware wrapper with comprehensive error handling
export default function middleware(req: NextRequest) {
  try {
    // Check if request should be handled by intl middleware
    const pathname = req.nextUrl.pathname;
    
    // Skip middleware for static files, API routes, and assets
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/assets') ||
      pathname.startsWith('/legal') ||
      pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|css|js|json|pdf|webmanifest)$/)
    ) {
      return NextResponse.next();
    }

    // Handle internationalization
    return intlMiddleware(req);
  } catch (error) {
    // Log error for debugging (will appear in Vercel function logs)
    console.error('[Middleware Error]:', error);
    
    // Return a safe fallback response
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     * - legal (legal documents)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|legal).*)',
  ],
};