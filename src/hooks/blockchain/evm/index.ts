/**
 * EVM Blockchain Hooks Barrel Export
 *
 * Exports all EVM-related blockchain interaction hooks.
 * Following 2025 module organization patterns.
 */

// Project data hooks
export { useGetProject } from "./useProject";

// Investor data hooks
export { useGetInvestorInfo } from "./useGetInvestorInfo";

// Investment transaction hooks
export { default as useApprovalTransaction } from "./useApprovalTransaction";
export { usePurchaseTransaction } from "./usePurchaseTransaction";
