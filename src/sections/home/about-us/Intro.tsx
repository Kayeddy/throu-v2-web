"use client";

import { useIsMobile } from "@/utils/hooks/shared/useIsMobile";
import { useTranslations } from "next-intl";

export default function Intro() {
  const isMobile = useIsMobile();
  const t = useTranslations("AboutUs.intro");

  return (
    <div className="flex flex-col items-start justify-start gap-10 text-primary">
      <h1 className="font-sen text-4xl lg:text-6xl font-bold">
        {isMobile ? t("headline.mobile") : t("headline.desktop")}
      </h1>

      <p className="font-jakarta">{t("description")}</p>

      <div className="flex flex-col gap-4 ml-4 font-jakarta lg:max-w-5xl">
        <p>
          <b>1. {t("pillars.democratize.title")}:</b>{" "}
          {t("pillars.democratize.description")}
          <br />
          <br />
          <b>2. {t("pillars.simplify.title")}:</b>{" "}
          {t("pillars.simplify.description")}
          <br />
          <br />
          <b>3. {t("pillars.dynamize.title")}:</b>{" "}
          {t("pillars.dynamize.description")}
        </p>
      </div>
    </div>
  );
}
