import ProjectAttributesContainer from "@/components/ui/project-attributes-boxes-container";
import ProjectImageSlider from "@/components/ui/project-details-image-slider";
import { calculateBarPercentage } from "@/lib/utils";
import { Button } from "@nextui-org/button";
import React, { useMemo } from "react";
import { FiChevronLeft as LeftButtonIcon } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function ProjectHeader({
  projectDetails,
  projectMedia,
}: {
  projectDetails: ProjectDetails | null;
  projectMedia: string[];
}) {
  const router = useRouter();

  const projectCompletionPercentage = useMemo(() => {
    if (
      projectDetails?.projectRemainingTokens &&
      projectDetails?.projectTotalSupply
    ) {
      return calculateBarPercentage(
        projectDetails?.projectTotalSupply,
        projectDetails?.projectRemainingTokens
      );
    }
    return 0;
  }, [projectDetails]);

  const projectAttributes = useMemo(
    () => ({
      tokens: projectDetails?.projectTotalSupply,
      valor: `$${projectDetails?.projectPrice}`,
      total: `$${
        projectDetails?.projectPrice && projectDetails?.projectTotalSupply
          ? projectDetails?.projectTotalSupply * projectDetails?.projectPrice
          : 0
      }`,
      APY: "23%",
    }),
    [projectDetails]
  );

  // Memoizing the project sales calculation
  const projectSales = useMemo(() => {
    return calculateProjectSales(
      projectDetails?.projectTotalSupply,
      projectDetails?.projectRemainingTokens,
      projectDetails?.projectPrice
    );
  }, [projectDetails]);

  // Memoizing the total project goal calculation
  const totalProjectGoal = useMemo(() => {
    if (projectDetails?.projectTotalSupply && projectDetails?.projectPrice) {
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
          Salón Prado
        </h1>
      </div>

      <ProjectImageSlider
        projectDetails={projectDetails}
        projectMedia={projectMedia}
      />

      <div className="mt-28 flex w-full flex-col items-start justify-center gap-3 lg:mt-0">
        <p className="font-jakarta text-base text-minimal">Estado</p>
        <h3 className="font-sen text-4xl font-bold text-secondary">
          {projectDetails?.projectActive ? "En recaudo" : "Finalizado"}
        </h3>
        <div className="flex w-full flex-col-reverse items-start justify-center lg:flex-col">
          <span className="mt-3 flex flex-row items-center justify-start gap-4 lg:mt-0">
            <p className="font-sen text-xl font-bold text-minimal">
              ${projectSales}
            </p>
            <p className="text-lg text-minimal">de ${totalProjectGoal}</p>
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
          {projectCompletionPercentage}% completado
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

// Optimized project sales calculation with type safety and number conversion
const calculateProjectSales = (
  supply: number | undefined,
  remainingTokens: number | bigint | undefined,
  tokenPrice: number | undefined
): number => {
  if (supply && remainingTokens && tokenPrice) {
    const remainingTokensNumber =
      typeof remainingTokens === "bigint"
        ? Number(remainingTokens)
        : remainingTokens;

    // Ensure the operation only happens with valid numbers
    return (supply - remainingTokensNumber) * tokenPrice;
  }
  return 0;
};
