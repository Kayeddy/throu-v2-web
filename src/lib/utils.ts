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

export const convertBalanceUnits = (
  bigNumber: bigint,
  decimals: number = 18 // Ethereum default
): number => {
  if (typeof bigNumber !== "bigint") {
    throw new Error("Expected a BigInt input for conversion");
  }

  const conversionFactor = BigInt(10 ** decimals);
  const adjustedAmount = Number(bigNumber) / Number(conversionFactor);

  return adjustedAmount;
};

// This function is used to calculate the progress percentage bar, based on the investment goal and the amount raised so far.
export const calculateBarPercentage = (
  totalTokens: number,
  remainingTokens: number | bigint
) => {
  // Convert remainingTokens to number if it's a BigInt
  const remainingTokensNumber = typeof remainingTokens === "bigint" 
    ? Number(remainingTokens) 
    : remainingTokens;
  
  // Guard clause for edge cases
  if (totalTokens === 0) return 0; // Avoid division by zero if totalTokens is 0
  if (remainingTokensNumber === 0) return 100; // All tokens sold
  if (totalTokens === remainingTokensNumber) return 0; // No tokens sold

  // Calculate the number of tokens sold
  const tokensSold = totalTokens - remainingTokensNumber;

  // Calculate the percentage of tokens sold
  const percentage = Math.round((tokensSold * 100) / totalTokens);

  // Ensure percentage is between 0 and 100
  return Math.min(Math.max(percentage, 0), 100);
};

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both sides
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters (except hyphens)
    .replace(/\-\-+/g, "-") // Replace multiple hyphens with a single one
    .replace(/^-+/, "") // Remove leading hyphens
    .replace(/-+$/, ""); // Remove trailing hyphens
};

/**
 * Generates a responsive sizes string for Next.js Image with fill property
 * @param mobile Size for mobile devices (default: 100vw)
 * @param tablet Size for tablet devices (default: 50vw)
 * @param desktop Size for desktop devices (default: 33vw)
 * @returns A sizes string for the Next.js Image component
 */
export const responsiveImageSizes = (
  mobile = "100vw",
  tablet = "50vw",
  desktop = "33vw"
): string => {
  return `(max-width: 768px) ${mobile}, (max-width: 1200px) ${tablet}, ${desktop}`;
};
