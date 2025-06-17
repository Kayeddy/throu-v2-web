"use client";

import { useCallback, useMemo, useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button, Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";
import { MdOutlineAccountBalanceWallet as WalletIcon } from "react-icons/md";
import { IoIosWarning as WarningIcon } from "react-icons/io";
import { useDualChainStore } from "@/stores/useDualChainStore";
import { ChainType } from "@/lib/chains";
import { BrowserWalletDetection } from "@/lib/solana";

export const PhantomConnectButton = () => {
  const t = useTranslations("Shared.walletConnectionButton");
  const { connection } = useConnection();
  const {
    wallet,
    publicKey,
    connected,
    connecting,
    disconnect,
    select,
    wallets,
  } = useWallet();
  const { setVisible } = useWalletModal();

  // Get dual-chain store actions
  const { connectWallet, disconnectWallet, solanaWallet } = useDualChainStore();

  // Browser-based wallet detection
  const [isPhantomBrowserInstalled, setIsPhantomBrowserInstalled] =
    useState(false);
  const [mounted, setMounted] = useState(false);

  // Check browser wallet installation on mount
  useEffect(() => {
    setMounted(true);

    const checkPhantomInstallation = async () => {
      const isInstalled = await BrowserWalletDetection.waitForWalletInjection(
        "phantom",
        2000
      );
      setIsPhantomBrowserInstalled(isInstalled);
    };

    checkPhantomInstallation();
  }, []);

  // Get wallet balance
  const balance = useMemo(async () => {
    if (!connected || !publicKey) return 0;
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return 0;
    }
  }, [connected, publicKey, connection]);

  // Phantom wallet specifically
  const phantomWallet = useMemo(
    () => wallets.find((wallet) => wallet.adapter.name === "Phantom"),
    [wallets]
  );

  // Check if Phantom is available - combine adapter state with browser detection
  const isPhantomAvailable = useMemo(() => {
    // If not mounted yet, don't show as available
    if (!mounted) return false;

    // Browser-based detection is the primary check
    if (isPhantomBrowserInstalled) return true;

    // Fallback to adapter state
    return (
      phantomWallet?.readyState === WalletReadyState.Installed ||
      phantomWallet?.readyState === WalletReadyState.Loadable
    );
  }, [mounted, isPhantomBrowserInstalled, phantomWallet]);

  // Sync with dual-chain store when connection changes
  useEffect(() => {
    if (connected && publicKey) {
      connectWallet(ChainType.SOLANA);
    }
  }, [connected, publicKey, connectWallet]);

  // Handle Phantom wallet connection
  const handlePhantomConnect = useCallback(async () => {
    if (connected) {
      await disconnect();
      await disconnectWallet(ChainType.SOLANA);
      return;
    }

    // If Phantom is available, try to connect
    if (isPhantomAvailable) {
      if (phantomWallet) {
        select(phantomWallet.adapter.name);
        try {
          await connectWallet(ChainType.SOLANA);
        } catch (error) {
          console.error("Failed to connect Phantom wallet:", error);
        }
      } else {
        // Phantom is installed but adapter not found, show modal
        setVisible(true);
      }
    } else {
      // Phantom is not installed, redirect to download
      if (
        confirm(
          "Phantom wallet is not installed. Would you like to download it?"
        )
      ) {
        window.open(
          "https://phantom.app/download",
          "_blank",
          "noopener,noreferrer"
        );
      }
    }
  }, [
    connected,
    disconnect,
    disconnectWallet,
    isPhantomAvailable,
    phantomWallet,
    select,
    connectWallet,
    setVisible,
  ]);

  // Handle wallet modal for other Solana wallets
  const handleWalletModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  // Format Solana address
  const formatAddress = useCallback((address: string, chars: number = 4) => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  }, []);

  // Resolve balance
  const [resolvedBalance, setResolvedBalance] = useState<number>(0);
  useEffect(() => {
    if (balance instanceof Promise) {
      balance.then(setResolvedBalance);
    } else {
      setResolvedBalance(balance);
    }
  }, [balance]);

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="flex h-8 w-fit items-center justify-center rounded-md bg-transparent p-4 lg:h-7 lg:w-7 lg:rounded-full lg:bg-secondary lg:p-0">
        <WalletIcon className="text-2xl text-secondary dark:text-light lg:text-light" />
      </div>
    );
  }

  // Not connected state
  if (!connected) {
    return (
      <button
        aria-label={t("connect")}
        className="flex h-8 w-fit items-center justify-center rounded-md bg-transparent p-4 lg:h-7 lg:w-7 lg:rounded-full lg:bg-secondary lg:p-0"
        onClick={handlePhantomConnect}
        disabled={connecting}
      >
        {connecting ? (
          <span className="relative flex h-full w-full items-center justify-center bg-transparent">
            <WalletIcon />
            <Spinner
              color="primary"
              size="sm"
              className="absolute inset-0 m-auto"
            />
          </span>
        ) : (
          <>
            <div className="flex flex-row items-center justify-center gap-2 font-medium lg:hidden">
              <span className="text-2xl text-secondary dark:text-light">
                <WalletIcon />
              </span>
              <p className="font-sen text-xl text-secondary dark:text-light">
                {isPhantomAvailable ? "Connect Phantom" : "Install Phantom"}
              </p>
            </div>

            <span className="hidden text-light lg:block">
              <WalletIcon />
            </span>
          </>
        )}
      </button>
    );
  }

  // Connected state
  return (
    <Button
      className="flex flex-row items-center justify-center bg-transparent font-jakarta text-primary dark:text-white"
      onClick={handleWalletModal}
    >
      <WalletIcon className="text-2xl lg:text-lg" />
      <span className="text-xl font-bold lg:text-base">
        {resolvedBalance.toFixed(2)} SOL
      </span>
      <span className="text-sm opacity-75 ml-2">
        {publicKey ? formatAddress(publicKey.toString()) : ""}
      </span>
    </Button>
  );
};
