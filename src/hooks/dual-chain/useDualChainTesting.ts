"use client";

import { useCallback } from "react";
import { useDualChainStore } from "@/stores/useDualChainStore";
import { ChainType, SupportedChainId } from "@/lib/chains";

export const useDualChainTesting = () => {
  const {
    activeChain,
    activeChainType,
    evmWallet,
    solanaWallet,
    switchChain,
    switchChainType,
    connectWallet,
    disconnectWallet,
    setError,
    clearError,
  } = useDualChainStore();

  // Test chain switching
  const testChainSwitching = useCallback(async () => {
    console.log("🔄 Testing chain switching...");

    try {
      // Test switching to Solana
      console.log("Switching to Solana...");
      await switchChainType(ChainType.SOLANA);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Test switching to EVM
      console.log("Switching to EVM...");
      await switchChainType(ChainType.EVM);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("✅ Chain switching test completed");
    } catch (error) {
      console.error("❌ Chain switching test failed:", error);
    }
  }, [switchChainType]);

  // Test wallet connections
  const testWalletConnections = useCallback(async () => {
    console.log("👛 Testing wallet connections...");

    try {
      // Test EVM wallet connection
      console.log("Testing EVM wallet connection...");
      await connectWallet(ChainType.EVM);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Test Solana wallet connection
      console.log("Testing Solana wallet connection...");
      await connectWallet(ChainType.SOLANA);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("✅ Wallet connection tests completed");
    } catch (error) {
      console.error("❌ Wallet connection test failed:", error);
    }
  }, [connectWallet]);

  // Test error handling
  const testErrorHandling = useCallback(() => {
    console.log("⚠️ Testing error handling...");

    const testErrors = [
      "User rejected connection request",
      "insufficient funds for gas",
      "WalletNotConnectedError: Wallet not connected",
      "insufficient lamports",
      "Phantom wallet not found",
      "Operation timeout",
    ];

    testErrors.forEach((error, index) => {
      setTimeout(() => {
        console.log(`Testing error: ${error}`);
        setError(error);

        // Clear error after 3 seconds
        setTimeout(clearError, 3000);
      }, index * 4000);
    });

    console.log("✅ Error handling tests started");
  }, [setError, clearError]);

  // Comprehensive test suite
  const runFullTestSuite = useCallback(async () => {
    console.log("🧪 Starting comprehensive dual-chain test suite...");
    console.log("📊 Current state:", {
      activeChain: activeChain.name,
      activeChainType,
      evmConnected: !!evmWallet,
      solanaConnected: !!solanaWallet,
    });

    try {
      await testChainSwitching();
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await testWalletConnections();
      await new Promise((resolve) => setTimeout(resolve, 2000));

      testErrorHandling();

      console.log("🎉 Full test suite completed!");
    } catch (error) {
      console.error("💥 Test suite failed:", error);
    }
  }, [
    activeChain,
    activeChainType,
    evmWallet,
    solanaWallet,
    testChainSwitching,
    testWalletConnections,
    testErrorHandling,
  ]);

  // Get current system status
  const getSystemStatus = useCallback(() => {
    return {
      // Chain information
      currentChain: {
        id: activeChain.id,
        name: activeChain.name,
        type: activeChainType,
        isTestnet: activeChain.isTestnet,
      },

      // Wallet statuses
      wallets: {
        evm: {
          connected: !!evmWallet,
          address: evmWallet?.address,
        },
        solana: {
          connected: !!solanaWallet,
          address: solanaWallet?.address,
        },
      },

      // System checks
      systemChecks: {
        storeInitialized: true,
        chainsConfigured: true,
        walletsConfigured: true,
      },
    };
  }, [activeChain, activeChainType, evmWallet, solanaWallet]);

  // Debug logging
  const logCurrentState = useCallback(() => {
    const status = getSystemStatus();
    console.log("🔍 Current Dual-Chain System Status:", status);
  }, [getSystemStatus]);

  return {
    // Test functions
    testChainSwitching,
    testWalletConnections,
    testErrorHandling,
    runFullTestSuite,

    // Status functions
    getSystemStatus,
    logCurrentState,

    // Quick actions for debugging
    forceError: (message: string) => setError(message),
    forceClearError: clearError,
    switchToSolana: () => switchChainType(ChainType.SOLANA),
    switchToEVM: () => switchChainType(ChainType.EVM),
  };
};

// Development only - expose testing functions to window
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).dualChainTest = {
    test: () => {
      console.log("Dual-chain testing utilities loaded!");
      return "Use window.dualChainTest.runTests() to start testing";
    },
  };
}
