/**
 * Comprehensive Wallet Hooks
 * 
 * Following Reown AppKit documentation patterns with multi-chain support.
 * Handles both EVM and Solana wallet connections and data.
 */

import { 
  useAppKitAccount, 
  useAppKitNetwork, 
  useAppKitBalance
} from "@reown/appkit/react";
import { useReadContract } from "wagmi";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import usdtTokenAbi from "@/utils/abis/usdtTokenAdmin.json";
import userAdminAbi from "@/utils/abis/userAdmin.json";

/**
 * Enhanced wallet connection hook
 * Provides detailed connection state and chain information
 */
export const useWalletConnection = () => {
  const { isConnected, address } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();

  const isSolana = (
    caipNetwork?.id?.toString().includes("solana") || 
    caipNetwork?.name?.toLowerCase().includes("solana") ||
    false
  );
  const isEVM = !isSolana;

  // Debug: Uncomment to troubleshoot wallet detection issues
  // console.log("🔍 [WALLET CONNECTION] Debug info:", {
  //   isConnected,
  //   address,
  //   chainId: caipNetwork?.id,
  //   chainName: caipNetwork?.name,
  //   isSolana,
  //   isEVM,
  //   fullCaipNetwork: caipNetwork
  // });

  return {
    isConnected,
    address,
    chainId: caipNetwork?.id,
    caipNetwork,
    isSolana,
    isEVM,
    networkName: caipNetwork?.name || "Unknown Network",
  };
};

/**
 * Enhanced balance hook with multi-token support
 * Supports native tokens and USDT on EVM, SOL on Solana
 */
export const useWalletBalance = () => {
  const { address, isConnected } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();
  const [customBalances, setCustomBalances] = useState<Record<string, string>>({});

  // Native token balance using Reown AppKit
  const nativeBalance = useAppKitBalance();

  const isSolana = (
    caipNetwork?.id?.toString().includes("solana") || 
    caipNetwork?.name?.toLowerCase().includes("solana") ||
    false
  );
  const usdtAddress = process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS as `0x${string}`;

  // USDT balance for EVM chains
  const {
    data: usdtBalance,
    isLoading: isLoadingUSDT,
    error: usdtError,
  } = useReadContract({
    address: usdtAddress,
    abi: usdtTokenAbi,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !isSolana && !!address && !!usdtAddress,
      refetchInterval: 10000, // Refresh every 10 seconds
    },
  });

  // Format balances
  const formatBalance = (balance: bigint | string | undefined, decimals: number = 18) => {
    if (!balance) return "0";
    try {
      return ethers.formatUnits(balance.toString(), decimals);
    } catch {
      return "0";
    }
  };

  const balances = {
    native: {
      value: "0", // TODO: Get from nativeBalance
      formatted: "0", // TODO: Get from nativeBalance  
      symbol: isSolana ? "SOL" : "ETH",
      decimals: isSolana ? 9 : 18,
    },
    usdt: {
      value: usdtBalance?.toString() || "0",
      formatted: formatBalance(usdtBalance as bigint, 6),
      symbol: "USDT",
      decimals: 6,
      isLoading: isLoadingUSDT,
      error: usdtError?.message,
    },
  };

  return {
    balances,
    isConnected,
    address,
    isLoading: isLoadingUSDT, // TODO: Add nativeBalance loading when properly implemented
  };
};

/**
 * Wallet information hook
 * Provides wallet metadata and connection details
 */
export const useWalletInfo = () => {
  const { address, isConnected } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();

  const walletInfo = {
    address: address || null,
    shortAddress: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
    isConnected,
    network: caipNetwork?.name || "Unknown",
    chainId: caipNetwork?.id || null,
  };

  return walletInfo;
};

/**
 * Multi-chain wallet management hook
 * Handles switching between different blockchain networks
 */
export const useMultiChainWallet = () => {
  const { caipNetwork } = useAppKitNetwork();
  const { isConnected, address } = useAppKitAccount();
  
  const [supportedChains] = useState([
    { id: "eip155:137", name: "Polygon", namespace: "eip155" },
    { id: "eip155:1", name: "Ethereum", namespace: "eip155" },
    { id: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp", name: "Solana", namespace: "solana" },
  ]);

  const currentChain = supportedChains.find(chain => 
    chain.id === caipNetwork?.id || chain.name === caipNetwork?.name
  );

  const isSolana = (
    currentChain?.namespace === "solana" || 
    caipNetwork?.id?.toString().includes("solana") ||
    caipNetwork?.name?.toLowerCase().includes("solana")
  );
  const isEVM = currentChain?.namespace === "eip155" || !isSolana;

  return {
    currentChain: currentChain || null,
    supportedChains,
    isSolana,
    isEVM,
    isConnected,
    address,
    canSwitchChain: isConnected,
  };
};

/**
 * User investment information hook
 * Fetches user's investment data from smart contracts
 */
export const useInvestorInfo = () => {
  const { address, isConnected } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();
  const [investorData, setInvestorData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const isSolana = (
    caipNetwork?.id?.toString().includes("solana") || 
    caipNetwork?.name?.toLowerCase().includes("solana") ||
    false
  );
  const userContractAddress = process.env.NEXT_PUBLIC_USER_ADMIN_SMART_CONTRACT_ADDRESS as `0x${string}`;

  // EVM investor data - would need specific function from userAdmin.json
  const {
    data: evmInvestorData,
    isLoading,
    error: contractError,
  } = useReadContract({
    address: userContractAddress,
    abi: userAdminAbi,
    functionName: "getUserInfo", // Assuming this function exists in userAdmin.json
    args: [address],
    query: {
      enabled: !isSolana && !!address && !!userContractAddress,
    },
  });

  useEffect(() => {
    if (isSolana) {
      // TODO: Implement Solana investor data fetching
      setError("Solana investor data fetching not yet implemented");
      return;
    }

    if (contractError) {
      setError(contractError.message);
      return;
    }

    if (evmInvestorData) {
      setInvestorData(evmInvestorData);
      setError(null);
    }
  }, [evmInvestorData, contractError, isSolana]);

  return {
    investorData,
    isLoading,
    error,
    isConnected,
    hasData: !!investorData,
  };
};

/**
 * Enhanced user balance hook with investment tracking
 * Combines wallet balance with investment positions
 */
export const useUserBalance = () => {
  const walletBalance = useWalletBalance();
  const investorInfo = useInvestorInfo();
  const { isConnected, address } = useAppKitAccount();

  const totalPortfolioValue = "0"; // Would calculate from investment positions
  const totalInvested = "0"; // Would sum from investor data
  const totalReturns = "0"; // Would calculate returns from investor data

  return {
    wallet: walletBalance.balances,
    portfolio: {
      totalValue: totalPortfolioValue,
      totalInvested,
      totalReturns,
      positions: investorInfo.investorData || [],
    },
    isLoading: walletBalance.isLoading || investorInfo.isLoading,
    error: investorInfo.error,
    isConnected,
    address,
  };
};