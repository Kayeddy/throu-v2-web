"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useGetProject } from "@/hooks/blockchain/evm";
import { useGetSolanaProject } from "@/hooks/blockchain/solana";
import { Carousel } from "@/components/ui/cards-carousel";
import { ShowcaseCard } from "@/components/ui/showcase-card";
import { useTranslations, useLocale } from "next-intl";
import { ProjectDetails } from "@/utils/types/shared/project";
import { generateProjectUrl } from "@/lib/utils";

// Interface for showcase card data
interface ShowcaseCardData extends ProjectDetails {
  redirectionLink: string;
}

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

  // EVM Project
  const evmProjectId = 0;
  const {
    project: evmProject,
    error: evmError,
    isPending: evmPending,
  } = useGetProject(evmProjectId);

  // Solana Project
  const solanaProjectId = "0";
  const {
    data: solanaProject,
    error: solanaError,
    isPending: solanaPending,
  } = useGetSolanaProject(solanaProjectId);

  const [availableProjects, setAvailableProjects] = useState<
    ShowcaseCardData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate redirect link for a project
  const generateProjectLink = (project: ProjectDetails) => {
    return generateProjectUrl(project, locale);
  };

  // Combine and process projects
  useEffect(() => {
    console.log("🟡 [SHOWCASE] Processing projects...");

    const projects: ShowcaseCardData[] = [];

    // Add EVM project if available
    if (evmProject && evmProject.projectActive) {
      console.log(
        "🟢 [SHOWCASE] Adding EVM project:",
        evmProject.projectURI?.name
      );
      projects.push({
        ...evmProject,
        redirectionLink: generateProjectLink(evmProject),
      } as ShowcaseCardData);
    }

    // Add Solana project if available (show regardless of active status for testnet)
    if (solanaProject) {
      console.log(
        "🟢 [SHOWCASE] Adding Solana project:",
        solanaProject.projectURI?.name || "Unnamed Project",
        "- Active:",
        solanaProject.projectActive
      );
      projects.push({
        ...solanaProject,
        redirectionLink: generateProjectLink(solanaProject),
      } as ShowcaseCardData);
    }

    setAvailableProjects(projects);
    setIsLoading(evmPending || solanaPending);

    console.log(`🟢 [SHOWCASE] Total projects available: ${projects.length}`);
  }, [evmProject, evmPending, solanaProject, solanaPending, locale]);

  // Legacy fallback for backward compatibility
  const legacyCardData = useMemo(() => {
    if (evmProject) {
      return {
        ...evmProject,
        chain: evmProject?.chain || "polygon",
        redirectionLink: generateProjectLink(evmProject),
      } as ShowcaseCardData;
    }
    return null;
  }, [evmProject, locale]);

  // Memoized carousel render logic for optimization
  const renderProjectsCarousel = useMemo(() => {
    // Show loading state during initial load
    if (isLoading) {
      return (
        <div className="flex h-[70vh] max-h-[600px] w-[80vw] max-w-[450px] items-center justify-center rounded-md bg-light/10 shadow-project-section-card-custom lg:max-h-[700px] lg:w-[40vw]">
          <div className="animate-pulse text-center">
            <div className="mx-auto mb-4 h-8 w-24 rounded bg-gray-200"></div>
            <div className="mx-auto h-4 w-32 rounded bg-gray-200"></div>
          </div>
        </div>
      );
    }

    // Multi-project carousel when we have projects
    if (availableProjects.length > 0) {
      return (
        <Carousel
          items={[
            ...availableProjects.map((project, index) => (
              <ShowcaseCard
                key={`${project.chain}-${project.projectId}-${index}`}
                data={project}
              />
            )),
            <TemporaryComingSoonCard key="coming-soon" />,
          ]}
        />
      );
    }

    // Fallback for legacy single project display
    if (legacyCardData) {
      return (
        <Carousel
          items={[
            <ShowcaseCard key="legacy-evm" data={legacyCardData} />,
            <TemporaryComingSoonCard key="coming-soon" />,
          ]}
        />
      );
    }

    // Default fallback - always show the coming soon card even if there are errors
    return (
      <Carousel
        items={[<TemporaryComingSoonCard key="coming-soon-fallback" />]}
      />
    );
  }, [availableProjects, isLoading, legacyCardData, t]);

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
