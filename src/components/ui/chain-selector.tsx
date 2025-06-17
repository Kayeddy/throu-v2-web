"use client";

import { useCallback, useMemo } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useDualChainStore } from "@/stores/useDualChainStore";
import { ChainType, CHAINS, SupportedChainId } from "@/lib/chains";

// Simple chevron down icon component
const ChevronDownIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

// Chain display info with proper mainnet configurations
const getChainDisplayInfo = (chainId: SupportedChainId) => {
  switch (chainId) {
    case SupportedChainId.POLYGON:
      return { name: "Polygon", icon: "🔷", color: "bg-purple-600" };
    case SupportedChainId.SOLANA_MAINNET:
      return { name: "Solana", icon: "🟣", color: "bg-green-600" };
    case SupportedChainId.POLYGON_MUMBAI:
      return { name: "Polygon Testnet", icon: "🔷", color: "bg-purple-400" };
    case SupportedChainId.SOLANA_DEVNET:
      return { name: "Solana Testnet", icon: "🟣", color: "bg-green-400" };
    default:
      return { name: "Unknown", icon: "❓", color: "bg-gray-400" };
  }
};

export const ChainSelector = () => {
  const {
    activeChain,
    activeChainType,
    isSwitchingChain,
    switchChain,
    switchChainType,
    lastError,
  } = useDualChainStore();

  // Available chains for selection (mainnet)
  const availableChains = useMemo(
    () => [
      CHAINS[SupportedChainId.POLYGON],
      CHAINS[SupportedChainId.SOLANA_MAINNET],
    ],
    []
  );

  // Handle chain selection
  const handleChainSelect = useCallback(
    async (chainId: string) => {
      if (chainId === activeChain.id.toString()) return;

      try {
        await switchChain(chainId as SupportedChainId);
      } catch (error) {
        console.error("Failed to switch chain:", error);
      }
    },
    [activeChain.id, switchChain]
  );

  // Handle chain type toggle (simplified switching)
  const handleChainTypeToggle = useCallback(async () => {
    const targetType =
      activeChainType === ChainType.EVM ? ChainType.SOLANA : ChainType.EVM;
    try {
      await switchChainType(targetType);
    } catch (error) {
      console.error("Failed to switch chain type:", error);
    }
  }, [activeChainType, switchChainType]);

  const activeChainInfo = getChainDisplayInfo(activeChain.id);

  return (
    <>
      {/* Mobile: Simple toggle button that looks like wallet button */}
      <button
        onClick={handleChainTypeToggle}
        disabled={isSwitchingChain}
        className="flex lg:hidden h-8 w-fit items-center justify-center rounded-md bg-secondary p-3 text-white hover:bg-primary transition-colors disabled:opacity-50"
      >
        <span className="text-lg mr-2">{activeChainInfo.icon}</span>
        <span className="font-medium text-sm">{activeChainInfo.name}</span>
      </button>

      {/* Desktop: Dropdown that looks like wallet button */}
      <Dropdown className="hidden lg:block">
        <DropdownTrigger>
          <button
            disabled={isSwitchingChain}
            className="flex items-center gap-2 h-8 px-3 rounded-md bg-secondary text-white hover:bg-primary transition-colors disabled:opacity-50"
          >
            <span className="text-lg">{activeChainInfo.icon}</span>
            <span className="font-medium text-sm">{activeChainInfo.name}</span>
            <ChevronDownIcon />
          </button>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="Chain selection"
          onAction={(key) => handleChainSelect(key as string)}
          selectedKeys={[activeChain.id.toString()]}
          selectionMode="single"
          className="min-w-[160px]"
        >
          {availableChains.map((chain) => {
            const chainInfo = getChainDisplayInfo(chain.id);
            return (
              <DropdownItem
                key={chain.id.toString()}
                className="flex items-center gap-3"
                startContent={<span className="text-lg">{chainInfo.icon}</span>}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{chainInfo.name}</span>
                  <span className="text-xs opacity-70">
                    {chain.type === ChainType.EVM
                      ? "EVM Compatible"
                      : "Solana Network"}
                  </span>
                </div>
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>

      {/* Error indicator */}
      {lastError && (
        <div
          className="text-xs text-danger max-w-[200px] truncate"
          title={lastError}
        >
          Chain error
        </div>
      )}
    </>
  );
};
