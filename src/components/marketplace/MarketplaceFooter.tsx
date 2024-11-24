"use client";

import Image from "next/image";
import { socialMediaItems } from "@/utils/constants";
import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";
import { HomeNavigationItems } from "@/utils/types/shared/common";

export default function Footer() {
  const t = useTranslations("HomeFooter");
  const locale = useLocale();

  // Footer links with translations
  const footerLinks: HomeNavigationItems[] = [
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
    <div className="relative z-[20] mt-32 flex h-fit w-full flex-col items-center justify-between gap-24 overflow-hidden bg-primary p-6 pb-32 dark:bg-opacity-50 sm:p-6 md:p-8 lg:p-12 lg:pb-8">
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
    </div>
  );
}
