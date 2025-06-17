"use client";

import { useCallback, useEffect } from "react";
import { useDualChainStore } from "@/stores/useDualChainStore";
import { ChainType } from "@/lib/chains";

export interface ChainError {
  type: "CONNECTION" | "TRANSACTION" | "NETWORK" | "VALIDATION" | "TIMEOUT";
  message: string;
  chainType: ChainType;
  code?: string | number;
  action?: () => Promise<void>;
}

export const useChainErrorHandler = () => {
  const { lastError, clearError, activeChainType } = useDualChainStore();

  // Parse error messages and provide user-friendly messages
  const parseError = useCallback(
    (error: string, chainType: ChainType): ChainError => {
      // EVM-specific errors
      if (chainType === ChainType.EVM) {
        if (error.includes("User rejected")) {
          return {
            type: "CONNECTION",
            message: "Connection rejected by user",
            chainType,
            code: "USER_REJECTED",
          };
        }
        if (error.includes("Chain")) {
          return {
            type: "NETWORK",
            message: "Please switch to the correct network",
            chainType,
            code: "WRONG_NETWORK",
          };
        }
        if (error.includes("insufficient funds")) {
          return {
            type: "TRANSACTION",
            message: "Insufficient funds for transaction",
            chainType,
            code: "INSUFFICIENT_FUNDS",
          };
        }
      }

      // Solana-specific errors
      if (chainType === ChainType.SOLANA) {
        if (error.includes("WalletNotConnectedError")) {
          return {
            type: "CONNECTION",
            message: "Please connect your Solana wallet",
            chainType,
            code: "WALLET_NOT_CONNECTED",
          };
        }
        if (error.includes("insufficient lamports")) {
          return {
            type: "TRANSACTION",
            message: "Insufficient SOL for transaction",
            chainType,
            code: "INSUFFICIENT_SOL",
          };
        }
        if (error.includes("Phantom")) {
          return {
            type: "CONNECTION",
            message: "Phantom wallet is required for Solana",
            chainType,
            code: "PHANTOM_REQUIRED",
          };
        }
      }

      // Generic errors
      if (error.includes("timeout")) {
        return {
          type: "TIMEOUT",
          message: "Operation timed out. Please try again.",
          chainType,
          code: "TIMEOUT",
        };
      }

      // Default error
      return {
        type: "VALIDATION",
        message: error || "An unknown error occurred",
        chainType,
        code: "UNKNOWN",
      };
    },
    []
  );

  // Get current parsed error
  const currentError = lastError
    ? parseError(lastError, activeChainType)
    : null;

  // Auto-clear errors after a timeout (optional)
  useEffect(() => {
    if (lastError) {
      const timer = setTimeout(() => {
        clearError();
      }, 10000); // Clear after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [lastError, clearError]);

  // Helper functions for common error actions
  const retryConnection = useCallback(async () => {
    clearError();
    // Specific retry logic can be implemented based on error type
  }, [clearError]);

  const switchNetwork = useCallback(async () => {
    clearError();
    // Network switching logic
  }, [clearError]);

  const openWalletInstallation = useCallback(() => {
    if (activeChainType === ChainType.SOLANA) {
      window.open("https://phantom.app/", "_blank");
    } else {
      window.open("https://metamask.io/", "_blank");
    }
  }, [activeChainType]);

  // Get suggested actions based on error type
  const getSuggestedActions = useCallback(
    (error: ChainError) => {
      const actions = [];

      switch (error.code) {
        case "USER_REJECTED":
          actions.push({
            label: "Try Again",
            action: retryConnection,
            primary: true,
          });
          break;

        case "WRONG_NETWORK":
          actions.push({
            label: "Switch Network",
            action: switchNetwork,
            primary: true,
          });
          break;

        case "WALLET_NOT_CONNECTED":
          actions.push({
            label: "Connect Wallet",
            action: retryConnection,
            primary: true,
          });
          break;

        case "PHANTOM_REQUIRED":
          actions.push({
            label: "Install Phantom",
            action: openWalletInstallation,
            primary: true,
          });
          break;

        case "TIMEOUT":
          actions.push({
            label: "Retry",
            action: retryConnection,
            primary: true,
          });
          break;

        default:
          actions.push({
            label: "Dismiss",
            action: clearError,
            primary: false,
          });
      }

      return actions;
    },
    [retryConnection, switchNetwork, openWalletInstallation, clearError]
  );

  return {
    currentError,
    hasError: !!lastError,
    clearError,
    parseError,
    getSuggestedActions,
    retryConnection,
    switchNetwork,
    openWalletInstallation,
  };
};
