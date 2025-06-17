"use client";

import { useCallback } from "react";
import { useDualChainStore } from "@/stores/useDualChainStore";
import { ChainType, SupportedChainId } from "@/lib/chains";

export const MobileChainSelector = () => {
  const { activeChain, activeChainType, isSwitchingChain, switchChainType } =
    useDualChainStore();

  const handleChainSelect = useCallback(
    async (targetType: ChainType) => {
      if (targetType === activeChainType) return;

      try {
        await switchChainType(targetType);
      } catch (error) {
        console.error("Failed to switch chain type:", error);
      }
    },
    [activeChainType, switchChainType]
  );

  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <div className="text-center text-sm font-medium text-primary dark:text-white">
        Select Blockchain
      </div>

      {/* Tab-style selector */}
      <div className="flex w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {/* Polygon Tab */}
        <button
          onClick={() => handleChainSelect(ChainType.EVM)}
          disabled={isSwitchingChain}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all ${
            activeChainType === ChainType.EVM
              ? "bg-secondary text-white shadow-sm"
              : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white"
          }`}
        >
          <span className="text-lg">🔷</span>
          <span className="font-medium text-sm">Polygon</span>
        </button>

        {/* Solana Tab */}
        <button
          onClick={() => handleChainSelect(ChainType.SOLANA)}
          disabled={isSwitchingChain}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all ${
            activeChainType === ChainType.SOLANA
              ? "bg-secondary text-white shadow-sm"
              : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white"
          }`}
        >
          <span className="text-lg">🟣</span>
          <span className="font-medium text-sm">Solana</span>
        </button>
      </div>

      {isSwitchingChain && (
        <div className="text-center text-xs text-gray-500">
          Switching blockchain...
        </div>
      )}
    </div>
  );
};
