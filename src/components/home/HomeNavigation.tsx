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
import UserButtonMenu from "../shared/UserButtonMenu";

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
      { name: t("projects"), link: "marketplace" },
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
          <Link href="/">
            <Image
              src="/assets/shared/logo_sm.webp"
              alt="throu_mobile_navbar_image"
              width={40}
              height={40}
              className="h-auto w-auto object-contain"
            />
          </Link>
        </NavbarContent>

        <NavbarMenu
          className={`max-h-[70vh] overflow-hidden mt-3 flex flex-col items-center justify-around ${blurClass}`}
        >
          {navigationItems.map((item, index) => (
            <NavbarMenuItem
              key={`${item.name}-navigation-item-${index}`}
              className="flex w-full flex-col items-center justify-center"
            >
              <Link
                className="text-center font-jakarta text-xl text-primary"
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
                href={`/${locale}/marketplace`}
                as={Link}
                size="lg"
                radius="none"
                className="w-full bg-primary px-10 font-sen text-sm font-bold text-white hover:bg-secondary lg:w-fit"
              >
                {t("invest")}
              </Button>
            </SignedIn>
            <SignedOut>
              <Button
                size="lg"
                radius="none"
                className="w-full bg-primary px-10 font-sen text-lg font-semibold text-white hover:bg-secondary lg:w-fit"
                as={Link}
                href={`/${locale}/sign-in`}
                rel="noreferrer"
              >
                {t("signIn")}
              </Button>
            </SignedOut>
          </NavbarMenuItem>

          <NavbarMenuItem className="flex w-full flex-row items-center justify-between">
            <a
              href="/legal/terms_conditions.pdf"
              download
              lang="en"
              className="font-jakarta"
            >
              {t("termsConditions")}
            </a>
            <a
              href="/legal/privacy_policy.pdf"
              download
              lang="en"
              className="font-jakarta"
            >
              {t("privacy")}
            </a>
          </NavbarMenuItem>

          <div className="flex w-full flex-row items-center justify-between">
            {socialMediaItems.map((item, idx) => (
              <NavbarMenuItem
                key={item.name + "navigation-social-media-element-" + idx}
              >
                <Link
                  href={item.link}
                  target="_blank"
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
          <SignedIn>
            <UserButtonMenu />
          </SignedIn>
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
      ? "/assets/shared/logo_sm.webp"
      : "/assets/shared/logo_lg.webp";
    const logoSize = compactNavigationElements ? 45 : 190;

    const navigationItems: NavigationItem[] = [
      { name: t("projects"), link: "marketplace" },
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
            className="h-auto w-auto object-contain"
            priority
          />
        </Link>

        <div className="flex flex-row items-center justify-center gap-4 transition-all duration-300 ease-in-out">
          {navigationItems.map((item) => (
            <Button
              key={`${item.name}-navbar-navigation-link`}
              href={`/${locale}/${item.link}`}
              as={Link}
              className="bg-transparent font-jakarta text-base text-primary hover:text-secondary hover:underline"
            >
              {item.name}
            </Button>
          ))}
        </div>

        <div className="flex flex-row gap-2 font-sen">
          <SignedOut>
            <Button
              startContent={<FaRegUser />}
              className="bg-transparent font-sen font-normal text-primary"
              as={Link}
              href={`/${locale}/sign-in`}
              rel="noreferrer"
            >
              {t("signIn")}
            </Button>
          </SignedOut>
          <SignedIn>
            {/* <UserButton /> */}
            <UserButtonMenu />
          </SignedIn>
          <LanguageSelector />
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
