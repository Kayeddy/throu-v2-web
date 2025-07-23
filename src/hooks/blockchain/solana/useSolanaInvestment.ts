import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useState, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import type { ProgramRealState } from "@/utils/types/shared/solana";
import programIdl from "@/utils/idls/program_real_state.json";
import * as token from "@solana/spl-token";

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
      if (!isConnected || !address || !connection) {
        setTransactionState((prev: SolanaTransactionState) => ({
          ...prev,
          error: "Wallet not connected",
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
        // For now, we'll use a minimal wallet interface for Anchor
        // The actual signing will be handled by Reown AppKit at the transaction level
        const wallet = {
          publicKey: new PublicKey(address),
          signTransaction: async (tx: any) => {
            // This will be handled by Reown AppKit's sendTransaction method
            throw new Error("Use sendTransaction method instead");
          },
          signAllTransactions: async (txs: any[]) => {
            throw new Error("Use sendTransaction method instead");
          },
        };

        // Create Anchor provider with minimal wallet
        const provider = new AnchorProvider(connection, wallet as any, {
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
        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.feePayer = publicKey;

        console.log(
          "📡 [SOLANA INVESTMENT] Sending transaction via Reown AppKit..."
        );

        // Use Reown AppKit's connection to send the transaction
        // The connection from useAppKitConnection should handle signing automatically
        console.log(
          "📝 [SOLANA INVESTMENT] Sending transaction for signing..."
        );

        // Use Reown AppKit's connection to send the transaction
        // The connection from useAppKitConnection should handle signing automatically
        let signature: string;

        // Access the wallet provider through window.solana or the connection object
        // This avoids the proxy state error from useAppKitProvider
        const solanaWallet = (window as any).solana;

        if (
          solanaWallet &&
          typeof solanaWallet.signAndSendTransaction === "function"
        ) {
          console.log(
            "📝 [SOLANA INVESTMENT] Using window.solana.signAndSendTransaction..."
          );
          let message = await connection.simulateTransaction(transaction);
          console.log("🔍 [SOLANA INVESTMENT] Message:", message);
          const signed = await solanaWallet.signAndSendTransaction(transaction);
          signature = signed.signature || signed;
        } else {
          // Fallback to connection.sendTransaction
          console.log(
            "📝 [SOLANA INVESTMENT] Using connection.sendTransaction..."
          );
          signature = await connection.sendTransaction(transaction, []);
        }

        console.log("⏳ [SOLANA INVESTMENT] Confirming transaction...");

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
    [isConnected, address, connection]
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
