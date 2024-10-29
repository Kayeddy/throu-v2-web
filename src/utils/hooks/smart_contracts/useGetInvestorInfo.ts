import { useState, useEffect } from "react";
import { useReadContract, useAccount } from "wagmi";
import userAdminAbi from "@/utils/abis/userAdmin.json";

/**
 * React hook to fetch user profile investment data using the updated useReadContract.
 * It will only run if the user is connected and the address is available.
 *
 * @returns {object} - Returns user's investment data, any error encountered, and the loading state.
 */
const useGetInvestorInfo = () => {
  const { address, isConnected } = useAccount();

  const [userInvestmentData, setUserInvestmentData] = useState<any | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(true);

  // Only call the contract if the address and isConnected are available
  const shouldFetch = !!address && isConnected;

  // Read user investment data from the smart contract using useReadContract
  const { data, isError, isLoading } = useReadContract({
    address: shouldFetch
      ? "0x32597E6De69c7c30dfBc8eEe5c37d2CA72658492"
      : undefined, // Only set address if shouldFetch is true
    abi: userAdminAbi,
    functionName: shouldFetch ? "getInfoInvestorByAddress" : undefined, // Set functionName if shouldFetch is true
    args: shouldFetch ? [0, address] : undefined, // Set args only if shouldFetch is true
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!shouldFetch) {
        setIsPending(false); // Stop fetching if conditions aren't met
        return;
      }

      try {
        if (isLoading) {
          setIsPending(true);
          return;
        }

        if (isError) {
          setError(new Error("Failed to fetch user investment data."));
          setIsPending(false);
          return;
        }

        // If data is available, update the state
        if (data) {
          setUserInvestmentData(data);
        }
      } catch (err) {
        setError(err as Error); // Handle error
      } finally {
        setIsPending(false); // Stop loading after fetching
      }
    };

    fetchUserData();
  }, [data, isError, isLoading, shouldFetch]);

  return {
    userInvestmentData,
    error,
    isPending,
  };
};

export default useGetInvestorInfo;
