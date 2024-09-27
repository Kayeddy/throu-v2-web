"use client";

import { Carousel } from "@/components/ui/cards-carousel";
import StepsShadowCard from "@/components/ui/steps-shadow-card";
import { Image } from "@nextui-org/react";
import { useRef, useState } from "react";
import Slider from "react-slick";

const stepList = [
  {
    name: "account step",
    icon: {
      url: "/assets/home/steps/account_step.png",
      width: 36,
      height: 36,
    },
    title: "la inversión",
    subtitle: "Únete al camino de",
    titlesColor: "text-primary",
    description: "¡Accede a oportunidades únicas con Throu!",
    link: {
      url: "/",
      color: "text-minimal",
      text: "Invertir",
    },
    shadowStyle: "shadow-blue-custom",
  },
  {
    name: "choose step",
    icon: {
      url: "/assets/home/steps/choose_step.png",
      width: 44,
      height: 44,
    },
    title: "nuestros proyectos",
    subtitle: "Escoje entre",
    titlesColor: "text-primary",
    description: "¡Construye tu portafolio inmobiliario!",
    link: {
      url: "/",
      color: "text-primary",
      text: "Explorar",
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
    title: "tokens que desees",
    subtitle: "Compra los",
    titlesColor: "text-secondary",
    description: "Repite el proceso y aumenta tu patrimonio",
    link: {
      url: "/",
      color: "text-secondary",
      text: "Comprar tokens",
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
    title: "crece tu cartera",
    subtitle: "Recibe utilidad y",
    titlesColor: "text-tertiary",
    description: "Repite el proceso y aumenta tu patrimonio",
    link: {
      url: "/",
      color: "text-tertiary",
      text: "Más información",
    },
    shadowStyle: "shadow-purple-custom",
  },
];

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

export default function Steps() {
  return (
    <div className="h-screen lg:min-h-screen min-h-fit lg:h-fit overflow-x-hidden max-w-screen-2xl 2xl:mx-auto flex justify-start items-start pb-6">
      <div>
        <div className="p-6 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex lg:flex-row flex-col items-start justify-start relative pt-24 lg:pt-0">
          <h1 className="font-sen flex flex-col items-start justify-start font-bold gap-4 lg:gap-1 lg:ml-[6%]">
            <span className="text-4xl text-primary">Estaremos en cada </span>
            <span className="text-5xl text-secondary">
              <span className="lg:opacity-50 opacity-100">Paso</span>{" "}
              <span className="opacity-50 lg:opacity-100">a paso</span>
            </span>
            <span className="text-4xl text-primary font-sen">para ti</span>
          </h1>
        </div>

        <Image
          src="/assets/home/steps/steps_line_light.png"
          alt="steps-line-image"
          className="object-contain w-screen h-[500px] translate-x-[100px] mt-[-20%] mb-[30px] lg:block hidden"
        />

        {renderStepsContent()}
      </div>
    </div>
  );
}
