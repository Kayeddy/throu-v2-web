import { defineRouting } from "next-intl/routing";
import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "es", "fr", "ar"],

  // Used when no locale matches
  defaultLocale: "es",

  pathnames: {
    "/": "/", // Homepage
    "/projects": {
      en: "/projects",
      es: "/proyectos",
      fr: "/projets",
      ar: "/مشاريع",
    },
    "/about": {
      en: "/about",
      es: "/nosotros",
      fr: "/à-propos",
      ar: "/حول",
    },
    "/about-us": {
      en: "/about-us",
      es: "/acerca-de",
      fr: "/a-propos-de-nous",
      ar: "/من-نحن",
    },
    "/learn": {
      en: "/learn",
      es: "/aprender",
      fr: "/apprendre",
      ar: "/تعلم",
    },
    "/dashboard": {
      en: "/dashboard",
      es: "/panel",
      fr: "/tableau-de-bord",
      ar: "/لوحة-التحكم",
    },
    "/terms-conditions": {
      en: "/terms-conditions",
      es: "/terminos-condiciones",
      fr: "/termes-conditions",
      ar: "/الشروط-والاحكام",
    },
    "/privacy-statement": {
      en: "/privacy-statement",
      es: "/declaracion-privacidad",
      fr: "/déclaration-confidentialité",
      ar: "/بيان-الخصوصية",
    },
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
