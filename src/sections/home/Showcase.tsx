"use client";

import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useEffect } from "react";
import { useGetProject } from "@/utils/hooks/smart_contracts/useGetProjects";
import { Carousel } from "@/components/ui/cards-carousel";
import { ShowcaseCard } from "@/components/ui/showcase-card";

export default function Showcase() {
  // const cards = data.map((card, index) => (
  //   <Card key={card.src} card={card} index={index} />
  // ));

  const projectId = 0;
  const { project, error, isPending } = useGetProject(projectId);

  useEffect(() => {
    if (!isPending && project && !error) {
      console.log(project);
    }
  }, [isPending, project, error]);

  const renderProjectsCarousel = () => {
    if (!isPending && project) {
      return (
        <Carousel items={[<ShowcaseCard data={project} />, <ShowcaseCard />]} />
      );
    }
    if (error) {
      return (
        <p className="text-center font-sen text-slate-600">
          There are no projects available to show
        </p>
      );
    }
  };

  return (
    <div className="w-screen h-fit lg:h-screen min-h-screen overflow-x-hidden p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex lg:flex-row flex-col items-center justify-center">
      <div className="h-full lg:w-[50%] lg:min-w-[550px] w-full flex flex-col items-start justify-center px-6 gap-6 shadow-project-section-custom">
        <h1 className="font-sen text-3xl lg:text-4xl text-primary font-bold lg:text-left text-center">
          <span className="lg:text-secondary text-tertiary font-bold">
            Proyectos
          </span>{" "}
          exclusivos, Inversiones{" "}
          <span className="text-secondary font-bold">asequibles</span>
        </h1>
        <p className="lg:text-base text-lg text-primary font-jakarta lg:max-w-sm text-center lg:text-left">
          Accede a una plataforma de finanzas descentralizadas (DeFi) que ofrece
          la posibilidad de{" "}
          <span className="font-semibold"> proyectos inmobiliarios</span> a
          través de tokens de fracción, con la seguridad y transparencia
          garantizadas por los Smart Contracts.
        </p>
        <div className="flex flex-col lg:flex-row items-center justify-start w-full gap-4 lg:gap-0">
          <Button
            size="lg"
            radius="none"
            variant="ghost"
            color="primary"
            className=" hover:text-white lg:text-sm text-lg font-bold px-10 w-full lg:w-fit hover:bg-primary font-sen border-primary"
          >
            Explorar
          </Button>
          <Button
            href="/"
            target="_blank"
            rel="noreferrer"
            as={Link}
            className="lg:font-medium font-extralight text-primary bg-transparent hover:underline hover:text-secondary hover:bg-transparent text-xl lg:text-base font-sen"
          >
            Conocer más
          </Button>
        </div>
      </div>
      <div className="h-full lg:w-[50%] w-full">
        <div className="h-full w-full relative flex items-center justify-center">
          {renderProjectsCarousel()}
        </div>
      </div>
    </div>
  );
}
