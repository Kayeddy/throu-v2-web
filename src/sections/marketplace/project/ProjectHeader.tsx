import ProjectAttributesContainer from "@/components/ui/project-attributes-boxes-container";
import ProjectImageSlider from "@/components/ui/project-details-image-slider";
import { calculateBarPercentage } from "@/lib/utils";
import { Button } from "@heroui/button";
import React, { useMemo } from "react";
import { FiChevronLeft as LeftButtonIcon } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProjectDetails } from "@/utils/types/shared/project";
import { useProjectNameByChain } from "@/hooks/blockchain/useProjectDataByChain";

export default function ProjectHeader({
  projectDetails,
  projectMedia,
}: {
  projectDetails: ProjectDetails | null;
  projectMedia: string[];
}) {
  const router = useRouter();
  const t = useTranslations("Marketplace.project.projectDetails.projectHeader");
  
  // Get dynamic project name based on chain
  const projectName = useProjectNameByChain(projectDetails?.chain);

  const projectCompletionPercentage = useMemo(() => {
    if (
      projectDetails?.projectRemainingTokens !== undefined &&
      projectDetails?.projectTotalSupply
    ) {
      return calculateBarPercentage(
        projectDetails.projectTotalSupply,
        projectDetails.projectRemainingTokens
      );
    }
    return 0;
  }, [projectDetails]);

  const projectAttributes = useMemo(() => {
    // The price is already in number format
    const price = projectDetails?.projectPrice || 0;

    return {
      tokens: projectDetails?.projectTotalSupply,
      value: `$${price}`,
      total: `$${
        price && projectDetails?.projectTotalSupply
          ? projectDetails.projectTotalSupply * price
          : 0
      }`,
      APY: "23%",
    };
  }, [projectDetails]);

  // Memoizing the project sales calculation
  const projectSales = useMemo(() => {
    // If all tokens are sold (remainingTokens = 0), use the total supply * price as the sales
    if (
      projectDetails?.projectRemainingTokens === 0 &&
      projectDetails?.projectTotalSupply &&
      projectDetails?.projectPrice
    ) {
      return projectDetails.projectTotalSupply * projectDetails.projectPrice;
    }

    // Otherwise calculate based on sold tokens
    if (
      projectDetails?.projectTotalSupply &&
      projectDetails?.projectRemainingTokens !== undefined &&
      projectDetails?.projectPrice
    ) {
      // Calculate tokens sold
      const tokensSold =
        projectDetails.projectTotalSupply -
        (typeof projectDetails.projectRemainingTokens === "number"
          ? projectDetails.projectRemainingTokens
          : 0);

      return tokensSold * projectDetails.projectPrice;
    }

    return 0;
  }, [projectDetails]);

  // Memoizing the total project goal calculation
  const totalProjectGoal = useMemo(() => {
    if (projectDetails?.projectTotalSupply && projectDetails?.projectPrice) {
      // Both values are already numbers, so we can multiply directly
      return projectDetails.projectTotalSupply * projectDetails.projectPrice;
    }
    return 0;
  }, [projectDetails]);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-6">
      <div className="flex flex-row items-center justify-center gap-2">
        <Button
          size="sm"
          radius="md"
          variant="light"
          color="primary"
          className="translate-y-[2px]"
          onClick={() => router.back()}
        >
          <LeftButtonIcon className="text-2xl font-bold text-minimal dark:text-light" />
        </Button>
        <h1 className="font-sen text-3xl font-bold text-primary dark:text-light">
          {t("title", { projectName })}
        </h1>
      </div>

      <ProjectImageSlider
        projectDetails={projectDetails}
        projectMedia={projectMedia}
      />

      <div className="mt-28 flex w-full flex-col items-start justify-center gap-3 lg:mt-0">
        <p className="font-jakarta text-base text-minimal">
          {t("status.label")}
        </p>
        <h3 className="font-sen text-4xl font-bold text-secondary">
          {projectDetails?.projectActive && projectCompletionPercentage < 100
            ? t("status.active")
            : t("status.completed")}
        </h3>
        <div className="flex w-full flex-col-reverse items-start justify-center lg:flex-col">
          <span className="mt-3 flex flex-row items-center justify-start gap-4 lg:mt-0">
            <p className="font-sen text-xl font-bold text-minimal">
              {t("sales.raised", {
                projectSales: projectSales.toLocaleString(),
              })}
            </p>
            <p className="text-lg text-minimal">
              {t("sales.goal", {
                totalProjectGoal: totalProjectGoal.toLocaleString(),
              })}
            </p>
          </span>
          <div className="relative h-2 w-full rounded-md bg-minimal dark:bg-light lg:w-[40%]">
            <span
              className="absolute h-2 rounded-[10px] bg-secondary"
              style={{
                width: `${projectCompletionPercentage}%`,
                maxWidth: "100%",
              }}
            />
          </div>
        </div>
        <p className="hidden animate-pulse font-jakarta text-base text-secondary lg:block">
          {t("progress", { projectCompletionPercentage })}
        </p>
      </div>
      <div className="relative mx-auto lg:hidden">
        <ProjectAttributesContainer
          items={projectAttributes}
          size="xl"
          layout="horizontal"
          isTranslucent
          isGrid
        />
      </div>
    </div>
  );
}
