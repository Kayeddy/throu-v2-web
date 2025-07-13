// Chain-specific enums
export type SupportedChain = "polygon" | "solana";

// Base project attribute interface
export interface ProjectAttribute {
  trait_type: string;
  value: string;
}

// Base project URI interface
export interface ProjectURI {
  attributes: ProjectAttribute[];
  description: string;
  image: string;
  name: string;
}

// Chain-specific project details
export interface ChainSpecificProjectDetails {
  // EVM specific properties
  crowdfundingPhase?: any;

  // Solana specific properties
  programAddress?: string;
  projectAddress?: string;
  isPasiveProject?: boolean;

  // Common chain identifier
  chain?: SupportedChain;
}

// Unified project details interface that works for both chains
export interface ProjectDetails extends ChainSpecificProjectDetails {
  // Core project properties (common to both chains)
  projectId?: number | string;
  projectActive?: boolean;
  projectPrice?: number;
  projectTotalSupply?: number;
  projectRemainingTokens?: number | bigint;
  projectSales?: number;
  projectProfit?: number;
  projectURI?: ProjectURI | null;
  projectHolders?: string[];
  projectMedia?: string[];

  // EVM specific properties (optional for Solana)
  crowdfundingPhase?: any;
  isProjectPassive?: boolean;

  // Solana specific properties (optional for EVM)
  programAddress?: string;
  projectAddress?: string;

  // Chain identifier (required for dual-chain support)
  chain: SupportedChain;
}

// Chain-specific project fetching interfaces
export interface EVMProjectDetails extends ProjectDetails {
  chain: "polygon";
  projectId: number;
  projectRemainingTokens: number | bigint;
  crowdfundingPhase?: any;
}

export interface SolanaProjectDetails extends ProjectDetails {
  chain: "solana";
  projectId: string;
  projectRemainingTokens: number;
  programAddress: string;
  projectAddress: string;
  isPasiveProject?: boolean;
}

// Unified project list response
export interface ProjectListResponse {
  projects: ProjectDetails[];
  totalCount: number;
  hasMore: boolean;
  chain?: SupportedChain; // Optional filter by chain
}

// Transaction types for both chains
export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  transactionSignature?: string; // Solana uses signatures
  error?: string;
  chain: SupportedChain;
}

// Investment transaction parameters
export interface InvestmentTransactionParams {
  projectId: string | number;
  amount: number; // Amount in native currency (ETH/SOL)
  investorAddress: string;
  chain: SupportedChain;
}

// Chain-specific error types
export interface ChainError {
  message: string;
  code?: string | number;
  chain: SupportedChain;
  transactionHash?: string;
  transactionSignature?: string;
}

// Utility type guards for chain-specific types
export const isEVMProject = (
  project: ProjectDetails
): project is EVMProjectDetails => {
  return project.chain === "polygon";
};

export const isSolanaProject = (
  project: ProjectDetails
): project is SolanaProjectDetails => {
  return project.chain === "solana";
};

// Helper function to normalize project data for UI components
export const normalizeProjectForUI = (
  project: ProjectDetails
): ProjectDetails => {
  const normalizedId = project.projectId
    ? String(project.projectId)
    : "unknown";

  return {
    ...project,
    projectId: normalizedId,
    projectRemainingTokens:
      typeof project.projectRemainingTokens === "bigint"
        ? Number(project.projectRemainingTokens)
        : project.projectRemainingTokens,
    projectURI: project.projectURI || {
      name: `Project ${normalizedId}`,
      description: "Real estate investment project",
      image: "",
      attributes: [
        { trait_type: "Chain", value: project.chain },
        {
          trait_type: "Status",
          value: project.projectActive ? "Active" : "Inactive",
        },
      ],
    },
  };
};

// Chain-specific project card props
export interface ProjectCardProps {
  data: ProjectDetails;
  onInvest?: (projectId: string | number) => void;
  showChainIndicator?: boolean;
  compact?: boolean;
}

// Export legacy interface for backwards compatibility
export interface LegacyProjectDetails extends ProjectDetails {
  // Maintain backwards compatibility with existing code
  id?: string | number;
  name?: string;
  description?: string;
}

export default ProjectDetails;
