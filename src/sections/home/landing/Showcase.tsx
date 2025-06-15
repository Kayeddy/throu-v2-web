"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useGetProject } from "@/utils/hooks/smart_contracts/useGetProjects";
import { Carousel } from "@/components/ui/cards-carousel";
import { ShowcaseCard } from "@/components/ui/showcase-card";
import { useTranslations, useLocale } from "next-intl";

const TemporaryComingSoonCard = () => {
  const t = useTranslations("HomePage.Showcase");

  return (
    <div className="relative flex h-[70vh] max-h-[600px] w-[80vw] max-w-[450px] flex-col items-start justify-start overflow-hidden rounded-md bg-primary shadow-project-section-card-custom lg:max-h-[700px] lg:w-[40vw]">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="absolute flex h-full w-full items-center justify-center bg-transparent">
        <h1 className="text-center font-sen text-3xl font-bold text-light">
          {t("coming_soon_card_text")}
        </h1>
      </div>
    </div>
  );
};

export default function Showcase() {
  const t = useTranslations("HomePage.Showcase");
  const locale = useLocale() as "en" | "es" | "fr" | "ar";
  const projectId = 0;
  const { project, error, isPending } = useGetProject(projectId);

  useEffect(() => {
    if (!isPending && project && !error) {
      console.log("Project fetched.");
    }
  }, [isPending, project, error]);

  {
    /** This is a remporal solution to redirect to one project, Salon Prado in this case */
  }

  const cardData = {
    ...project,
    redirectionLink: `/${locale}/marketplace/projects/salon-prado-0`,
  };

  // Memoized carousel render logic for optimization
  const renderProjectsCarousel = useMemo(() => {
    if (!isPending && project) {
      return (
        <Carousel
          items={[
            <ShowcaseCard data={cardData} />,
            <TemporaryComingSoonCard />,
            <ShowcaseCard />,
          ]}
        />
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
    <div className="flex h-fit min-h-screen w-screen flex-col items-center justify-center overflow-x-hidden p-4 sm:p-6 md:p-8 lg:h-screen lg:flex-row lg:p-12 xl:p-16">
      <div className="flex h-full w-full flex-col items-start justify-center gap-6 px-6 shadow-project-section-custom lg:w-[50%] lg:min-w-[550px]">
        <h1 className="text-center font-sen text-3xl font-bold text-primary lg:text-left lg:text-4xl">
          {formatTitle}
        </h1>
        <p className="text-center font-jakarta text-lg text-primary lg:max-w-sm lg:text-left lg:text-base">
          {t("description")}
        </p>
        <div className="flex w-full flex-col items-center justify-start gap-4 lg:flex-row lg:gap-0">
          <Button
            as={Link}
            href={`${locale}/marketplace`}
            size="lg"
            radius="none"
            variant="ghost"
            color="primary"
            aria-label={t("explore_button")}
            className="w-full border-primary px-10 font-sen text-lg font-bold hover:bg-primary hover:text-white lg:w-fit lg:text-sm"
          >
            {t("explore_button")}
          </Button>
          <Button
            href="/Learn"
            target="_blank"
            rel="noreferrer"
            as={Link}
            aria-label={t("learn_more_button")}
            className="bg-transparent font-sen text-xl font-extralight text-primary hover:bg-transparent hover:text-secondary hover:underline lg:text-base lg:font-medium"
          >
            {t("learn_more_button")}
          </Button>
        </div>
      </div>
      <div className="h-full w-full lg:w-[50%]">
        <div className="relative flex h-full w-full items-center justify-center">
          {renderProjectsCarousel}
        </div>
      </div>
    </div>
  );
}
