/**
 * Blockchain Hooks Index
 * 
 * Exports all blockchain-related hooks following Reown AppKit patterns.
 * Provides clean, direct access to wallet connection, transaction, and project functionality.
 */

// Re-export Reown AppKit hooks directly (no abstractions)
export {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitBalance,
  useAppKitConnection,
  useAppKitState,
  useAppKitTheme,
  useAppKitEvents,
  useDisconnect,
} from "@reown/appkit/react";

// Project-related hooks
export {
  useProject,
  useProjects,
  useCanInvest,
  useProjectStats,
} from "./projects";

// Transaction hooks
export {
  useInvestTransaction,
  useApprovalTransaction,
  useContractTransaction,
  usePurchaseTransaction,
} from "./transactions";

// Wallet and user hooks
export {
  useWalletConnection,
  useWalletBalance,
  useWalletInfo,
  useMultiChainWallet,
  useInvestorInfo,
  useUserBalance,
} from "./wallet";

// Re-export wagmi hooks that are commonly used with Reown
export {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSimulateContract,
  useAccount,
  useChainId,
  usePublicClient,
  useWalletClient,
} from "wagmi";