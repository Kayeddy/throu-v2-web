// DISABLED: EVM Smart Contract Hook - Will be re-implemented with 2025 standards
// import { useReadContract, useAccount } from "wagmi";
// import { projectAdminAbi } from "@/utils/abis/projectAdmin.json";

/**
 * React hook to fetch user profile investment data using the updated useReadContract.
 * It will only run if the user is connected and the address is available.
 *
 * @returns {object} - Returns user's investment data, any error encountered, and the loading state.
 */
const useGetInvestorInfo = () => {
  // TODO: Re-implement with 2025 EVM standards when needed
  // const { address, isConnected } = useAccount();

  // const {
  //   data: userInvestmentData,
  //   error,
  //   isPending,
  // } = useReadContract({
  //   address: process.env
  //     .NEXT_PUBLIC_PROJECT_SMART_CONTRACT_ADDRESS as `0x${string}`,
  //   abi: projectAdminAbi,
  //   functionName: "getInvestorInfo",
  //   args: address && isConnected ? [address] : undefined,
  // });

  return {
    userInvestmentData: null,
    error: null,
    isPending: false,
  };
};

export default useGetInvestorInfo;
