// 2025 MINIMALIST WALLET CONNECTION MODAL
// Magic Eden inspired design - clean, minimal, elegant

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
} from "@heroui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { PublicKey } from "@solana/web3.js";
import { useTranslations } from "next-intl";
import { WalletSigningVerification } from "@/components/shared/WalletSigningVerification";
import {
  useUnifiedWalletStore,
  ChainType,
} from "@/stores/useUnifiedWalletStore";
import {
  SUPPORTED_WALLETS,
  detectWalletInstallation,
  connectPhantomWallet,
} from "@/lib/unified-wallet-config";

interface ModernWalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (walletName: string, address: string, chain: ChainType) => void;
}

type ModalStep =
  | "chain-selection"
  | "wallet-selection"
  | "connecting"
  | "connected"
  | "signing"
  | "success"
  | "error";

const getWalletIcon = (walletName: string): string => {
  const icons: Record<string, string> = {
    phantom: "/assets/wallets/phantom_logo.png",
    solflare: "/assets/wallets/solflare_logo.png",
    metamask: "/assets/wallets/metamask_logo.png",
    "coinbase wallet": "/assets/wallets/coinbase_logo.png",
    walletconnect: "/assets/wallets/wallet_connect_logo.png",
  };

  return (
    icons[walletName.toLowerCase()] ||
    `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#6366f1"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">
          ${walletName.charAt(0)}
        </text>
      </svg>
    `)}`
  );
};

export function ModernWalletConnectionModal({
  isOpen,
  onClose,
  onSuccess,
}: ModernWalletConnectionModalProps) {
  // Translations
  const t = useTranslations("Shared.walletModal");

  // Modal state
  const [currentStep, setCurrentStep] = useState<ModalStep>("chain-selection");
  const [selectedChain, setSelectedChain] = useState<ChainType>("evm");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isWalletConnectModalOpen, setIsWalletConnectModalOpen] =
    useState(false);
  const [phantomAddress, setPhantomAddress] = useState<string | null>(null);

  // Connection monitoring refs
  const userApprovedConnection = useRef(false);
  const isManualDisconnect = useRef(false);
  const phantomConnectionAttempted = useRef(false);
  const coinbaseConnectionAttempted = useRef(false);

  // Wallet hooks
  const {
    publicKey: solanaPublicKey,
    connected: solanaConnected,
    disconnect: solanaDisconnect,
    wallet: solanaWallet,
    connect: solanaConnect,
  } = useWallet();
  const { address: evmAddress, isConnected: evmConnected } = useAccount();
  const { connect: evmConnect, connectors } = useConnect();
  const { disconnect: evmDisconnect } = useDisconnect();

  // Store actions
  const {
    setEvmConnection,
    setSolanaConnection,
    setActiveChain,
    setEvmStatus,
    setSolanaStatus,
    setEvmError,
    setSolanaError,
    clearErrors,
  } = useUnifiedWalletStore();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      console.log("🔄 Modal opened - resetting state");
      setCurrentStep("chain-selection");
      setConnectionError(null);
      setSelectedChain("evm");
      setSelectedWallet("");
      setIsWalletConnectModalOpen(false);
      setPhantomAddress(null);
      userApprovedConnection.current = false;
      isManualDisconnect.current = false;
      phantomConnectionAttempted.current = false;
      coinbaseConnectionAttempted.current = false;
      clearErrors();
    } else {
      // Also reset when modal closes to prevent stale state
      console.log("🔄 Modal closed - cleaning up state");
      setCurrentStep("chain-selection");
      setConnectionError(null);
      setSelectedWallet("");
      setIsWalletConnectModalOpen(false);
      setPhantomAddress(null);
      userApprovedConnection.current = false;
      isManualDisconnect.current = false;
      phantomConnectionAttempted.current = false;
      coinbaseConnectionAttempted.current = false;
    }
  }, [isOpen, clearErrors]);

  // Enhanced Solana connection monitoring
  useEffect(() => {
    if (!isOpen || selectedChain !== "solana" || currentStep !== "connecting") {
      return;
    }

    const connectionTimeout = setTimeout(() => {
      if (currentStep === "connecting" && !solanaConnected) {
        console.log("⏰ Solana connection timeout");
        setConnectionError(
          `${selectedWallet} connection timed out. Please make sure your wallet is unlocked and try again.`
        );
        setCurrentStep("error");
      }
    }, 30000);

    if (solanaConnected && solanaPublicKey) {
      console.log("🔍 Solana wallet state changed:", {
        connected: solanaConnected,
        publicKey: solanaPublicKey.toBase58(),
        userApproved: userApprovedConnection.current,
        currentStep,
        selectedWallet,
        phantomAttempted: phantomConnectionAttempted.current,
      });

      // For Phantom direct connection, or if user explicitly approved
      if (
        userApprovedConnection.current ||
        (phantomConnectionAttempted.current &&
          selectedWallet.toLowerCase().includes("phantom"))
      ) {
        console.log(
          "✅ Connection approved (direct or user) - proceeding to connected state"
        );
        clearTimeout(connectionTimeout);
        setCurrentStep("connected");
      } else {
        console.log("⚠️ Auto-connection detected - waiting for user approval");
        // Don't automatically progress - wait for explicit user action
      }
    }

    return () => {
      clearTimeout(connectionTimeout);
    };
  }, [
    solanaConnected,
    solanaPublicKey,
    currentStep,
    selectedChain,
    selectedWallet,
    isOpen,
  ]);

  // Enhanced EVM connection monitoring with better error handling
  useEffect(() => {
    if (!isOpen || selectedChain !== "evm" || currentStep !== "connecting") {
      return;
    }

    console.log("🔍 Starting EVM connection monitoring for:", selectedWallet);

    // Primary timeout for connection attempts
    const connectionTimeout = setTimeout(() => {
      if (currentStep === "connecting" && !evmConnected) {
        console.log("⏰ EVM connection timeout for:", selectedWallet);

        let errorMessage = `${selectedWallet} connection timed out. Please try again.`;

        if (selectedWallet.toLowerCase().includes("coinbase")) {
          errorMessage =
            "Coinbase connection was cancelled or timed out. Please make sure to approve the connection in your Coinbase wallet and try again.";
          setEvmError("Coinbase connection timeout");
        } else if (selectedWallet.toLowerCase().includes("metamask")) {
          errorMessage =
            "MetaMask connection was cancelled or timed out. Please make sure to approve the connection in MetaMask and try again.";
          setEvmError("MetaMask connection timeout");
        } else if (selectedWallet.toLowerCase().includes("walletconnect")) {
          errorMessage =
            "WalletConnect connection timed out. Please scan the QR code or approve the connection in your wallet app.";
          setEvmError("WalletConnect connection timeout");
        } else {
          setEvmError("Connection timeout");
        }

        setEvmStatus("error");
        setConnectionError(errorMessage);
        setCurrentStep("error");
      }
    }, 20000); // Increased to 20 seconds for better user experience

    // Earlier check for popup dismissal
    const popupCheckTimeout = setTimeout(() => {
      if (currentStep === "connecting" && !evmConnected) {
        console.log("🔍 Checking for popup dismissal:", selectedWallet);

        // Check if the connection was likely dismissed by user
        if (
          coinbaseConnectionAttempted.current ||
          selectedWallet.toLowerCase().includes("metamask")
        ) {
          console.log("⚠️ Potential popup dismissal detected");
          setEvmError("Popup dismissed or rejected");
          setConnectionError(
            `${selectedWallet} connection popup may have been closed or rejected. Please try again and approve the connection request.`
          );
          setEvmStatus("error");
          setCurrentStep("error");
        }
      }
    }, 5000); // Check after 5 seconds

    // Success handling
    if (evmConnected && evmAddress) {
      console.log("✅ EVM wallet connected successfully:", {
        address: evmAddress,
        wallet: selectedWallet,
      });
      clearTimeout(connectionTimeout);
      clearTimeout(popupCheckTimeout);
      setEvmStatus("connected");
      setEvmError(null);
      setCurrentStep("connected");
    }

    return () => {
      clearTimeout(connectionTimeout);
      clearTimeout(popupCheckTimeout);
    };
  }, [
    evmConnected,
    evmAddress,
    currentStep,
    selectedChain,
    selectedWallet,
    isOpen,
  ]);

  // Enhanced WalletConnect modal detection
  useEffect(() => {
    if (!isOpen) return;

    const checkWalletConnectModal = () => {
      const wcModalElements = [
        document.querySelector('[data-testid="w3m-modal"]'),
        document.querySelector(".w3m-modal"),
        document.querySelector("#w3m-modal"),
        document.querySelector('[id*="walletconnect"]'),
        document.querySelector('[class*="walletconnect"]'),
        document.querySelector("wcm-modal"),
        document.querySelector("w3m-modal"),
      ];

      const isWCModalVisible = wcModalElements.some(
        (element) => element && getComputedStyle(element).display !== "none"
      );

      if (isWCModalVisible !== isWalletConnectModalOpen) {
        console.log("🔗 WalletConnect modal state changed:", isWCModalVisible);
        setIsWalletConnectModalOpen(isWCModalVisible);
      }
    };

    checkWalletConnectModal();
    const interval = setInterval(checkWalletConnectModal, 500);

    return () => clearInterval(interval);
  }, [isOpen, isWalletConnectModalOpen]);

  const handleChainSelection = (chain: ChainType) => {
    setSelectedChain(chain);
    setCurrentStep("wallet-selection");
    setConnectionError(null);
  };

  const handleWalletSelection = async (walletName: string) => {
    setSelectedWallet(walletName);
    setCurrentStep("connecting");
    setConnectionError(null);
    userApprovedConnection.current = false;

    try {
      if (selectedChain === "evm") {
        await handleEvmConnection(walletName);
      } else {
        await handleSolanaConnection(walletName);
      }
    } catch (error: any) {
      console.error("❌ Wallet connection failed:", error);
      setConnectionError(error.message || "Failed to connect wallet");
      setCurrentStep("error");
    }
  };

  const handleEvmConnection = async (walletName: string) => {
    const connector = getConnectorByWalletName(walletName);
    if (!connector) {
      throw new Error(`${walletName} connector not found`);
    }

    console.log("🔌 Connecting to EVM wallet:", walletName);
    setEvmStatus("connecting");
    setEvmError(null);

    if (walletName.toLowerCase().includes("coinbase")) {
      coinbaseConnectionAttempted.current = true;
    }

    try {
      await evmConnect({ connector });
    } catch (error: any) {
      console.error("❌ EVM connection error:", error);

      // Handle specific error types
      if (error.code === 4001 || error.message?.includes("rejected")) {
        setEvmError("Connection request was rejected by user");
        setConnectionError(
          "Connection request was rejected. Please try again and approve the connection in your wallet."
        );
      } else if (error.code === -32002) {
        setEvmError("Connection request already pending");
        setConnectionError(
          "A connection request is already pending. Please check your wallet and approve the request."
        );
      } else if (error.message?.includes("popup")) {
        setEvmError("Wallet popup was closed");
        setConnectionError(
          "Wallet popup was closed. Please try again and keep the wallet popup open to complete the connection."
        );
      } else {
        setEvmError(error.message || "Connection failed");
        setConnectionError(
          error.message ||
            `Failed to connect to ${walletName}. Please try again.`
        );
      }

      setEvmStatus("error");
      setCurrentStep("error");
      throw error;
    }
  };

  const handleSolanaConnection = async (walletName: string) => {
    console.log("🔌 Connecting to Solana wallet:", walletName);
    setSolanaStatus("connecting");
    setSolanaError(null);

    if (walletName.toLowerCase().includes("phantom")) {
      phantomConnectionAttempted.current = true;

      try {
        const result = await connectPhantomWallet();
        console.log("✅ Phantom connection successful:", result);

        // For Phantom direct connection, progress to connected state for user verification
        // DO NOT update store yet - wait for signing verification
        if (result && result.publicKey) {
          console.log(
            "✅ Phantom direct connection successful - proceeding to verification step"
          );
          console.log(
            "🔐 Phantom address obtained:",
            result.publicKey.toString()
          );

          // Store the Phantom address for display in connected step
          setPhantomAddress(result.publicKey.toString());

          // Set status but DO NOT update store connection yet
          setSolanaStatus("connected");
          setCurrentStep("connected");
        }
        return;
      } catch (error: any) {
        console.error("❌ Phantom connection failed:", error);

        // Handle specific Phantom errors
        if (error.code === 4001 || error.message?.includes("rejected")) {
          setSolanaError("Connection request was rejected by user");
          setConnectionError(
            "Phantom connection was rejected. Please try again and approve the connection request."
          );
        } else if (error.message?.includes("not installed")) {
          setSolanaError("Phantom wallet not installed");
          setConnectionError(
            "Phantom wallet is not installed. Please install Phantom and try again."
          );
        } else {
          setSolanaError(error.message || "Phantom connection failed");
          setConnectionError(
            error.message ||
              "Failed to connect to Phantom wallet. Please try again."
          );
        }

        setSolanaStatus("error");
        setCurrentStep("error");
        throw error;
      }
    }

    // For other Solana wallets, fall back to wallet adapter
    if (!solanaWallet) {
      setSolanaError("Solana wallet not available");
      setConnectionError(
        "Selected Solana wallet is not available. Please make sure it's installed and try again."
      );
      setSolanaStatus("error");
      setCurrentStep("error");
      throw new Error("Solana wallet not available");
    }

    try {
      await solanaConnect();
      console.log(
        "🔗 Solana wallet connection initiated, waiting for user approval"
      );
    } catch (error: any) {
      console.error("❌ Solana connection error:", error);

      // Handle wallet adapter errors
      if (error.name === "WalletNotConnectedError") {
        setSolanaError("Wallet not connected");
        setConnectionError(
          "Failed to connect to Solana wallet. Please try again."
        );
      } else if (error.name === "WalletConnectionError") {
        setSolanaError("Connection failed");
        setConnectionError(
          "Solana wallet connection failed. Please make sure your wallet is unlocked and try again."
        );
      } else {
        setSolanaError(error.message || "Connection failed");
        setConnectionError(
          error.message ||
            "Failed to connect to Solana wallet. Please try again."
        );
      }

      setSolanaStatus("error");
      setCurrentStep("error");
      throw error;
    }
  };

  const handleProceedToSigning = () => {
    console.log(
      "✅ User explicitly approved connection - proceeding to signing"
    );
    userApprovedConnection.current = true;
    setCurrentStep("signing");
  };

  const handleSigningSuccess = useCallback(
    (signature: string) => {
      console.log("✅ Wallet signing verification successful:", signature);

      if (selectedChain === "evm" && evmAddress) {
        setEvmConnection(true, evmAddress, selectedWallet);
        setActiveChain("evm");
      } else if (selectedChain === "solana") {
        // For Solana, handle both adapter and direct connections
        let solanaAddress = "";

        if (solanaPublicKey) {
          // Standard wallet adapter connection
          solanaAddress = solanaPublicKey.toBase58();
        } else if (
          phantomConnectionAttempted.current &&
          window.phantom?.solana?.publicKey
        ) {
          // Direct Phantom connection
          solanaAddress = window.phantom.solana.publicKey.toString();
        }

        if (solanaAddress) {
          console.log("🔗 Setting Solana connection in store:", {
            address: solanaAddress,
            walletName: selectedWallet,
          });
          setSolanaConnection(true, solanaAddress, selectedWallet);
          setActiveChain("solana");
        }
      }

      setCurrentStep("success");

      if (onSuccess) {
        const address =
          selectedChain === "evm"
            ? evmAddress
            : solanaPublicKey?.toBase58() ||
              (phantomConnectionAttempted.current &&
                window.phantom?.solana?.publicKey?.toString());
        if (address) {
          onSuccess(selectedWallet, address, selectedChain);
        }
      }
    },
    [
      selectedChain,
      evmAddress,
      solanaPublicKey,
      selectedWallet,
      setEvmConnection,
      setSolanaConnection,
      setActiveChain,
      onSuccess,
    ]
  );

  const handleSigningError = useCallback((error: string) => {
    console.error("❌ Wallet signing verification failed:", error);
    setConnectionError(error);
    setCurrentStep("error");
  }, []);

  const handleSigningCancel = useCallback(() => {
    console.log("⚠️ User cancelled wallet signing verification");
    setConnectionError(
      "Signing verification was cancelled. Please try again to complete the wallet connection."
    );
    setCurrentStep("error");
  }, []);

  const handleRetry = () => {
    console.log("🔄 Retrying connection - resetting state");
    setConnectionError(null);
    setCurrentStep("wallet-selection");
    setIsWalletConnectModalOpen(false);
    userApprovedConnection.current = false;
    phantomConnectionAttempted.current = false;
    coinbaseConnectionAttempted.current = false;
    // Clear any existing wallet store errors
    clearErrors();
  };

  const handleBack = async () => {
    setConnectionError(null);

    if (currentStep === "wallet-selection") {
      setCurrentStep("chain-selection");
    } else if (
      currentStep === "connecting" ||
      currentStep === "connected" ||
      currentStep === "error"
    ) {
      await handleProperDisconnection();
      setCurrentStep("wallet-selection");
    } else if (currentStep === "signing") {
      await handleProperDisconnection();
      setCurrentStep("wallet-selection");
    }
  };

  const handleProperDisconnection = async () => {
    console.log("🔌 Performing proper disconnection cleanup");
    isManualDisconnect.current = true;

    try {
      if (selectedChain === "evm" && evmConnected) {
        console.log("🔌 Disconnecting EVM wallet");
        await evmDisconnect();
        setEvmConnection(false);
        setEvmStatus("disconnected");
        setEvmError(null);
      }

      if (selectedChain === "solana" && solanaConnected) {
        console.log("🔌 Disconnecting Solana wallet");

        if (selectedWallet.toLowerCase().includes("phantom")) {
          try {
            const phantom = (window as any).phantom?.solana;
            if (phantom && phantom.isConnected) {
              await phantom.disconnect();
            }
          } catch (error) {
            console.warn(
              "⚠️ Phantom direct disconnect failed, using adapter:",
              error
            );
          }
        }

        await solanaDisconnect();
        setSolanaConnection(false);
        setSolanaStatus("disconnected");
        setSolanaError(null);
      }
    } catch (error) {
      console.error("❌ Disconnection error:", error);
    }

    userApprovedConnection.current = false;
    phantomConnectionAttempted.current = false;
    coinbaseConnectionAttempted.current = false;

    setTimeout(() => {
      isManualDisconnect.current = false;
    }, 1000);
  };

  const handleModalClose = () => {
    if (isWalletConnectModalOpen) {
      console.log(
        "🔗 WalletConnect modal is open - preventing main modal close"
      );
      return;
    }

    console.log("🔒 Closing wallet connection modal");

    if (currentStep === "connecting" || currentStep === "connected") {
      handleProperDisconnection();
    }

    onClose();
  };

  const getConnectorByWalletName = (walletName: string) => {
    const walletLower = walletName.toLowerCase();

    let connector = connectors.find(
      (c) => c.name.toLowerCase() === walletLower
    );

    if (!connector) {
      const alternativeNames: Record<string, string[]> = {
        "coinbase wallet": ["coinbase wallet", "coinbase", "coinbasewallet"],
        walletconnect: ["walletconnect", "wallet connect", "wc"],
        metamask: ["metamask", "meta mask", "injected"],
      };

      const alternatives = alternativeNames[walletLower] || [];

      for (const altName of alternatives) {
        connector = connectors.find(
          (c) =>
            c.name.toLowerCase() === altName ||
            c.id.toLowerCase() === altName ||
            c.type.toLowerCase() === altName
        );
        if (connector) break;
      }
    }

    if (!connector) {
      console.warn(`❌ No connector found for wallet: ${walletName}`);
      console.log(
        "Available connectors:",
        connectors.map((c) => `${c.name} (${c.id}, ${c.type})`)
      );
    } else {
      console.log(
        `✅ Found connector for ${walletName}:`,
        connector.name,
        `(${connector.id}, ${connector.type})`
      );
    }

    return connector;
  };

  const renderChainSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t("chainSelection.title")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("chainSelection.description")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleChainSelection("evm")}
          className="group relative p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 hover:shadow-lg"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">Ξ</span>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {t("chainSelection.ethereum.title")}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {t("chainSelection.ethereum.description")}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleChainSelection("solana")}
          className="group relative p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 hover:shadow-lg"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">◎</span>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {t("chainSelection.solana.title")}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {t("chainSelection.solana.description")}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderWalletSelection = () => {
    const availableWallets = SUPPORTED_WALLETS[selectedChain];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("walletSelection.title")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t("walletSelection.description", {
                chain: selectedChain === "evm" ? "Ethereum" : "Solana",
              })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back
          </Button>
        </div>

        <div className="space-y-3">
          {availableWallets.map((walletName) => {
            const isInstalled = detectWalletInstallation(walletName);
            const walletIcon = getWalletIcon(walletName);

            return (
              <button
                key={walletName}
                onClick={() => isInstalled && handleWalletSelection(walletName)}
                disabled={!isInstalled}
                className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all duration-200 ${
                  isInstalled
                    ? "border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-800 hover:shadow-md cursor-pointer"
                    : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 cursor-not-allowed opacity-60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={walletIcon}
                    alt={`${walletName} icon`}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="32" height="32" rx="8" fill="#6366f1"/>
                          <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">
                            ${walletName.charAt(0)}
                          </text>
                        </svg>
                      `)}`;
                    }}
                  />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {walletName}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {isInstalled
                        ? t("walletSelection.detected")
                        : t("walletSelection.notInstalled")}
                    </p>
                  </div>
                </div>
                {isInstalled && (
                  <div className="text-blue-500 dark:text-blue-400">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {availableWallets.every(
          (wallet) => !detectWalletInstallation(wallet)
        ) && (
          <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <div className="text-yellow-600 dark:text-yellow-400 mb-2">
              <svg
                className="w-8 h-8 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              {t("walletSelection.noWalletsDetected.title")}
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t("walletSelection.noWalletsDetected.description")}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderConnecting = () => {
    const showProceedButton =
      selectedChain === "solana" &&
      solanaConnected &&
      solanaPublicKey &&
      !userApprovedConnection.current;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t("connecting.title", { wallet: selectedWallet })}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back
          </Button>
        </div>

        <div className="text-center py-8">
          <div className="relative">
            <img
              src={getWalletIcon(selectedWallet)}
              alt={`${selectedWallet} icon`}
              className="w-16 h-16 mx-auto rounded-full mb-4"
            />
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
              <Spinner size="sm" color="white" />
            </div>
          </div>

          {showProceedButton ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 mb-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    {t("connecting.walletConnected")}
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {t("connecting.proceedDescription", {
                    wallet: selectedWallet,
                  })}
                </p>
              </div>

              <Button
                onClick={handleProceedToSigning}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3"
                size="lg"
              >
                {t("connecting.proceedButton")}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                {t("connecting.approveMessage", { wallet: selectedWallet })}
              </p>

              <div className="text-xs text-gray-500 dark:text-gray-500">
                {t("connecting.waitingMessage")}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderConnected = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative mb-4">
          <img
            src={getWalletIcon(selectedWallet)}
            alt={`${selectedWallet} icon`}
            className="w-16 h-16 mx-auto rounded-full"
          />
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t("connected.title")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t("connected.description", {
            wallet: selectedWallet,
            chain: selectedChain === "evm" ? "Ethereum" : "Solana",
          })}
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t("connected.connectedAddress")}
          </div>
          <div className="font-mono text-sm text-gray-900 dark:text-white break-all">
            {selectedChain === "evm"
              ? evmAddress
              : phantomAddress || solanaPublicKey?.toBase58()}
          </div>
        </div>

        <Button
          onClick={handleProceedToSigning}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3"
          size="lg"
        >
          {t("connected.proceedButton")}
        </Button>
      </div>
    </div>
  );

  const renderSigning = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t("signing.title")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("signing.description")}
        </p>
      </div>

      <WalletSigningVerification
        walletName={selectedWallet}
        walletAddress={
          selectedChain === "evm"
            ? evmAddress || ""
            : phantomAddress || solanaPublicKey?.toBase58() || ""
        }
        chainType={selectedChain}
        onSigningSuccess={handleSigningSuccess}
        onSigningError={handleSigningError}
        onCancel={handleSigningCancel}
      />
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t("success.title")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t("success.description", { wallet: selectedWallet })}
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
          <div className="text-xs text-green-600 dark:text-green-400 mb-1">
            {t("success.connectedTo", {
              chain: selectedChain === "evm" ? "Ethereum" : "Solana",
            })}
          </div>
          <div className="font-mono text-sm text-green-800 dark:text-green-200 break-all">
            {selectedChain === "evm"
              ? evmAddress
              : phantomAddress || solanaPublicKey?.toBase58()}
          </div>
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3"
          size="lg"
        >
          {t("success.continueButton")}
        </Button>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t("error.title")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t("error.description")}
        </p>

        {connectionError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-700 dark:text-red-300">
              {connectionError}
            </p>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            onClick={handleRetry}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
          >
            {t("error.tryAgainButton")}
          </Button>
          <Button onClick={handleBack} variant="bordered" className="flex-1">
            {t("error.goBackButton")}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentStep) {
      case "chain-selection":
        return renderChainSelection();
      case "wallet-selection":
        return renderWalletSelection();
      case "connecting":
        return renderConnecting();
      case "connected":
        return renderConnected();
      case "signing":
        return renderSigning();
      case "success":
        return renderSuccess();
      case "error":
        return renderError();
      default:
        return renderChainSelection();
    }
  };

  return (
    <Modal
      key={isOpen ? "modal-open" : "modal-closed"}
      isOpen={isOpen}
      onClose={handleModalClose}
      isDismissable={!isWalletConnectModalOpen}
      hideCloseButton={true}
      size="md"
      placement="center"
      className="z-50"
      classNames={{
        backdrop: "bg-black/70 backdrop-blur-sm",
        base: "border-none",
        wrapper: "z-50",
      }}
    >
      <ModalContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/20 dark:border-gray-700/20 shadow-2xl">
        <ModalHeader className="flex flex-col gap-1 pb-2 relative">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold">{t("title")}</span>
            </div>

            {/* Custom close button */}
            <button
              onClick={handleModalClose}
              disabled={isWalletConnectModalOpen}
              className={`p-2 rounded-full transition-all duration-200 ${
                isWalletConnectModalOpen
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110"
              }`}
              aria-label={t("closeLabel")}
            >
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="pb-6">{renderContent()}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
