/**
 * Solana Project Hooks Barrel Export
 *
 * Exports all project-related hooks for Solana blockchain interactions.
 * Following 2025 module organization patterns.
 */

// Wallet provider hooks for multi-wallet compatibility
export { useWalletProvider, useAnchorWallet } from "./useWalletProvider";
export { usePriorityFees } from "./usePriorityFees";

// Project data hooks
export { useGetSolanaProject } from "./useGetSolanaProject";

// Investor data hooks
export { useSolanaInvestorInfo } from "./useSolanaInvestorInfo";

// Investment transaction hooks
export { useSolanaInvestment } from "./useSolanaInvestment";
export { useSolanaWithdrawInvestor } from "./useSolanaWithdrawInvestor";

// Note: usePurchaseTransaction is already exported from EVM hooks
// Removed legacy export to avoid ambiguity
