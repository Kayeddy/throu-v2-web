import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SupportedChain } from "@/utils/types/shared/project";
import { getProjectDataByChain, ProjectData } from "@/hardcoded-projects";

/**
 * Hook that returns project data based on the current chain
 * Can be used with URL params or explicit chain parameter
 */
export function useProjectDataByChain(explicitChain?: SupportedChain): ProjectData {
  const params = useParams();
  
  const currentChain = useMemo(() => {
    // Use explicit chain if provided
    if (explicitChain) {
      return explicitChain;
    }
    
    // Try to get chain from URL params
    if (params?.network) {
      return params.network as SupportedChain;
    }
    
    // Default to polygon if no chain is detected
    return "polygon" as SupportedChain;
  }, [explicitChain, params?.network]);

  const projectData = useMemo(() => {
    return getProjectDataByChain(currentChain);
  }, [currentChain]);

  return projectData;
}

/**
 * Hook that returns only the project name based on chain
 */
export function useProjectNameByChain(explicitChain?: SupportedChain): string {
  const projectData = useProjectDataByChain(explicitChain);
  return projectData.name;
}

/**
 * Hook that returns only the project media based on chain
 */
export function useProjectMediaByChain(explicitChain?: SupportedChain): string[] {
  const projectData = useProjectDataByChain(explicitChain);
  return projectData.media;
}

/**
 * Hook that returns only the project description images based on chain
 */
export function useProjectDescriptionImagesByChain(explicitChain?: SupportedChain): string[] {
  const projectData = useProjectDataByChain(explicitChain);
  return projectData.descriptionImages;
}

/**
 * Hook that returns the appropriate project description key for translations based on chain
 */
export function useProjectDescriptionKeyByChain(explicitChain?: SupportedChain): string {
  const currentChain = explicitChain || "polygon";
  
  // Return the appropriate translation key based on chain
  switch (currentChain) {
    case "polygon":
      return "description.paragraph1"; // Prado description
    case "solana":
      return "description.xtremo.paragraph1"; // Xtremo description
    default:
      return "description.paragraph1";
  }
}

/**
 * Hook that returns the translated project category based on chain
 */
export function useProjectCategoryByChain(explicitChain?: SupportedChain): string {
  const projectData = useProjectDataByChain(explicitChain);
  const tHardcoded = useTranslations("hardcoded.projects");
  
  // For Solana/Xtremo project, use the hardcoded translated category
  if (projectData.details?.category === "tourism") {
    return tHardcoded("xtremo.category.tourism");
  }
  
  // Default fallback for other chains
  return explicitChain === "solana" ? "Real Estate" : "Gastronomic";
}