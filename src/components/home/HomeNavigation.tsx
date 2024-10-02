"use client";

import { FaRegUser } from "react-icons/fa";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useScrollPosition } from "@/utils/hooks/shared/useScrollPosition";
import React, { useState, useCallback } from "react";

import {
  Navbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Skeleton,
} from "@nextui-org/react";
import { socialMediaItems } from "@/utils/constants";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { WalletConnectionButton } from "../shared/WalletConnectionButton";
import LanguageSelector from "../shared/LanguageSelector";

// Types for home navigation items
interface NavigationItem {
  name: string;
  link: string;
}

// Mobile Navigation Component
export const MobileHomeNavigation = React.memo(
  ({ scrollPosition, locale }: { scrollPosition: number; locale: string }) => {
    const t = useTranslations("HomeNavigation"); // Translation hook
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = useCallback(() => {
      setIsMenuOpen((prevState) => !prevState);
    }, []);

    const blurClass =
      scrollPosition > 10 ? "bg-white/80" : "backdrop-blur-lg bg-transparent";

    const navigationItems: NavigationItem[] = [
      { name: t("projects"), link: "projects" },
      { name: t("about-us"), link: "about-us" },
      { name: t("learn"), link: "learn" },
    ];

    return (
      <Navbar
        shouldHideOnScroll
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className={`z-[999] py-2 transition-all duration-300 ease-in-out lg:hidden ${blurClass}`}
      >
        <NavbarContent>
          <Image
            src="/assets/shared/logo_sm.png"
            alt="throu_mobile_navbar_image"
            width={40}
            height={40}
            className="object-contain w-auto h-auto"
          />
        </NavbarContent>

        <NavbarMenu
          className={`max-h-[70vh] overflow-hidden mt-3 flex flex-col items-center justify-around ${blurClass}`}
        >
          <SignedIn>
            <UserButton />
          </SignedIn>
          {navigationItems.map((item, index) => (
            <NavbarMenuItem
              key={`${item.name}-navigation-item-${index}`}
              className="flex flex-col items-center justify-center w-full"
            >
              <Link
                className="text-center text-xl text-primary font-jakarta"
                href={`/${locale}/${item.link}`}
                rel="noreferrer"
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}

          <NavbarMenuItem className="w-full">
            <SignedIn>
              <Button
                size="lg"
                radius="none"
                className="bg-primary text-white text-sm font-bold px-10 w-full lg:w-fit hover:bg-secondary font-sen"
              >
                {t("invest")}
              </Button>
            </SignedIn>
            <SignedOut>
              <Button
                size="lg"
                radius="none"
                className="bg-primary text-white text-lg font-semibold px-10 font-sen w-full lg:w-fit hover:bg-secondary"
                as={Link}
                href={`/${locale}/sign-in`}
                rel="noreferrer"
              >
                {t("signIn")}
              </Button>
            </SignedOut>
          </NavbarMenuItem>

          <NavbarMenuItem className="w-full flex flex-row items-center justify-between">
            <Link
              href="/terms-conditions"
              rel="noreferrer"
              target="_blank"
              className="font-jakarta"
            >
              {t("termsConditions")}
            </Link>
            <Link
              href="/privacy"
              rel="noreferrer"
              target="_blank"
              className="font-jakarta"
            >
              {t("privacy")}
            </Link>
          </NavbarMenuItem>

          <div className="flex flex-row items-center justify-between w-full">
            {socialMediaItems.map((item, idx) => (
              <NavbarMenuItem
                key={item.name + "navigation-social-media-element-" + idx}
              >
                <Link
                  href={item.link}
                  rel="noreferrer"
                  className={`${item.styles} font-sen`}
                >
                  <item.icon />
                </Link>
              </NavbarMenuItem>
            ))}
          </div>
        </NavbarMenu>

        <NavbarContent justify="end">
          <LanguageSelector />

          <Button className="relative bg-transparent" onClick={toggleMenu}>
            <div
              className={`h-1 w-[33px] rounded-full bg-primary absolute transition-transform ease-in-out duration-300 ${
                isMenuOpen
                  ? "rotate-45 translate-x-0 translate-y-[0.25rem]"
                  : "top-3"
              }`}
            />
            <div
              className={`h-1 w-[33px] rounded-full bg-primary absolute transition-transform ease-in-out duration-300 ${
                isMenuOpen
                  ? "-rotate-45 translate-x-0 translate-y-[0.25rem]"
                  : "top-[1.25rem]"
              }`}
            />
          </Button>
        </NavbarContent>
      </Navbar>
    );
  }
);

// Desktop Navigation Component
export const DesktopHomeNavigation = React.memo(
  ({ scrollPosition, locale }: { scrollPosition: number; locale: string }) => {
    const t = useTranslations("HomeNavigation");
    const compactNavigationElements = scrollPosition > 10;
    const logoSrc = compactNavigationElements
      ? "/assets/shared/logo_sm.png"
      : "/assets/shared/logo_lg.png";
    const logoSize = compactNavigationElements ? 45 : 190;

    const navigationItems: NavigationItem[] = [
      { name: t("projects"), link: "projects" },
      { name: t("about-us"), link: "about-us" },
      { name: t("learn"), link: "learn" },
    ];

    return (
      <div
        className={`lg:flex w-full flex-row items-center justify-between transition-all duration-300 ease-in-out ${
          compactNavigationElements ? "py-2" : "py-6"
        } sm:px-6 md:px-8 lg:px-12 xl:px-16 hidden`}
      >
        <Link href="/">
          <Image
            alt="Throu_desktop_logo"
            height={0}
            width={logoSize}
            src={logoSrc}
            className="object-contain w-auto h-auto"
          />
        </Link>

        <div className="gap-4 flex flex-row items-center justify-center transition-all duration-300 ease-in-out">
          {navigationItems.map((item) => (
            <Button
              key={`${item.name}-navbar-navigation-link`}
              href={`/${locale}/${item.link}`}
              as={Link}
              className="text-base hover:text-secondary hover:underline bg-transparent text-primary font-jakarta"
            >
              {item.name}
            </Button>
          ))}
        </div>

        <div className="font-sen flex flex-row gap-2">
          <LanguageSelector />
          <SignedOut>
            <Button
              startContent={<FaRegUser />}
              className="text-primary bg-transparent font-sen font-normal"
              as={Link}
              href={`/${locale}/sign-in`}
              rel="noreferrer"
            >
              {t("signIn")}
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    );
  }
);

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
      <MobileHomeNavigation scrollPosition={scrollPosition} locale={locale} />
      <DesktopHomeNavigation scrollPosition={scrollPosition} locale={locale} />
    </nav>
  );
}