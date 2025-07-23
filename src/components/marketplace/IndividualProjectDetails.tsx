"use client";

import ProjectHeader from "@/sections/marketplace/project/ProjectHeader";
import ProjectTabsHandler from "@/sections/marketplace/project/ProjectTabsHandler";
import { useGetProject } from "@/hooks/blockchain/evm";
import { useGetSolanaProject } from "@/hooks/blockchain/solana";
import { useEffect, useState } from "react";
import { Card, Divider, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { ProjectDetails, SupportedChain } from "@/utils/types/shared/project";
import { useProjectMediaByChain } from "@/hooks/blockchain/useProjectDataByChain";

// Updated ProjectPageParams interface
export interface ProjectPageParams {
  network: string;
  projectSlug: string;
  locale: string;
}

const CardSkeletonLoader = () => {
  return (
    <Card className="relative flex h-full w-full flex-col items-start justify-start overflow-hidden rounded-md shadow-project-section-card-custom">
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


export default function IndividualProjectDetails({
  params,
}: {
  params: ProjectPageParams;
}) {
  const [projectData, setProjectData] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Determine network type and extract project ID
  const network = params.network as SupportedChain;
  const projectId = params.projectSlug.split("-").pop() || "0";
  
  // Get dynamic project media based on chain
  const projectMedia = useProjectMediaByChain(network);

  // Hooks for different networks
  const {
    project: evmProject,
    error: evmError,
    isPending: evmPending,
  } = useGetProject(network === "polygon" ? parseInt(projectId) : 0);

  const {
    data: solanaProject,
    error: solanaError,
    isPending: solanaPending,
  } = useGetSolanaProject(network === "solana" ? projectId : "");

  // Update project data based on network
  useEffect(() => {
    console.log("🔍 [PROJECT DETAILS] Network:", network);
    console.log("🔍 [PROJECT DETAILS] Project ID:", projectId);

    if (network === "polygon") {
      setIsLoading(evmPending);
      setError(evmError);
      if (evmProject) {
        console.log("✅ [PROJECT DETAILS] EVM Project loaded:", evmProject);
        setProjectData(evmProject);
      }
    } else if (network === "solana") {
      setIsLoading(solanaPending);
      setError(solanaError);
      if (solanaProject) {
        console.log(
          "✅ [PROJECT DETAILS] Solana Project loaded:",
          solanaProject
        );
        setProjectData(solanaProject);
      }
    } else {
      setIsLoading(false);
      setError(new Error(`Unsupported network: ${network}`));
    }
  }, [
    network,
    projectId,
    evmProject,
    evmPending,
    evmError,
    solanaProject,
    solanaPending,
    solanaError,
  ]);

  if (error) {
    return (
      <motion.div
        className="flex h-full w-full items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 1 }}
      >
        <div className="text-center p-10">
          <h2 className="text-xl font-bold text-red-500 mb-4">
            Project Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error.message || "The requested project could not be found."}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex h-full w-full items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
    >
      {isLoading ? (
        <CardSkeletonLoader />
      ) : (
        <div className="relative w-full">
          <ProjectHeader
            projectDetails={projectData}
            projectMedia={projectMedia}
          />
          <Divider className="my-6 h-[0.5px] w-full bg-minimal dark:bg-light" />
          <ProjectTabsHandler projectDetails={projectData} />
        </div>
      )}
    </motion.div>
  );
}
