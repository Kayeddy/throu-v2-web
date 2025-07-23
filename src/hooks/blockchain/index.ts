/**
 * Blockchain Hooks Index
 *
 * Clean barrel exports following Reown AppKit documentation patterns.
 * Provides a single entry point for all blockchain-related hooks.
 *
 * Key Features:
 * - Multi-chain support (EVM + Solana)
 * - Clean AppKit integration
 * - Proper error handling
 * - TypeScript-first approach
 * - Organized by blockchain type (EVM/Solana)
 */

// Core Reown AppKit exports
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

// EVM Blockchain hooks
export * from "./evm";

// Solana Blockchain hooks
export * from "./solana";

// Generic blockchain hooks
export * from "./wallet";

// Project data hooks
export * from "./useProjectDataByChain";

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
