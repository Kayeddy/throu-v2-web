import { config } from "@/lib/wagmi";
import {
  writeContract,
  simulateContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import projectAdminAbi from "@/utils/abis/projectAdmin.json";
import { ethers } from "ethers";

export const useBuyInvestmentAmount = async (investmentAmount: number) => {
  const parsedInvestmentAmount = ethers
    .parseUnits(investmentAmount.toString(), 6)
    .toString();

  const { request } = await simulateContract(config, {
    abi: projectAdminAbi,
    address: process.env
      .NEXT_PUBLIC_PROJECT_ADMIN_SMART_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "buyProject2",
    args: [0, parsedInvestmentAmount],
  });
  const hash = await writeContract(config, request);

  const transactionReceipt = await waitForTransactionReceipt(config, {
    hash: hash,
    pollingInterval: 1_000,
  });

  return {
    investmentTransactionHash: hash,
    investmentTransactionReceipt: transactionReceipt,
  };
};
