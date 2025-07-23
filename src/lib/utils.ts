import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProjectDetails } from "@/utils/types/shared/project";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =============================================================================
// EVM UTILITIES
// =============================================================================

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

// =============================================================================
// SOLANA UTILITIES
// =============================================================================

/**
 * Convert Solana lamports to SOL
 * @param lamports - Amount in lamports (smallest unit)
 * @returns Amount in SOL
 */
export const lamportsToSol = (lamports: number | bigint): number => {
  const lamportsBigInt =
    typeof lamports === "bigint" ? lamports : BigInt(lamports);
  const solInLamports = BigInt(1000000000); // 1 SOL = 1,000,000,000 lamports
  return Number(lamportsBigInt) / Number(solInLamports);
};

/**
 * Convert SOL to lamports
 * @param sol - Amount in SOL
 * @returns Amount in lamports
 */
export const solToLamports = (sol: number): bigint => {
  const solInLamports = BigInt(1000000000); // 1 SOL = 1,000,000,000 lamports
  return BigInt(Math.floor(sol * Number(solInLamports)));
};

/**
 * Convert Solana token units based on decimals
 * @param value - Token value in smallest unit
 * @param decimals - Number of decimal places (default: 6 for USDC)
 * @returns Converted value as number
 */
export const convertSolanaTokenUnits = (
  value: bigint | number | string,
  decimals: number = 6
): number => {
  const valueString = value.toString();
  const valueBigInt = BigInt(valueString);
  const conversionFactor = BigInt(10 ** decimals);
  return Number(valueBigInt) / Number(conversionFactor);
};

/**
 * Format Solana token units to string with proper decimal places
 * @param value - Token value in smallest unit
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export const formatSolanaTokenUnits = (
  value: bigint | number | string,
  decimals: number = 6
): string => {
  const valueStr = value.toString();

  // If the value is smaller than the decimal places, pad with zeros
  if (valueStr.length <= decimals) {
    return "0." + "0".repeat(decimals - valueStr.length) + valueStr;
  }

  // Otherwise, insert the decimal point
  const integerPart = valueStr.slice(0, -decimals);
  const decimalPart = valueStr.slice(-decimals);
  return integerPart + "." + decimalPart;
};

/**
 * Convert Solana token price from raw format (with 6 decimals) to display format
 * @param rawPrice - Raw token price with 6 decimals (e.g., 45000000)
 * @returns Display price (e.g., 45.00)
 */
export const convertSolanaTokenPriceToDisplay = (
  rawPrice: number | string
): number => {
  return convertSolanaTokenUnits(rawPrice, 6);
};

/**
 * Convert investment amount to Solana blockchain format (6 decimals)
 * @param usdAmount - USD amount to invest (e.g., 100)
 * @returns Amount in smallest unit with 6 decimals (e.g., 100000000)
 */
export const convertUsdToSolanaTokenUnits = (usdAmount: number): number => {
  return Math.floor(usdAmount * 1_000_000);
};

/**
 * Calculate Solana investment amount for blockchain transaction
 * @param usdAmount - USD amount to invest
 * @param rawTokenPrice - Raw token price with 6 decimals
 * @returns Final value to send to Solana blockchain
 */
export const calculateSolanaInvestmentAmount = (
  usdAmount: number,
  rawTokenPrice: number
): {
  tokensToReceive: number;
  amountToSend: number;
} => {
  // Convert USD to display format for token calculation
  const displayPrice = convertSolanaTokenPriceToDisplay(rawTokenPrice);
  const tokensToReceive = usdAmount / displayPrice;

  // Amount to send to blockchain (USD * 1,000,000)
  const amountToSend = convertUsdToSolanaTokenUnits(usdAmount);

  return {
    tokensToReceive,
    amountToSend,
  };
};

// =============================================================================
// GENERIC UTILITIES (Used by both EVM and Solana)
// =============================================================================

// This function is used to calculate the progress percentage bar, based on the investment goal and the amount raised so far.
export const calculateBarPercentage = (
  totalTokens: number,
  remainingTokens: number | bigint
) => {
  // Convert remainingTokens to number if it's a BigInt
  const remainingTokensNumber =
    typeof remainingTokens === "bigint"
      ? Number(remainingTokens)
      : remainingTokens;

  // Guard clause for edge cases
  if (totalTokens === 0) return 0; // Avoid division by zero if totalTokens is 0
  if (remainingTokensNumber === 0) return 100; // All tokens sold
  if (totalTokens === remainingTokensNumber) return 0; // No tokens sold

  // Calculate the number of tokens sold
  const tokensSold = totalTokens - remainingTokensNumber;

  // Calculate the percentage of tokens sold
  const exactPercentage = (tokensSold * 100) / totalTokens;
  
  // If tokens are sold but percentage rounds to 0, show at least 1%
  const percentage = tokensSold > 0 && exactPercentage < 1 
    ? 1 
    : Math.round(exactPercentage);

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
 * Generate a project URL with network support
 * @param project - The project details
 * @param locale - The current locale
 * @returns The formatted project URL
 */
export function generateProjectUrl(
  project: ProjectDetails,
  locale: string = "en"
): string {
  const projectNameSlug = slugify(project.projectURI?.name ?? "project");
  const projectId = project.projectId || 0;
  const network = project.chain === "solana" ? "solana" : "polygon";
  return `/${locale}/marketplace/projects/${network}/${projectNameSlug}-${projectId}`;
}

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
