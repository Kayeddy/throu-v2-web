// 2025 UNIFIED WALLET CONNECTION HOOK
// This is the modern approach that Magic Eden and other top platforms use

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { WalletName } from "@solana/wallet-adapter-base";
import {
  useUnifiedWalletStore,
  ChainType,
} from "@/stores/useUnifiedWalletStore";

// Define window interface extensions
interface PhantomProvider {
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<any>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  publicKey?: any;
  on?: (event: string, callback: Function) => void;
  request?: (method: string, params: any) => Promise<any>;
}

interface SolanaProvider {
  isPhantom?: boolean;
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<any>;
  disconnect: () => Promise<void>;
  on?: (event: string, callback: Function) => void;
  publicKey?: any;
  signMessage?: (message: Uint8Array) => Promise<any>;
  signTransaction?: (transaction: any) => Promise<any>;
}

interface SolflareProvider {
  connect: () => Promise<any>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  publicKey?: any;
  on?: (event: string, callback: Function) => void;
}

interface CoinbaseSolanaProvider {
  connect: () => Promise<any>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  publicKey?: any;
  on?: (event: string, callback: Function) => void;
}

// Extend window interface
declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider;
    };
    solana?: SolanaProvider | any;
    solflare?: SolflareProvider;
    coinbaseSolana?: CoinbaseSolanaProvider;
  }
}

// Enhanced error types for comprehensive error handling
export interface WalletConnectionError {
  type:
    | "USER_REJECTED"
    | "NOT_INSTALLED"
    | "NETWORK_ERROR"
    | "INSUFFICIENT_FUNDS"
    | "UNKNOWN";
  message: string;
  originalError?: any;
  chain: ChainType;
  walletName?: string;
}

// Safe Solana wallet hook wrapper
function useSolanaWalletSafe() {
  const [solanaState, setSolanaState] = useState({
    publicKey: null,
    connected: false,
    connecting: false,
    wallet: null,
    wallets: [],
    connect: async () => console.warn("Solana wallet not available"),
    disconnect: async () => console.warn("Solana wallet not available"),
    select: () => console.warn("Solana wallet not available"),
  });

  useEffect(() => {
    try {
      // Try to access Solana wallet context
      const { useWallet } = require("@solana/wallet-adapter-react");

      // This is a workaround to access the context safely
      // We need to check if we're inside the provider context
      console.log("Attempting to access Solana wallet context...");

      // For now, just return the default state until we properly implement this
      // The actual implementation should use the context properly
    } catch (error) {
      console.warn("Solana wallet context not available:", error);
    }
  }, []);

  return solanaState;
}

export const useUnifiedWalletConnection = () => {
  const {
    // Store state
    evmConnected,
    solanaConnected,
    evmAddress,
    solanaAddress,
    evmWalletName,
    solanaWalletName,
    evmStatus,
    solanaStatus,
    activeChain,
    evmError,
    solanaError,

    // Store actions
    setEvmConnection,
    setSolanaConnection,
    setEvmStatus,
    setSolanaStatus,
    setEvmError,
    setSolanaError,
    setActiveChain,
    disconnectAll,
    clearErrors,
  } = useUnifiedWalletStore();

  // EVM wallet hooks
  const {
    address: wagmiAddress,
    isConnected: wagmiConnected,
    connector,
  } = useAccount();
  const {
    connect: wagmiConnect,
    connectors,
    isPending: evmConnecting,
    error: wagmiError,
  } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  // Safe Solana wallet hooks
  const solanaWalletData = useSolanaWalletSafe();

  // Connection state management
  const isConnectingRef = useRef(false);
  const syncingRef = useRef(false);

  // Enhanced error parser
  const parseConnectionError = useCallback(
    (
      error: any,
      chain: ChainType,
      walletName?: string
    ): WalletConnectionError => {
      console.log("🔍 Parsing connection error:", { error, chain, walletName });

      const errorMessage =
        error?.message || error?.toString() || "Unknown error";
      const lowerMessage = errorMessage.toLowerCase();

      // User rejection patterns
      if (
        lowerMessage.includes("user rejected") ||
        lowerMessage.includes("user denied") ||
        lowerMessage.includes("user cancelled") ||
        lowerMessage.includes("rejected") ||
        lowerMessage.includes("cancelled") ||
        lowerMessage.includes("denied") ||
        error?.code === 4001 ||
        error?.code === -32000
      ) {
        return {
          type: "USER_REJECTED",
          message:
            "Connection was rejected. Please try again and approve the connection.",
          originalError: error,
          chain,
          walletName,
        };
      }

      // Wallet not installed patterns
      if (
        lowerMessage.includes("not installed") ||
        lowerMessage.includes("not found") ||
        lowerMessage.includes("not detected") ||
        lowerMessage.includes("connector not found") ||
        error?.code === "WALLET_NOT_FOUND"
      ) {
        return {
          type: "NOT_INSTALLED",
          message: `${
            walletName || "Wallet"
          } is not installed. Please install it and try again.`,
          originalError: error,
          chain,
          walletName,
        };
      }

      // Network/connection errors
      if (
        lowerMessage.includes("network") ||
        lowerMessage.includes("connection") ||
        lowerMessage.includes("rpc") ||
        lowerMessage.includes("provider")
      ) {
        return {
          type: "NETWORK_ERROR",
          message:
            "Network connection failed. Please check your internet and try again.",
          originalError: error,
          chain,
          walletName,
        };
      }

      // Insufficient funds
      if (
        lowerMessage.includes("insufficient") ||
        lowerMessage.includes("balance")
      ) {
        return {
          type: "INSUFFICIENT_FUNDS",
          message: "Insufficient funds for transaction.",
          originalError: error,
          chain,
          walletName,
        };
      }

      // Default unknown error
      return {
        type: "UNKNOWN",
        message:
          errorMessage || "An unexpected error occurred. Please try again.",
        originalError: error,
        chain,
        walletName,
      };
    },
    []
  );

  // Sync EVM state with store
  const syncEvmState = useCallback(() => {
    if (syncingRef.current) return;
    syncingRef.current = true;

    try {
      if (wagmiConnected && wagmiAddress && connector) {
        console.log("🔄 Syncing EVM connection state:", {
          address: wagmiAddress,
          connector: connector.name,
        });

        setEvmConnection(true, wagmiAddress, connector.name);
        setEvmStatus("connected");
        setEvmError(null);
      } else if (!wagmiConnected && evmConnected) {
        console.log("🔄 Syncing EVM disconnection state");
        setEvmConnection(false);
        setEvmStatus("disconnected");
      }

      // Handle EVM errors
      if (wagmiError) {
        console.log("❌ EVM connection error:", wagmiError);
        const parsedError = parseConnectionError(wagmiError, "evm");
        setEvmError(parsedError.message);
        setEvmStatus("error");
      }
    } finally {
      syncingRef.current = false;
    }
  }, [
    wagmiConnected,
    wagmiAddress,
    connector,
    evmConnected,
    wagmiError,
    setEvmConnection,
    setEvmStatus,
    setEvmError,
    parseConnectionError,
  ]);

  // Sync Solana state with store (simplified for now)
  const syncSolanaState = useCallback(() => {
    if (syncingRef.current) return;
    syncingRef.current = true;

    try {
      // For now, just use the store state
      // TODO: Implement proper Solana wallet sync when context is available
      console.log("🔄 Solana state sync (simplified)");
    } finally {
      syncingRef.current = false;
    }
  }, []);

  // EVM connection
  const connectEVM = useCallback(
    async (walletName: string) => {
      if (isConnectingRef.current) return;
      isConnectingRef.current = true;

      try {
        setEvmStatus("connecting");
        setEvmError(null);

        const connector = connectors.find((c) => c.name === walletName);
        if (!connector) {
          throw new Error(`Connector "${walletName}" not found`);
        }

        console.log(`🔌 Connecting to ${walletName}...`);
        await wagmiConnect({ connector });

        setActiveChain("evm");
        console.log(`✅ Successfully connected to ${walletName}`);
      } catch (error) {
        console.error("❌ EVM connection failed:", error);
        const parsedError = parseConnectionError(error, "evm", walletName);
        setEvmError(parsedError.message);
        setEvmStatus("error");
        throw parsedError;
      } finally {
        isConnectingRef.current = false;
      }
    },
    [
      connectors,
      wagmiConnect,
      setEvmStatus,
      setEvmError,
      setActiveChain,
      parseConnectionError,
    ]
  );

  // Solana connection (simplified for now)
  const connectSolana = useCallback(async (walletName: string) => {
    console.log(`🔌 Solana connection requested for ${walletName}`);
    console.warn("Solana connection not fully implemented yet");
    // TODO: Implement proper Solana connection when context is available
  }, []);

  // EVM disconnection
  const disconnectEVM = useCallback(async () => {
    try {
      console.log("🔌 Disconnecting EVM wallet...");
      await wagmiDisconnect();
      setEvmConnection(false);
      setEvmStatus("disconnected");
      console.log("✅ EVM wallet disconnected");
    } catch (error) {
      console.error("❌ EVM disconnection failed:", error);
    }
  }, [wagmiDisconnect, setEvmConnection, setEvmStatus]);

  // Solana disconnection (simplified for now)
  const disconnectSolana = useCallback(async () => {
    console.log("🔌 Solana disconnection requested");
    setSolanaConnection(false);
  }, [setSolanaConnection]);

  // Connect wallet
  const connectWallet = useCallback(
    async (walletName: string, chain: ChainType) => {
      console.log(`🔌 Connecting ${walletName} on ${chain}...`);

      if (chain === "evm") {
        return connectEVM(walletName);
      } else if (chain === "solana") {
        return connectSolana(walletName);
      }

      throw new Error(`Unsupported chain: ${chain}`);
    },
    [connectEVM, connectSolana]
  );

  // Disconnect all wallets
  const disconnectAllWallets = useCallback(async () => {
    await Promise.all([disconnectEVM(), disconnectSolana()]);
  }, [disconnectEVM, disconnectSolana]);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    clearErrors();
  }, [clearErrors]);

  // Sync states
  useEffect(() => {
    syncEvmState();
  }, [syncEvmState]);

  useEffect(() => {
    syncSolanaState();
  }, [syncSolanaState]);

  // Determine active wallet info
  const activeAddress = evmConnected
    ? evmAddress
    : solanaConnected
    ? solanaAddress
    : null;
  const activeWalletName = evmConnected
    ? evmWalletName
    : solanaConnected
    ? solanaWalletName
    : null;
  const isConnecting =
    evmStatus === "connecting" || solanaStatus === "connecting";
  const hasError = evmError || solanaError;

  return {
    // Connection states
    evmConnected,
    solanaConnected,
    isConnecting,
    hasError,

    // Addresses
    evmAddress,
    solanaAddress,
    activeAddress,

    // Wallet names
    evmWalletName,
    solanaWalletName,
    activeWalletName,

    // Statuses
    evmStatus,
    solanaStatus,
    activeChain,

    // Errors
    evmError,
    solanaError,

    // Actions
    connectWallet,
    connectEVM,
    connectSolana,
    disconnectEVM,
    disconnectSolana,
    disconnectAll: disconnectAllWallets,
    clearErrors: clearAllErrors,

    // EVM specific
    wagmiAddress,
    wagmiConnected,
    evmConnecting,
    connectors,

    // Solana specific (simplified for now)
    solanaWalletData,
  };
};
