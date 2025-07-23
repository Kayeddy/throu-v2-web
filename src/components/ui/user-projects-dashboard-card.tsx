"use client";

import { slugify } from "@/lib/utils";
import { Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { BlurImage } from "./blur-image";
import { FaRegBookmark as BookmarkIcon } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useProjectNameByChain, useProjectMediaByChain, useProjectCategoryByChain } from "@/hooks/blockchain/useProjectDataByChain";
import { useSolanaWithdrawInvestor } from "@/hooks/blockchain";
import { ProjectDetails } from "@/utils/types/shared/project";
import { Button } from "@heroui/button";
import { useState, useEffect } from "react";
import ChainIndicator from "./chain-indicator";

interface UserDashboardProjectDetails {
  project?: ProjectDetails;
  investorInfo?: any;
  projectName?: string;
  userTokenCount: number;
  userOwnershipPercentage: number | string;
  projectTokenPrice: number;
}

export default function UserProjectDashboardCard({
  project,
  investorInfo,
  projectName,
  userTokenCount,
  projectTokenPrice,
  userOwnershipPercentage,
}: UserDashboardProjectDetails) {
  // Get dynamic project data based on project chain or fallback to polygon
  const projectChain = project?.chain || "polygon";
  const dynamicProjectName = useProjectNameByChain(projectChain);
  const projectMedia = useProjectMediaByChain(projectChain);
  const projectCategory = useProjectCategoryByChain(projectChain);
  
  // Use hardcoded project name like in marketplace cards
  const displayName = dynamicProjectName;
  const displayMedia = project?.projectMedia?.[0] || projectMedia[0];
  
  const getProjectPageRedirectionUrl = () => {
    const nameForSlug = displayName || "project";
    const projectNameSlug = slugify(nameForSlug);
    const id = project?.projectId || 0;
    const chain = projectChain;
    return `/marketplace/projects/${chain}/${projectNameSlug}-${id}`;
  };

  // Determine if project is finalized (for polygon projects that are no longer active)
  const isProjectFinalized = project?.chain === "polygon" && project?.projectActive === false;

  // Withdraw functionality for Solana projects
  const { executeWithdraw, isLoading: isWithdrawing, error: withdrawError } = useSolanaWithdrawInvestor();
  const [showWithdrawResult, setShowWithdrawResult] = useState(false);
  const [showError, setShowError] = useState(false);

  // Auto-clear error after 5 seconds when it appears
  useEffect(() => {
    if (withdrawError) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [withdrawError]);

  const handleWithdraw = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    
    if (!project || project.chain !== "solana") return;
    
    // Clear any previous errors
    setShowError(false);
    
    try {
      const signature = await executeWithdraw(String(project.projectId));
      if (signature) {
        setShowWithdrawResult(true);
        // Auto-hide result after 3 seconds
        setTimeout(() => setShowWithdrawResult(false), 3000);
      }
    } catch (error) {
      console.error("Withdraw failed:", error);
    }
  };

  const t = useTranslations("Dashboard");
  const t3 = useTranslations("Shared.projectBaseAttributes");
  const tWithdraw = useTranslations("Dashboard.tabs.portfolio.withdraw");

  return (
    <motion.div>
      <Link
        href={getProjectPageRedirectionUrl()}
        className="relative flex h-[40vh] min-h-[420px] w-[20vw] min-w-[300px] items-center justify-center overflow-hidden rounded-md"
      >
        <>
          <div className="relative h-full w-full rounded-md">
            <div className="absolute top-3 z-10 flex w-full flex-row items-center justify-between px-3">
              <Chip
                radius="sm"
                size="sm"
                className="bg-quaternary font-jakarta text-light"
              >
                {projectCategory}
              </Chip>

              {/* Chain indicator */}
              <ChainIndicator
                chain={projectChain}
                variant="compact"
              />
            </div>
            <BlurImage
              src={displayMedia}
              alt={displayName}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="h-auto w-auto rounded-md object-cover"
            />
          </div>

          <div className="absolute bottom-0 flex h-32 w-full flex-col items-center justify-center bg-light/90 p-3 backdrop-blur-sm dark:bg-dark/80">
            <h1 className="font-sen text-lg font-bold text-primary dark:text-white mb-1">
              {displayName}
            </h1>

            <div className="flex flex-row items-center justify-center gap-2 font-jakarta mb-1">
              <p className="text-sm font-bold text-primary dark:text-light">{`${userTokenCount} ${t3(
                "tokens"
              )}`}</p>
              <p className="text-tiny text-minimal">
                =${userTokenCount * projectTokenPrice} USDT
              </p>
            </div>

            <div className="flex flex-row items-center justify-center gap-2 font-jakarta text-sm font-bold text-secondary mb-2">
              <p className="text">
                {isProjectFinalized ? "Project finalized" : t("tabs.portfolio.partnerMessage")}
              </p>
              <p>({userOwnershipPercentage}%)</p>
            </div>

            {/* Withdraw button for Solana projects */}
            {project?.chain === "solana" && !isProjectFinalized && (
              <Button
                size="sm"
                color={showError ? "danger" : "secondary"}
                variant="solid"
                isLoading={isWithdrawing}
                isDisabled={isWithdrawing}
                onClick={handleWithdraw}
                className="min-w-20 h-7 text-xs font-medium"
              >
                {showError 
                  ? tWithdraw("tryAgain")
                  : showWithdrawResult 
                    ? `✓ ${tWithdraw("success")}`
                    : isWithdrawing 
                      ? tWithdraw("withdrawing")
                      : tWithdraw("button")
                }
              </Button>
            )}

            {/* Show error if withdraw fails - only when showError is true */}
            {showError && withdrawError && (
              <p className="text-xs text-red-500 mt-1 text-center">
                {tWithdraw("error")}
              </p>
            )}
          </div>
        </>
      </Link>
    </motion.div>
  );
}
