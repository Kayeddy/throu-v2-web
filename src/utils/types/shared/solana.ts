import { PublicKey } from "@solana/web3.js";

/**
 * Real Estate Investment Program Types
 * Based on IDL: program_real_state.json
 *
 * Program IDs:
 * - Mainnet: 8GYVnwsURhjhjDktJ7vNggS7jkgunEyTbpbvHbJxXd8q
 * - Testnet: TBD (to be provided by blockchain developer)
 */

// Network-specific Program IDs
const PROGRAM_IDS = {
  "mainnet-beta": "8GYVnwsURhjhjDktJ7vNggS7jkgunEyTbpbvHbJxXd8q", // Real mainnet contract
  testnet:
    process.env.NEXT_PUBLIC_SOLANA_TESTNET_PROGRAM_ID ||
    "8GYVnwsURhjhjDktJ7vNggS7jkgunEyTbpbvHbJxXd8q", // Fallback to mainnet until testnet is provided
  devnet: "8GYVnwsURhjhjDktJ7vNggS7jkgunEyTbpbvHbJxXd8q", // Fallback to mainnet for development
} as const;

// Get current network from environment or default to mainnet
const getCurrentNetwork = () => {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet-beta";
  return network as keyof typeof PROGRAM_IDS;
};

// Program ID constant - switches based on network
export const PROGRAM_ID = new PublicKey(PROGRAM_IDS[getCurrentNetwork()]);

// Debug logging - only on client side to avoid SSR issues
if (typeof window !== "undefined") {
  console.log(
    "🟡 [SOLANA CONFIG] Using Program ID:",
    PROGRAM_ID.toString(),
    "for network:",
    getCurrentNetwork()
  );
}

// Account Types based on IDL
export interface ProjectAccount {
  projectId: bigint;
  owner: PublicKey;
  tokenSell: PublicKey;
  price: bigint;
  metadataUri: string;
  sharesSold: bigint;
  shares: bigint;
  token: PublicKey;
  feePlatform: bigint;
  feeSale: bigint;
  feeAgent: bigint;
  withdrawFeeActive: bigint;
  withdrawFeePasive: bigint;
  isPasiveProject: boolean;
  isActive: boolean;
  recolected: bigint;
  gains: bigint;
  fees: bigint;
}

export interface InvestorAccount {
  shares: bigint;
  amountWithdrawn: bigint;
  project: PublicKey;
  owner: PublicKey;
}

// Instruction argument types
export interface CreateProjectArgs {
  projectId: bigint;
  price: bigint;
  metadataUri: string;
  shares: bigint;
}

export interface InvestProjectArgs {
  projectId: bigint;
  shares: bigint;
}

export interface WithdrawInvestorArgs {
  projectId: bigint;
}

export interface ActiveProjectArgs {
  projectId: bigint;
  feePlatform: bigint;
  feeSale: bigint;
  feeAgent: bigint;
  withdrawFeeActive: bigint;
  withdrawFeePasive: bigint;
}

export interface ChangePriceAndMintNewArgs {
  projectId: bigint;
  newPrice: bigint;
  newShares: bigint;
}

export interface ClaimSharesArgs {
  projectId: bigint;
}

export interface DepositAdminArgs {
  projectId: bigint;
  amount: bigint;
}

// PDA seed constants
export const PDA_SEEDS = {
  PROJECT: "project",
  INVESTOR: "investor",
  MINT_PROJECT: "mint_project",
  TOKEN_ACCOUNT: "token_account",
} as const;

// Helper functions for PDA generation
export const getProjectPDA = (projectId: bigint): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(PDA_SEEDS.PROJECT), Buffer.from(projectId.toString())],
    PROGRAM_ID
  );
};

export const getInvestorPDA = (
  projectId: bigint,
  investor: PublicKey
): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(PDA_SEEDS.INVESTOR),
      Buffer.from(projectId.toString()),
      investor.toBuffer(),
    ],
    PROGRAM_ID
  );
};

export const getMintProjectPDA = (projectId: bigint): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(PDA_SEEDS.MINT_PROJECT), Buffer.from(projectId.toString())],
    PROGRAM_ID
  );
};

// Error handling types
export type SolanaTransactionError = {
  message: string;
  code?: number;
  logs?: string[];
};

// Hook return types
export interface SolanaTransactionState {
  isPending: boolean;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  transactionSignature: string | null;
}
