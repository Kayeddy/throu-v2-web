interface ProjectAttribute {
  trait_type: string;
  value: string;
}

interface ProjectURI {
  attributes: ProjectAttribute[];
  description: string;
  image: string;
  name: string;
}

interface ProjectDetails {
  crowdfundingPhase?: any; // This seems to be undefined in the object, so using any for now
  isProjectPassive?: boolean;
  projectActive?: boolean;
  projectHolders?: string[]; // Array of holder addresses
  projectId?: number;
  projectMedia?: string[]; // Array of media file paths
  projectPrice?: number;
  projectProfit?: number;
  projectRemainingTokens?: number | bigint;
  projectSales?: number;
  projectTotalSupply?: number;
  projectURI?: ProjectURI | null;
}
