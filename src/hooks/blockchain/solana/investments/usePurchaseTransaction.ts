import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import type { Provider } from "@reown/appkit-adapter-solana/react";
import { useState, useCallback } from "react";
import {
  Transaction,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import * as borsh from "@project-serum/borsh";
import {
  PROGRAM_ID,
  InvestProjectArgs,
  getProjectPDA,
  getInvestorPDA,
  getMintProjectPDA,
  SolanaTransactionState,
} from "../../../../utils/types/shared/solana";

// Define the instruction layout for invest_project
const InvestProjectLayout = borsh.struct([
  borsh.u8("instruction"), // 0 for invest_project
  borsh.u64("projectId"),
  borsh.u64("shares"),
]);

/**
 * Modern Solana hook for purchasing project investments.
 * Uses actual invest_project instruction from the program IDL.
 *
 * @param investmentAmount - The amount to invest (in SOL)
 * @returns Object with purchase transaction functions and states
 */
export const usePurchaseTransaction = (investmentAmount: number) => {
  const { connection } = useAppKitConnection();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");

  const [transactionState, setTransactionState] =
    useState<SolanaTransactionState>({
      isPending: false,
      isLoading: false,
      isError: false,
      error: null,
      transactionSignature: null,
    });

  const executePurchase = useCallback(
    async (projectId: string) => {
      if (!isConnected || !address || !connection || !walletProvider) {
        setTransactionState((prev) => ({
          ...prev,
          error: "Wallet not connected",
          isError: true,
        }));
        return null;
      }

      setTransactionState((prev) => ({
        ...prev,
        isPending: true,
        isLoading: true,
        isError: false,
        error: null,
      }));

      try {
        const publicKey = new PublicKey(address);
        const projectIdBigInt = BigInt(projectId);
        const sharesBigInt = BigInt(
          Math.floor(investmentAmount * LAMPORTS_PER_SOL)
        );

        // Get PDAs for accounts
        const [projectPDA] = getProjectPDA(projectIdBigInt);
        const [investorPDA] = getInvestorPDA(projectIdBigInt, publicKey);
        const [mintProjectPDA] = getMintProjectPDA(projectIdBigInt);

        // Get associated token accounts
        const investorTokenAccount = getAssociatedTokenAddressSync(
          mintProjectPDA,
          publicKey,
          false,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const projectTokenAccount = getAssociatedTokenAddressSync(
          mintProjectPDA,
          projectPDA,
          true,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        // Prepare instruction data
        const instructionData = Buffer.alloc(17); // 1 + 8 + 8 bytes
        InvestProjectLayout.encode(
          {
            instruction: 0, // invest_project instruction discriminator
            projectId: projectIdBigInt,
            shares: sharesBigInt,
          },
          instructionData
        );

        // Create the invest_project instruction
        const investInstruction = new TransactionInstruction({
          keys: [
            { pubkey: publicKey, isSigner: true, isWritable: true }, // investor
            { pubkey: projectPDA, isSigner: false, isWritable: true }, // project
            { pubkey: investorPDA, isSigner: false, isWritable: true }, // investor_account
            { pubkey: mintProjectPDA, isSigner: false, isWritable: true }, // token_mint
            { pubkey: investorTokenAccount, isSigner: false, isWritable: true }, // investor_token_account
            { pubkey: projectTokenAccount, isSigner: false, isWritable: true }, // project_token_account
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // token_program
            {
              pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
              isSigner: false,
              isWritable: false,
            }, // associated_token_program
            {
              pubkey: SystemProgram.programId,
              isSigner: false,
              isWritable: false,
            }, // system_program
          ],
          programId: PROGRAM_ID,
          data: instructionData,
        });

        // Create transaction
        const latestBlockhash = await connection.getLatestBlockhash();
        const transaction = new Transaction({
          feePayer: publicKey,
          recentBlockhash: latestBlockhash.blockhash,
        });

        // Add the investment instruction
        transaction.add(investInstruction);

        // Send transaction using Reown AppKit provider
        const signature = await walletProvider.sendTransaction(
          transaction,
          connection
        );

        // Wait for confirmation
        const confirmation = await connection.confirmTransaction({
          signature,
          ...latestBlockhash,
        });

        if (confirmation.value.err) {
          throw new Error(`Transaction failed: ${confirmation.value.err}`);
        }

        setTransactionState((prev) => ({
          ...prev,
          transactionSignature: signature,
        }));

        return signature;
      } catch (err) {
        console.error("Purchase transaction error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Purchase transaction failed";
        setTransactionState((prev) => ({
          ...prev,
          error: errorMessage,
          isError: true,
        }));
        return null;
      } finally {
        setTransactionState((prev) => ({
          ...prev,
          isPending: false,
          isLoading: false,
        }));
      }
    },
    [isConnected, address, connection, walletProvider, investmentAmount]
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
