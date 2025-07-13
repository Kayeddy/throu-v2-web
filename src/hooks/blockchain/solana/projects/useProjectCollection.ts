import { useState, useEffect, useCallback } from "react";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { getProjectPDA } from "../../../../utils/types/shared/solana";

/**
 * Simple hook to test Solana project existence and count
 */
export const useFetchAllSolanaProjects = () => {
  const [totalProjectCount, setTotalProjectCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjectCount = useCallback(async () => {
    console.log("🟡 [SOLANA COLLECTION] fetchProjectCount called");

    setIsLoading(true);
    setError(null);

    try {
      // Create a direct connection for read-only operations
      // Try to detect network from environment or default to mainnet
      const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet-beta";

      // Use appropriate cluster based on network
      const clusterUrl =
        network === "testnet"
          ? clusterApiUrl("testnet")
          : network === "devnet"
          ? clusterApiUrl("devnet")
          : clusterApiUrl("mainnet-beta");

      const connection = new Connection(clusterUrl, "confirmed");
      console.log(`🟢 [SOLANA COLLECTION] Created ${network} connection`);

      // For now, we'll check the first few project PDAs to see how many exist
      // In a real implementation, this would query a counter account or use getProgramAccounts
      let projectCount = 0;
      const maxProjects = 5; // Check first 5 projects for now

      for (let i = 0; i < maxProjects; i++) {
        try {
          const [projectPDA] = getProjectPDA(BigInt(i));
          const accountInfo = await connection.getAccountInfo(projectPDA);

          if (accountInfo && accountInfo.data) {
            console.log(
              `🟢 [SOLANA COLLECTION] Found project ${i} at ${projectPDA.toString()}`
            );
            projectCount++;
          } else {
            console.log(
              `🟡 [SOLANA COLLECTION] Project ${i} not found at ${projectPDA.toString()}`
            );
            // Don't break here - projects might not be sequential
            // break; // Assume projects are sequential
          }
        } catch (err) {
          console.log(
            `🟠 [SOLANA COLLECTION] Error checking project ${i}:`,
            err
          );
          // Don't break - continue checking other projects
        }
      }

      console.log(
        `🟢 [SOLANA COLLECTION] Found ${projectCount} Solana projects out of ${maxProjects} checked`
      );
      setTotalProjectCount(projectCount);
    } catch (err) {
      console.error(
        "🔴 [SOLANA COLLECTION] Error fetching project count:",
        err
      );
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch project count";
      setError(new Error(errorMessage));
    } finally {
      setIsLoading(false);
      console.log("🏁 [SOLANA COLLECTION] fetchProjectCount completed");
    }
  }, []);

  useEffect(() => {
    fetchProjectCount();
  }, [fetchProjectCount]);

  return {
    totalProjectCount,
    isLoading,
    error,
    refetch: fetchProjectCount,
  };
};
