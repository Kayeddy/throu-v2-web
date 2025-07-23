import {
  useWriteContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import usdtTokenAbi from "@/utils/abis/usdtTokenAdmin.json";
import { ethers } from "ethers";
import { polygon } from "viem/chains";

/**
 * Modern wagmi v2 hook for approving USDT spending for investment transactions.
 * Uses proper React hooks instead of legacy @wagmi/core patterns.
 *
 * @param investmentAmount - The amount to approve for spending (in USDT)
 * @returns Object with approval transaction functions and states
 */
export default function useApprovalTransaction(investmentAmount: number) {
  const parsedInvestmentAmount = ethers
    .parseUnits(investmentAmount.toString(), 6)
    .toString();

  // Simulate the approval transaction
  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: process.env
      .NEXT_PUBLIC_USDT_SMART_CONTRACT_ADDRESS as `0x${string}`,
    abi: usdtTokenAbi,
    functionName: "approve",
    args: [
      process.env
        .NEXT_PUBLIC_PROJECT_ADMIN_SMART_CONTRACT_ADDRESS as `0x${string}`,
      parsedInvestmentAmount,
    ],
    chainId: polygon.id,
  });

  // Write the approval transaction
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

  // Function to execute the approval transaction
  const executeApproval = () => {
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
    executeApproval,

    // Legacy return format for backward compatibility
    paymentApprovalTransactionHash: transactionHash,
    paymentApprovalTransactionReceipt: transactionReceipt,
  };
}
