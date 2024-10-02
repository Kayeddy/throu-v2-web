"use client";

import { Carousel } from "@/components/ui/cards-carousel";
import StepsShadowCard from "@/components/ui/steps-shadow-card";
import { Image } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const Steps = () => {
  const t = useTranslations("HomePage.Steps");

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
          url: "/",
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
          url: "/",
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
          url: "/",
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
          url: "/",
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
        <div className="lg:flex hidden flex-row w-full items-center justify-between lg:px-10">
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

        <div className="w-screen flex items-center justify-center lg:hidden px-3 mt-10 lg:mt-0">
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
    <div className="h-screen lg:min-h-screen min-h-fit lg:h-fit overflow-x-hidden max-w-screen-2xl 2xl:mx-auto flex justify-start items-start pb-6">
      <div>
        <div className="p-6 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex lg:flex-row flex-col items-start justify-start relative pt-24 lg:pt-0">
          <h1 className="font-sen flex flex-col items-start justify-start font-bold gap-4 lg:gap-1 lg:ml-[6%]">
            <span className="text-4xl text-primary text-center">
              {t("main_title_part1")}
            </span>
            <span className="text-5xl text-secondary text-center">
              <span className="lg:opacity-50 opacity-100">
                {t("main_title_part2")}
              </span>{" "}
              <span className="opacity-50 lg:opacity-100 text-center">
                {t("main_title_part3")}
              </span>
            </span>
            <span className="text-4xl text-primary font-sen text-center">
              {t("main_title_part4")}
            </span>
          </h1>
        </div>

        <Image
          src="/assets/home/steps/steps_line_light.png"
          alt="steps-line-image"
          className="object-contain w-screen h-[500px] translate-x-[100px] mt-[-20%] mb-[30px] lg:block hidden"
          loading="lazy" // Lazy load this large image
        />

        {renderStepsContent()}
      </div>
    </div>
  );
};

export default Steps;
