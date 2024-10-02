"use client";

import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useGetProject } from "@/utils/hooks/smart_contracts/useGetProjects";
import { Carousel } from "@/components/ui/cards-carousel";
import { ShowcaseCard } from "@/components/ui/showcase-card";
import { useTranslations, useLocale } from "next-intl";

export default function Showcase() {
  const t = useTranslations("HomePage.Showcase");
  const locale = useLocale() as "en" | "es" | "fr" | "ar";
  const projectId = 0;
  const { project, error, isPending } = useGetProject(projectId);

  useEffect(() => {
    if (!isPending && project && !error) {
      console.log(project);
    }
  }, [isPending, project, error]);

  // Memoized carousel render logic for optimization
  const renderProjectsCarousel = useMemo(() => {
    if (!isPending && project) {
      return (
        <Carousel items={[<ShowcaseCard data={project} />, <ShowcaseCard />]} />
      );
    }
    if (error) {
      return (
        <p className="text-center font-sen text-slate-600">
          {t("no_projects_message")}
        </p>
      );
    }
  }, [project, error, isPending, t]);

  // Dynamically detect and highlight "projects" and "affordable" based on locale
  const formatTitle = useMemo(() => {
    const titleText = t("title");
    const wordsToHighlight: Record<string, Record<string, string>> = {
      en: { projects: "projects", affordable: "affordable" },
      es: { projects: "proyectos", affordable: "asequibles" },
      fr: { projects: "projets", affordable: "abordables" },
      ar: { projects: "المشاريع", affordable: "المعقولة" },
    };

    const titleParts = titleText.split(",");

    return titleParts.map((part, partIndex) => {
      const words = part.split(" ");

      return (
        <div key={partIndex}>
          {words.map((word, wordIndex) => {
            const isHighlighted = Object.values(
              wordsToHighlight[locale]
            ).includes(word.toLowerCase());

            return (
              <span
                key={wordIndex}
                className={isHighlighted ? "text-secondary font-bold" : ""}
              >
                {word}
                {wordIndex < words.length - 1 && " "}
              </span>
            );
          })}
          {partIndex < titleParts.length - 1 && ", "}
          {partIndex < titleParts.length - 1 && <br />}
        </div>
      );
    });
  }, [t, locale]);

  return (
    <div className="w-screen h-fit lg:h-screen min-h-screen overflow-x-hidden p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex lg:flex-row flex-col items-center justify-center">
      <div className="h-full lg:w-[50%] lg:min-w-[550px] w-full flex flex-col items-start justify-center px-6 gap-6 shadow-project-section-custom">
        <h1 className="font-sen text-3xl lg:text-4xl text-primary font-bold lg:text-left text-center">
          {formatTitle}
        </h1>
        <p className="lg:text-base text-lg text-primary font-jakarta lg:max-w-sm text-center lg:text-left">
          {t("description")}
        </p>
        <div className="flex flex-col lg:flex-row items-center justify-start w-full gap-4 lg:gap-0">
          <Button
            size="lg"
            radius="none"
            variant="ghost"
            color="primary"
            aria-label={t("explore_button")}
            className="hover:text-white lg:text-sm text-lg font-bold px-10 w-full lg:w-fit hover:bg-primary font-sen border-primary"
          >
            {t("explore_button")}
          </Button>
          <Button
            href="/"
            target="_blank"
            rel="noreferrer"
            as={Link}
            aria-label={t("learn_more_button")}
            className="lg:font-medium font-extralight text-primary bg-transparent hover:underline hover:text-secondary hover:bg-transparent text-xl lg:text-base font-sen"
          >
            {t("learn_more_button")}
          </Button>
        </div>
      </div>
      <div className="h-full lg:w-[50%] w-full">
        <div className="h-full w-full relative flex items-center justify-center">
          {renderProjectsCarousel}
        </div>
      </div>
    </div>
  );
}
