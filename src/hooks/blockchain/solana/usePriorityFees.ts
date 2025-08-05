import { 
  ComputeBudgetProgram,
  Connection,
  Transaction,
  TransactionInstruction,
  PublicKey
} from "@solana/web3.js";

// Default priority fee settings (in microLamports)
const DEFAULT_PRIORITY_RATE = 25000; // 0.025 lamports per compute unit
const DEFAULT_COMPUTE_UNIT_LIMIT = 200000; // Default limit per instruction

interface PriorityFeeConfig {
  computeUnitPrice?: number; // in microLamports
  computeUnitLimit?: number;
  autoEstimate?: boolean;
}

/**
 * Hook to add priority fees to Solana transactions
 * Based on 2025 best practices for transaction prioritization
 */
export function usePriorityFees() {
  /**
   * Estimates the optimal priority fee based on recent network activity
   */
  const estimatePriorityFee = async (
    connection: Connection,
    accounts: PublicKey[]
  ): Promise<number> => {
    try {
      // Get recent prioritization fees for the specific accounts
      const fees = await connection.getRecentPrioritizationFees({
        lockedWritableAccounts: accounts
      });
      
      if (fees.length === 0) {
        return DEFAULT_PRIORITY_RATE;
      }
      
      // Calculate median fee
      const sortedFees = fees
        .map(f => f.prioritizationFee)
        .sort((a, b) => a - b);
      const medianFee = sortedFees[Math.floor(sortedFees.length / 2)];
      
      // Add 10% buffer for better landing chances
      return Math.ceil(medianFee * 1.1);
    } catch (err) {
      console.warn("Failed to estimate priority fee, using default:", err);
      return DEFAULT_PRIORITY_RATE;
    }
  };

  /**
   * Simulates a transaction to estimate required compute units
   */
  const estimateComputeUnits = async (
    connection: Connection,
    transaction: Transaction
  ): Promise<number> => {
    try {
      const simulation = await connection.simulateTransaction(transaction);
      
      if (simulation.value.err) {
        console.warn("Transaction simulation failed:", simulation.value.err);
        return DEFAULT_COMPUTE_UNIT_LIMIT;
      }
      
      const unitsConsumed = simulation.value.unitsConsumed || DEFAULT_COMPUTE_UNIT_LIMIT;
      
      // Add 10% safety margin
      return Math.ceil(unitsConsumed * 1.1);
    } catch (err) {
      console.warn("Failed to estimate compute units, using default:", err);
      return DEFAULT_COMPUTE_UNIT_LIMIT;
    }
  };

  /**
   * Adds priority fee instructions to a transaction
   */
  const addPriorityFee = async (
    transaction: Transaction,
    connection: Connection,
    config?: PriorityFeeConfig
  ): Promise<Transaction> => {
    try {
      let computeUnitPrice = config?.computeUnitPrice || DEFAULT_PRIORITY_RATE;
      let computeUnitLimit = config?.computeUnitLimit || DEFAULT_COMPUTE_UNIT_LIMIT;
      
      if (config?.autoEstimate) {
        // Extract accounts from the transaction
        const accounts: PublicKey[] = [];
        transaction.instructions.forEach(ix => {
          ix.keys.forEach(key => {
            if (key.isWritable) {
              accounts.push(key.pubkey);
            }
          });
        });
        
        // Estimate optimal priority fee
        if (accounts.length > 0) {
          computeUnitPrice = await estimatePriorityFee(connection, accounts);
        }
        
        // Estimate required compute units
        computeUnitLimit = await estimateComputeUnits(connection, transaction);
      }
      
      // Create priority fee instructions
      const priorityFeeIxs: TransactionInstruction[] = [
        ComputeBudgetProgram.setComputeUnitLimit({
          units: computeUnitLimit
        }),
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: computeUnitPrice
        })
      ];
      
      // Add priority fee instructions at the beginning of the transaction
      const newTransaction = new Transaction();
      newTransaction.add(...priorityFeeIxs);
      newTransaction.add(...transaction.instructions);
      
      // Copy other transaction properties
      newTransaction.recentBlockhash = transaction.recentBlockhash;
      newTransaction.feePayer = transaction.feePayer;
      
      console.log(`💰 Added priority fee: ${computeUnitPrice} microLamports/CU, limit: ${computeUnitLimit} CUs`);
      console.log(`   Total priority fee: ${(computeUnitLimit * computeUnitPrice) / 1_000_000} lamports`);
      
      return newTransaction;
    } catch (err) {
      console.error("Failed to add priority fee, returning original transaction:", err);
      return transaction;
    }
  };

  /**
   * Checks if the wallet supports automatic priority fees
   */
  const walletSupportsPriorityFees = (walletName: string | null): boolean => {
    if (!walletName) return false;
    
    // Wallets that handle priority fees automatically (as of 2025)
    const autoFeeWallets = [
      "Phantom", // Phantom handles priority fees automatically
      "Trust Wallet", // Trust Wallet with Helius optimization
      "Solflare" // Solflare has built-in fee optimization
    ];
    
    return autoFeeWallets.some(name => 
      walletName.toLowerCase().includes(name.toLowerCase())
    );
  };

  return {
    addPriorityFee,
    estimatePriorityFee,
    estimateComputeUnits,
    walletSupportsPriorityFees,
    DEFAULT_PRIORITY_RATE,
    DEFAULT_COMPUTE_UNIT_LIMIT
  };
}