import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useState, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import type { ProgramRealState } from "@/utils/types/shared/solana";
import programIdl from "@/utils/idls/program_real_state.json";
import * as token from "@solana/spl-token";

interface SolanaWithdrawState {
  isPending: boolean;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  transactionSignature: string | null;
}

interface UseSolanaWithdrawInvestorReturn {
  executeWithdraw: (projectId: string) => Promise<string | null>;
  isPending: boolean;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  transactionSignature: string | null;
  reset: () => void;
}

/**
 * Solana hook for withdrawing investor funds using the withdraw_investor instruction.
 * Uses Anchor framework to interact with the Solana program.
 *
 * Based on the IDL structure:
 * - Function: withdraw_investor
 * - Args: project_id (u64)
 * - Derives investor PDA: ["investor", signer, project_id]
 * - Derives project PDA: ["project", project_id]
 *
 * @returns Object with withdraw transaction functions and states
 */
export const useSolanaWithdrawInvestor =
  (): UseSolanaWithdrawInvestorReturn => {
    const { connection } = useAppKitConnection();
    const { address, isConnected } = useAppKitAccount();

    const [withdrawState, setWithdrawState] = useState<SolanaWithdrawState>({
      isPending: false,
      isLoading: false,
      isError: false,
      error: null,
      transactionSignature: null,
    });

    const reset = useCallback(() => {
      setWithdrawState({
        isPending: false,
        isLoading: false,
        isError: false,
        error: null,
        transactionSignature: null,
      });
    }, []);

    const executeWithdraw = useCallback(
      async (projectId: string): Promise<string | null> => {
        if (!connection || !address || !isConnected) {
          const errorMsg = "Wallet not connected or connection not available";
          console.error("❌ [SOLANA WITHDRAW]", errorMsg);
          setWithdrawState((prev) => ({
            ...prev,
            isError: true,
            error: errorMsg,
          }));
          return null;
        }

        console.log("🚀 [SOLANA WITHDRAW] Starting withdrawal process:", {
          projectId,
          userAddress: address,
        });

        setWithdrawState({
          isPending: true,
          isLoading: true,
          isError: false,
          error: null,
          transactionSignature: null,
        });

        try {
          const publicKey = new PublicKey(address);
          const projectIdBN = new BN(projectId);

          // Create minimal wallet interface for Anchor
          const wallet = {
            publicKey,
            signTransaction: async () => {
              throw new Error("Use connection signTransaction method instead");
            },
            signAllTransactions: async () => {
              throw new Error(
                "Use connection signAllTransactions method instead"
              );
            },
          };

          // Create Anchor provider
          const provider = new AnchorProvider(connection, wallet as any, {
            commitment: "confirmed",
            preflightCommitment: "confirmed",
          });

          // Create program instance
          let program: Program<ProgramRealState>;
          program = new Program<ProgramRealState>(programIdl, provider);

          console.log("✅ [SOLANA WITHDRAW] Anchor program initialized");

          // Derive PDAs according to the IDL structure
          // Project PDA: ["project", project_id]
          const [projectPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("project"), projectIdBN.toArrayLike(Buffer, "le", 8)],
            program.programId
          );

          // Investor PDA: ["investor", signer, project_id] - CORRECT ORDER from IDL
          const [investorPDA] = PublicKey.findProgramAddressSync(
            [
              Buffer.from("investor"),
              publicKey.toBuffer(),
              projectIdBN.toArrayLike(Buffer, "le", 8),
            ],
            program.programId
          );

          console.log("🔑 [SOLANA WITHDRAW] Derived PDAs:", {
            projectPDA: projectPDA.toString(),
            investorPDA: investorPDA.toString(),
          });

          // Get project data to find mint addresses
          console.log("📦 [SOLANA WITHDRAW] Fetching project data...");
          let projectAccount;
          try {
            // Fetch project account using the correct account name from IDL
            projectAccount = await program.account.projectAccount.fetch(
              projectPDA
            );
          } catch (err) {
            throw new Error(`Project account not found for ID: ${projectId}`);
          }

          console.log(
            "✅ [SOLANA WITHDRAW] Project data fetched:",
            projectAccount
          );

          // Extract mint addresses from project account
          const mintSell = new PublicKey(projectAccount.tokenSell);
          const [mintProject] = PublicKey.findProgramAddressSync(
            [
              Buffer.from("mint_project"),
              projectPDA.toBuffer(),
              projectIdBN.toArrayLike(Buffer, "le", 8),
            ],
            program.programId
          );

          console.log("🎯 [SOLANA WITHDRAW] Mint addresses:", {
            mintSell: mintSell.toString(),
            mintProject: mintProject.toString(),
          });

          // Derive user token accounts using SPL token helper
          const userTokenAccountMintSell = token.getAssociatedTokenAddressSync(
            mintSell,
            publicKey,
            false,
            token.TOKEN_PROGRAM_ID
          );

          const userTokenAccountMintProject =
            token.getAssociatedTokenAddressSync(
              mintProject,
              publicKey,
              false,
              new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb") // TOKEN_2022_PROGRAM_ID
            );

          // Derive program token accounts
          const [programTokenAccountMintSell] =
            PublicKey.findProgramAddressSync(
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

          console.log("🎯 [SOLANA WITHDRAW] Derived token accounts:", {
            userTokenAccountMintSell: userTokenAccountMintSell.toString(),
            userTokenAccountMintProject: userTokenAccountMintProject.toString(),
            programTokenAccountMintSell: programTokenAccountMintSell.toString(),
            programTokenAccountMintProject:
              programTokenAccountMintProject.toString(),
          });

          // Execute withdraw_investor instruction
          console.log(
            "📝 [SOLANA WITHDRAW] Executing withdraw_investor instruction..."
          );

          const transaction = await program.methods
            .withdrawInvestor(projectIdBN)
            .accountsPartial({
              signer: publicKey,
              mintSell: mintSell,
              mintProject: mintProject,
              investor: investorPDA,
              project: projectPDA,
              userTokenAccountMintSell: userTokenAccountMintSell,
              userTokenAccountMintProject: userTokenAccountMintProject,
              programTokenAccountMintSell: programTokenAccountMintSell,
              programTokenAccountMintProject: programTokenAccountMintProject,
              tokenProgram: token.TOKEN_PROGRAM_ID,
              // tokenProgram2022: new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),
              associatedTokenProgram: token.ASSOCIATED_TOKEN_PROGRAM_ID,
              systemProgram: new PublicKey("11111111111111111111111111111111"),
            })
            .transaction();

          // Get the latest blockhash
          const latestBlockhash = await connection.getLatestBlockhash();
          transaction.recentBlockhash = latestBlockhash.blockhash;
          transaction.feePayer = publicKey;

          console.log(
            "📡 [SOLANA WITHDRAW] Sending transaction via Reown AppKit..."
          );

          // Use Reown AppKit's connection to send the transaction
          let signature: string;

          // Access the wallet provider through window.solana or the connection object
          const solanaWallet = (window as any).solana;

          if (
            solanaWallet &&
            typeof solanaWallet.signAndSendTransaction === "function"
          ) {
            console.log(
              "📝 [SOLANA WITHDRAW] Using window.solana.signAndSendTransaction..."
            );
            const simulationResult = await connection.simulateTransaction(
              transaction
            );
            console.log(
              "🔍 [SOLANA WITHDRAW] Simulation result:",
              simulationResult
            );
            const signed = await solanaWallet.signAndSendTransaction(
              transaction
            );
            signature = signed.signature || signed;
          } else {
            // Fallback to connection.sendTransaction
            console.log(
              "📝 [SOLANA WITHDRAW] Using connection.sendTransaction..."
            );
            signature = await connection.sendTransaction(transaction, []);
          }

          console.log("⏳ [SOLANA WITHDRAW] Confirming transaction...");

          // Wait for confirmation
          const confirmation = await connection.confirmTransaction({
            signature,
            ...latestBlockhash,
          });

          if (confirmation.value.err) {
            throw new Error(
              `Transaction failed: ${JSON.stringify(confirmation.value.err)}`
            );
          }

          console.log(
            "✅ [SOLANA WITHDRAW] Transaction successful:",
            signature
          );

          setWithdrawState({
            isPending: false,
            isLoading: false,
            isError: false,
            error: null,
            transactionSignature: signature,
          });

          return signature;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          console.error("❌ [SOLANA WITHDRAW] Transaction failed:", error);

          setWithdrawState({
            isPending: false,
            isLoading: false,
            isError: true,
            error: errorMessage,
            transactionSignature: null,
          });

          return null;
        }
      },
      [connection, address, isConnected]
    );

    return {
      executeWithdraw,
      isPending: withdrawState.isPending,
      isLoading: withdrawState.isLoading,
      isError: withdrawState.isError,
      error: withdrawState.error,
      transactionSignature: withdrawState.transactionSignature,
      reset,
    };
  };
