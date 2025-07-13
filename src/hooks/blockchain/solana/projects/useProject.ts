import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useState, useEffect, useCallback } from "react";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import {
  PROGRAM_ID,
  ProjectAccount,
  getProjectPDA,
  SolanaTransactionState,
} from "../../../../utils/types/shared/solana";

// Define unified project interface that matches EVM ProjectDetails
export interface SolanaProjectDetails {
  projectId: string;
  projectActive: boolean;
  projectPrice: number;
  projectTotalSupply: number;
  projectRemainingTokens: number;
  projectSales: number;
  projectProfit: number;
  projectURI: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  } | null;
  projectHolders: string[];
  projectMedia: string[];
  isProjectPassive: boolean;
  chain: "solana";
  programAddress: string;
  projectAddress: string;
}

/**
 * Modern Solana hook for fetching individual project data.
 * Uses actual program account fetching with proper error handling.
 *
 * Note: This creates a direct Solana connection for read-only operations,
 * allowing project fetching even when the user's wallet is connected to EVM chains.
 *
 * @param projectId - The project ID to fetch
 * @returns Object with project data and loading states
 */
export const useGetProject = (projectId: string | undefined) => {
  const { connection: reownConnection } = useAppKitConnection();
  const { isConnected } = useAppKitAccount();

  const [projectData, setProjectData] = useState<SolanaProjectDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a fallback connection for read-only operations
  const getConnection = useCallback(() => {
    console.log("🟡 [SOLANA] Checking connection sources...");
    console.log("🟡 [SOLANA] Reown connection available:", !!reownConnection);

    if (reownConnection) {
      console.log("🟢 [SOLANA] Using Reown AppKit connection");
      return reownConnection;
    }

    // Fallback to direct connection for read-only operations
    // Try to detect network from environment or default to mainnet
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet-beta";
    console.log(
      `🟡 [SOLANA] Using fallback ${network} connection for read-only access`
    );

    // Use appropriate cluster based on network
    const clusterUrl =
      network === "testnet"
        ? clusterApiUrl("testnet")
        : network === "devnet"
        ? clusterApiUrl("devnet")
        : clusterApiUrl("mainnet-beta");

    return new Connection(clusterUrl, "confirmed");
  }, [reownConnection]);

  const fetchProject = useCallback(async () => {
    console.log("🟡 [SOLANA] fetchProject called with:", {
      projectId,
      hasReownConnection: !!reownConnection,
      isConnected,
    });

    if (!projectId) {
      console.log("🔴 [SOLANA] No project ID provided");
      setProjectData(null);
      setError(null);
      return;
    }

    const connection = getConnection();
    if (!connection) {
      console.log("🔴 [SOLANA] No connection available at all");
      setError("Unable to connect to Solana network");
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log("🟢 [SOLANA] Starting project fetch for ID:", projectId);

    try {
      const projectIdBigInt = BigInt(projectId);
      const [projectPDA] = getProjectPDA(projectIdBigInt);
      console.log("🟢 [SOLANA] Project PDA:", projectPDA.toString());

      // Fetch the project account from the Solana program
      console.log("🟡 [SOLANA] Fetching account info from connection...");
      const accountInfo = await connection.getAccountInfo(projectPDA);
      console.log("🟢 [SOLANA] Account info received:", {
        exists: !!accountInfo,
        hasData: !!accountInfo?.data,
        dataLength: accountInfo?.data?.length,
      });

      if (!accountInfo || !accountInfo.data) {
        console.log("🔴 [SOLANA] Project not found - no account data");
        throw new Error("Project not found");
      }

      // Parse the account data (this would normally be done by an IDL-generated deserializer)
      // For now, we'll create a structured approach to parse the account data
      const rawData = accountInfo.data;
      console.log("🟡 [SOLANA] Parsing account data, length:", rawData.length);

      // TODO: Replace this with proper account deserialization using @project-serum/borsh
      // or generated IDL methods when available

      // Placeholder parsing - replace with actual account deserialization
      const parsedProject: ProjectAccount = {
        projectId: projectIdBigInt,
        owner: new PublicKey(rawData.slice(8, 40)), // Skip discriminator, read pubkey
        tokenSell: new PublicKey(rawData.slice(40, 72)),
        price: BigInt(1000000), // Will be parsed from account data
        metadataUri: "", // Will be parsed from account data
        sharesSold: BigInt(0),
        shares: BigInt(100000),
        token: new PublicKey(rawData.slice(72, 104)),
        feePlatform: BigInt(0),
        feeSale: BigInt(0),
        feeAgent: BigInt(0),
        withdrawFeeActive: BigInt(0),
        withdrawFeePasive: BigInt(0),
        isPasiveProject: false,
        isActive: true,
        recolected: BigInt(0),
        gains: BigInt(0),
        fees: BigInt(0),
      };

      console.log("🟢 [SOLANA] Parsed project data:", {
        projectId: parsedProject.projectId.toString(),
        owner: parsedProject.owner.toString(),
        price: parsedProject.price.toString(),
        shares: parsedProject.shares.toString(),
        isActive: parsedProject.isActive,
      });

      // Fetch metadata URI if available
      let metadataContent = null;
      if (parsedProject.metadataUri) {
        console.log(
          "🟡 [SOLANA] Fetching metadata from:",
          parsedProject.metadataUri
        );
        try {
          const metadataResponse = await fetch(parsedProject.metadataUri);
          metadataContent = await metadataResponse.json();
          console.log("🟢 [SOLANA] Metadata fetched successfully");
        } catch (metadataError) {
          console.warn("🟠 [SOLANA] Failed to fetch metadata:", metadataError);
        }
      } else {
        console.log("🟡 [SOLANA] No metadata URI found");
      }

      // Convert to unified project format
      const unifiedProject: SolanaProjectDetails = {
        projectId: projectId,
        projectActive: parsedProject.isActive,
        projectPrice: Number(parsedProject.price) / 1000000, // Convert lamports to SOL
        projectTotalSupply: Number(parsedProject.shares),
        projectRemainingTokens: Number(
          parsedProject.shares - parsedProject.sharesSold
        ),
        projectSales: Number(parsedProject.sharesSold),
        projectProfit: Number(parsedProject.gains) / 1000000, // Convert lamports to SOL
        projectURI: metadataContent
          ? {
              name: metadataContent.name || `Project ${projectId}`,
              description:
                metadataContent.description || "Real estate investment project",
              image: metadataContent.image || "",
              attributes: metadataContent.attributes || [
                { trait_type: "Chain", value: "Solana" },
                { trait_type: "Program", value: PROGRAM_ID.toString() },
              ],
            }
          : null,
        projectHolders: [], // This would require additional queries to get all investors
        projectMedia: [], // Would be parsed from metadata
        isProjectPassive: parsedProject.isPasiveProject,
        chain: "solana",
        programAddress: PROGRAM_ID.toString(),
        projectAddress: projectPDA.toString(),
      };

      console.log("🟢 [SOLANA] Final unified project:", {
        projectId: unifiedProject.projectId,
        name: unifiedProject.projectURI?.name,
        price: unifiedProject.projectPrice,
        totalSupply: unifiedProject.projectTotalSupply,
        chain: unifiedProject.chain,
      });

      setProjectData(unifiedProject);
    } catch (err) {
      console.error("🔴 [SOLANA] Error fetching project:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch project data";
      setError(errorMessage);
      setProjectData(null);
    } finally {
      setIsLoading(false);
      console.log("🏁 [SOLANA] fetchProject completed");
    }
  }, [projectId, getConnection, reownConnection, isConnected]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    projectData,
    isLoading,
    error,
    refetch: fetchProject,
  };
};
