import { Button, Card } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

interface CardLink {
  url: string;
  color: string;
  text: string;
}

interface CardIcon {
  url: string;
  width: number;
  height: number;
}

interface CardProps {
  name: string;
  icon: CardIcon;
  title: string;
  titlesColor: string;
  subtitle: string;
  description: string;
  link: CardLink;
  shadowStyle: string;
}

export default function StepsShadowCard({ step }: { step: CardProps }) {
  return (
    <div
      className={`lg:w-48 lg:h-[14rem] h-64 w-[80vw] max-w-[400px] flex items-center justify-center p-2 rounded-md bg-white ${step.shadowStyle}`}
    >
      <div className="flex h-full w-full flex-col items-center justify-around">
        <Image
          src={step.icon.url}
          alt={step.name + "step-card-image"}
          width={step.icon.width}
          height={step.icon.height}
          className="h-auto w-auto object-cover"
        />
        <div
          className={`flex flex-col items-center justify-center font-bold font-jakarta ${step.titlesColor}`}
        >
          <h2 className="translate-y-[5px] text-center text-base lg:text-sm">
            {step.subtitle}
          </h2>
          <h1 className="text-center text-lg lg:text-base">{step.title}</h1>
        </div>
        <p className="text-center font-jakarta text-base text-primary lg:text-sm">
          {step.description}
        </p>
        <Button
          href={step.link.url}
          target="_blank"
          rel="noreferrer"
          as={Link}
          className={`bg-transparent hover:font-bold font-sen hover:underline lg:text-sm text-lg font-normal mx-auto transition-all duration-300 ease-in-out ${step.link.color}`}
        >
          {step.link.text}
        </Button>
      </div>
    </div>
  );
}
