"use client";

import { calculateBarPercentage, generateProjectUrl } from "@/lib/utils";
import { Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { BlurImage } from "./blur-image";
import ProjectAttributesContainer from "./project-attributes-boxes-container";
import { SlLocationPin as LocationIcon } from "react-icons/sl";
import { FaRegBookmark as BookmarkIcon } from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ProjectDetails,
  normalizeProjectForUI,
  isEVMProject,
  isSolanaProject,
} from "@/utils/types/shared/project";
import { useProjectMediaByChain, useProjectNameByChain, useProjectDescriptionKeyByChain, useProjectCategoryByChain } from "@/hooks/blockchain/useProjectDataByChain";
import ChainIndicator from "./chain-indicator";

interface MarketplaceHomeProjectCardProps {
  data: ProjectDetails;
  className?: string;
  onInvest?: (projectId: string | number) => void;
  showChainIndicator?: boolean;
}

export default function MarketplaceHomeProjectCard({
  data,
  className = "",
  onInvest,
  showChainIndicator = true,
}: MarketplaceHomeProjectCardProps) {
  const t = useTranslations("HomePage.Showcase");
  const t1 = useTranslations(
    "Marketplace.project.projectDetails.projectDescriptionTab"
  );
  const router = useRouter();

  // Normalize the project data for consistent UI rendering
  let normalizedData = normalizeProjectForUI(data);
  // TEMP: Force available for Solana Project 0
  if (normalizedData.projectId === "0" || normalizedData.projectId === 0) {
    normalizedData = { ...normalizedData, projectActive: true };
  }
  
  // Get dynamic project media, name, description, and category based on chain
  const projectMedia = useProjectMediaByChain(data.chain);
  const projectName = useProjectNameByChain(data.chain);
  const descriptionKey = useProjectDescriptionKeyByChain(data.chain);
  const projectCategory = useProjectCategoryByChain(data.chain);

  // Format currency based on chain
  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return "0";

    if (isEVMProject(normalizedData)) {
      return `${amount.toFixed(4)} MATIC`;
    } else if (isSolanaProject(normalizedData)) {
      return `${amount.toFixed(4)} SOL`;
    }
    return amount.toString();
  };

  const projectAttributes = {
    tokens: normalizedData?.projectTotalSupply,
    value: `$${normalizedData?.projectPrice}`,
    total: `$${
      normalizedData?.projectPrice && normalizedData?.projectTotalSupply
        ? normalizedData?.projectTotalSupply * normalizedData?.projectPrice
        : 0
    }`,
    APY: "23%",
  };

  const projectCompletionPercentage = () => {
    if (
      normalizedData?.projectRemainingTokens !== undefined &&
      normalizedData?.projectTotalSupply
    ) {
      const remainingTokens =
        typeof normalizedData.projectRemainingTokens === "bigint"
          ? Number(normalizedData.projectRemainingTokens)
          : normalizedData.projectRemainingTokens;
      return calculateBarPercentage(
        normalizedData.projectTotalSupply,
        remainingTokens
      );
    }
    return 0;
  };

  const locale = useLocale();

  // Handle redirection to the project page using both the name and ID in the URL with network support
  const handleInvestClick = () => {
    if (onInvest && normalizedData.projectId) {
      onInvest(normalizedData.projectId);
    } else {
      const projectUrl = generateProjectUrl(normalizedData, locale);
      router.push(projectUrl);
    }
  };

  // Get project image
  const projectImage =
    projectMedia[0] ||
    normalizedData.projectURI?.image ||
    "/images/default-project.jpg";

  return (
    normalizedData && (
      <motion.div
        className={`relative flex h-[70vh] max-h-[500px] w-[90vw] flex-col items-start justify-start overflow-hidden rounded-md bg-light/5 shadow-project-section-card-custom dark:bg-dark/10 lg:h-[70vh] lg:max-h-[600px] lg:min-h-[500px] lg:w-80 ${className}`}
      >
        <div className="relative h-[50%] min-h-[40%] w-full">
          <div className="absolute top-3 z-10 flex w-full flex-row items-center justify-between px-3">
            <Chip
              radius="sm"
              size="sm"
              className="bg-quaternary font-jakarta text-light"
            >
              {projectCategory}
            </Chip>

            {/* Chain indicator */}
            {showChainIndicator && (
              <ChainIndicator
                chain={normalizedData.chain}
                variant="compact"
                className="backdrop-blur-sm"
              />
            )}

            {/* <Chip
              radius="sm"
              size="md"
              className="cursor-pointer bg-black/30 text-white backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-105"
            >
              <BookmarkIcon />
            </Chip> */}
          </div>
          <BlurImage
            src={projectImage}
            alt={projectName ?? "Project-card-image"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="h-auto w-auto object-cover"
          />
        </div>

        <div className="relative flex h-full w-full flex-col items-start justify-between p-3">
          <h1 className="font-sen text-xl font-semibold text-primary dark:text-white">
            {projectName ?? "Unnamed Project"}
          </h1>

          <div className="flex w-full flex-col items-start justify-start gap-1">
            <p className="font-jakarta text-sm font-semibold text-secondary">
              {t("project_complete", {
                percentage: projectCompletionPercentage(),
              })}
            </p>
            <span
              className="h-1.5 rounded-[10px] bg-secondary"
              style={{
                width: `${projectCompletionPercentage()}%`,
                maxWidth: "100%",
              }}
            ></span>
          </div>

          <ProjectAttributesContainer
            items={projectAttributes}
            layout="horizontal"
            isTranslucent
          />

          <p className="w-[95%] truncate font-jakarta text-base font-extralight text-primary dark:text-white">
            {t1(descriptionKey)}
          </p>

          <span className="text-jakarta flex flex-row items-center justify-start gap-2 text-base text-primary dark:text-white">
            <LocationIcon />
            {normalizedData.projectURI?.attributes?.find(
              (attr) => attr.trait_type === "Location"
            )?.value ||
              normalizedData.projectURI?.attributes?.[0]?.value ||
              t("no_location_available")}
          </span>

          <Button
            onClick={handleInvestClick}
            variant="bordered"
            size="lg"
            className="w-full rounded-none border-secondary bg-secondary font-sen text-lg font-bold text-white hover:bg-transparent hover:text-secondary lg:text-base"
            isDisabled={!normalizedData.projectActive}
          >
            {normalizedData.projectActive ? t("invest_button") : "Unavailable"}
          </Button>
        </div>
      </motion.div>
    )
  );
}
