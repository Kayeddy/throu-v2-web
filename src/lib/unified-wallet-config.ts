// 2025 UNIFIED WALLET CONFIGURATION
// This approach is used by Magic Eden, Jupiter, and other top Solana platforms

"use client";

import { createConfig, http, createStorage, cookieStorage } from "wagmi";
import { polygon, mainnet } from "wagmi/chains";
import {
  injected,
  metaMask,
  coinbaseWallet,
  walletConnect,
} from "wagmi/connectors";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

// Project configuration with environment variable fallback
const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "9497f7be49f92c5f565bb3bf26ed3205";

// 2025 PATTERN: Unified wallet configuration
export const WALLET_CONFIG = {
  // EVM Configuration
  evm: {
    chains: [polygon, mainnet],
    projectId: WALLETCONNECT_PROJECT_ID,
  },
  // Solana Configuration
  solana: {
    network: WalletAdapterNetwork.Mainnet,
    endpoint: clusterApiUrl(WalletAdapterNetwork.Mainnet),
  },
} as const;

// 2025 PATTERN: Singleton EVM config to prevent multiple WalletConnect instances
let evmConfig: ReturnType<typeof createConfig> | null = null;

export const getEVMConfig = () => {
  // CRITICAL FIX: Return null on server side to prevent any WalletConnect initialization
  if (typeof window === "undefined") {
    console.log(
      "🔧 Server-side: Returning null config to prevent WalletConnect errors"
    );
    return null;
  }

  if (!evmConfig) {
    try {
      console.log(
        "🔧 Creating EVM wallet config (singleton) - client-side only"
      );

      evmConfig = createConfig({
        chains: [polygon, mainnet],
        connectors: [
          injected({ shimDisconnect: true }),
          metaMask({
            dappMetadata: {
              name: "Throu",
              url: window.location.origin,
            },
          }),
          coinbaseWallet({
            appName: "Throu",
            appLogoUrl: "/logo.svg",
          }),
          walletConnect({
            projectId: WALLETCONNECT_PROJECT_ID,
            metadata: {
              name: "Throu",
              description: "Real Estate Investment Platform",
              url: window.location.origin,
              icons: ["/logo.svg"],
            },
            // RESTORED: Enable QR modal for WalletConnect
            showQrModal: true,
          }),
        ],
        storage: createStorage({
          storage: cookieStorage,
        }),
        transports: {
          [polygon.id]: http(),
          [mainnet.id]: http(),
        },
        ssr: true,
      });

      console.log("✅ EVM wallet config created successfully");
    } catch (error) {
      console.error("❌ Error creating EVM wallet config:", error);
      throw error;
    }
  }

  return evmConfig;
};

// Export the EVM config for use in wagmi core functions
export const getEVMConfigForCore = () => {
  const config = getEVMConfig();
  if (!config) {
    throw new Error(
      "EVM config not available - make sure you're running on the client side"
    );
  }
  return config;
};

// 2025 PATTERN: Synchronous Solana wallets following official documentation
// FIXED: Using synchronous initialization following official Solana wallet adapter patterns
export const getSolanaWallets = () => {
  // Following official Solana documentation: all major wallets support Wallet Standard
  // No need for specific adapters anymore - return empty array for Wallet Standard support
  console.log("🔧 Using Wallet Standard for Solana wallet support");
  return [];
};

// 2025 PATTERN: Enhanced wallet detection following official Phantom documentation
export const detectPhantomWallet = (): boolean => {
  if (typeof window === "undefined") return false;

  // Official Phantom detection pattern from docs.phantom.com
  const isPhantomInstalled = !!(window as any).phantom?.solana?.isPhantom;

  console.log("🔍 Phantom wallet detection:", {
    isInstalled: isPhantomInstalled,
    phantom: !!(window as any).phantom,
    solana: !!(window as any).phantom?.solana,
    isPhantom: !!(window as any).phantom?.solana?.isPhantom,
  });

  return isPhantomInstalled;
};

// Enhanced wallet detection for all supported wallets
export const detectWalletInstallation = (walletName: string): boolean => {
  if (typeof window === "undefined") return false;

  const walletLower = walletName.toLowerCase();

  switch (walletLower) {
    case "phantom":
      return detectPhantomWallet();

    case "coinbase wallet":
    case "coinbase":
      // Check for both EVM and Solana Coinbase support
      const coinbaseEVM = !!(
        (window as any).ethereum?.isCoinbaseWallet ||
        (window as any).coinbaseWalletExtension ||
        (window as any).ethereum?.providers?.find(
          (p: any) => p.isCoinbaseWallet
        )
      );
      const coinbaseSolana = !!(window as any).coinbaseSolana;
      return coinbaseEVM || coinbaseSolana;

    case "metamask":
      return !!(window as any).ethereum?.isMetaMask;

    case "walletconnect":
      // WalletConnect is always "available" as it's a protocol
      return true;

    default:
      return false;
  }
};

// 2025 PATTERN: Wallet detection utilities
export const SUPPORTED_WALLETS = {
  evm: ["MetaMask", "Coinbase Wallet", "WalletConnect"],
  solana: ["Phantom"], // Only Phantom has reliable Solana support for direct connection
} as const;

export type WalletType = "evm" | "solana";
export type SupportedWallet =
  (typeof SUPPORTED_WALLETS)[keyof typeof SUPPORTED_WALLETS][number];

// Utility to detect wallet capabilities
export const detectWalletCapabilities = (walletName: string): WalletType[] => {
  const capabilities: WalletType[] = [];

  if (SUPPORTED_WALLETS.evm.includes(walletName as any)) {
    capabilities.push("evm");
  }

  if (SUPPORTED_WALLETS.solana.includes(walletName as any)) {
    capabilities.push("solana");
  }

  return capabilities;
};

// CRITICAL FIX: Enhanced Phantom connection helper following official docs
export const connectPhantomWallet = async (): Promise<{
  publicKey: string;
  isConnected: boolean;
}> => {
  if (!detectPhantomWallet()) {
    throw new Error("Phantom wallet is not installed");
  }

  try {
    const phantom = (window as any).phantom?.solana;

    if (!phantom) {
      throw new Error("Phantom wallet not found");
    }

    // Official Phantom connection pattern from docs.phantom.com
    const response = await phantom.connect({ onlyIfTrusted: false });

    console.log("✅ Phantom connected:", {
      publicKey: response.publicKey.toString(),
      isConnected: phantom.isConnected,
    });

    return {
      publicKey: response.publicKey.toString(),
      isConnected: phantom.isConnected,
    };
  } catch (error: any) {
    console.error("❌ Phantom connection failed:", error);

    // Provide specific error messages following troubleshooting guides
    if (error.code === 4001) {
      throw new Error("Connection request was rejected by the user");
    } else if (error.code === -32002) {
      throw new Error("Connection request is already pending");
    } else if (error.message?.includes("not available")) {
      throw new Error(
        "Phantom wallet is not available. Please make sure it's installed and unlocked."
      );
    } else {
      throw new Error(
        `Failed to connect to Phantom: ${error.message || "Unknown error"}`
      );
    }
  }
};
