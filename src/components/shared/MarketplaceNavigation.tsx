"use client";

import Image from "next/image";
import { FaRegUser } from "react-icons/fa";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useScrollPosition } from "@/utils/hooks/shared/useScrollPosition";
import React, { useState } from "react";

import {
  Navbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import { homeNavigationItems, socialMediaItems } from "@/utils/constants";
import { useLocale } from "next-intl";

// Mobile Marketplace Navigation Component
export const MobileMarketplaceNavigation = React.memo(() => {
  return <></>; // Placeholder
});

// Desktop Marketplace Navigation Component
export const DesktopMarketplaceNavigation = React.memo(() => {
  return <></>; // Placeholder
});

// Main navigation component
export default function Navigation() {
  const scrollPosition = useScrollPosition();
  const blurClass =
    scrollPosition > 10 ? "backdrop-blur-lg bg-opacity-30" : "bg-transparent";

  const locale = useLocale();

  return (
    <nav
      className={`fixed top-0 w-full flex items-center justify-center z-50 transition-colors duration-300 ${blurClass}`}
    >
      {/* 
        <MobileMarketplaceNavigation /> */}
      {/* <MobileHomeNavigation scrollPosition={scrollPosition} locale={locale} />
      <DesktopHomeNavigation scrollPosition={scrollPosition} locale={locale} /> */}
      {/* <DesktopMarketplaceNavigation /> */}
    </nav>
  );
}
