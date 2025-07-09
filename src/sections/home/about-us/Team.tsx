"use client";

import { useIsMobile } from "@/hooks/ui/useIsMobile";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Team() {
  const isMobile = useIsMobile();
  const t = useTranslations("AboutUs.team");

  return (
    <>
      <div className="relative h-[200px] w-full lg:h-[27rem]">
        <Image
          src="/assets/about_us/full_team.jpg"
          alt={t("teamImageAlt")}
          fill
          className="w-full scale-100 object-cover object-center lg:h-full"
        />
      </div>

      <div className="relative flex h-96 w-full flex-col items-center justify-between gap-10 text-primary lg:flex-row">
        <div className="flex flex-row items-start justify-start">
          <Image
            src="/assets/about_us/quotes.png"
            alt="quote-icon"
            width={isMobile ? 20 : 40}
            height={isMobile ? 20 : 40}
            className="h-auto w-auto object-cover"
          />

          <p className="max-w-sm pl-3 text-center font-sen text-2xl font-bold">
            {t("quote")}
          </p>

          <Image
            src="/assets/about_us/quotes.png"
            alt="quote-icon"
            width={isMobile ? 20 : 40}
            height={isMobile ? 20 : 40}
            className="h-auto w-auto self-end object-cover"
          />
        </div>

        <div className="relative h-[200px] w-full lg:h-80 lg:w-[50%]">
          <Image
            src="/assets/about_us/founders.jpg"
            alt={t("teamImageAlt2")}
            fill
            className="h-full w-full object-cover antialiased"
          />
        </div>
      </div>
    </>
  );
}
