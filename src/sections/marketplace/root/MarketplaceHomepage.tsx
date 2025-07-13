"use client";

import { motion } from "framer-motion";
import MarketplaceHomeCard from "@/components/ui/marketplace-home-project-card";
import { useProject } from "@/hooks/blockchain/projects";
// TODO: Implement simplified Solana hooks
// import { useGetProject as useGetSolanaProject } from "@/hooks/blockchain/solana/projects/useProject";
// import { useFetchAllSolanaProjects } from "@/hooks/blockchain/solana/projects/useProjectCollection";
import { Card, Skeleton } from "@heroui/react";
import { useTranslations } from "next-intl";
import { Carousel } from "@/components/ui/cards-carousel";
import { ProjectDetails } from "@/utils/types/shared/project";
import { useEffect, useState } from "react";

const TemporaryComingSoonCard = () => {
  const t = useTranslations("HomePage.Showcase");

  return (
    <div className="relative flex h-[70vh] max-h-[500px] w-[90vw] flex-col items-start justify-start overflow-hidden rounded-md bg-light/5 shadow-project-section-card-custom dark:bg-dark/10 lg:h-[70vh] lg:max-h-[600px] lg:min-h-[500px] lg:w-80">
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

const CardSkeletonLoader = () => {
  return (
    <Card className="relative flex h-[70vh] max-h-[500px] w-[90vw] flex-col items-start justify-start overflow-hidden rounded-md shadow-project-section-card-custom lg:h-[55vh] lg:max-h-[600px] lg:w-80">
      <Skeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300"></div>
      </Skeleton>
      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
    </Card>
  );
};

export default function MarketplaceHomepage() {
  console.log("🚀 [MARKETPLACE] MarketplaceHomepage rendering");

  // EVM Project Fetch
  const evmProjectId = 0;
  const { project: evmProject, isLoading: evmPending } =
    useProject(evmProjectId);

  // TODO: Implement simplified Solana hooks
  // Solana Project Fetch
  // const solanaProjectId = "0"; // Solana projects use string IDs
  // const { projectData: solanaProject, isLoading: solanaPending } =
  //   useGetSolanaProject(solanaProjectId);
  const solanaProject = null;
  const solanaPending = false;

  // Solana project count for debugging
  // const {
  //   totalProjectCount: solanaProjectCount,
  //   isLoading: solanaCountLoading,
  // } = useFetchAllSolanaProjects();
  const solanaProjectCount = 0;
  const solanaCountLoading = false;

  const [allProjects, setAllProjects] = useState<ProjectDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const t = useTranslations("Marketplace");

  useEffect(() => {
    console.log("🟡 [MARKETPLACE] Project data update effect triggered");
    console.log("🟡 [MARKETPLACE] EVM Project:", {
      project: evmProject?.projectURI?.name,
      pending: evmPending,
    });
    // TODO: Re-enable when Solana hooks are implemented
    // console.log("🟡 [MARKETPLACE] Solana Project:", {
    //   project: solanaProject?.projectURI?.name,
    //   pending: solanaPending,
    // });
    console.log("🟡 [MARKETPLACE] Solana Project Count:", {
      count: solanaProjectCount,
      loading: solanaCountLoading,
    });

    const projects: ProjectDetails[] = [];

    // Add EVM project if available
    if (evmProject) {
      console.log(
        "🟢 [MARKETPLACE] Adding EVM project to display:",
        evmProject.projectURI?.name
      );
      projects.push(evmProject);
    }

    // TODO: Add Solana project when simplified hooks are implemented
    // Add Solana project if available (convert SolanaProjectDetails to ProjectDetails)
    // if (solanaProject) {
    //   console.log(
    //     "🟢 [MARKETPLACE] Adding Solana project to display:",
    //     solanaProject.projectURI?.name
    //   );
    //   const solanaAsProjectDetails: ProjectDetails = {
    //     ...solanaProject,
    //     // Ensure compatibility with ProjectDetails interface
    //     projectRemainingTokens: BigInt(solanaProject.projectRemainingTokens),
    //     // Add missing properties from ProjectDetails that aren't in SolanaProjectDetails
    //     projectPrice: solanaProject.projectPrice,
    //     projectTotalSupply: solanaProject.projectTotalSupply,
    //     projectSales: solanaProject.projectSales,
    //     projectProfit: solanaProject.projectProfit,
    //   };
    //   projects.push(solanaAsProjectDetails);
    // }

    console.log(
      `🟢 [MARKETPLACE] Total projects to display: ${projects.length}`
    );
    setAllProjects(projects);
    setIsLoading(evmPending || solanaPending || solanaCountLoading);
  }, [
    evmProject,
    evmPending,
    solanaProject,
    solanaPending,
    solanaProjectCount,
    solanaCountLoading,
  ]);

  const carouselItems = [
    ...allProjects.map((project, index) => (
      <MarketplaceHomeCard
        key={`${project.chain}-${project.projectId || index}`}
        data={project}
      />
    )),
    <TemporaryComingSoonCard key="coming-soon" />,
  ];

  console.log(
    "🟡 [MARKETPLACE] Rendering with carousel items count:",
    carouselItems.length
  );

  return (
    <motion.div
      className="flex flex-col items-start justify-start gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 1 }}
    >
      <h1 className="font-sen text-3xl font-bold text-primary dark:text-light lg:text-4xl">
        {t("availableProjects")}
      </h1>

      {/* Debug Info */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm">
        <h3 className="font-bold mb-2">🔍 Debug Info:</h3>
        <p>
          EVM Projects: {evmProject ? "1 found" : "0 found"} (Loading:{" "}
          {evmPending ? "Yes" : "No"})
        </p>
        <p>
          Solana Projects: {solanaProject ? "1 found" : "0 found"} (Loading:{" "}
          {solanaPending ? "Yes" : "No"})
        </p>
        <p>
          Total Solana Projects Available: {solanaProjectCount} (Loading:{" "}
          {solanaCountLoading ? "Yes" : "No"})
        </p>
        <p>Total Projects Displaying: {allProjects.length}</p>
      </div>

      <div className="flex w-full items-start justify-center gap-6 lg:justify-start">
        {!isLoading && carouselItems.length > 1 ? (
          <Carousel
            removePaddings
            showPagination={false}
            items={carouselItems}
          />
        ) : isLoading ? (
          <CardSkeletonLoader />
        ) : (
          <div className="text-center p-10">
            <h2 className="text-xl font-bold">No projects found</h2>
            <p>Check the browser console for debugging information</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
