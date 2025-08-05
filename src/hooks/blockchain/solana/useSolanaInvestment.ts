import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useState, useCallback } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import type { ProgramRealState } from "@/utils/types/shared/solana";
import programIdl from "@/utils/idls/program_real_state.json";
import * as token from "@solana/spl-token";
import { useWalletProvider, useAnchorWallet } from "./useWalletProvider";
import { usePriorityFees } from "./usePriorityFees";

// Create PROGRAM_ID as a constant
const PROGRAM_ID = new PublicKey(programIdl.address);

interface SolanaTransactionState {
  isPending: boolean;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  transactionSignature: string | null;
}

interface UseSolanaInvestmentReturn {
  executePurchase: (
    projectId: string,
    shares: number
  ) => Promise<string | null>;
  isPending: boolean;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  transactionSignature: string | null;
  reset: () => void;
}

/**
 * Modern Solana hook for purchasing project investments using Anchor.
 * Uses the invest_project instruction from the program IDL with proper Anchor integration.
 *
 * This version avoids the proxy state error by accessing the wallet through the connection object.
 *
 * @returns Object with purchase transaction functions and states
 */
export const useSolanaInvestment = (): UseSolanaInvestmentReturn => {
  const { connection } = useAppKitConnection();
  const { address, isConnected } = useAppKitAccount();
  const walletProvider = useWalletProvider();
  const anchorWallet = useAnchorWallet();
  const { addPriorityFee, walletSupportsPriorityFees } = usePriorityFees();

  const [transactionState, setTransactionState] =
    useState<SolanaTransactionState>({
      isPending: false,
      isLoading: false,
      isError: false,
      error: null,
      transactionSignature: null,
    });

  const executePurchase = useCallback(
    async (projectId: string, shares: number) => {
      if (!isConnected || !address || !connection || !walletProvider || !anchorWallet) {
        setTransactionState((prev: SolanaTransactionState) => ({
          ...prev,
          error: "Wallet not connected or not supported",
          isError: true,
        }));
        return null;
      }

      setTransactionState((prev: SolanaTransactionState) => ({
        ...prev,
        isPending: true,
        isLoading: true,
        isError: false,
        error: null,
      }));

      try {
        console.log(`🔌 [SOLANA INVESTMENT] Using wallet: ${walletProvider.walletName}`);
        console.log(`🔑 [SOLANA INVESTMENT] Wallet address: ${address}`);
        console.log(`📡 [SOLANA INVESTMENT] Connection endpoint: ${connection.rpcEndpoint}`);
        
        // Create Anchor provider with the proper wallet interface
        const provider = new AnchorProvider(connection, anchorWallet as any, {
          commitment: "confirmed",
          preflightCommitment: "confirmed",
        });

        let program: Program<ProgramRealState>;

        program = new Program<ProgramRealState>(programIdl, provider);

        const publicKey = new PublicKey(address);
        const projectIdBN = new BN(projectId);
        const sharesBN = new BN(shares);

        console.log("🔍 [SOLANA INVESTMENT] Starting investment transaction:", {
          projectId,
          shares,
          investor: publicKey.toString(),
        });

        // Derive PDAs according to the IDL structure
        const [projectPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("project"), projectIdBN.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        const [investorPDA] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("investor"),
            publicKey.toBuffer(),
            projectIdBN.toArrayLike(Buffer, "le", 8),
          ],
          program.programId
        );

        // First, we need to get the project data to find the mint addresses
        console.log("📦 [SOLANA INVESTMENT] Fetching project data...");
        let projectAccount;
        try {
          projectAccount = await program.account["projectAccount"].fetch(
            projectPDA
          );
        } catch (error) {
          console.error("Failed to fetch project account:", error);
          throw new Error(`Project ${projectId} not found on chain`);
        }

        // Check if project is active
        if (!projectAccount.isActive) {
          throw new Error(
            "Project is not active. Investments are currently disabled."
          );
        }

        const mintSell = new PublicKey(projectAccount.tokenSell);

        console.log(
          "🔍 [SOLANA INVESTMENT] token sell:",
          projectAccount.tokenSell
        );

        const [mintProject] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("mint_project"),
            projectPDA.toBuffer(), // o el project public key
            projectIdBN.toArrayLike(Buffer, "le", 8),
          ],
          program.programId
        );

        console.log("🎯 [SOLANA INVESTMENT] Project mints:", {
          mintSell: mintSell.toString(),
          mintProject: mintProject.toString(),
        });

        // Derive user token accounts using the SPL token helper
        const userTokenAccountMintSell = token.getAssociatedTokenAddressSync(
          mintSell,
          publicKey,
          false,
          token.TOKEN_PROGRAM_ID
        );

        const userTokenAccountMintProject = token.getAssociatedTokenAddressSync(
          mintProject,
          publicKey,
          false,
          new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb") // TOKEN_2022_PROGRAM_ID
        );

        const [programTokenAccountMintSell] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("token_account"),
            projectIdBN.toArrayLike(Buffer, "le", 8),
            mintSell.toBuffer(),
          ],
          program.programId
        );

        const [programTokenAccountMintProject] =
          PublicKey.findProgramAddressSync(
            [
              Buffer.from("token_account"),
              projectIdBN.toArrayLike(Buffer, "le", 8),
              mintProject.toBuffer(),
            ],
            program.programId
          );

        console.log("🎯 [SOLANA INVESTMENT] Derived accounts:", {
          userTokenAccountMintSell: userTokenAccountMintSell.toString(),
          userTokenAccountMintProject: userTokenAccountMintProject.toString(),
          programTokenAccountMintSell: programTokenAccountMintSell.toString(),
          programTokenAccountMintProject:
            programTokenAccountMintProject.toString(),
        });

        // Build the transaction using Anchor but don't send it yet
        console.log(
          "🚀 [SOLANA INVESTMENT] Building invest_project transaction with Anchor..."
        );

        const transaction = await program.methods
          .investProject(projectIdBN, sharesBN)
          .accountsPartial({
            signer: publicKey,
            // investor: investorPDA,
            project: projectPDA,
            mintSell: mintSell,
            mintProject: mintProject,
            userTokenAccountMintSell: userTokenAccountMintSell,
            userTokenAccountMintProject: userTokenAccountMintProject,
            programTokenAccountMintSell: programTokenAccountMintSell,
            programTokenAccountMintProject: programTokenAccountMintProject,
            tokenProgram: token.TOKEN_PROGRAM_ID,
            token2022Program: new PublicKey(
              "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
            ),
            systemProgram: new PublicKey("11111111111111111111111111111111"),
            associatedTokenProgram: token.ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .transaction();

        // Get the latest blockhash
        const latestBlockhash = await connection.getLatestBlockhash("confirmed");
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.feePayer = publicKey;
        
        // Add priority fees if wallet doesn't handle them automatically
        let finalTransaction = transaction;
        if (!walletProvider.supportsPriorityFees) {
          console.log("💰 Adding priority fees to transaction...");
          finalTransaction = await addPriorityFee(transaction, connection, {
            autoEstimate: true // Automatically estimate optimal fees
          });
        } else {
          console.log("✅ Wallet handles priority fees automatically");
        }

        console.log(
          `📡 [SOLANA INVESTMENT] Sending transaction via ${walletProvider.walletName}...`
        );
        console.log(`🎯 [SOLANA INVESTMENT] Transaction details:`, {
          wallet: walletProvider.walletName,
          supportsPriorityFees: walletProvider.supportsPriorityFees,
          feePayer: publicKey.toString(),
          instructions: finalTransaction.instructions.length
        });

        // Simulate transaction first to check for errors
        console.log("🔍 [SOLANA INVESTMENT] Simulating transaction...");
        const simulationResult = await connection.simulateTransaction(finalTransaction);
        
        if (simulationResult.value.err) {
          console.error("❌ [SOLANA INVESTMENT] Simulation failed:", simulationResult.value.err);
          
          // Check if the error is AccountNotFound - this usually means token accounts need to be created
          const errorStr = JSON.stringify(simulationResult.value.err);
          if (errorStr.includes("AccountNotFound")) {
            console.log("💳 [SOLANA INVESTMENT] Token accounts may not exist, transaction will create them");
            console.log("🔄 [SOLANA INVESTMENT] Proceeding with transaction despite simulation error...");
            // Continue with the transaction - it will create the accounts
          } else {
            // Other errors should stop the transaction
            throw new Error(`Transaction simulation failed: ${errorStr}`);
          }
        } else {
          console.log("✅ [SOLANA INVESTMENT] Simulation successful");
        }
        console.log("📝 [SOLANA INVESTMENT] Sending transaction for signing...");
        
        // Use the wallet provider to sign and send the transaction
        let signature: string;
        try {
          // Use skipPreflight for wallets via Reown to avoid double simulation
          // Also skip preflight if we had AccountNotFound error (accounts will be created)
          const skipPreflight = walletProvider.walletName?.includes("Reown") || 
                                walletProvider.walletName?.includes("Trust") ||
                                simulationResult.value.err !== null;
          
          console.log(`🚀 [SOLANA INVESTMENT] Sending with skipPreflight: ${skipPreflight}`);
          signature = await walletProvider.signAndSendTransaction(finalTransaction, skipPreflight);
        } catch (err) {
          console.error("❌ [SOLANA INVESTMENT] Wallet signing failed:", err);
          // If signAndSendTransaction fails, try alternative approach
          if (walletProvider.walletName === "Trust Wallet" || walletProvider.walletName === "Reown Wallet") {
            console.log("🔄 [SOLANA INVESTMENT] Trying fallback method...");
            signature = await connection.sendTransaction(finalTransaction, [], { skipPreflight: true });
          } else {
            throw err;
          }
        }

        console.log("⏳ [SOLANA INVESTMENT] Confirming transaction...");

        // Wait for confirmation with timeout
        const confirmation = await connection.confirmTransaction({
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        }, "confirmed");

        if (confirmation.value.err) {
          throw new Error(
            `Transaction failed: ${JSON.stringify(confirmation.value.err)}`
          );
        }

        console.log(
          "✅ [SOLANA INVESTMENT] Transaction successful:",
          signature
        );

        setTransactionState((prev: SolanaTransactionState) => ({
          ...prev,
          transactionSignature: signature,
        }));

        return signature;
      } catch (err) {
        console.error("❌ [SOLANA INVESTMENT] Transaction error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Investment transaction failed";
        setTransactionState((prev: SolanaTransactionState) => ({
          ...prev,
          error: errorMessage,
          isError: true,
        }));
        return null;
      } finally {
        setTransactionState((prev: SolanaTransactionState) => ({
          ...prev,
          isPending: false,
          isLoading: false,
        }));
      }
    },
    [isConnected, address, connection, walletProvider, anchorWallet]
  );

  const reset = useCallback(() => {
    setTransactionState({
      isPending: false,
      isLoading: false,
      isError: false,
      error: null,
      transactionSignature: null,
    });
  }, []);

  return {
    executePurchase,
    ...transactionState,
    reset,
  };
};
