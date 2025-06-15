"use client";

import { Carousel } from "@/components/ui/cards-carousel";
import StepsShadowCard from "@/components/ui/steps-shadow-card";
import { Image } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

const Steps = () => {
  const t = useTranslations("HomePage.Steps");
  const locale = useLocale();

  // Step list is now translated, and memoized to avoid re-render
  const stepList = useMemo(
    () => [
      {
        name: "account step",
        icon: {
          url: "/assets/home/steps/account_step.png",
          width: 33,
          height: 33,
        },
        title: t("steps.0.title"),
        subtitle: t("steps.0.subtitle"),
        titlesColor: "text-primary",
        description: t("steps.0.description"),
        link: {
          url: `/${locale}/learn`,
          color: "text-minimal",
          text: t("steps.0.link_text"),
        },
        shadowStyle: "shadow-blue-custom",
      },
      {
        name: "choose step",
        icon: {
          url: "/assets/home/steps/choose_step.png",
          width: 48,
          height: 48,
        },
        title: t("steps.1.title"),
        subtitle: t("steps.1.subtitle"),
        titlesColor: "text-primary",
        description: t("steps.1.description"),
        link: {
          url: `/${locale}/learn`,
          color: "text-primary",
          text: t("steps.1.link_text"),
        },
        shadowStyle: "shadow-gray-custom",
      },
      {
        name: "buy step",
        icon: {
          url: "/assets/home/steps/buy_step.png",
          width: 50,
          height: 50,
        },
        title: t("steps.2.title"),
        subtitle: t("steps.2.subtitle"),
        titlesColor: "text-secondary",
        description: t("steps.2.description"),
        link: {
          url: `/${locale}/learn`,
          color: "text-secondary",
          text: t("steps.2.link_text"),
        },
        shadowStyle: "shadow-blue-custom",
      },
      {
        name: "profit step",
        icon: {
          url: "/assets/home/steps/profit_step.png",
          width: 40,
          height: 40,
        },
        title: t("steps.3.title"),
        subtitle: t("steps.3.subtitle"),
        titlesColor: "text-tertiary",
        description: t("steps.3.description"),
        link: {
          url: `/${locale}/learn`,
          color: "text-tertiary",
          text: t("steps.3.link_text"),
        },
        shadowStyle: "shadow-purple-custom",
      },
    ],
    [t]
  );

  // Render steps content
  const renderStepsContent = () => {
    return (
      <>
        <div className="hidden w-full flex-row items-center justify-between lg:flex lg:px-10">
          <div>
            <StepsShadowCard step={stepList[0]} />
          </div>
          <div className="-translate-y-[100px]">
            <StepsShadowCard step={stepList[1]} />
          </div>
          <div className="-translate-y-[180px]">
            <StepsShadowCard step={stepList[2]} />
          </div>
          <div className="-translate-y-[230px]">
            <StepsShadowCard step={stepList[3]} />
          </div>
        </div>

        <div className="mt-10 flex w-screen items-center justify-center px-3 lg:mt-0 lg:hidden">
          <Carousel
            showPagination={false}
            items={stepList.map((step, index) => (
              <div key={index}>
                <StepsShadowCard step={step} />
              </div>
            ))}
          />
        </div>
      </>
    );
  };

  return (
    <div className="flex h-screen min-h-fit max-w-screen-2xl items-start justify-start overflow-x-hidden pb-6 lg:h-fit lg:min-h-screen 2xl:mx-auto">
      <div>
        <div className="relative flex flex-col items-start justify-start p-6 pt-24 sm:p-6 md:p-8 lg:flex-row lg:p-12 lg:pt-0 xl:p-16">
          <h1 className="flex flex-col items-start justify-start gap-4 font-sen font-bold lg:ml-[6%] lg:gap-1">
            <span className="text-center text-4xl text-primary">
              {t("main_title_part1")}
            </span>
            <span className="text-center text-5xl text-secondary">
              <span className="opacity-100 lg:opacity-50">
                {t("main_title_part2")}
              </span>{" "}
              <span className="text-center opacity-50 lg:opacity-100">
                {t("main_title_part3")}
              </span>
            </span>
            <span className="text-center font-sen text-4xl text-primary">
              {t("main_title_part4")}
            </span>
          </h1>
        </div>

        <Image
          src="/assets/home/steps/steps_line_light.png"
          alt="steps-line-image"
          className="mb-[30px] mt-[-20%] hidden h-[500px] w-screen translate-x-[100px] object-contain lg:block"
          loading="lazy" // Lazy load this large image
        />

        {renderStepsContent()}
      </div>
    </div>
  );
};

export default Steps;
