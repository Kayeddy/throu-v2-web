"use client";

import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { useAccount, useChainId } from "wagmi";

// Hook for unified chain detection
export function useReownChain() {
  const { address, isConnected, caipAddress } = useAppKitAccount();
  const { chainId, caipNetworkId } = useAppKitNetwork();
  const wagmiChainId = useChainId();
  const { isConnected: wagmiConnected } = useAccount();

  // Determine if we're on Solana or EVM
  const isSolana =
    caipNetworkId?.includes("solana") || caipAddress?.includes("solana");
  const isEVM = !isSolana && (wagmiConnected || chainId);

  // Get appropriate chain ID
  const currentChainId = isSolana ? caipNetworkId : chainId || wagmiChainId;

  // Get chain type
  const chainType = isSolana ? "solana" : "evm";

  return {
    address,
    isConnected,
    chainId: currentChainId,
    chainType,
    isSolana,
    isEVM,
    caipAddress,
    caipNetworkId,
  };
}

// Hook for wallet balance (unified)
export function useReownBalance() {
  const { chainType, address, isConnected } = useReownChain();

  // This would typically integrate with balance fetching logic
  // For now, returning the structure
  return {
    balance: null,
    isLoading: false,
    error: null,
    refetch: () => {},
    chainType,
    address,
    isConnected,
  };
}

// Hook for transaction handling
export function useReownTransactions() {
  const { chainType, isConnected } = useReownChain();

  const sendTransaction = async (params: any) => {
    if (!isConnected) {
      throw new Error("Wallet not connected");
    }

    if (chainType === "solana") {
      // Handle Solana transaction
      console.log("Sending Solana transaction:", params);
      // Implementation would go here
    } else {
      // Handle EVM transaction
      console.log("Sending EVM transaction:", params);
      // Implementation would go here
    }
  };

  return {
    sendTransaction,
    chainType,
    isConnected,
  };
}
