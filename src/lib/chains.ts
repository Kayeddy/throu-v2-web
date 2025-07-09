/**
 * Unified Chain Configuration System
 * Supports both EVM (Polygon) and Solana chains
 *
 * Version: Based on latest Solana wallet-adapter 0.15.39 and @solana/web3.js 1.98.2
 * Next.js 15 + React 19 compatible
 */

import { clusterApiUrl } from "@solana/web3.js";

// Solana network types (replacing WalletAdapterNetwork)
export type SolanaNetwork = "mainnet-beta" | "devnet" | "testnet";

// Chain types enum
export enum ChainType {
  EVM = "evm",
  SOLANA = "solana",
}

// Supported chain IDs
export enum SupportedChainId {
  // EVM Chains
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,

  // Solana Chains
  SOLANA_MAINNET = "mainnet-beta",
  SOLANA_DEVNET = "devnet",
  SOLANA_TESTNET = "testnet",
}

// Base chain interface
export interface BaseChain {
  id: SupportedChainId;
  name: string;
  type: ChainType;
  isTestnet: boolean;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer: {
    name: string;
    url: string;
  };
}

// EVM-specific chain interface
export interface EVMChain extends BaseChain {
  type: ChainType.EVM;
  rpcUrls: string[];
  chainId: number;
}

// Solana-specific chain interface
export interface SolanaChain extends BaseChain {
  type: ChainType.SOLANA;
  network: SolanaNetwork;
  rpcUrl: string;
  wsUrl?: string;
}

// Union type for all supported chains
export type SupportedChain = EVMChain | SolanaChain;

// Chain configuration
export const CHAINS: Record<SupportedChainId, SupportedChain> = {
  // EVM Chains
  [SupportedChainId.POLYGON]: {
    id: SupportedChainId.POLYGON,
    name: "Polygon",
    type: ChainType.EVM,
    isTestnet: false,
    chainId: 137,
    rpcUrls: [
      "https://polygon-rpc.com",
      "https://rpc-mainnet.matic.network",
      "https://matic-mainnet.chainstacklabs.com",
    ],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorer: {
      name: "PolygonScan",
      url: "https://polygonscan.com",
    },
  },

  [SupportedChainId.POLYGON_MUMBAI]: {
    id: SupportedChainId.POLYGON_MUMBAI,
    name: "Polygon Mumbai",
    type: ChainType.EVM,
    isTestnet: true,
    chainId: 80001,
    rpcUrls: [
      "https://rpc-mumbai.maticvigil.com",
      "https://matic-mumbai.chainstacklabs.com",
    ],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorer: {
      name: "PolygonScan Mumbai",
      url: "https://mumbai.polygonscan.com",
    },
  },

  // Solana Chains
  [SupportedChainId.SOLANA_MAINNET]: {
    id: SupportedChainId.SOLANA_MAINNET,
    name: "Solana Mainnet",
    type: ChainType.SOLANA,
    isTestnet: false,
    network: "mainnet-beta",
    rpcUrl: clusterApiUrl("mainnet-beta"),
    wsUrl: clusterApiUrl("mainnet-beta").replace("https", "wss"),
    nativeCurrency: {
      name: "Solana",
      symbol: "SOL",
      decimals: 9,
    },
    blockExplorer: {
      name: "Solscan",
      url: "https://solscan.io",
    },
  },

  [SupportedChainId.SOLANA_DEVNET]: {
    id: SupportedChainId.SOLANA_DEVNET,
    name: "Solana Devnet",
    type: ChainType.SOLANA,
    isTestnet: true,
    network: "devnet",
    rpcUrl: clusterApiUrl("devnet"),
    wsUrl: clusterApiUrl("devnet").replace("https", "wss"),
    nativeCurrency: {
      name: "Solana",
      symbol: "SOL",
      decimals: 9,
    },
    blockExplorer: {
      name: "Solscan Devnet",
      url: "https://solscan.io?cluster=devnet",
    },
  },

  [SupportedChainId.SOLANA_TESTNET]: {
    id: SupportedChainId.SOLANA_TESTNET,
    name: "Solana Testnet",
    type: ChainType.SOLANA,
    isTestnet: true,
    network: "testnet",
    rpcUrl: clusterApiUrl("testnet"),
    wsUrl: clusterApiUrl("testnet").replace("https", "wss"),
    nativeCurrency: {
      name: "Solana",
      symbol: "SOL",
      decimals: 9,
    },
    blockExplorer: {
      name: "Solscan Testnet",
      url: "https://solscan.io?cluster=testnet",
    },
  },
};

// Default chains for production
export const DEFAULT_CHAINS = {
  EVM: CHAINS[SupportedChainId.POLYGON],
  SOLANA: CHAINS[SupportedChainId.SOLANA_MAINNET],
} as const;

// Utility functions
export function getChainById(
  chainId: SupportedChainId
): SupportedChain | undefined {
  return CHAINS[chainId];
}

export function getChainsByType(type: ChainType): SupportedChain[] {
  return Object.values(CHAINS).filter((chain) => chain.type === type);
}

export function isEVMChain(chain: SupportedChain): chain is EVMChain {
  return chain.type === ChainType.EVM;
}

export function isSolanaChain(chain: SupportedChain): chain is SolanaChain {
  return chain.type === ChainType.SOLANA;
}

export function getTestnetChains(): SupportedChain[] {
  return Object.values(CHAINS).filter((chain) => chain.isTestnet);
}

export function getMainnetChains(): SupportedChain[] {
  return Object.values(CHAINS).filter((chain) => !chain.isTestnet);
}

// Chain detection utilities
export function detectChainFromWallet(address?: string): ChainType | null {
  if (!address) return null;

  // Solana addresses are base58 encoded and typically 32-44 characters
  if (address.length >= 32 && address.length <= 44 && !/^0x/.test(address)) {
    return ChainType.SOLANA;
  }

  // EVM addresses start with 0x and are 42 characters long
  if (address.startsWith("0x") && address.length === 42) {
    return ChainType.EVM;
  }

  return null;
}

// Types are already exported above
