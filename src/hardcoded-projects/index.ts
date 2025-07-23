import { SupportedChain } from "@/utils/types/shared/project";
import * as PradoProject from "./prado";
import * as XtremoProject from "./xtremo";
import PradoDescription from "./prado/PradoDescription";
import XtremoDescription from "./xtremo/XtremoDescription";

// Project data interface
export interface ProjectData {
  name: string;
  media: string[];
  descriptionImages: string[];
  fallbackImage: string;
  DescriptionComponent: React.ComponentType<any>;
  details?: {
    investmentType?: string;
    category?: string;
    subcategory?: string;
    location?: string;
  };
}

// Get project data based on chain
export function getProjectDataByChain(chain: SupportedChain): ProjectData {
  switch (chain) {
    case "polygon":
      return {
        name: PradoProject.PRADO_PROJECT_NAME,
        media: PradoProject.PRADO_PROJECT_MEDIA,
        descriptionImages: PradoProject.PRADO_PROJECT_DESCRIPTION_IMAGES,
        fallbackImage: PradoProject.PRADO_PROJECT_FALLBACK_IMAGE,
        DescriptionComponent: PradoDescription,
      };
    case "solana":
      return {
        name: XtremoProject.XTREMO_PROJECT_NAME,
        media: XtremoProject.XTREMO_PROJECT_MEDIA,
        descriptionImages: XtremoProject.XTREMO_PROJECT_DESCRIPTION_IMAGES,
        fallbackImage: XtremoProject.XTREMO_PROJECT_FALLBACK_IMAGE,
        DescriptionComponent: XtremoDescription,
        details: XtremoProject.XTREMO_PROJECT_DETAILS,
      };
    default:
      // Default to Prado for unknown chains
      return {
        name: PradoProject.PRADO_PROJECT_NAME,
        media: PradoProject.PRADO_PROJECT_MEDIA,
        descriptionImages: PradoProject.PRADO_PROJECT_DESCRIPTION_IMAGES,
        fallbackImage: PradoProject.PRADO_PROJECT_FALLBACK_IMAGE,
        DescriptionComponent: PradoDescription,
      };
  }
}

// Export individual projects for direct access if needed
export { PradoProject, XtremoProject };
export { PradoDescription, XtremoDescription };