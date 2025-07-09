import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import type { Provider } from "@reown/appkit-adapter-solana/react";
import { useState, useCallback } from "react";
import {
  Transaction,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  PROGRAM_ID,
  InvestProjectArgs,
  getProjectPDA,
  getInvestorPDA,
  SolanaTransactionState,
} from "../../../../utils/types/shared/solana";

/**
 * Modern Solana hook for purchasing project investments.
 * Uses Reown AppKit Solana adapter following 2025 best practices.
 *
 * @param investmentAmount - The amount to invest (in SOL)
 * @returns Object with purchase transaction functions and states
 */
export const usePurchaseTransaction = (investmentAmount: number) => {
  const { connection } = useAppKitConnection();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");

  const [transactionState, setTransactionState] = useState<SolanaTransactionState>({
    isPending: false,
    isLoading: false,
    isError: false,
    error: null,
    transactionSignature: null,
  });

  const executePurchase = useCallback(
    async (projectId: string) => {
      if (!isConnected || !address || !connection || !walletProvider) {
        setTransactionState(prev => ({
          ...prev,
          error: "Wallet not connected",
          isError: true,
        }));
        return null;
      }

      setTransactionState(prev => ({
        ...prev,
        isPending: true,
        isLoading: true,
        isError: false,
        error: null,
      }));

      try {
        const publicKey = new PublicKey(address);
        const projectIdBigInt = BigInt(projectId);
        
        // Get PDAs
        const [projectPDA] = getProjectPDA(projectIdBigInt);
        const [investorPDA] = getInvestorPDA(projectIdBigInt, publicKey);

        // Create transaction with proper Solana program instruction
        const latestBlockhash = await connection.getLatestBlockhash();
        
        const transaction = new Transaction({
          feePayer: publicKey,
          recentBlockhash: latestBlockhash.blockhash,
        });

        // TODO: Replace with actual program instruction builder
        // For now, using placeholder. In production, you would use:
        // const investInstruction = createInvestProjectInstruction({
        //   accounts: {
        //     investor: publicKey,
        //     project: projectPDA,
        //     investorAccount: investorPDA,
        //     systemProgram: SystemProgram.programId,
        //   },
        //   args: {
        //     projectId: projectIdBigInt,
        //     shares: BigInt(investmentAmount * LAMPORTS_PER_SOL),
        //   }
        // });
        // transaction.add(investInstruction);

        // Placeholder instruction (remove when real instruction is implemented)
        const placeholderInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey,
          lamports: 0,
        });
        transaction.add(placeholderInstruction);

        // Send transaction using Reown AppKit provider
        const signature = await walletProvider.sendTransaction(transaction, connection);

        setTransactionState(prev => ({
          ...prev,
          transactionSignature: signature,
        }));

        return signature;
      } catch (err) {
        console.error("Purchase transaction error:", err);
        const errorMessage = err instanceof Error ? err.message : "Purchase transaction failed";
        setTransactionState(prev => ({
          ...prev,
          error: errorMessage,
          isError: true,
        }));
        return null;
      } finally {
        setTransactionState(prev => ({
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
