import { config } from "@/lib/wagmi";
import {
  writeContract,
  simulateContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import usdtTokenAbi from "@/utils/abis/usdtTokenAdmin.json";
import { ethers } from "ethers";
import { polygon } from "viem/chains";

export default async function useApproveInvestmentAmount(
  investmentAmount: number
) {
  const parsedInvestmentAmount = ethers
    .parseUnits(investmentAmount.toString(), 6)
    .toString();

  const { request } = await simulateContract(config, {
    abi: usdtTokenAbi,
    address: process.env
      .NEXT_PUBLIC_USDT_SMART_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "approve",
    args: [
      process.env
        .NEXT_PUBLIC_PROJECT_ADMIN_SMART_CONTRACT_ADDRESS as `0x${string}`,
      parsedInvestmentAmount,
    ],
    chainId: polygon.id,
  });

  const hash = await writeContract(config, request);

  // TODO: Replace this with use wait for transaction so I can make use of the loading states
  const transactionReceipt = await waitForTransactionReceipt(config, {
    hash: hash,
    pollingInterval: 1_000,
  });

  return {
    paymentApprovalTransactionHash: hash,
    paymentApprovalTransactionReceipt: transactionReceipt,
  };
}
