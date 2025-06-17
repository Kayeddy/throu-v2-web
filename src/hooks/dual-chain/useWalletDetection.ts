"use client";

import { useState, useEffect } from "react";
import { BrowserWalletDetection } from "@/lib/solana";

interface WalletDetectionState {
  mounted: boolean;
  phantom: boolean;
  coinbase: boolean;
  solana: boolean;
  hasSolanaWallets: boolean;
  isLoading: boolean;
}

export const useWalletDetection = () => {
  const [walletState, setWalletState] = useState<WalletDetectionState>({
    mounted: false,
    phantom: false,
    coinbase: false,
    solana: false,
    hasSolanaWallets: false,
    isLoading: true,
  });

  useEffect(() => {
    const detectWallets = async () => {
      try {
        // Wait a bit for wallet injection
        await new Promise((resolve) => setTimeout(resolve, 100));

        const detected = BrowserWalletDetection.detectInstalledWallets();

        // Additional async checks with timeout
        const phantomCheck =
          await BrowserWalletDetection.waitForWalletInjection("phantom", 2000);
        const coinbaseCheck =
          await BrowserWalletDetection.waitForWalletInjection("coinbase", 1000);

        const hasSolanaWallets =
          detected.solana || phantomCheck || coinbaseCheck;

        setWalletState({
          mounted: true,
          phantom: phantomCheck,
          coinbase: coinbaseCheck,
          solana: detected.solana || false,
          hasSolanaWallets,
          isLoading: false,
        });
      } catch (error) {
        console.error("Wallet detection error:", error);
        setWalletState((prev) => ({
          ...prev,
          mounted: true,
          isLoading: false,
        }));
      }
    };

    detectWallets();
  }, []);

  // Helper functions
  const getWalletInfo = (walletName: string) => {
    switch (walletName.toLowerCase()) {
      case "phantom":
        return {
          isInstalled: walletState.phantom,
          downloadUrl: "https://phantom.app/download",
        };
      case "coinbase":
      case "coinbase wallet":
        return {
          isInstalled: walletState.coinbase,
          downloadUrl: "https://wallet.coinbase.com/",
        };
      default:
        return {
          isInstalled: false,
          downloadUrl: "https://solana.com/ecosystem/explore?categories=wallet",
        };
    }
  };

  const promptWalletInstall = (walletName: string) => {
    const info = getWalletInfo(walletName);
    if (
      confirm(
        `${walletName} wallet is not installed. Would you like to download it?`
      )
    ) {
      window.open(info.downloadUrl, "_blank", "noopener,noreferrer");
    }
  };

  return {
    ...walletState,
    getWalletInfo,
    promptWalletInstall,
  };
};
