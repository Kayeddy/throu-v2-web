// DISABLED: EVM Smart Contract Hook - Will be re-implemented with 2025 standards
// import { useReadContract, useAccount } from "wagmi";
// import usdtTokenAbi from "@/utils/abis/usdtTokenAdmin.json";

const useGetUserUsdtBalance = () => {
  // TODO: Re-implement with 2025 EVM standards when needed
  // const { address, isConnected } = useAccount();

  // const {
  //   data: usdtBalance,
  //   error,
  //   isLoading,
  // } = useReadContract({
  //   address: process.env
  //     .NEXT_PUBLIC_USDT_SMART_CONTRACT_ADDRESS as `0x${string}`,
  //   abi: usdtTokenAbi,
  //   functionName: "balanceOf",
  //   args: address && isConnected ? [address] : undefined,
  // });

  return {
    usdtBalance: null as bigint | null,
    error: null,
    isLoading: false,
  };
};
export default useGetUserUsdtBalance;
