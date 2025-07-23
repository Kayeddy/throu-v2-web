import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import type { ProgramRealState } from "@/utils/types/shared/solana";
import { ProjectDetails } from "@/utils/types/shared/project";
import programIdl from "@/utils/idls/program_real_state.json";
import { convertSolanaTokenUnits } from "@/lib/utils";
import { XTREMO_PROJECT_FALLBACK_IMAGE } from "@/hardcoded-projects/xtremo";

// Create PROGRAM_ID as a constant outside the component to prevent re-creation
const PROGRAM_ID = new PublicKey(programIdl.address);

// Define SolanaProject type based on the IDL
interface SolanaProject {
  id: string;
  owner: string;
  tokenSell: string;
  price: string;
  metadataUri: string;
  sharesSold: string;
  shares: string;
  token: string;
  feePlatform: string;
  feeSale: string;
  feeAgent: string;
  withdrawFeeActive: string;
  withdrawFeePasive: string;
  isPasiveProject: boolean;
  isActive: boolean;
  recolected: string;
  gains?: string;
  fees?: string;
  metadata?: {
    name: string;
    description: string;
    image: string;
  };
}

// Utility function to normalize Solana project data to match EVM project structure
const normalizeSolanaProject = (
  solanaProject: SolanaProject
): ProjectDetails => {
  const totalSupply = parseInt(solanaProject.shares);
  const sold = parseInt(solanaProject.sharesSold);
  const remaining = totalSupply - sold;


  // Convert metadata to ProjectURI format if available
  const projectURI = solanaProject.metadata
    ? {
        name: solanaProject.metadata.name,
        description: solanaProject.metadata.description,
        image: solanaProject.metadata.image,
        attributes: [
          { trait_type: "location", value: "none" },
          { trait_type: "type", value: "Real Estate" },
          { trait_type: "blockchain", value: "Solana" },
        ],
      }
    : {
        // Fallback for projects without metadata (useful for testnet)
        name: `Solana Project ${solanaProject.id}`,
        description: "Real estate investment project on Solana blockchain",
        image: XTREMO_PROJECT_FALLBACK_IMAGE, // Using Xtremo render as fallback for Solana
        attributes: [
          { trait_type: "location", value: "none" },
          { trait_type: "type", value: "Real Estate" },
          { trait_type: "blockchain", value: "Solana" },
        ],
      };

  return {
    projectId: solanaProject.id,
    projectActive: solanaProject.isActive,
    // Convert token price from 6 decimals to display format (e.g., 45,000,000 -> 45)
    projectPrice: convertSolanaTokenUnits(solanaProject.price, 6),
    projectTotalSupply: totalSupply,
    projectRemainingTokens: remaining,
    projectSales: sold,
    projectProfit: solanaProject.gains ? parseInt(solanaProject.gains) : 0,
    projectURI,
    projectHolders: [], // This would need to be fetched separately if needed
    projectMedia: solanaProject.metadata?.image
      ? [solanaProject.metadata.image]
      : [],
    chain: "solana" as const,
    // Store the raw price for investment calculations
    rawTokenPrice: parseInt(solanaProject.price),
  };
};

interface UseGetSolanaProjectReturn {
  data: ProjectDetails | null;
  isPending: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGetSolanaProject(
  projectId: string
): UseGetSolanaProjectReturn {
  const [data, setData] = useState<ProjectDetails | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Track if we're currently fetching to prevent duplicate requests
  const isFetchingRef = useRef(false);
  const lastProjectIdRef = useRef<string | null>(null);
  const lastErrorRef = useRef<string | null>(null);

  const { connection } = useAppKitConnection();
  const { isConnected } = useAppKitAccount();

  // Create stable program instance using useMemo
  const program = useMemo(() => {
    if (!connection || !connection.rpcEndpoint) {
      return null;
    }

    try {
      // Create a minimal wallet interface for Anchor (read-only operations)
      const wallet = {
        publicKey: null,
        signTransaction: async () => {
          throw new Error("Signing not supported in read-only mode");
        },
        signAllTransactions: async () => {
          throw new Error("Signing not supported in read-only mode");
        },
      };

      // Create Anchor provider
      const provider = new AnchorProvider(connection, wallet as any, {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      });

      // Create program instance using the IDL
      const programInstance = new Program(
        programIdl as ProgramRealState,
        provider
      );

      console.log(
        "✅ [SOLANA] Anchor program initialized:",
        PROGRAM_ID.toString()
      );
      return programInstance;
    } catch (error) {
      console.error("❌ [SOLANA] Failed to initialize Anchor program:", error);
      return null;
    }
  }, [connection?.rpcEndpoint]);

  const refetch = useCallback(async () => {
    if (!connection || !program || !projectId || isFetchingRef.current) {
      console.log("🚫 [SOLANA] Skipping fetch:", {
        hasConnection: !!connection,
        hasProgram: !!program,
        hasProjectId: !!projectId,
        isFetching: isFetchingRef.current,
      });
      return;
    }

    // Prevent duplicate fetches
    isFetchingRef.current = true;
    setIsPending(true);
    setError(null);

    try {
      console.log("🔍 [SOLANA] Fetching project with Anchor:", projectId);
      console.log("📡 [SOLANA] Using program ID:", PROGRAM_ID.toString());
      console.log("🌐 [SOLANA] Connection endpoint:", connection.rpcEndpoint);

      const convertedProjectId = new BN(projectId);

      // Derive the PDA for the project account
      const [projectPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("project"),
          convertedProjectId.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      console.log("🔑 [SOLANA] Project PDA:", projectPDA.toString());

      // Use Anchor to fetch the account data
      console.log("📦 [SOLANA] Fetching account data with Anchor...");

      // Try to fetch the account using different approaches
      let projectAccount;
      try {
        // Approach 1: Use bracket notation to access account by name
        projectAccount = await (program.account as any)["projectAccount"].fetch(
          projectPDA
        );
      } catch (err) {
        console.log("🔄 [SOLANA] Trying alternative account name...");
        try {
          // Approach 2: Try exact IDL name
          projectAccount = await (program.account as any)[
            "ProjectAccount"
          ].fetch(projectPDA);
        } catch (err2) {
          console.log("🔄 [SOLANA] Trying raw account parsing...");
          // Approach 3: Fall back to raw account info and manual parsing
          const accountInfo = await connection.getAccountInfo(projectPDA);
          if (!accountInfo) {
            throw new Error(`Project account not found for ID: ${projectId}`);
          }

          // For now, throw an error with useful information
          throw new Error(
            `Could not parse account data. Account exists but parsing failed. Account data length: ${accountInfo.data.length} bytes`
          );
        }
      }

      console.log("✅ [SOLANA] Raw account data:", projectAccount);

      // Convert the Anchor account data to our interface
      const project: SolanaProject = {
        id: projectAccount.projectId.toString(),
        owner: projectAccount.owner.toString(),
        tokenSell: projectAccount.tokenSell.toString(),
        price: projectAccount.price.toString(),
        metadataUri: projectAccount.metadataUri,
        sharesSold: projectAccount.sharesSold.toString(),
        shares: projectAccount.shares.toString(),
        token: projectAccount.token.toString(),
        feePlatform: projectAccount.feePlatform.toString(),
        feeSale: projectAccount.feeSale.toString(),
        feeAgent: projectAccount.feeAgent.toString(),
        withdrawFeeActive: projectAccount.withdrawFeeActive.toString(),
        withdrawFeePasive: projectAccount.withdrawFeePasive.toString(),
        isPasiveProject: projectAccount.isPasiveProject,
        isActive: projectAccount.isActive,
        recolected: projectAccount.recolected.toString(),
        gains: projectAccount.gains?.toString(),
        fees: projectAccount.fees?.toString(),
      };

      console.log("🎯 [SOLANA] Converted project data:", project);

      // If metadata URI is available, fetch the metadata
      if (
        project.metadataUri &&
        project.metadataUri !== "placeholder" &&
        project.metadataUri.trim() !== ""
      ) {
        try {
          console.log(
            "🌐 [SOLANA] Fetching metadata from:",
            project.metadataUri
          );
          const metadataResponse = await fetch(project.metadataUri);

          if (metadataResponse.ok) {
            const metadata = await metadataResponse.json();
            project.metadata = metadata;
            console.log("✅ [SOLANA] Metadata fetched:", metadata);
          } else {
            console.warn(
              "⚠️ [SOLANA] Metadata fetch failed with status:",
              metadataResponse.status
            );
          }
        } catch (metadataError) {
          console.warn("⚠️ [SOLANA] Failed to fetch metadata:", metadataError);
        }
      }

      // Normalize the project data to match EVM structure
      const normalizedProject = normalizeSolanaProject(project);
      setData(normalizedProject);
      lastProjectIdRef.current = projectId;
      lastErrorRef.current = null; // Clear error state on successful fetch
      setError(null); // Clear any previous errors
      console.log("✅ [SOLANA] Project fetched and normalized successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch Solana project with Anchor";

      // Handle "account not found" errors more gracefully
      if (
        errorMessage.includes("account not found") ||
        errorMessage.includes("Project account not found")
      ) {
        console.log(
          `ℹ️ [SOLANA] Project ID ${projectId} not found on blockchain (this is expected for non-existent projects)`
        );
        lastErrorRef.current = `not_found_${projectId}`;
        setError(new Error(`Project not found: ${projectId}`));
      } else {
        console.error("❌ [SOLANA] Anchor fetch error:", err);
        lastErrorRef.current = null; // Reset for other types of errors
        setError(new Error(errorMessage));
      }
    } finally {
      setIsPending(false);
      isFetchingRef.current = false;
    }
  }, [connection, program, projectId]);

  // Auto-fetch when dependencies change with debounce
  useEffect(() => {
    // Reset error tracking when project ID changes
    if (
      lastProjectIdRef.current !== projectId &&
      lastProjectIdRef.current !== null
    ) {
      lastErrorRef.current = null;
    }

    // Don't retry projects that we know don't exist
    const isKnownNotFound = lastErrorRef.current === `not_found_${projectId}`;

    // Only fetch if we have all required dependencies and haven't fetched this project yet
    const shouldFetch =
      isConnected &&
      connection &&
      program &&
      projectId &&
      !isFetchingRef.current &&
      lastProjectIdRef.current !== projectId &&
      !isKnownNotFound;

    if (shouldFetch) {
      // Small delay to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
        console.log(
          "🚀 [SOLANA] Auto-fetching project with Anchor due to dependency change"
        );
        refetch();
      }, 100);

      return () => clearTimeout(timeoutId);
    } else if (isKnownNotFound) {
      console.log(
        `⏭️ [SOLANA] Skipping auto-fetch for project ${projectId} (known to not exist)`
      );
    }
  }, [isConnected, connection, program, projectId, refetch]);

  return { data, isPending, error, refetch };
}
