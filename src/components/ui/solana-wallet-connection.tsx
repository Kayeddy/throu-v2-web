/**
 * SOLANA WALLET CONNECTION COMPONENT
 * Following official Solana documentation: https://solana.com/developers/cookbook/wallets/connect-wallet-react
 */

"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button, Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";

interface SolanaWalletConnectionProps {
  onSuccess?: (address: string) => void;
  className?: string;
}

export function SolanaWalletConnection({
  onSuccess,
  className,
}: SolanaWalletConnectionProps) {
  const t = useTranslations("Shared.wallet");
  const [isConnecting, setIsConnecting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    publicKey,
    connected,
    connecting,
    connect,
    disconnect,
    select,
    wallet,
    wallets,
  } = useWallet();

  const { setVisible } = useWalletModal();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle wallet connection
  const handleConnect = async () => {
    if (!mounted) return;

    console.log("🔌 Starting Solana wallet connection...");

    try {
      setIsConnecting(true);

      if (!wallet) {
        console.log("📋 No wallet selected, showing wallet modal");
        setVisible(true);
        return;
      }

      console.log("🔗 Connecting to wallet:", wallet.adapter.name);
      await connect();

      if (publicKey) {
        console.log("✅ Solana wallet connected:", publicKey.toString());
        onSuccess?.(publicKey.toString());
      }
    } catch (error) {
      console.error("❌ Solana wallet connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    if (!mounted) return;

    try {
      console.log("🔌 Disconnecting Solana wallet...");
      await disconnect();
      console.log("✅ Solana wallet disconnected");
    } catch (error) {
      console.error("❌ Solana wallet disconnection failed:", error);
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button color="primary" className={className} isDisabled>
        Loading...
      </Button>
    );
  }

  // If connected, show disconnect button
  if (connected && publicKey) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {wallet?.adapter.name || "Solana Wallet"}
          </span>
          <span className="text-xs text-gray-500">
            {publicKey.toString().slice(0, 8)}...
            {publicKey.toString().slice(-8)}
          </span>
        </div>
        <Button
          color="danger"
          variant="light"
          size="sm"
          onPress={handleDisconnect}
        >
          {t("disconnect")}
        </Button>
      </div>
    );
  }

  // Show connect button
  return (
    <Button
      color="primary"
      onPress={handleConnect}
      isLoading={connecting || isConnecting}
      className={className}
      startContent={connecting || isConnecting ? <Spinner size="sm" /> : null}
    >
      {connecting || isConnecting ? t("connecting") : t("connectSolana")}
    </Button>
  );
}

// Export a simple button that just opens the wallet modal
export function SolanaWalletModalButton({ className }: { className?: string }) {
  const t = useTranslations("Shared.wallet");
  const { setVisible } = useWalletModal();
  const { connected, publicKey, wallet, disconnect } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted
  if (!mounted) {
    return (
      <Button color="primary" className={className} isDisabled>
        Loading...
      </Button>
    );
  }

  if (connected && publicKey) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {wallet?.adapter.name || "Solana Wallet"}
          </span>
          <span className="text-xs text-gray-500">
            {publicKey.toString().slice(0, 8)}...
            {publicKey.toString().slice(-8)}
          </span>
        </div>
        <Button color="danger" variant="light" size="sm" onPress={disconnect}>
          {t("disconnect")}
        </Button>
      </div>
    );
  }

  return (
    <Button
      color="primary"
      onPress={() => setVisible(true)}
      className={className}
    >
      {t("connectSolana")}
    </Button>
  );
}
