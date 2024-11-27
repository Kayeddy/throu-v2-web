"use client";

import { FooterCard } from "../ui/footer-card";
import Image from "next/image";
import { socialMediaItems } from "@/utils/constants";
import Link from "next/link";
import ScrollTopIndicator from "./ScrollTopIndicator";
import BackgroundImage from "../ui/background-image";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

export default function Footer() {
  const t = useTranslations("HomeFooter");
  const locale = useLocale();

  const { address, isConnected } = useAccount();

  const { openAccountModal } = useAccountModal();
  const { openConnectModal } = useConnectModal();

  const router = useRouter();

  const handleCreateWalletClick = () => {
    if (isConnected && address) {
      openAccountModal?.();
    } else {
      // Open connect modal if not connected
      openConnectModal?.();
    }
  };

  // Translated footer cards data using useMemo
  const footerCardsData = useMemo(
    () => [
      {
        title: t("cards.createAccount.title"),
        subtitle: t("cards.createAccount.subtitle"),
        icon: {
          src: "/assets/shared/user_footer_icon.webp",
          width: 40,
          height: 40,
        },
        link: {
          url: `${locale}/sign-up`,
          text: t("cards.createAccount.linkText"),
        },
      },
      {
        title: t("cards.createWallet.title"),
        subtitle: t("cards.createWallet.subtitle"),
        icon: {
          src: "/assets/shared/wallet_footer_icon.webp",
          width: 60,
          height: 60,
        },
        callback: handleCreateWalletClick,
        link: {
          text: t("cards.createWallet.linkText"),
        },
      },
    ],
    [t, locale, isConnected, address]
  );

  // Footer links with translations
  const footerLinks = [
    {
      name: "projects",
      link: `/${locale}/marketplace`,
    },
    {
      name: "aboutUs",
      link: `/${locale}/about-us`,
    },
    {
      name: "learn",
      link: `/${locale}/learn`,
    },
  ];

  return (
    <div className="relative z-[10] mt-32 flex h-fit w-full flex-col items-center justify-between gap-24 overflow-hidden bg-primary p-6 pb-32 sm:p-6 md:p-8 lg:p-12 lg:pb-8">
      <div className="relative z-10 flex w-full flex-col items-center justify-start gap-16 lg:flex-row">
        <div className="flex flex-col gap-4">
          <h1 className="mt-4 font-sen text-[1.85rem] font-bold leading-relaxed text-light lg:mt-4 lg:max-w-[28rem] lg:text-[2.50rem]">
            <span className="lg:text-secondary">{t("headline.part1")}</span>{" "}
            {t("headline.part2")}{" "}
            <span className="lg:text-secondary">{t("headline.part3")}</span>.
          </h1>
          <p className="max-w-[23rem] font-jakarta text-base font-normal text-light">
            {t("description")}
          </p>
        </div>
        <div className="flex flex-row gap-4 lg:gap-10">
          {footerCardsData.map((cardData, index) => (
            <div key={index}>
              <FooterCard data={cardData} />
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 flex w-full flex-col items-center justify-center gap-10 lg:flex-row lg:justify-between lg:gap-0">
        <div className="flex flex-col items-start justify-center gap-10 lg:items-start lg:justify-start">
          <Image
            alt={t("logoAltText")}
            height={0}
            width={190}
            src="/assets/shared/logo_lg_footer.webp"
            className="h-auto w-auto object-contain"
          />
          <div className="mx-auto flex flex-col items-center justify-center gap-6 lg:mx-0 lg:flex-row lg:flex-wrap lg:justify-start">
            {footerLinks.map((item) => (
              <Link
                key={`${item.name}-footer-link`}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="bg-transparent text-base text-light transition-all duration-300 ease-in-out hover:text-secondary hover:underline"
              >
                {t(`links.${item.name}`)}
              </Link>
            ))}
            <a
              href="/legal/terms_conditions.pdf"
              download
              lang="en"
              className="bg-transparent text-base text-light transition-all duration-300 ease-in-out hover:text-secondary hover:underline"
            >
              {t("links.termsService")}
            </a>
            <a
              href="/legal/privacy_policy.pdf"
              download
              lang="en"
              className="bg-transparent text-base text-light transition-all duration-300 ease-in-out hover:text-secondary hover:underline"
            >
              {t("links.privacy")}
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-12">
          <div className="flex w-full max-w-sm flex-row items-center justify-around gap-4">
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
          <p className="max-w-sm text-center text-sm text-light lg:text-xs">
            {t("rightsReserved")}
          </p>
        </div>
      </div>
      <ScrollTopIndicator />
      <BackgroundImage
        src="/assets/shared/logo_blue_left.webp"
        containerStyles="h-full justify-end hidden lg:block absolute top-[100px] right-[-90px] z-0"
        imageStyles="w-[300px] h-[500px] rotate-[-20deg]"
      />
    </div>
  );
}
