import HomeScrollIndicator from "@/components/ui/home-scroll-indicator";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("HomePage.Hero"); // Access the Hero section translations

  return (
    <div
      className=" bg-[url('/assets/home/hero/landing_bg.jpg')] 
      bg-cover 
      bg-[left_210vw_bottom_-50px]  
      md:bg-[center]               
      w-screen 
      h-screen 
      min-h-screen 
      overflow-x-hidden 
      p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 
      relative"
    >
      <div className="flex flex-col items-start justify-between gap-8 lg:mt-28 mt-20 w-full h-[calc(100%-5rem)] lg:h-auto">
        <section className="w-full flex flex-col items-start justify-start gap-6">
          <h1 className="lg:text-4xl text-[2rem] text-primary max-w-2xl leading-normal font-sen">
            {t("title")}
          </h1>
          <p className="lg:max-w-[22rem] max-w-[18rem] lg:text-base text-lg text-primary font-normal font-jakarta">
            {t("subtitle")}
          </p>
        </section>
        <section className="flex lg:flex-row flex-col gap-4 items-center justify-center w-full lg:w-fit">
          <Button
            size="lg"
            radius="none"
            className="bg-primary text-white lg:text-sm text-lg font-bold px-10 w-full lg:w-fit hover:bg-secondary font-sen"
          >
            {t("primaryButton")}
          </Button>
          <Button
            href="/"
            target="_blank"
            rel="noreferrer"
            as={Link}
            className="lg:font-medium text-primary bg-transparent hover:underline hover:text-secondary hover:bg-transparent text-xl lg:text-base font-sen"
          >
            {t("secondaryButton")}
          </Button>
        </section>
      </div>
      <HomeScrollIndicator />
    </div>
  );
}
