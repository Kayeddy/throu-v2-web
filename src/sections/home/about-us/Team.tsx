"use client";

import { useIsMobile } from "@/utils/hooks/shared/useIsMobile";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Team() {
  const isMobile = useIsMobile();
  const t = useTranslations("AboutUs.team");

  return (
    <>
      <div className="w-full lg:h-[27rem] h-[200px] relative">
        <Image
          src="/assets/about_us/team_1.png"
          alt={t("teamImageAlt")}
          fill
          className="object-cover object-center w-full lg:h-full scale-100"
        />
      </div>

      <div className="flex lg:flex-row flex-col items-center justify-between h-96 relative w-full gap-10 text-primary">
        <div className="flex flex-row items-start justify-start">
          <Image
            src="/assets/about_us/quotes.png"
            alt="quote-icon"
            width={isMobile ? 20 : 40}
            height={isMobile ? 20 : 40}
            className="object-cover w-auto h-auto"
          />

          <p className="text-2xl font-bold font-sen text-center max-w-sm pl-3">
            {t("quote")}
          </p>

          <Image
            src="/assets/about_us/quotes.png"
            alt="quote-icon"
            width={isMobile ? 20 : 40}
            height={isMobile ? 20 : 40}
            className="object-cover w-auto h-auto self-end"
          />
        </div>

        <div className="relative lg:h-80 h-[200px] lg:w-[50%] w-full">
          <Image
            src="/assets/about_us/team_2.png"
            alt={t("teamImageAlt2")}
            fill
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </>
  );
}
