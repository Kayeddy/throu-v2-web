"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { FooterCard } from "../ui/footer-card";
import Image from "next/image";
import { socialMediaItems } from "@/utils/constants";
import Link from "next/link";
import ScrollTopIndicator from "./ScrollTopIndicator";
import BackgroundImage from "../ui/background-image";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { HomeNavigationItems } from "@/utils/types/shared/common";

export default function Footer() {
  const { openConnectModal } = useConnectModal();
  const t = useTranslations("HomeFooter");

  // Translated footer cards data using useMemo
  const footerCardsData = useMemo(
    () => [
      {
        title: t("cards.createAccount.title"),
        subtitle: t("cards.createAccount.subtitle"),
        icon: {
          src: "/assets/shared/user_footer_icon.png",
          width: 40,
          height: 40,
        },
        link: {
          url: "/",
          text: t("cards.createAccount.linkText"),
        },
      },
      {
        title: t("cards.createWallet.title"),
        subtitle: t("cards.createWallet.subtitle"),
        icon: {
          src: "/assets/shared/wallet_footer_icon.png",
          width: 60,
          height: 60,
        },
        link: {
          customRedirectFunction: openConnectModal,
          text: t("cards.createWallet.linkText"),
        },
      },
    ],
    [t, openConnectModal]
  );

  // Footer links with translations
  const footerLinks: HomeNavigationItems[] = [
    {
      name: "projects",
      link: "/marketplace",
    },
    {
      name: "aboutUs",
      link: "/about-us",
    },
    {
      name: "learn",
      link: "/learn",
    },
    {
      name: "termsService",
      link: "/terms",
    },
    {
      name: "privacy",
      link: "/privacy",
    },
  ];

  return (
    <div className="bg-primary w-full h-fit p-6 sm:p-6 md:p-8 lg:p-12 pb-32 lg:pb-8 flex flex-col items-center justify-between mt-32 gap-24 z-[10] relative overflow-hidden">
      <div className="flex lg:flex-row flex-col items-center justify-start w-full gap-16 z-10 relative">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold font-sen text-[1.85rem] lg:text-[2.50rem] text-light lg:max-w-[28rem] leading-relaxed mt-4 lg:mt-4">
            <span className="lg:text-secondary">{t("headline.part1")}</span>{" "}
            {t("headline.part2")}{" "}
            <span className="lg:text-secondary">{t("headline.part3")}</span>.
          </h1>
          <p className="text-light text-base font-normal font-jakarta max-w-[23rem]">
            {t("description")}
          </p>
        </div>
        <div className="flex flex-row lg:gap-10 gap-4">
          {footerCardsData.map((cardData, index) => (
            <div key={index}>
              <FooterCard data={cardData} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex lg:flex-row flex-col items-center lg:justify-between justify-center w-full gap-10 lg:gap-0 z-10 relative">
        <div className="flex flex-col gap-10 lg:items-start items-start lg:justify-start justify-center">
          <Image
            alt={t("logoAltText")}
            height={0}
            width={190}
            src="/assets/shared/logo_lg_footer.png"
            className="object-contain w-auto h-auto"
          />
          <div className="flex lg:flex-row flex-col items-center lg:justify-start justify-center gap-6 lg:flex-wrap mx-auto lg:mx-0">
            {footerLinks.map((item) => (
              <Link
                key={`${item.name}-footer-link`}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="text-base hover:text-secondary hover:underline bg-transparent text-light transition-all duration-300 ease-in-out"
              >
                {t(`links.${item.name}`)}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-12 items-center justify-center">
          <div className="flex flex-row gap-4 items-center justify-around w-full max-w-sm">
            {socialMediaItems.map((item) => (
              <Link
                key={`${item.name}-social-media-link`}
                className="text-center text-xl text-light"
                href={item.link}
                rel="noreferrer"
              >
                <item.icon />
              </Link>
            ))}
          </div>
          <p className="lg:text-xs text-sm text-light max-w-sm text-center">
            {t("rightsReserved")}
          </p>
        </div>
      </div>
      <ScrollTopIndicator />
      <BackgroundImage
        src="/assets/shared/logo_blue_left.png"
        containerStyles="h-full justify-end hidden lg:block absolute top-[100px] right-[-90px] z-0"
        imageStyles="w-[300px] h-[500px] rotate-[-20deg]"
      />
    </div>
  );
}
