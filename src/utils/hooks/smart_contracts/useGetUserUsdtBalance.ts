import { useReadContract, useAccount } from "wagmi";
import usdtTokenAbi from "@/utils/abis/usdtTokenAdmin.json";

const useGetUserUsdtBalance = () => {
  const { address, isConnected } = useAccount();

  const {
    data: usdtBalance,
    error,
    isLoading,
  } = useReadContract({
    address: process.env
      .NEXT_PUBLIC_USDT_SMART_CONTRACT_ADDRESS as `0x${string}`,
    abi: usdtTokenAbi,
    functionName: "balanceOf",
    args: address && isConnected ? [address] : undefined,
  });

  return {
    usdtBalance: usdtBalance as bigint | null,
    error,
    isLoading,
  };
};
export default useGetUserUsdtBalance;
