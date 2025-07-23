/**
 * Solana Configuration and Utilities
 *
 * Based on latest Solana web3.js 1.98.2 and Reown AppKit
 * Compatible with Next.js 15 + React 19
 *
 * Updated for Reown AppKit integration (January 2025)
 */

import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { ReactNode, useMemo, useCallback } from "react";
import {
  SolanaChain,
  SolanaNetwork,
  SupportedChainId,
  CHAINS,
  isSolanaChain,
} from "./chains";

// Solana connection configuration (updated to use our SolanaNetwork type)
export interface SolanaConnectionConfig {
  network: SolanaNetwork;
  endpoint?: string;
  commitment?: "processed" | "confirmed" | "finalized";
}

// Default Solana configuration
export const DEFAULT_SOLANA_CONFIG: SolanaConnectionConfig = {
  network: "devnet", // Changed from "devnet" to avoid mainnet rate limits
  commitment: "confirmed",
};

// Solana provider props (simplified)
export interface SolanaProviderProps {
  children: ReactNode;
  config?: SolanaConnectionConfig;
  autoConnect?: boolean;
  onError?: (error: Error) => void;
}

// Get Solana connection
export function getSolanaConnection(
  config: SolanaConnectionConfig = DEFAULT_SOLANA_CONFIG
): Connection {
  const endpoint = config.endpoint || clusterApiUrl(config.network);
  return new Connection(endpoint, config.commitment);
}

// Get Solana chain configuration (updated to use SolanaNetwork)
export function getSolanaChainConfig(
  network: SolanaNetwork
): SolanaChain | null {
  const chainId =
    network === "mainnet-beta"
      ? SupportedChainId.SOLANA_MAINNET
      : network === "devnet"
      ? SupportedChainId.SOLANA_DEVNET
      : network === "testnet"
      ? SupportedChainId.SOLANA_DEVNET
      : null;

  if (!chainId) return null;

  const chain = CHAINS[chainId as keyof typeof CHAINS];
  return isSolanaChain(chain) ? chain : null;
}

// Browser-based wallet detection utilities
export class BrowserWalletDetection {
  // ENHANCED: Get available wallet providers with comprehensive detection
  static getAvailableWalletProviders(): Record<string, any> {
    if (typeof window === "undefined") return {};

    return {
      // Phantom: Check multiple possible injection points
      phantom: (window as any).phantom?.solana || null,
      phantomEthereum: (window as any).phantom?.ethereum || null,

      // Legacy Solana provider (might be Phantom or other wallet)
      solana: (window as any).solana || null,

      // Other Solana wallets
      coinbase: (window as any).coinbaseSolana || null,
      backpack: (window as any).backpack || null,
      solflare: (window as any).solflare || null,
      torus: (window as any).torus || null,
      ledger: (window as any).ledger || null,
    };
  }

  // ENHANCED: Check if Phantom wallet is installed with comprehensive detection
  static isPhantomInstalled(): boolean {
    if (typeof window === "undefined") return false;

    // Method 1: Check window.phantom.solana (preferred)
    const phantomSolana = (window as any).phantom?.solana;
    if (phantomSolana && phantomSolana.isPhantom) {
      console.log("🔍 Phantom detected via window.phantom.solana");
      return true;
    }

    // Method 2: Check window.solana (legacy, might be Phantom)
    const solana = (window as any).solana;
    if (solana && solana.isPhantom) {
      console.log("🔍 Phantom detected via window.solana (legacy)");
      return true;
    }

    // Method 3: Check for Phantom-specific properties
    if (phantomSolana && typeof phantomSolana.connect === "function") {
      console.log("🔍 Phantom detected via phantom.solana.connect");
      return true;
    }

    console.log("🔍 Phantom not detected");
    return false;
  }

  // ENHANCED: Wait for Phantom injection with multiple detection methods
  static async waitForPhantomInjection(
    timeout: number = 5000
  ): Promise<boolean> {
    if (typeof window === "undefined") return false;

    // Return immediately if already available
    if (this.isPhantomInstalled()) return true;

    console.log("🔍 Waiting for Phantom wallet injection...");

    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = timeout / 100; // Check every 100ms

      const checkPhantom = () => {
        attempts++;

        if (this.isPhantomInstalled()) {
          console.log(`✅ Phantom detected after ${attempts * 100}ms`);
          resolve(true);
          return;
        }

        if (attempts >= maxAttempts) {
          console.log(`❌ Phantom not found after ${timeout}ms timeout`);
          resolve(false);
          return;
        }

        setTimeout(checkPhantom, 100);
      };

      checkPhantom();
    });
  }

  // ENHANCED: Get Phantom provider with proper error handling
  static getPhantomProvider(): any | null {
    if (typeof window === "undefined") return null;

    // Method 1: window.phantom.solana (preferred)
    const phantomSolana = (window as any).phantom?.solana;
    if (phantomSolana && phantomSolana.isPhantom) {
      return phantomSolana;
    }

    // Method 2: window.solana (legacy)
    const solana = (window as any).solana;
    if (solana && solana.isPhantom) {
      return solana;
    }

    console.log("🔍 Phantom provider not found");
    return null;
  }

  // ENHANCED: Connect to Phantom wallet with error handling
  static async connectPhantom(): Promise<{
    publicKey: string;
    success: boolean;
    error?: string;
  }> {
    try {
      const provider = this.getPhantomProvider();
      if (!provider) {
        return {
          publicKey: "",
          success: false,
          error: "Phantom wallet not found",
        };
      }

      console.log("🔗 Connecting to Phantom wallet...");

      // Request connection
      const response = await provider.connect();
      const publicKey = response.publicKey.toString();

      console.log("✅ Phantom connected:", publicKey);

      return {
        publicKey,
        success: true,
      };
    } catch (error: any) {
      console.error("❌ Phantom connection failed:", error);

      let errorMessage = "Failed to connect to Phantom wallet";
      if (error.message) {
        if (error.message.includes("User rejected")) {
          errorMessage = "User rejected the connection request";
        } else if (error.message.includes("already pending")) {
          errorMessage = "Connection request already pending";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        publicKey: "",
        success: false,
        error: errorMessage,
      };
    }
  }

  // ENHANCED: Disconnect from Phantom wallet
  static async disconnectPhantom(): Promise<boolean> {
    try {
      const provider = this.getPhantomProvider();
      if (!provider) return true; // Already disconnected

      await provider.disconnect();
      console.log("✅ Phantom disconnected successfully");
      return true;
    } catch (error) {
      console.error("❌ Phantom disconnection failed:", error);
      return false;
    }
  }

  // Check if Coinbase wallet is installed
  static isCoinbaseWalletInstalled(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean((window as any).coinbaseSolana);
  }

  // Check if any Solana wallet is installed
  static isSolanaWalletInstalled(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean((window as any).solana);
  }

  // Detect all installed wallets
  static detectInstalledWallets(): Record<string, boolean> {
    return {
      phantom: this.isPhantomInstalled(),
      coinbase: this.isCoinbaseWalletInstalled(),
      solana: this.isSolanaWalletInstalled(),
    };
  }

  // Wait for wallet injection (generic)
  static async waitForWalletInjection(
    walletName: string,
    timeout: number = 3000
  ): Promise<boolean> {
    if (typeof window === "undefined") return false;

    // Quick check for immediate availability
    const wallets = this.detectInstalledWallets();
    if (wallets[walletName.toLowerCase()]) return true;

    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = timeout / 100;

      const checkWallet = () => {
        attempts++;

        const currentWallets = this.detectInstalledWallets();
        if (currentWallets[walletName.toLowerCase()]) {
          resolve(true);
          return;
        }

        if (attempts >= maxAttempts) {
          resolve(false);
          return;
        }

        setTimeout(checkWallet, 100);
      };

      checkWallet();
    });
  }

  // Get wallet connection status
  static getWalletConnectionStatus(
    walletName: string
  ): "connected" | "disconnected" | "not_installed" {
    if (typeof window === "undefined") return "not_installed";

    switch (walletName.toLowerCase()) {
      case "phantom":
        const phantom = this.getPhantomProvider();
        if (!phantom) return "not_installed";
        return phantom.isConnected ? "connected" : "disconnected";

      case "coinbase":
        const coinbase = (window as any).coinbaseSolana;
        if (!coinbase) return "not_installed";
        return coinbase.isConnected ? "connected" : "disconnected";

      default:
        return "not_installed";
    }
  }

  // MOBILE: Check if running on mobile device
  static isMobileDevice(): boolean {
    if (typeof window === "undefined") return false;

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  // MOBILE: Get Phantom mobile deep link
  static getPhantomMobileDeepLink(dappUrl: string): string {
    const encodedUrl = encodeURIComponent(dappUrl);
    return `https://phantom.app/ul/browse/${encodedUrl}?ref=https://phantom.app`;
  }

  // MOBILE: Handle mobile wallet connection
  static handleMobilePhantomConnection(dappUrl?: string): void {
    if (!this.isMobileDevice()) return;

    const currentUrl = dappUrl || window.location.href;
    const deepLink = this.getPhantomMobileDeepLink(currentUrl);

    console.log("📱 Opening Phantom mobile app:", deepLink);
    window.open(deepLink, "_blank");
  }
}

// Solana utility functions (updated to use SolanaNetwork)
export const SolanaUtils = {
  // Convert SOL to lamports
  solToLamports: (sol: number): number => {
    return Math.floor(sol * LAMPORTS_PER_SOL);
  },

  // Convert lamports to SOL
  lamportsToSol: (lamports: number): number => {
    return lamports / LAMPORTS_PER_SOL;
  },

  // Validate Solana address
  isValidSolanaAddress: (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  },

  // Format Solana address for display
  formatSolanaAddress: (address: string, chars: number = 4): string => {
    if (!address) return "";
    if (address.length <= chars * 2) return address;
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  },

  // Get transaction explorer URL (updated to use SolanaNetwork)
  getTransactionUrl: (signature: string, network: SolanaNetwork): string => {
    const baseUrl = "https://solscan.io/tx";
    const cluster = network === "mainnet-beta" ? "" : `?cluster=${network}`;
    return `${baseUrl}/${signature}${cluster}`;
  },

  // Get account explorer URL (updated to use SolanaNetwork)
  getAccountUrl: (address: string, network: SolanaNetwork): string => {
    const baseUrl = "https://solscan.io/account";
    const cluster = network === "mainnet-beta" ? "" : `?cluster=${network}`;
    return `${baseUrl}/${address}${cluster}`;
  },
};

// Solana transaction helpers
export const SolanaTransactions = {
  // Create a simple SOL transfer transaction
  createTransferTransaction: async (
    connection: Connection,
    fromPubkey: PublicKey,
    toPubkey: PublicKey,
    lamports: number
  ): Promise<Transaction> => {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    return transaction;
  },

  // Estimate transaction fee
  estimateTransactionFee: async (
    connection: Connection,
    transaction: Transaction
  ): Promise<number> => {
    try {
      const fee = await connection.getFeeForMessage(
        transaction.compileMessage()
      );
      return fee?.value || 0;
    } catch (error) {
      console.error("Error estimating transaction fee:", error);
      return 5000; // Default fee estimate in lamports
    }
  },
};

// Solana error handling (updated for Reown AppKit)
export const SolanaErrors = {
  // Handle wallet errors (simplified for Reown AppKit)
  handleWalletError: (error: Error): string => {
    const message = error.message || "Unknown error";

    if (message.includes("User rejected")) {
      return "User rejected the connection request";
    }
    if (message.includes("not connected")) {
      return "Please connect your wallet first";
    }
    if (message.includes("disconnected")) {
      return "Wallet was disconnected";
    }
    if (message.includes("timeout")) {
      return "Wallet connection timed out";
    }
    if (message.includes("not found")) {
      return "Wallet not found. Please install a Solana wallet";
    }
    if (message.includes("not ready")) {
      return "Wallet is not ready. Please try again";
    }

    return message;
  },

  // Handle transaction errors
  handleTransactionError: (error: any): string => {
    if (error?.message) {
      if (error.message.includes("insufficient funds")) {
        return "Insufficient SOL balance for this transaction";
      }
      if (error.message.includes("blockhash not found")) {
        return "Transaction expired. Please try again";
      }
      if (error.message.includes("Transaction simulation failed")) {
        return "Transaction simulation failed. Please check your inputs";
      }
    }
    return error?.message || "Transaction failed";
  },
};

// Export core Solana types and utilities
export { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram };
