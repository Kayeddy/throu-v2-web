"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect, useBalance, useBlockNumber } from "wagmi";
import { emojiAvatarForAddress } from "@/utils/helpers/walletButtonStyleGenerator";
import { MdOutlineAccountBalanceWallet as WalletIcon } from "react-icons/md";
import { IoIosWarning as WarningIcon } from "react-icons/io";
import { Button, Spinner } from "@nextui-org/react";
import { convertBalanceUnits, convertContractUnits } from "@/lib/utils";
import { useTranslations } from "next-intl"; // Importing next-intl for translations

export const WalletConnectionButton = () => {
  const t = useTranslations("Shared.walletConnectionButton"); // Accessing translations
  const { isConnecting, address, addresses, isConnected, chain } = useAccount();

  // Memoizing the result of this function since it only depends on the address
  const { color: backgroundColor, emoji } = useMemo(
    () => emojiAvatarForAddress(address ?? ""),
    [address]
  );

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: balance, queryKey } = useBalance({ address });

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { disconnect } = useDisconnect();

  const isMounted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Reference for timeout

  useEffect(() => {
    isMounted.current = true;
  }, []);

  // Unified effect to handle balance logging and query invalidation
  useEffect(() => {
    if (balance?.value) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [balance, queryClient, queryKey, blockNumber]);

  // Timeout effect for wallet connection attempt
  useEffect(() => {
    if (isConnecting && !isConnected) {
      timeoutRef.current = setTimeout(() => {
        console.log(t("disconnectTimeout")); // Using translation for timeout log
        disconnect(); // Disconnect the wallet if it's taking too long to connect
      }, 3000); // Timeout set for 3 seconds
    }

    // Clear the timeout if the wallet connects before the timeout
    if (isConnected && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clean up on unmount
      }
    };
  }, [isConnecting, isConnected, disconnect]);

  // Handlers for connecting/disconnecting
  const handleConnectClick = useCallback(async () => {
    if (isConnected) {
      disconnect();
    }
    openConnectModal?.();
  }, [disconnect, isConnected, openConnectModal]);

  const handleAccountModalClick = useCallback(() => {
    openAccountModal?.();
  }, [openAccountModal]);

  if (!isConnected) {
    return (
      <button
        aria-label={t("connect")} // Translation for button label
        className="flex h-8 w-fit items-center justify-center rounded-md bg-transparent p-4 lg:h-7 lg:w-7 lg:rounded-full lg:bg-secondary lg:p-0"
        onClick={handleConnectClick}
        disabled={isConnecting}
      >
        {isConnecting ? (
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
                {t("connect")} {/* Translation for "Connect Wallet" */}
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

  if ((isConnected && !chain) || chain?.id !== 137) {
    return (
      <Button
        className="flex flex-row items-center justify-center bg-transparent font-jakarta text-lg text-primary focus:border-transparent focus:outline-none dark:text-white"
        onClick={openChainModal}
      >
        <span className="relative flex h-full items-center justify-center">
          <WalletIcon className="text-lg" />
          <WarningIcon className="absolute bottom-1 right-0 translate-x-2 animate-pulse text-danger" />
        </span>
        {t("wrongNetwork")} {/* Translation for "Wrong Network" */}
      </Button>
    );
  }

  return (
    <Button
      className="flex flex-row items-center justify-center bg-transparent font-jakarta text-primary dark:text-white"
      onClick={handleAccountModalClick}
    >
      {isConnected && chain && (
        <>
          <WalletIcon className="text-2xl lg:text-lg" />
          <span className="text-xl font-bold lg:text-base">
            {balance?.value
              ? t("balance", {
                  balance: convertBalanceUnits(balance?.value).toFixed(2),
                  symbol: balance?.symbol,
                })
              : t("balance", { balance: 0, symbol: "POL" })}
          </span>
        </>
      )}
    </Button>
  );
};
