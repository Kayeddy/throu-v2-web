import HomeScrollIndicator from "@/components/ui/home-scroll-indicator";
import { Button } from "@heroui/button";
import { Link } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("HomePage.Hero"); // Access the Hero section translations
  const locale = useLocale();

  return (
    <div className="relative h-screen min-h-screen w-screen overflow-x-hidden bg-[url('/assets/home/hero/landing_bg.webp')] bg-cover bg-[left_210vw_bottom_-50px] p-4 sm:p-6 md:bg-[center] md:p-8 lg:p-12 xl:p-16">
      <div className="mt-20 flex h-[calc(100%-5rem)] w-full flex-col items-start justify-between gap-8 lg:mt-28 lg:h-auto">
        <section className="flex w-full flex-col items-start justify-start gap-6">
          <h1 className="max-w-2xl font-sen text-[2rem] leading-normal text-primary lg:text-4xl">
            {t("title")}
          </h1>
          <p className="max-w-[18rem] font-jakarta text-lg font-normal text-primary lg:max-w-[22rem] lg:text-base">
            {t("subtitle")}
          </p>
        </section>
        <section className="flex w-full flex-col items-center justify-center gap-4 lg:w-fit lg:flex-row">
          <Button
            href={`/${locale}/marketplace`}
            as={Link}
            size="lg"
            radius="none"
            className="w-full bg-primary px-10 font-sen text-lg font-bold text-white hover:bg-secondary lg:w-fit lg:text-sm"
          >
            {t("primaryButton")}
          </Button>
          <Button
            href={`/${locale}/learn`}
            as={Link}
            className="bg-transparent font-sen text-xl text-primary hover:bg-transparent hover:text-secondary hover:underline lg:text-base lg:font-medium"
          >
            {t("secondaryButton")}
          </Button>
        </section>
      </div>
      <HomeScrollIndicator />
    </div>
  );
}
