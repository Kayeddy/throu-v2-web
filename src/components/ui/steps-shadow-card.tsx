import { Button, Card } from "@nextui-org/react";
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
      className={`lg:w-44 lg:h-48 h-64 w-[80vw] max-w-[400px] flex items-center justify-center p-2 rounded-md bg-white ${step.shadowStyle}`}
    >
      <div className="flex flex-col items-center justify-around w-full h-full">
        <Image
          src={step.icon.url}
          alt={step.name + "step-card-image"}
          width={step.icon.width}
          height={step.icon.height}
          className="object-cover w-auto h-auto"
        />
        <div
          className={`flex flex-col items-center justify-center font-bold font-jakarta ${step.titlesColor}`}
        >
          <h2 className="lg:text-sm text-base translate-y-[5px]">
            {step.subtitle}
          </h2>
          <h1 className="lg:text-base text-lg">{step.title}</h1>
        </div>
        <p className="font-jakarta lg:text-sm text-base text-center">
          {step.description}
        </p>
        <Button
          href={step.link.url}
          target="_blank"
          rel="noreferrer"
          as={Link}
          className={`bg-transparent hover:font-bold font-sen hover:underline lg:text-sm text-lg font-normal mx-auto ${step.link.color}`}
        >
          {step.link.text}
        </Button>
      </div>
    </div>
  );
}
