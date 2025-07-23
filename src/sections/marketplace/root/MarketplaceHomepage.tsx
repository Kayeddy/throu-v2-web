"use client";

import React from "react";
import { motion } from "framer-motion";
import MarketplaceHomeCard from "@/components/ui/marketplace-home-project-card";
import { useGetProject } from "@/hooks/blockchain/evm";
import { useGetSolanaProject } from "@/hooks/blockchain/solana";
import { Card, Skeleton } from "@heroui/react";
import { useTranslations } from "next-intl";
import { Carousel } from "@/components/ui/cards-carousel";
import { ProjectDetails } from "@/utils/types/shared/project";
import { useEffect, useState, useMemo, useRef } from "react";

const TemporaryComingSoonCard = React.memo(() => {
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
});

const CardSkeletonLoader = React.memo(() => {
  return (
    <div className="flex w-full gap-6 overflow-x-auto px-6 lg:px-0">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className="relative flex h-[70vh] max-h-[500px] w-[90vw] flex-col items-start justify-start rounded-md bg-light/5 shadow-project-section-card-custom dark:bg-dark/10 lg:h-[70vh] lg:max-h-[600px] lg:min-h-[500px] lg:w-80"
        >
          <Skeleton className="h-full w-full rounded-md" />
        </Card>
      ))}
    </div>
  );
});

function MarketplaceHomepage() {
  // console.log("🚀 [MARKETPLACE] MarketplaceHomepage rendering"); // Temporarily disabled

  // EVM Project Fetch
  const evmProjectId = 0;
  const { project: evmProject, isPending: evmPending } =
    useGetProject(evmProjectId);

  // Solana Project Fetch
  const solanaProjectId = "0"; // Solana projects use string IDs
  const { data: solanaProject, isPending: solanaPending } =
    useGetSolanaProject(solanaProjectId);

  const [allProjects, setAllProjects] = useState<ProjectDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const t = useTranslations("Marketplace");

  // Debug: Track what causes re-renders (with proper dependencies)
  const renderCount = useRef(0);
  const prevProps = useRef({
    evmProject,
    evmPending,
    solanaProject,
    solanaPending,
  });

  useEffect(() => {
    renderCount.current += 1;
    const current = { evmProject, evmPending, solanaProject, solanaPending };

    console.log(`🔍 [MARKETPLACE] Render #${renderCount.current}`);

    // Check what changed
    if (prevProps.current.evmProject !== current.evmProject) {
      console.log("🔄 [MARKETPLACE] EVM Project changed");
    }
    if (prevProps.current.evmPending !== current.evmPending) {
      console.log("🔄 [MARKETPLACE] EVM Pending changed");
    }
    if (prevProps.current.solanaProject !== current.solanaProject) {
      console.log("🔄 [MARKETPLACE] Solana Project changed");
    }
    if (prevProps.current.solanaPending !== current.solanaPending) {
      console.log("🔄 [MARKETPLACE] Solana Pending changed");
    }

    prevProps.current = current;
  }, [evmProject, evmPending, solanaProject, solanaPending]);

  useEffect(() => {
    console.log("🟡 [MARKETPLACE] Project data update effect triggered");
    console.log("🟡 [MARKETPLACE] EVM Project:", {
      project: evmProject?.projectURI?.name,
      pending: evmPending,
    });
    console.log("🟡 [MARKETPLACE] Solana Project:", {
      project: solanaProject?.projectURI?.name,
      pending: solanaPending,
      isActive: solanaProject?.projectActive,
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

    // Add Solana project if available (show regardless of active status for testnet)
    if (solanaProject) {
      console.log(
        "🟢 [MARKETPLACE] Adding Solana project to display:",
        solanaProject.projectURI?.name || "Unnamed Project",
        "- Active:",
        solanaProject.projectActive
      );
      projects.push(solanaProject);
    }

    console.log(
      `🟢 [MARKETPLACE] Total projects to display: ${projects.length}`
    );

    // Only update projects if they actually changed
    setAllProjects((prevProjects) => {
      const projectsChanged =
        prevProjects.length !== projects.length ||
        prevProjects.some((prevProject, index) => {
          const currentProject = projects[index];
          return (
            !currentProject ||
            prevProject.projectId !== currentProject.projectId
          );
        });

      if (projectsChanged) {
        console.log("📝 [MARKETPLACE] Projects array updated");
        return projects;
      }
      console.log("♻️ [MARKETPLACE] Projects array unchanged, skipping update");
      return prevProjects;
    });

    // Only update loading state if it actually changed
    const newLoadingState = evmPending || solanaPending;
    setIsLoading((prev) => {
      if (prev !== newLoadingState) {
        console.log(
          `🔄 [MARKETPLACE] Loading state changed: ${prev} → ${newLoadingState}`
        );
        return newLoadingState;
      }
      return prev;
    });
  }, [evmProject, evmPending, solanaProject, solanaPending]);

  const carouselItems = useMemo(
    () => [
      ...allProjects.map((project, index) => (
        <MarketplaceHomeCard
          key={`${project.chain}-${project.projectId || index}`}
          data={project}
        />
      )),
      <TemporaryComingSoonCard key="coming-soon" />,
    ],
    [allProjects]
  );

  // console.log("🟡 [MARKETPLACE] Rendering with carousel items count:", carouselItems.length); // Temporarily disabled

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

export default React.memo(MarketplaceHomepage);
