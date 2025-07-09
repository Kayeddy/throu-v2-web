import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useState, useEffect, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import {
  PROGRAM_ID,
  InvestorAccount,
  getInvestorPDA,
} from "../../../../utils/types/shared/solana";

/**
 * Modern Solana hook for fetching user's investment information.
 * Uses Reown AppKit Solana adapter following 2025 best practices.
 *
 * @returns Object with user's investment data and loading states
 */
const useInvestorInfo = () => {
  const { connection } = useAppKitConnection();
  const { address, isConnected } = useAppKitAccount();

  const [investorData, setInvestorData] = useState<InvestorAccount | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestorInfo = useCallback(async () => {
    if (!isConnected || !address) {
      setInvestorData(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual program instruction call once IDL is processed
      // For now, return placeholder data structure

      // This will be replaced with:
      // const investorAccount = await program.account.investor.fetch(investorPDA);

      // Create placeholder data matching InvestorAccount interface
      const userPublicKey = new PublicKey(address);
      const placeholderData: InvestorAccount = {
        shares: BigInt(0), // bigint for shares owned
        amountWithdrawn: BigInt(0), // bigint for amount already withdrawn
        project: PROGRAM_ID, // placeholder PublicKey - will be actual project PDA
        owner: userPublicKey, // user's wallet address
      };

      setInvestorData(placeholderData);
    } catch (err) {
      console.error("Error fetching investor info:", err);
      setError("Failed to fetch investor information");
      setInvestorData(null);
    } finally {
      setIsLoading(false);
    }
  }, [connection, address, isConnected]);

  useEffect(() => {
    fetchInvestorInfo();
  }, [fetchInvestorInfo]);

  return {
    investorData,
    isLoading,
    error,
    refetch: fetchInvestorInfo,
    isConnected,
    address,
  };
};

export default useInvestorInfo;
