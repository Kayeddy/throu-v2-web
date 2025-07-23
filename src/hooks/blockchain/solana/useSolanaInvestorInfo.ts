import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import type { ProgramRealState } from "@/utils/types/shared/solana";
import programIdl from "@/utils/idls/program_real_state.json";

// Create PROGRAM_ID as a constant outside the component to prevent re-creation
const PROGRAM_ID = new PublicKey(programIdl.address);

// Define properly typed interfaces based on the IDL
interface InvestorAccount {
  shares: bigint; // u64 -> bigint
  amountWithdrawn: bigint; // u64 -> bigint
  project: PublicKey; // pubkey -> string
  owner: PublicKey; // pubkey -> string
}

// Legacy interface removed - no longer needed

// Normalized investor info to match EVM structure
interface NormalizedInvestorInfo {
  tokenCount: number;
  investmentAmount: number;
  profitAmount: number;
  isActive: boolean;
  hasInvestment: boolean;
  projectId: string;
  chain: "solana";
}

interface UseSolanaInvestorInfoReturn {
  data: NormalizedInvestorInfo | null;
  isPending: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSolanaInvestorInfo(
  projectId: string
): UseSolanaInvestorInfoReturn {
  const [data, setData] = useState<NormalizedInvestorInfo | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Track if we're currently fetching to prevent duplicate requests
  const isFetchingRef = useRef(false);
  const lastProjectIdRef = useRef<string | null>(null);
  const lastAddressRef = useRef<string | null>(null);

  const { connection } = useAppKitConnection();
  const { address, isConnected } = useAppKitAccount();

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

      let correctProgramInstance: Program<ProgramRealState>;

      correctProgramInstance = new Program<ProgramRealState>(
        programIdl,
        provider
      );

      // Create program instance using the IDL
      // const programInstance = new Program(
      //   programIdl as ProgramRealState,
      //   provider
      // );

      console.log(
        "✅ [SOLANA INVESTOR] Anchor program initialized:",
        PROGRAM_ID.toString()
      );
      return correctProgramInstance;
    } catch (error) {
      console.error(
        "❌ [SOLANA INVESTOR] Failed to initialize Anchor program:",
        error
      );
      return null;
    }
  }, [connection?.rpcEndpoint]);

  const refetch = useCallback(async () => {
    // Skip if projectId is empty string or missing required dependencies
    if (
      !connection ||
      !program ||
      !projectId ||
      projectId === "" ||
      !address ||
      !isConnected ||
      isFetchingRef.current
    ) {
      console.log("🚫 [SOLANA INVESTOR] Skipping fetch:", {
        hasConnection: !!connection,
        hasProgram: !!program,
        projectId,
        hasAddress: !!address,
        isConnected,
        isFetching: isFetchingRef.current,
      });
      return;
    }

    // Prevent duplicate fetches
    isFetchingRef.current = true;
    setIsPending(true);
    setError(null);

    try {
      console.log("🔍 [SOLANA INVESTOR] Fetching investor info:", {
        projectId,
        address,
      });

      const projectIdBN = new BN(projectId);
      const investorPubkey = new PublicKey(address);

      // Derive the PDA for the investor account
      // CORRECT ORDER from IDL: ["investor", signer, project_id]
      const [investorPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("investor"),
          investorPubkey.toBuffer(),
          projectIdBN.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      console.log("🔑 [SOLANA INVESTOR] Investor PDA:", investorPDA.toString());

      // Try to fetch the investor account with proper typing
      let investorAccount;
      try {
        // Fetch investor account using the correct account name from IDL
        investorAccount = await program.account.investor.fetch(investorPDA);
      } catch (err) {
        console.log(
          "ℹ️ [SOLANA INVESTOR] No investment found for this address in project",
          projectId
        );
        // No investment found - this is not an error, just means user hasn't invested
        setData({
          tokenCount: 0,
          investmentAmount: 0,
          profitAmount: 0,
          isActive: false,
          hasInvestment: false,
          projectId,
          chain: "solana",
        });
        return;
      }

      console.log(
        "✅ [SOLANA INVESTOR] Raw investor account data:",
        investorAccount
      );

      // We need to fetch project data to get the token price for investment calculation
      console.log("🔍 [SOLANA INVESTOR] Fetching project data for investment calculation...");
      
      const [projectPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("project"),
          projectIdBN.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      let projectAccount;
      try {
        projectAccount = await program.account.projectAccount.fetch(projectPDA);
      } catch (err) {
        console.warn("⚠️ [SOLANA INVESTOR] Could not fetch project data for investment calculation:", err);
        // Fall back to basic data without investment amount calculation
        setData({
          tokenCount: Number(investorAccount.shares),
          investmentAmount: 0,
          profitAmount: 0,
          isActive: investorAccount.shares > BigInt(0),
          hasInvestment: investorAccount.shares > BigInt(0),
          projectId,
          chain: "solana",
        });
        return;
      }

      // Cast to typed interface and normalize the investor data
      const typedAccount: InvestorAccount = investorAccount;
      const tokenCount = Number(typedAccount.shares);
      const tokenPrice = Number(projectAccount.price);
      
      // Calculate investment amount: shares * token_price (considering 6 decimal places for Solana tokens)
      const investmentAmount = (tokenCount * tokenPrice) / Math.pow(10, 6);
      
      // For profit calculation, we would need the current token value vs original investment
      // For now, we'll use amountWithdrawn as profit if available
      const profitAmount = Number(typedAccount.amountWithdrawn) / Math.pow(10, 6);

      console.log("💰 [SOLANA INVESTOR] Investment calculation:", {
        tokenCount,
        tokenPrice,
        rawTokenPrice: tokenPrice,
        investmentAmount,
        profitAmount,
        shares: typedAccount.shares.toString(),
        amountWithdrawn: typedAccount.amountWithdrawn.toString(),
      });

      const normalizedData: NormalizedInvestorInfo = {
        tokenCount,
        investmentAmount,
        profitAmount,
        isActive: typedAccount.shares > BigInt(0),
        hasInvestment: typedAccount.shares > BigInt(0),
        projectId,
        chain: "solana",
      };

      console.log("🎯 [SOLANA INVESTOR] Normalized investor data:", {
        shares: typedAccount.shares.toString(),
        amountWithdrawn: typedAccount.amountWithdrawn.toString(),
        project: typedAccount.project.toString(),
        owner: typedAccount.owner.toString(),
        normalized: normalizedData,
      });

      setData(normalizedData);
      lastProjectIdRef.current = projectId;
      lastAddressRef.current = address;
      setError(null);
      console.log(
        "✅ [SOLANA INVESTOR] Investor info fetched and normalized successfully!"
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch Solana investor info";

      console.error("❌ [SOLANA INVESTOR] Fetch error:", err);
      setError(new Error(errorMessage));
    } finally {
      setIsPending(false);
      isFetchingRef.current = false;
    }
  }, [connection, program, projectId, address, isConnected]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    // Clear data when conditions aren't met
    if (!isConnected || !projectId || projectId === "" || !address) {
      setData(null);
      setError(null);
      setIsPending(false);
      return;
    }

    // Only fetch if we have all required dependencies and haven't fetched this combination yet
    const shouldFetch =
      isConnected &&
      connection &&
      program &&
      projectId &&
      projectId !== "" &&
      address &&
      !isFetchingRef.current &&
      (lastProjectIdRef.current !== projectId ||
        lastAddressRef.current !== address);

    if (shouldFetch) {
      // Small delay to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
        console.log(
          "🚀 [SOLANA INVESTOR] Auto-fetching investor info due to dependency change"
        );
        refetch();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isConnected, connection, program, projectId, address, refetch]);

  return { data, isPending, error, refetch };
}
