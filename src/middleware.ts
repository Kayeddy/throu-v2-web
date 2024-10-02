import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  "/",
  "/en",
  "/es",
  "/fr",
  "/ar",
  "/:locale/sign-in",
  "/:locale/sign-up",
  "/:locale/about-us", // More specific route first
  "/api/webhooks/clerk",
  "/(en|es|fr|ar)/about-us", // Also ensure locale-specific paths for about-us
  "/(en|es|fr|ar)(.*)", // General route matcher last
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Match locales
    "/(en|es|fr|ar)/:path*",
  ],
};
