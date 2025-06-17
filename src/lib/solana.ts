/**
 * Solana Configuration and Utilities
 *
 * Based on latest Solana wallet-adapter 0.15.39 and @solana/web3.js 1.98.2
 * Compatible with Next.js 15 + React 19
 *
 * Reference: https://solana.com/developers/guides/wallets/add-solana-wallet-adapter-to-nextjs
 */

import {
  WalletAdapterNetwork,
  WalletError,
  WalletName,
} from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { ReactNode, useMemo, useCallback } from "react";
import { SolanaChain, SupportedChainId, CHAINS, isSolanaChain } from "./chains";

// Solana wallet configuration
export const SOLANA_WALLETS = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new TorusWalletAdapter(),
  new LedgerWalletAdapter(),
];

// Solana connection configuration
export interface SolanaConnectionConfig {
  network: WalletAdapterNetwork;
  endpoint?: string;
  commitment?: "processed" | "confirmed" | "finalized";
}

// Default Solana configuration
export const DEFAULT_SOLANA_CONFIG: SolanaConnectionConfig = {
  network: WalletAdapterNetwork.Devnet,
  commitment: "confirmed",
};

// Solana provider props
export interface SolanaProviderProps {
  children: ReactNode;
  config?: SolanaConnectionConfig;
  autoConnect?: boolean;
  onError?: (error: WalletError) => void;
}

// Get Solana connection
export function getSolanaConnection(
  config: SolanaConnectionConfig = DEFAULT_SOLANA_CONFIG
): Connection {
  const endpoint = config.endpoint || clusterApiUrl(config.network);
  return new Connection(endpoint, config.commitment);
}

// Get Solana chain configuration
export function getSolanaChainConfig(
  network: WalletAdapterNetwork
): SolanaChain | null {
  const chainId =
    network === WalletAdapterNetwork.Mainnet
      ? SupportedChainId.SOLANA_MAINNET
      : network === WalletAdapterNetwork.Devnet
      ? SupportedChainId.SOLANA_DEVNET
      : network === WalletAdapterNetwork.Testnet
      ? SupportedChainId.SOLANA_TESTNET
      : null;

  if (!chainId) return null;

  const chain = CHAINS[chainId];
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

    return null;
  }

  // ENHANCED: Connect to Phantom with comprehensive error handling
  static async connectPhantom(): Promise<{
    publicKey: string;
    success: boolean;
    error?: string;
  }> {
    console.log("🔌 Starting Phantom connection...");

    try {
      // Step 1: Wait for Phantom injection
      const isAvailable = await this.waitForPhantomInjection(5000);

      if (!isAvailable) {
        throw new Error(
          "Phantom wallet not found. Please install Phantom wallet."
        );
      }

      // Step 2: Get the provider
      const provider = this.getPhantomProvider();

      if (!provider) {
        throw new Error("Phantom provider not available");
      }

      console.log("🔌 Phantom provider found, attempting connection...");

      // Step 3: Check if already connected
      if (provider.isConnected && provider.publicKey) {
        console.log("✅ Phantom already connected");
        return {
          publicKey: provider.publicKey.toString(),
          success: true,
        };
      }

      // Step 4: Request connection
      const response = await provider.connect();

      if (!response || !response.publicKey) {
        throw new Error("No public key received from Phantom");
      }

      console.log(
        "✅ Phantom connection successful:",
        response.publicKey.toString()
      );

      return {
        publicKey: response.publicKey.toString(),
        success: true,
      };
    } catch (error: any) {
      console.error("❌ Phantom connection failed:", error);

      // Parse error types
      let errorMessage = "Failed to connect to Phantom wallet";

      if (error.code === 4001 || error.message?.includes("User rejected")) {
        errorMessage = "Connection rejected by user";
      } else if (
        error.message?.includes("not found") ||
        error.message?.includes("not installed")
      ) {
        errorMessage = "Phantom wallet not installed";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        publicKey: "",
        success: false,
        error: errorMessage,
      };
    }
  }

  // ENHANCED: Disconnect from Phantom
  static async disconnectPhantom(): Promise<boolean> {
    try {
      const provider = this.getPhantomProvider();

      if (provider && provider.disconnect) {
        await provider.disconnect();
        console.log("✅ Phantom disconnected");
        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Phantom disconnection failed:", error);
      return false;
    }
  }

  // Check if Coinbase Wallet is installed
  static isCoinbaseWalletInstalled(): boolean {
    if (typeof window === "undefined") return false;

    // Check for coinbase wallet provider
    const coinbase = (window as any).coinbaseSolana;
    return coinbase && coinbase.isCoinbaseWallet;
  }

  // Check if generic Solana wallet is installed
  static isSolanaWalletInstalled(): boolean {
    if (typeof window === "undefined") return false;

    // Check for any solana provider
    const solana = (window as any).solana;
    return solana && typeof solana.connect === "function";
  }

  // Detect all installed wallets
  static detectInstalledWallets(): Record<string, boolean> {
    return {
      phantom: this.isPhantomInstalled(),
      coinbase: this.isCoinbaseWalletInstalled(),
      solana: this.isSolanaWalletInstalled(),
    };
  }

  // Wait for wallet injection with timeout
  static async waitForWalletInjection(
    walletName: string,
    timeout: number = 3000
  ): Promise<boolean> {
    if (typeof window === "undefined") return false;

    // Use enhanced Phantom detection
    if (walletName.toLowerCase() === "phantom") {
      return this.waitForPhantomInjection(timeout);
    }

    // Return immediately if already available
    switch (walletName.toLowerCase()) {
      case "coinbase":
        if (this.isCoinbaseWalletInstalled()) return true;
        break;
      case "solana":
        if (this.isSolanaWalletInstalled()) return true;
        break;
    }

    // Wait for wallet injection
    return new Promise((resolve) => {
      let timeoutId: NodeJS.Timeout;
      let intervalId: NodeJS.Timeout;

      const checkWallet = () => {
        let isInstalled = false;

        switch (walletName.toLowerCase()) {
          case "coinbase":
            isInstalled = this.isCoinbaseWalletInstalled();
            break;
          case "solana":
            isInstalled = this.isSolanaWalletInstalled();
            break;
        }

        if (isInstalled) {
          clearTimeout(timeoutId);
          clearInterval(intervalId);
          resolve(true);
        }
      };

      // Set up interval to check wallet availability
      intervalId = setInterval(checkWallet, 100);

      // Set up timeout to resolve false after timeout period
      timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        resolve(false);
      }, timeout);
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

// Solana utility functions
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

  // Get transaction explorer URL
  getTransactionUrl: (
    signature: string,
    network: WalletAdapterNetwork
  ): string => {
    const baseUrl = "https://solscan.io/tx";
    const cluster =
      network === WalletAdapterNetwork.Mainnet ? "" : `?cluster=${network}`;
    return `${baseUrl}/${signature}${cluster}`;
  },

  // Get account explorer URL
  getAccountUrl: (address: string, network: WalletAdapterNetwork): string => {
    const baseUrl = "https://solscan.io/account";
    const cluster =
      network === WalletAdapterNetwork.Mainnet ? "" : `?cluster=${network}`;
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

// Solana error handling
export const SolanaErrors = {
  // Handle wallet errors
  handleWalletError: (error: WalletError): string => {
    switch (error.name) {
      case "WalletNotConnectedError":
        return "Please connect your wallet first";
      case "WalletDisconnectedError":
        return "Wallet was disconnected";
      case "WalletTimeoutError":
        return "Wallet connection timed out";
      case "WalletNotFoundError":
        return "Wallet not found. Please install a Solana wallet";
      case "WalletNotReadyError":
        return "Wallet is not ready. Please try again";
      case "WalletLoadError":
        return "Failed to load wallet";
      case "WalletConfigError":
        return "Wallet configuration error";
      default:
        return error.message || "An unknown wallet error occurred";
    }
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

// Export commonly used types and constants
export {
  WalletAdapterNetwork,
  type WalletError,
  type WalletName,
  ConnectionProvider,
  WalletProvider,
  WalletModalProvider,
  useConnection,
  useWallet,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
};

// Export Solana wallet adapter CSS (to be imported in layout)
export const SOLANA_WALLET_ADAPTER_STYLES =
  "@solana/wallet-adapter-react-ui/styles.css";
