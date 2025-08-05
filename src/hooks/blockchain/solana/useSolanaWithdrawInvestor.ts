import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useState, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import type { ProgramRealState } from "@/utils/types/shared/solana";
import programIdl from "@/utils/idls/program_real_state.json";
import * as token from "@solana/spl-token";
import { useWalletProvider, useAnchorWallet } from "./useWalletProvider";
import { usePriorityFees } from "./usePriorityFees";

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
    const walletProvider = useWalletProvider();
    const anchorWallet = useAnchorWallet();
    const { addPriorityFee, walletSupportsPriorityFees } = usePriorityFees();

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
        if (!connection || !address || !isConnected || !walletProvider || !anchorWallet) {
          const errorMsg = "Wallet not connected, not supported, or connection not available";
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
          console.log(`🔌 [SOLANA WITHDRAW] Using wallet: ${walletProvider.walletName}`);
          
          const publicKey = new PublicKey(address);
          const projectIdBN = new BN(projectId);

          // Create Anchor provider with the proper wallet interface
          const provider = new AnchorProvider(connection, anchorWallet as any, {
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
          const latestBlockhash = await connection.getLatestBlockhash("confirmed");
          transaction.recentBlockhash = latestBlockhash.blockhash;
          transaction.feePayer = publicKey;
          
          // Add priority fees if wallet doesn't handle them automatically
          let finalTransaction = transaction;
          if (!walletProvider.supportsPriorityFees) {
            console.log("💰 [SOLANA WITHDRAW] Adding priority fees...");
            finalTransaction = await addPriorityFee(transaction, connection, {
              autoEstimate: true
            });
          } else {
            console.log("✅ [SOLANA WITHDRAW] Wallet handles priority fees automatically");
          }

          console.log(
            `📡 [SOLANA WITHDRAW] Sending transaction via ${walletProvider.walletName}...`
          );

          // Simulate transaction first
          console.log("🔍 [SOLANA WITHDRAW] Simulating transaction...");
          const simulationResult = await connection.simulateTransaction(finalTransaction);
          
          if (simulationResult.value.err) {
            console.error("❌ [SOLANA WITHDRAW] Simulation failed:", simulationResult.value.err);
            throw new Error(`Transaction simulation failed: ${JSON.stringify(simulationResult.value.err)}`);
          }
          
          console.log("✅ [SOLANA WITHDRAW] Simulation successful");
          console.log("📝 [SOLANA WITHDRAW] Sending transaction for signing...");
          
          // Use the wallet provider to sign and send the transaction
          let signature: string;
          try {
            const skipPreflight = walletProvider.walletName === "Trust Wallet";
            signature = await walletProvider.signAndSendTransaction(finalTransaction, skipPreflight);
          } catch (err) {
            console.error("❌ [SOLANA WITHDRAW] Wallet signing failed:", err);
            // If signAndSendTransaction fails, try alternative approach
            if (walletProvider.walletName === "Trust Wallet" || walletProvider.walletName === "Reown Wallet") {
              console.log("🔄 [SOLANA WITHDRAW] Trying fallback method...");
              signature = await connection.sendTransaction(finalTransaction, [], { skipPreflight: true });
            } else {
              throw err;
            }
          }

          console.log("⏳ [SOLANA WITHDRAW] Confirming transaction...");

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
      [connection, address, isConnected, walletProvider, anchorWallet]
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
