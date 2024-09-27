import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertContractUnits = (
  bigNumber: bigint,
  isEthereumUnit = true
): number => {
  if (typeof bigNumber !== "bigint") {
    throw new Error("Expected a BigInt input for conversion");
  }

  // If it's an Ethereum unit (e.g., wei), convert using the appropriate factor (10^6 in your case)
  if (isEthereumUnit) {
    const weiInEther = BigInt(1000000); // Assuming we're converting from gwei to ether
    const etherAmount = bigNumber / weiInEther;
    return Number(etherAmount);
  }

  // If it's not an Ethereum unit, just convert the BigInt directly to a regular number
  return Number(bigNumber);
};

// This function is used to calculate the percentage bar, based on the investment goal and the amount raised so far.
export const calculateBarPercentage = (
  totalTokens: number,
  remainingTokens: number | any
) => {
  // Guard clause for edge cases
  if (totalTokens === 0) return 0; // Avoid division by zero if totalTokens is 0
  if (remainingTokens === 0) return 100; // All tokens sold
  if (totalTokens === remainingTokens) return 0; // No tokens sold

  // Calculate the number of tokens sold
  const tokensSold = totalTokens - remainingTokens;

  // Calculate the percentage of tokens sold
  const percentage = Math.round((tokensSold * 100) / totalTokens);

  return percentage;
};
