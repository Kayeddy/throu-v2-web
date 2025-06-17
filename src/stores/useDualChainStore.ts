/**
 * Dual-Chain State Management Store
 *
 * Manages state for both EVM (Polygon) and Solana chains
 * Handles chain switching, wallet connections, and unified state
 *
 * Built with Zustand for optimal performance with React 19
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  ChainType,
  SupportedChain,
  SupportedChainId,
  CHAINS,
  DEFAULT_CHAINS,
} from "@/lib/chains";
import {
  UnifiedWallet,
  UnifiedTransaction,
  ChainAdapter,
  getChainAdapter,
} from "@/lib/chain-abstraction";

// Dual-chain state interface
export interface DualChainState {
  // Active chain management
  activeChain: SupportedChain;
  activeChainType: ChainType;

  // Wallet connections
  evmWallet: UnifiedWallet | null;
  solanaWallet: UnifiedWallet | null;

  // Chain adapters
  evmAdapter: ChainAdapter | null;
  solanaAdapter: ChainAdapter | null;

  // Loading states
  isConnecting: boolean;
  isSwitchingChain: boolean;

  // Transaction state
  pendingTransactions: UnifiedTransaction[];

  // Error handling
  lastError: string | null;
}

// Dual-chain actions interface
export interface DualChainActions {
  // Chain management
  switchChain: (chainId: SupportedChainId) => Promise<void>;
  switchChainType: (chainType: ChainType) => Promise<void>;

  // Wallet management
  connectWallet: (chainType: ChainType) => Promise<boolean>;
  disconnectWallet: (chainType: ChainType) => Promise<void>;
  disconnectAllWallets: () => Promise<void>;

  // Transaction management
  addPendingTransaction: (transaction: UnifiedTransaction) => void;
  updateTransactionStatus: (
    hash: string,
    status: "pending" | "confirmed" | "failed"
  ) => void;
  removePendingTransaction: (hash: string) => void;

  // Utility functions
  getActiveWallet: () => UnifiedWallet | null;
  getActiveAdapter: () => ChainAdapter | null;
  isWalletConnected: (chainType?: ChainType) => boolean;

  // Error management
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset functions
  resetChainState: () => void;
}

// Combined store type
export type DualChainStore = DualChainState & DualChainActions;

// Initial state
const initialState: DualChainState = {
  activeChain: DEFAULT_CHAINS.EVM, // Start with EVM (Polygon Mumbai)
  activeChainType: ChainType.EVM,
  evmWallet: null,
  solanaWallet: null,
  evmAdapter: null,
  solanaAdapter: null,
  isConnecting: false,
  isSwitchingChain: false,
  pendingTransactions: [],
  lastError: null,
};

// Create the dual-chain store
export const useDualChainStore = create<DualChainStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Chain management actions
        switchChain: async (chainId: SupportedChainId) => {
          const state = get();
          const targetChain = CHAINS[chainId];

          if (!targetChain) {
            set({ lastError: `Chain ${chainId} not supported` });
            return;
          }

          if (state.activeChain.id === chainId) {
            return; // Already on this chain
          }

          set({ isSwitchingChain: true, lastError: null });

          try {
            // Create new adapter for the target chain
            const newAdapter = getChainAdapter(targetChain);

            // Update active chain and adapter
            if (targetChain.type === ChainType.EVM) {
              set({
                activeChain: targetChain,
                activeChainType: ChainType.EVM,
                evmAdapter: newAdapter,
                isSwitchingChain: false,
              });
            } else {
              set({
                activeChain: targetChain,
                activeChainType: ChainType.SOLANA,
                solanaAdapter: newAdapter,
                isSwitchingChain: false,
              });
            }
          } catch (error: any) {
            set({
              lastError: error.message || "Failed to switch chain",
              isSwitchingChain: false,
            });
          }
        },

        switchChainType: async (chainType: ChainType) => {
          const state = get();

          if (state.activeChainType === chainType) {
            return; // Already on this chain type
          }

          const targetChain =
            chainType === ChainType.EVM
              ? DEFAULT_CHAINS.EVM
              : DEFAULT_CHAINS.SOLANA;

          await get().switchChain(targetChain.id);
        },

        // Wallet management actions
        connectWallet: async (chainType: ChainType) => {
          const state = get();

          set({ isConnecting: true, lastError: null });

          try {
            let adapter: ChainAdapter;

            if (chainType === ChainType.EVM) {
              if (!state.evmAdapter) {
                adapter = getChainAdapter(DEFAULT_CHAINS.EVM);
                set({ evmAdapter: adapter });
              } else {
                adapter = state.evmAdapter;
              }
            } else {
              if (!state.solanaAdapter) {
                adapter = getChainAdapter(DEFAULT_CHAINS.SOLANA);
                set({ solanaAdapter: adapter });
              } else {
                adapter = state.solanaAdapter;
              }
            }

            const result = await adapter.connect();

            if (result.success && result.data) {
              if (chainType === ChainType.EVM) {
                set({
                  evmWallet: result.data,
                  isConnecting: false,
                });
              } else {
                set({
                  solanaWallet: result.data,
                  isConnecting: false,
                });
              }
              return true;
            } else {
              set({
                lastError: result.error || "Failed to connect wallet",
                isConnecting: false,
              });
              return false;
            }
          } catch (error: any) {
            set({
              lastError: error.message || "Failed to connect wallet",
              isConnecting: false,
            });
            return false;
          }
        },

        disconnectWallet: async (chainType: ChainType) => {
          const state = get();

          try {
            const adapter =
              chainType === ChainType.EVM
                ? state.evmAdapter
                : state.solanaAdapter;

            if (adapter) {
              await adapter.disconnect();
            }

            if (chainType === ChainType.EVM) {
              set({ evmWallet: null });
            } else {
              set({ solanaWallet: null });
            }
          } catch (error: any) {
            set({ lastError: error.message || "Failed to disconnect wallet" });
          }
        },

        disconnectAllWallets: async () => {
          await get().disconnectWallet(ChainType.EVM);
          await get().disconnectWallet(ChainType.SOLANA);
        },

        // Transaction management
        addPendingTransaction: (transaction: UnifiedTransaction) => {
          const state = get();
          set({
            pendingTransactions: [...state.pendingTransactions, transaction],
          });
        },

        updateTransactionStatus: (
          hash: string,
          status: "pending" | "confirmed" | "failed"
        ) => {
          const state = get();
          const updatedTransactions = state.pendingTransactions.map((tx) => {
            if (tx.hash === hash || tx.signature === hash) {
              return { ...tx, status };
            }
            return tx;
          });

          set({ pendingTransactions: updatedTransactions });
        },

        removePendingTransaction: (hash: string) => {
          const state = get();
          const filteredTransactions = state.pendingTransactions.filter(
            (tx) => tx.hash !== hash && tx.signature !== hash
          );

          set({ pendingTransactions: filteredTransactions });
        },

        // Utility functions
        getActiveWallet: () => {
          const state = get();
          return state.activeChainType === ChainType.EVM
            ? state.evmWallet
            : state.solanaWallet;
        },

        getActiveAdapter: () => {
          const state = get();
          return state.activeChainType === ChainType.EVM
            ? state.evmAdapter
            : state.solanaAdapter;
        },

        isWalletConnected: (chainType?: ChainType) => {
          const state = get();

          if (chainType) {
            return chainType === ChainType.EVM
              ? !!state.evmWallet?.isConnected
              : !!state.solanaWallet?.isConnected;
          }

          // Check if any wallet is connected
          return !!(
            state.evmWallet?.isConnected || state.solanaWallet?.isConnected
          );
        },

        // Error management
        setError: (error: string | null) => {
          set({ lastError: error });
        },

        clearError: () => {
          set({ lastError: null });
        },

        // Reset functions
        resetChainState: () => {
          set({
            ...initialState,
            evmAdapter: null,
            solanaAdapter: null,
          });
        },
      }),
      {
        name: "dual-chain-store",
        // Only persist essential state, not adapters or connections
        partialize: (state) => ({
          activeChain: state.activeChain,
          activeChainType: state.activeChainType,
          pendingTransactions: state.pendingTransactions,
        }),
      }
    ),
    {
      name: "dual-chain-store",
    }
  )
);

// Selector hooks for better performance
export const useActiveChain = () =>
  useDualChainStore((state) => state.activeChain);
export const useActiveChainType = () =>
  useDualChainStore((state) => state.activeChainType);
export const useActiveWallet = () =>
  useDualChainStore((state) => state.getActiveWallet());
export const useIsWalletConnected = () =>
  useDualChainStore((state) => state.isWalletConnected());
export const useChainLoading = () =>
  useDualChainStore((state) => ({
    isConnecting: state.isConnecting,
    isSwitchingChain: state.isSwitchingChain,
  }));
export const usePendingTransactions = () =>
  useDualChainStore((state) => state.pendingTransactions);
export const useChainError = () =>
  useDualChainStore((state) => state.lastError);

// Action hooks
export const useChainActions = () =>
  useDualChainStore((state) => ({
    switchChain: state.switchChain,
    switchChainType: state.switchChainType,
    connectWallet: state.connectWallet,
    disconnectWallet: state.disconnectWallet,
    disconnectAllWallets: state.disconnectAllWallets,
    clearError: state.clearError,
  }));

export const useTransactionActions = () =>
  useDualChainStore((state) => ({
    addPendingTransaction: state.addPendingTransaction,
    updateTransactionStatus: state.updateTransactionStatus,
    removePendingTransaction: state.removePendingTransaction,
  }));
