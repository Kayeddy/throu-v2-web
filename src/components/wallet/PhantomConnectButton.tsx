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

  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<number>(0);

  // Check for mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get balance when connected
  useEffect(() => {
    if (connected && publicKey && connection) {
      connection.getBalance(publicKey).then((balance) => {
        setBalance(balance / LAMPORTS_PER_SOL);
      });
    }
  }, [connected, publicKey, connection]);

  // Find Phantom wallet
  const phantomWallet = useMemo(
    () => wallets.find((w) => w.adapter.name === "Phantom"),
    [wallets]
  );

  const isPhantomAvailable =
    phantomWallet?.readyState === WalletReadyState.Installed;

  const handlePhantomConnect = useCallback(async () => {
    if (!mounted) return;

    try {
      if (phantomWallet) {
        select(phantomWallet.adapter.name);
      } else {
        setVisible(true);
      }
    } catch (error) {
      console.error("Error connecting to Phantom:", error);
    }
  }, [phantomWallet, select, setVisible, mounted]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

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
      onClick={() => setVisible(true)}
    >
      <WalletIcon className="text-2xl lg:text-lg" />
      <span className="text-xl font-bold lg:text-base">
        {balance.toFixed(2)} SOL
      </span>
      <span className="text-sm opacity-75 ml-2">
        {publicKey ? formatAddress(publicKey.toString()) : ""}
      </span>
    </Button>
  );
};
