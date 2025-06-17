// 2025 MODERN WALLET BUTTON
// This follows the patterns used by Magic Eden, Jupiter, and other top platforms

"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUnifiedWalletStore } from "@/stores/useUnifiedWalletStore";

// Client-side wrapper to prevent SSR issues
function ClientOnlyWalletButton({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button className="" size="md" variant="solid" color="primary" disabled>
        Loading...
      </Button>
    );
  }

  return <>{children}</>;
}

interface ModernWalletButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}

function ModernWalletButtonInner({
  className = "",
  size = "md",
  variant = "solid",
  color = "primary",
}: ModernWalletButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModernWalletConnectionModal, setModernWalletConnectionModal] =
    useState<any>(null);
  const t = useTranslations("Shared.modernWalletButton");

  // EVM wallet state
  const {
    address: evmAddress,
    isConnected: evmConnected,
    connector: evmConnector,
  } = useAccount();
  const { connect: evmConnect, connectors } = useConnect();
  const { disconnect: evmDisconnect } = useDisconnect();

  // Solana wallet state
  const {
    publicKey: solanaPublicKey,
    connected: solanaConnected,
    wallet: solanaWallet,
    disconnect: solanaDisconnect,
  } = useWallet();

  // Unified wallet store for tracking connection states
  const {
    evmConnected: storeEvmConnected,
    solanaConnected: storeSolanaConnected,
    evmAddress: storeEvmAddress,
    solanaAddress: storeSolanaAddress,
    evmWalletName: storeEvmWalletName,
    solanaWalletName: storeSolanaWalletName,
    activeChain,
    setEvmConnection,
    setSolanaConnection,
    setActiveChain,
    disconnectAll,
  } = useUnifiedWalletStore();

  // Debug logging for store state changes
  useEffect(() => {
    console.log("🔍 ModernWalletButton store state:", {
      storeEvmConnected,
      storeSolanaConnected,
      storeEvmAddress,
      storeSolanaAddress,
      storeEvmWalletName,
      storeSolanaWalletName,
      activeChain,
    });
  }, [
    storeEvmConnected,
    storeSolanaConnected,
    storeEvmAddress,
    storeSolanaAddress,
    storeEvmWalletName,
    storeSolanaWalletName,
    activeChain,
  ]);

  // Sync wagmi state with store
  useEffect(() => {
    if (evmConnected && evmAddress && evmConnector) {
      setEvmConnection(true, evmAddress, evmConnector.name);
    } else {
      setEvmConnection(false);
    }
  }, [evmConnected, evmAddress, evmConnector, setEvmConnection]);

  // Sync Solana state with store
  useEffect(() => {
    if (solanaConnected && solanaPublicKey && solanaWallet) {
      setSolanaConnection(
        true,
        solanaPublicKey.toString(),
        solanaWallet.adapter.name
      );
    } else {
      setSolanaConnection(false);
    }
  }, [solanaConnected, solanaPublicKey, solanaWallet, setSolanaConnection]);

  useEffect(() => {
    const loadModal = async () => {
      try {
        const { ModernWalletConnectionModal: Modal } = await import(
          "@/components/ui/modern-wallet-connection-modal"
        );
        setModernWalletConnectionModal(() => Modal);
      } catch (error) {
        console.warn("Failed to load wallet modal:", error);
      }
    };

    loadModal();
  }, []);

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = () => {
    setIsModalOpen(true);
  };

  const handleDisconnect = async () => {
    // Disconnect from both chains
    if (storeEvmConnected) {
      await evmDisconnect();
    }
    if (storeSolanaConnected) {
      await solanaDisconnect();
    }
    disconnectAll();
  };

  const handleConnectionSuccess = (
    walletName: string,
    walletAddress: string,
    chain: string
  ) => {
    console.log(
      `✅ Successfully connected ${walletName} on ${chain}:`,
      walletAddress
    );
    setIsModalOpen(false);
  };

  // Determine if any wallet is connected
  const isAnyWalletConnected = storeEvmConnected || storeSolanaConnected;

  // Debug log for connection status
  useEffect(() => {
    console.log("🔍 ModernWalletButton connection status:", {
      isAnyWalletConnected,
      storeEvmConnected,
      storeSolanaConnected,
      evmStatus: useUnifiedWalletStore.getState().evmStatus,
      solanaStatus: useUnifiedWalletStore.getState().solanaStatus,
    });
  }, [isAnyWalletConnected, storeEvmConnected, storeSolanaConnected]);

  // If no wallets are connected, show connect button
  if (!isAnyWalletConnected) {
    return (
      <>
        <Button
          className={className}
          size={size}
          variant={variant}
          color={color}
          onClick={handleConnect}
        >
          {t("connect")}
        </Button>

        {ModernWalletConnectionModal && (
          <ModernWalletConnectionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleConnectionSuccess}
          />
        )}
      </>
    );
  }

  // Determine which wallet to display based on active chain and connection status
  const getActiveWalletInfo = () => {
    if (storeEvmConnected && (activeChain === "evm" || !storeSolanaConnected)) {
      return {
        address: storeEvmAddress,
        walletName: storeEvmWalletName,
        chainName: "Polygon",
        chainType: "evm" as const,
      };
    } else if (storeSolanaConnected) {
      return {
        address: storeSolanaAddress,
        walletName: storeSolanaWalletName,
        chainName: "Solana",
        chainType: "solana" as const,
      };
    }
    return null;
  };

  const activeWallet = getActiveWalletInfo();

  // If wallet is connected, show wallet info with dropdown
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            className={className}
            size={size}
            variant={variant}
            color={color}
          >
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-70">
                  {activeWallet?.chainName}
                </span>
                <span className="text-sm font-medium">
                  {formatAddress(activeWallet?.address || "")}
                </span>
              </div>
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Wallet actions">
          <DropdownItem
            key="wallet"
            textValue={`Connected: ${activeWallet?.walletName}`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {activeWallet?.walletName}
              </span>
              <span className="text-xs text-gray-500">
                {activeWallet?.chainName} Network
              </span>
            </div>
          </DropdownItem>
          <DropdownItem
            key="address"
            textValue={`Address: ${activeWallet?.address}`}
          >
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{t("address")}</span>
              <span className="text-sm font-mono">{activeWallet?.address}</span>
            </div>
          </DropdownItem>
          <DropdownItem
            key="disconnect"
            color="danger"
            onClick={handleDisconnect}
            textValue={t("disconnect")}
          >
            {t("disconnect")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {ModernWalletConnectionModal && (
        <ModernWalletConnectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleConnectionSuccess}
        />
      )}
    </>
  );
}

export function ModernWalletButton(props: ModernWalletButtonProps) {
  return (
    <ClientOnlyWalletButton>
      <ModernWalletButtonInner {...props} />
    </ClientOnlyWalletButton>
  );
}
