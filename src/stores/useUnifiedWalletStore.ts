// 2025 UNIFIED WALLET STATE MANAGEMENT
// This is the modern approach used by top DeFi platforms

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChainType = "evm" | "solana";
export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error"
  | "rejected"
  | "timeout";

interface WalletState {
  // Connection states
  evmConnected: boolean;
  solanaConnected: boolean;

  // Wallet information
  evmAddress: string | null;
  solanaAddress: string | null;
  evmWalletName: string | null;
  solanaWalletName: string | null;

  // Connection status
  evmStatus: ConnectionStatus;
  solanaStatus: ConnectionStatus;

  // Active chain preference
  activeChain: ChainType;

  // Error states
  evmError: string | null;
  solanaError: string | null;

  // User preferences
  autoConnect: boolean;
  preferredEvmWallet: string | null;
  preferredSolanaWallet: string | null;
}

interface WalletActions {
  // EVM actions
  setEvmConnection: (
    connected: boolean,
    address?: string,
    walletName?: string
  ) => void;
  setEvmStatus: (status: ConnectionStatus) => void;
  setEvmError: (error: string | null) => void;

  // Solana actions
  setSolanaConnection: (
    connected: boolean,
    address?: string,
    walletName?: string
  ) => void;
  setSolanaStatus: (status: ConnectionStatus) => void;
  setSolanaError: (error: string | null) => void;

  // Chain management
  setActiveChain: (chain: ChainType) => void;

  // Preferences
  setAutoConnect: (autoConnect: boolean) => void;
  setPreferredWallet: (chain: ChainType, walletName: string) => void;

  // Utility actions
  disconnectAll: () => void;
  clearErrors: () => void;
  reset: () => void;
}

type WalletStore = WalletState & WalletActions;

const initialState: WalletState = {
  evmConnected: false,
  solanaConnected: false,
  evmAddress: null,
  solanaAddress: null,
  evmWalletName: null,
  solanaWalletName: null,
  evmStatus: "disconnected",
  solanaStatus: "disconnected",
  activeChain: "evm",
  evmError: null,
  solanaError: null,
  autoConnect: false,
  preferredEvmWallet: null,
  preferredSolanaWallet: null,
};

export const useUnifiedWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // EVM actions
      setEvmConnection: (connected, address, walletName) => {
        set({
          evmConnected: connected,
          evmAddress: connected ? address || null : null,
          evmWalletName: connected ? walletName || null : null,
          evmStatus: connected ? "connected" : "disconnected",
          evmError: null,
        });
      },

      setEvmStatus: (status) => {
        set({ evmStatus: status });
        if (status === "connected") {
          set({ evmError: null });
        }
      },

      setEvmError: (error) => {
        const status = error
          ? error.includes("rejected") || error.includes("dismissed")
            ? "rejected"
            : error.includes("timeout")
            ? "timeout"
            : "error"
          : get().evmStatus;

        set({
          evmError: error,
          evmStatus: status,
        });
      },

      // Solana actions
      setSolanaConnection: (connected, address, walletName) => {
        set({
          solanaConnected: connected,
          solanaAddress: connected ? address || null : null,
          solanaWalletName: connected ? walletName || null : null,
          solanaStatus: connected ? "connected" : "disconnected",
          solanaError: null,
        });
      },

      setSolanaStatus: (status) => {
        set({ solanaStatus: status });
        if (status === "connected") {
          set({ solanaError: null });
        }
      },

      setSolanaError: (error) => {
        const status = error
          ? error.includes("rejected") || error.includes("dismissed")
            ? "rejected"
            : error.includes("timeout")
            ? "timeout"
            : "error"
          : get().solanaStatus;

        set({
          solanaError: error,
          solanaStatus: status,
        });
      },

      // Chain management
      setActiveChain: (chain) => {
        set({ activeChain: chain });
      },

      // Preferences
      setAutoConnect: (autoConnect) => {
        set({ autoConnect });
      },

      setPreferredWallet: (chain, walletName) => {
        if (chain === "evm") {
          set({ preferredEvmWallet: walletName });
        } else {
          set({ preferredSolanaWallet: walletName });
        }
      },

      // Utility actions
      disconnectAll: () => {
        set({
          evmConnected: false,
          solanaConnected: false,
          evmAddress: null,
          solanaAddress: null,
          evmWalletName: null,
          solanaWalletName: null,
          evmStatus: "disconnected",
          solanaStatus: "disconnected",
          evmError: null,
          solanaError: null,
        });
      },

      clearErrors: () => {
        set({
          evmError: null,
          solanaError: null,
        });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "unified-wallet-store",
      // Only persist user preferences, not connection states
      partialize: (state) => ({
        autoConnect: state.autoConnect,
        preferredEvmWallet: state.preferredEvmWallet,
        preferredSolanaWallet: state.preferredSolanaWallet,
        activeChain: state.activeChain,
      }),
    }
  )
);

// Selectors for better performance
export const useEvmWallet = () => {
  return useUnifiedWalletStore((state) => ({
    connected: state.evmConnected,
    address: state.evmAddress,
    walletName: state.evmWalletName,
    status: state.evmStatus,
    error: state.evmError,
  }));
};

export const useSolanaWallet = () => {
  return useUnifiedWalletStore((state) => ({
    connected: state.solanaConnected,
    address: state.solanaAddress,
    walletName: state.solanaWalletName,
    status: state.solanaStatus,
    error: state.solanaError,
  }));
};

export const useActiveWallet = () => {
  return useUnifiedWalletStore((state) => {
    const activeChain = state.activeChain;

    if (activeChain === "evm") {
      return {
        chain: "evm" as const,
        connected: state.evmConnected,
        address: state.evmAddress,
        walletName: state.evmWalletName,
        status: state.evmStatus,
        error: state.evmError,
      };
    } else {
      return {
        chain: "solana" as const,
        connected: state.solanaConnected,
        address: state.solanaAddress,
        walletName: state.solanaWalletName,
        status: state.solanaStatus,
        error: state.solanaError,
      };
    }
  });
};
