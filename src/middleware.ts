import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/en",
//   "/es",
//   "/fr",
//   "/ar",
//   "/:locale/sign-in",
//   "/:locale/sign-up",
//   "/:locale/about-us", // More specific route first
//   "/:locale/marketplace", // Marketplace route for locales
//   "/:locale/marketplace/projects/:project", // Marketplace project route with slug for locales
//   "/api/webhooks/clerk",
//   "/(en|es|fr|ar)/about-us", // Locale-specific paths for about-us
//   "/(en|es|fr|ar)/marketplace", // Locale-specific paths for marketplace
//   "/(en|es|fr|ar)/marketplace/projects/:project", // Locale-specific paths for marketplace projects with slug
//   "/(en|es|fr|ar)(.*)", // General route matcher last
// ]);

const isPublicRoute = createRouteMatcher(["/(.*)"]); // Match all routes

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Exclude static files such as PDFs, images, and others in the public folder
    "/((?!_next|legal|assets|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|pdf|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Match locales
    '/', '/(de|en)/:path*',
  ],
};
