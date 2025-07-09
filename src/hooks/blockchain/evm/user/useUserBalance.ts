import { useReadContract, useAccount } from "wagmi";
import usdtTokenAbi from "@/utils/abis/usdtTokenAdmin.json";
import { polygon } from "viem/chains";

/**
 * Modern wagmi v2 hook for fetching user's USDT balance.
 * Uses proper React hooks with Reown AppKit integration.
 * 
 * @returns Object with user's USDT balance and loading states
 */
const useUserBalance = () => {
  const { address, isConnected } = useAccount();

  const {
    data: usdtBalance,
    error,
    isLoading,
    isPending,
    refetch,
  } = useReadContract({
    address: process.env
      .NEXT_PUBLIC_USDT_SMART_CONTRACT_ADDRESS as `0x${string}`,
    abi: usdtTokenAbi,
    functionName: "balanceOf",
    args: address && isConnected ? [address] : undefined,
    chainId: polygon.id,
    // Only query if user is connected and has an address
    query: {
      enabled: !!(address && isConnected),
      refetchInterval: 30_000, // Refetch every 30 seconds
    },
  });

  return {
    // Balance data
    usdtBalance,
    
    // Loading states
    isLoading,
    isPending,
    
    // Error state
    error,
    
    // User connection state
    isConnected,
    userAddress: address,
    
    // Actions
    refetch,
  };
};

export default useUserBalance;