"use client";

import { useMemo } from "react";
import { useDualChainStore } from "@/stores/useDualChainStore";
import { SupportedChainId } from "@/lib/chains";

// Chain display info for indicator
const getChainIndicatorInfo = (chainId: SupportedChainId) => {
  switch (chainId) {
    case SupportedChainId.POLYGON:
      return { icon: "🔷", color: "bg-purple-600" };
    case SupportedChainId.SOLANA_MAINNET:
      return { icon: "🟣", color: "bg-green-600" };
    case SupportedChainId.POLYGON_MUMBAI:
      return { icon: "🔷", color: "bg-purple-400" };
    case SupportedChainId.SOLANA_DEVNET:
      return { icon: "🟣", color: "bg-green-400" };
    default:
      return { icon: "❓", color: "bg-gray-400" };
  }
};

export const ChainIndicator = () => {
  const { activeChain } = useDualChainStore();

  const chainInfo = useMemo(
    () => getChainIndicatorInfo(activeChain.id),
    [activeChain.id]
  );

  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white">
      <span className="text-lg">{chainInfo.icon}</span>
    </div>
  );
};
