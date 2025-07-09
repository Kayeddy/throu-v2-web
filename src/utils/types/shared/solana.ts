import { PublicKey } from '@solana/web3.js';

/**
 * Real Estate Investment Program Types
 * Based on IDL: program_real_state.json
 * Program ID: 83yNQCtYj46dry6NadX5vY8pSFJxmqBDRZJA46UhjkGv
 */

// Program ID constant
export const PROGRAM_ID = new PublicKey('83yNQCtYj46dry6NadX5vY8pSFJxmqBDRZJA46UhjkGv');

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
  PROJECT: 'project',
  INVESTOR: 'investor',
  MINT_PROJECT: 'mint_project',
  TOKEN_ACCOUNT: 'token_account',
} as const;

// Helper functions for PDA generation
export const getProjectPDA = (projectId: bigint): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(PDA_SEEDS.PROJECT),
      Buffer.from(projectId.toString()),
    ],
    PROGRAM_ID
  );
};

export const getInvestorPDA = (projectId: bigint, investor: PublicKey): [PublicKey, number] => {
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
    [
      Buffer.from(PDA_SEEDS.MINT_PROJECT),
      Buffer.from(projectId.toString()),
    ],
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