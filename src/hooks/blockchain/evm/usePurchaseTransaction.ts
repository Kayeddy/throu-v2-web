import {
  useWriteContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import projectAdminAbi from "@/utils/abis/projectAdmin.json";
import { ethers } from "ethers";

/**
 * Modern wagmi v2 hook for purchasing project investments.
 * Uses proper React hooks instead of legacy @wagmi/core patterns.
 *
 * @param investmentAmount - The amount to invest (in USDT)
 * @param projectId - The ID of the project to invest in
 * @returns Object with purchase transaction functions and states
 */
export const usePurchaseTransaction = (
  investmentAmount: number,
  projectId: number = 0
) => {
  const parsedInvestmentAmount = ethers
    .parseUnits(investmentAmount.toString(), 6)
    .toString();

  // Simulate the purchase transaction
  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: process.env
      .NEXT_PUBLIC_PROJECT_ADMIN_SMART_CONTRACT_ADDRESS as `0x${string}`,
    abi: projectAdminAbi,
    functionName: "buyProject2",
    args: [projectId, parsedInvestmentAmount],
  });

  // Write the purchase transaction
  const {
    data: transactionHash,
    error: writeError,
    isPending: isWritePending,
    writeContract,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    data: transactionReceipt,
    error: receiptError,
    isPending: isReceiptPending,
  } = useWaitForTransactionReceipt({
    hash: transactionHash,
    pollingInterval: 1_000,
  });

  // Function to execute the purchase transaction
  const executePurchase = () => {
    if (simulateData?.request) {
      writeContract(simulateData.request);
    }
  };

  return {
    // Transaction data
    transactionHash,
    transactionReceipt,

    // Loading states
    isPending: isWritePending || isReceiptPending,
    isWritePending,
    isReceiptPending,

    // Error states
    error: simulateError || writeError || receiptError,
    simulateError,
    writeError,
    receiptError,

    // Actions
    executePurchase,

    // Legacy return format for backward compatibility
    investmentTransactionHash: transactionHash,
    investmentTransactionReceipt: transactionReceipt,
  };
};
