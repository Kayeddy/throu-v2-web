import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useState, useEffect, useCallback } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

/**
 * Modern Solana hook for fetching user's SOL balance.
 * Uses Reown AppKit Solana adapter following 2025 best practices.
 *
 * @returns Object with user's SOL balance and loading states
 */
const useUserBalance = () => {
  const { connection } = useAppKitConnection();
  const { address, isConnected } = useAppKitAccount();

  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!isConnected || !address || !connection) {
      setBalance(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const publicKey = new PublicKey(address);
      const lamports = await connection.getBalance(publicKey);
      const solBalance = lamports / LAMPORTS_PER_SOL;
      setBalance(solBalance);
    } catch (err) {
      console.error("Error fetching SOL balance:", err);
      setError("Failed to fetch SOL balance");
      setBalance(null);
    } finally {
      setIsLoading(false);
    }
  }, [connection, address, isConnected]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Refetch balance when connection changes
  useEffect(() => {
    if (isConnected && address) {
      fetchBalance();
    }
  }, [isConnected, address, fetchBalance]);

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance,
    isConnected,
    address,
  };
};

export default useUserBalance;
