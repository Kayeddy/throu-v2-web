import { useReadContract, useAccount } from "wagmi";
import projectAdminAbi from "@/utils/abis/projectAdmin.json";
import { polygon } from "viem/chains";

/**
 * Modern wagmi v2 hook for fetching user's investment information.
 * Uses proper React hooks with Reown AppKit integration.
 * 
 * @returns Object with user's investment data and loading states
 */
const useInvestorInfo = () => {
  const { address, isConnected } = useAccount();

  const {
    data: userInvestmentData,
    error,
    isLoading,
    isPending,
    refetch,
  } = useReadContract({
    address: process.env
      .NEXT_PUBLIC_PROJECT_ADMIN_SMART_CONTRACT_ADDRESS as `0x${string}`,
    abi: projectAdminAbi,
    functionName: "getInvestorInfo",
    args: address && isConnected ? [address] : undefined,
    chainId: polygon.id,
    // Only query if user is connected and has an address
    query: {
      enabled: !!(address && isConnected),
      refetchInterval: 60_000, // Refetch every 60 seconds
    },
  });

  return {
    // Investment data
    userInvestmentData,
    
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

export default useInvestorInfo;