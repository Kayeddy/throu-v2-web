/**
 * Solana Blockchain Hooks
 *
 * Exports all Solana-related hooks for real estate investment platform.
 * Uses Reown AppKit Solana adapter following 2025 best practices.
 */

// Investment hooks
export { usePurchaseTransaction } from "./investments/usePurchaseTransaction";
// Note: No approval transaction needed for Solana - it's handled atomically in the purchase transaction

// User hooks
export { default as useUserBalance } from "./user/useUserBalance";
export { default as useInvestorInfo } from "./user/useInvestorInfo";

// Project hooks
export { useGetProject } from "./projects/useProject";
// TODO: Add useProjectCollection once implemented
