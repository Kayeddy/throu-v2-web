import { useState, useEffect } from "react";
import { useReadContract, useAccount } from "wagmi";
import userAdminAbi from "@/utils/abis/userAdmin.json";

// Normalized investor info to match other hooks
interface NormalizedInvestorInfo {
  tokenCount: number;
  investmentAmount: number;
  profitAmount: number;
  isActive: boolean;
  hasInvestment: boolean;
  projectId: number;
  chain: "polygon";
}

interface UseGetInvestorInfoReturn {
  data: NormalizedInvestorInfo | null;
  error: Error | null;
  isPending: boolean;
}

/**
 * React hook to fetch user profile investment data for a specific EVM project.
 * Following the updated wagmi v2 patterns and consistent with other EVM hooks.
 *
 * @param projectId - The ID of the project to fetch investor info for
 * @returns {UseGetInvestorInfoReturn} - Returns normalized investor data, error state, and loading state
 */
export const useGetInvestorInfo = (projectId: number): UseGetInvestorInfoReturn => {
  const { address, isConnected } = useAccount();

  const [data, setData] = useState<NormalizedInvestorInfo | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(true);

  // Only call the contract if the address and isConnected are available and projectId is valid
  const shouldFetch = !!address && isConnected && typeof projectId === 'number' && projectId >= 0;

  // Read user investment data from the smart contract using useReadContract
  const { 
    data: rawData, 
    isError, 
    isLoading,
    error: contractError 
  } = useReadContract({
    address: shouldFetch 
      ? (process.env.NEXT_PUBLIC_USER_ADMIN_SMART_CONTRACT_ADDRESS as `0x${string}`)
      : undefined,
    abi: userAdminAbi,
    functionName: shouldFetch ? "getInfoInvestorByAddress" : undefined,
    args: shouldFetch ? [projectId, address] : undefined,
    query: {
      enabled: shouldFetch,
      refetchInterval: 10000, // Refresh every 10 seconds like other hooks
    },
  });

  useEffect(() => {
    const processInvestorData = async () => {
      if (!shouldFetch) {
        // Clear data when wallet is disconnected or conditions not met
        setData(null);
        setError(null);
        setIsPending(false);
        return;
      }

      try {
        if (isLoading) {
          setIsPending(true);
          return;
        }

        if (isError || contractError) {
          setError(contractError || new Error("Failed to fetch user investment data."));
          setIsPending(false);
          return;
        }

        // Process the data if available
        if (rawData && Array.isArray(rawData) && rawData.length >= 5) {
          console.log("======== EVM INVESTOR DATA FROM SMART CONTRACT ========");
          console.log("Project ID:", projectId);
          console.log("Address:", address);
          console.log("Raw Data:", rawData);
          console.log("===================================================");

          // Based on the ABI, the return values are:
          // [tokenCount, investmentAmount, profitAmount, isActive, hasInvestment]
          const [tokenCount, investmentAmount, profitAmount, isActive, hasInvestment] = rawData;

          const normalizedData: NormalizedInvestorInfo = {
            tokenCount: typeof tokenCount === 'bigint' ? Number(tokenCount) : Number(tokenCount || 0),
            investmentAmount: typeof investmentAmount === 'bigint' ? Number(investmentAmount) : Number(investmentAmount || 0),
            profitAmount: typeof profitAmount === 'bigint' ? Number(profitAmount) : Number(profitAmount || 0),
            isActive: Boolean(isActive),
            hasInvestment: Boolean(hasInvestment),
            projectId,
            chain: "polygon",
          };

          setData(normalizedData);
          setError(null);
          console.log("✅ [EVM INVESTOR] Investor data processed successfully:", normalizedData);
        } else if (rawData) {
          // If we have data but it's not in expected format, create default
          setData({
            tokenCount: 0,
            investmentAmount: 0,
            profitAmount: 0,
            isActive: false,
            hasInvestment: false,
            projectId,
            chain: "polygon",
          });
          setError(null);
        }
      } catch (err) {
        console.error("❌ [EVM INVESTOR] Error processing investor data:", err);
        setError(err as Error);
      } finally {
        setIsPending(false);
      }
    };

    processInvestorData();
  }, [rawData, isError, isLoading, shouldFetch, contractError, projectId, address]);

  return {
    data,
    error,
    isPending,
  };
};
