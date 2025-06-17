"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-base";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { MdClose as X } from "react-icons/md";
import { BrowserWalletDetection } from "@/lib/solana";

interface SolanaWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Essential Solana wallets - Phantom and Coinbase Wallet
const SOLANA_WALLETS = [
  {
    name: "Phantom" as WalletName,
    description: "The most popular Solana wallet",
    bgColor: "bg-gradient-to-br from-purple-500 to-blue-600",
    textColor: "text-white",
    emoji: "👻",
    downloadUrl: "https://phantom.app/download",
  },
  {
    name: "Coinbase Wallet" as WalletName,
    description: "Coinbase's secure wallet",
    bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
    textColor: "text-white",
    emoji: "🔵",
    downloadUrl: "https://wallet.coinbase.com/",
  },
];

export const SolanaWalletModal = ({
  isOpen,
  onClose,
}: SolanaWalletModalProps) => {
  const t = useTranslations("Shared.solanaWalletModal");
  const { wallets, select, connect, connecting, connected } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<WalletName | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [installedWallets, setInstalledWallets] = useState<
    Record<string, boolean>
  >({});

  // Check wallet installation status
  useEffect(() => {
    if (mounted) {
      const checkInstalledWallets = async () => {
        const detected = BrowserWalletDetection.detectInstalledWallets();

        // Additional checks with timeout for async wallet injection
        const phantomCheck =
          await BrowserWalletDetection.waitForWalletInjection("phantom", 1000);
        const coinbaseCheck =
          await BrowserWalletDetection.waitForWalletInjection("coinbase", 1000);

        setInstalledWallets({
          ...detected,
          phantom: phantomCheck,
          coinbase: coinbaseCheck,
        });
      };

      checkInstalledWallets();
    }
  }, [mounted]);

  // Map wallet info with actual installation status
  const allWallets = SOLANA_WALLETS.map((walletInfo) => {
    const walletAdapter = wallets.find(
      (wallet) => wallet.adapter.name === walletInfo.name
    );

    // Determine if wallet is installed based on browser detection
    const isInstalled = (() => {
      switch (walletInfo.name) {
        case "Phantom":
          return installedWallets.phantom || false;
        case "Coinbase Wallet":
          return installedWallets.coinbase || false;
        default:
          return false;
      }
    })();

    return {
      ...walletInfo,
      isInstalled, // Use actual detection instead of hardcoded false
      readyState: walletAdapter?.readyState || "NotDetected",
      adapter: walletAdapter,
    };
  });

  // Separate installed and not installed wallets
  const installedWalletsList = allWallets.filter(
    (wallet) => wallet.isInstalled
  );
  const notInstalledWallets = allWallets.filter(
    (wallet) => !wallet.isInstalled
  );

  // Show installed wallets first, then not installed ones
  const recommendedWallets = [...installedWalletsList, ...notInstalledWallets];

  // Close modal when connection is successful
  useEffect(() => {
    if (connected && selectedWallet) {
      console.log("Connection successful, closing modal");
      setTimeout(() => {
        onClose();
        setSelectedWallet(null);
      }, 1000); // Give user time to see connection success
    }
  }, [connected, selectedWallet, onClose]);

  // Ensure we're on the client side and detect mobile
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleWalletSelect = async (walletName: WalletName) => {
    console.log("=== WALLET SELECTION DEBUG START ===");
    console.log("Selected wallet name:", walletName);

    try {
      setSelectedWallet(walletName);

      // Find the wallet info to check if installed
      const walletInfo = allWallets.find((w) => w.name === walletName);
      console.log("Wallet info:", walletInfo);
      console.log("Is wallet installed:", walletInfo?.isInstalled);

      // If wallet is not installed, show download option
      if (!walletInfo?.isInstalled) {
        console.log("Wallet not installed, redirecting to download");
        handleWalletNotInstalled(walletName);
        return;
      }

      // Find the wallet adapter
      const walletAdapter = wallets.find(
        (wallet) => wallet.adapter.name === walletName
      );
      console.log("Wallet adapter found:", !!walletAdapter);
      console.log("Wallet adapter:", walletAdapter);

      if (!walletAdapter) {
        console.error("Wallet adapter not found:", walletName);
        handleWalletNotInstalled(walletName);
        return;
      }

      console.log("Selecting wallet:", walletName);

      // Select the wallet
      select(walletName);
      console.log("Wallet selected, now attempting adapter connection...");

      // Use only the adapter connection method - no direct phantom connection
      // Wait for wallet selection to register, then use adapter connection
      setTimeout(async () => {
        try {
          console.log("Attempting adapter connection to:", walletName);
          console.log(
            "Current wallet state - connecting:",
            connecting,
            "connected:",
            connected
          );

          const connectResult = await connect();
          console.log("Adapter connection result:", connectResult);
          console.log("Adapter connection successful");

          // Don't close the modal here - let the useEffect handle it when connection state changes
          console.log(
            "Connection attempt completed, waiting for state change..."
          );
        } catch (connectError) {
          console.error("Failed to connect via adapter:", connectError);
          console.error("Connect error details:", {
            name: (connectError as Error)?.name,
            message: (connectError as Error)?.message,
            stack: (connectError as Error)?.stack,
          });

          setSelectedWallet(null);

          // Show user-friendly error message
          const errorMessage =
            (connectError as Error)?.message || "Unknown connection error";
          alert(
            `Failed to connect to ${walletName}: ${errorMessage}\n\nPlease ensure your wallet is unlocked and try again.`
          );
        }
      }, 300);
    } catch (error) {
      console.error("Failed to select wallet:", error);
      console.error("Selection error details:", {
        name: (error as Error)?.name,
        message: (error as Error)?.message,
        stack: (error as Error)?.stack,
      });

      setSelectedWallet(null);

      // On error, check if wallet is installed and show appropriate action
      const walletInfo = allWallets.find((w) => w.name === walletName);
      if (!walletInfo?.isInstalled) {
        handleWalletNotInstalled(walletName);
      } else {
        alert(`Error selecting ${walletName}. Please try again.`);
      }
    }

    console.log("=== WALLET SELECTION DEBUG END ===");
  };

  const handleWalletNotInstalled = (walletName: WalletName) => {
    console.log("=== WALLET NOT INSTALLED HANDLER ===");
    console.log("Wallet name:", walletName);

    const walletInfo = SOLANA_WALLETS.find((w) => w.name === walletName);
    console.log("Wallet info for not installed:", walletInfo);

    const downloadUrl =
      walletInfo?.downloadUrl ||
      "https://solana.com/ecosystem/explore?categories=wallet";

    console.log("Download URL:", downloadUrl);

    // Show user-friendly message and redirect
    const shouldDownload = confirm(
      `${walletName} wallet is not installed. Would you like to download it?`
    );

    console.log("User chose to download:", shouldDownload);

    if (shouldDownload) {
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    }

    console.log("Closing modal from handleWalletNotInstalled");
    onClose();
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Don't render anything on the server or if not mounted
  if (!mounted) return null;

  const WalletButton = ({
    walletInfo,
    showInstallationStatus = true,
  }: {
    walletInfo: any;
    showInstallationStatus?: boolean;
  }) => (
    <button
      key={walletInfo.name}
      onClick={() => handleWalletSelect(walletInfo.name)}
      disabled={connecting && selectedWallet === walletInfo.name}
      className={`w-full flex items-center gap-3 p-3 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors disabled:opacity-50 group ${
        isMobile
          ? "gap-4 p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
          : ""
      }`}
    >
      <div
        className={`${isMobile ? "w-12 h-12" : "w-10 h-10"} ${
          walletInfo.bgColor
        } ${
          isMobile ? "rounded-xl" : "rounded-lg"
        } flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
      >
        <span className={isMobile ? "text-2xl" : "text-lg"}>
          {walletInfo.emoji}
        </span>
      </div>
      <div className="flex-1 text-left">
        <div
          className={`font-medium text-gray-900 dark:text-white ${
            isMobile ? "" : "text-sm"
          }`}
        >
          {walletInfo.name}
          {showInstallationStatus && !walletInfo.isInstalled && (
            <span className="text-orange-500 ml-1 text-xs">
              (Not installed)
            </span>
          )}
          {showInstallationStatus && walletInfo.isInstalled && (
            <span className="text-green-500 ml-1 text-xs">✓ Installed</span>
          )}
        </div>
        {isMobile && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t(
              `wallets.${walletInfo.name
                .toLowerCase()
                .replace(/\s+/g, "")}.description`
            )}
          </div>
        )}
      </div>
      {connecting && selectedWallet === walletInfo.name && (
        <div
          className={`${
            isMobile ? "w-5 h-5" : "w-4 h-4"
          } border-2 border-blue-500 border-t-transparent rounded-full animate-spin`}
        />
      )}
    </button>
  );

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container - Responsive */}
          {isMobile ? (
            // Mobile: Bottom slide-up design
            <div className="fixed inset-0 z-[9999] flex items-end justify-center">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-md bg-white/80 dark:bg-black/70 backdrop-blur-2xl rounded-t-3xl shadow-2xl border border-white/20"
              >
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t("title")}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Wallet Options */}
                <div className="p-6 space-y-4">
                  {/* All Wallets */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Available Wallets
                    </h3>
                    <div className="space-y-2">
                      {recommendedWallets.map((walletInfo) => (
                        <WalletButton
                          key={walletInfo.name}
                          walletInfo={walletInfo}
                          showInstallationStatus
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile Educational Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {t("educationalContent.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    {t("educationalContent.description")}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        window.open(
                          "https://phantom.app",
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                    >
                      {t("educationalContent.getWallet")}
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          "https://docs.solana.com/wallet-guide",
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      className="flex-1 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
                    >
                      {t("educationalContent.learnMore")}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            // Desktop: Centered modal design (like RainbowKit)
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="bg-white/30 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-lg overflow-hidden"
              >
                {/* Desktop Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/20 dark:border-gray-700/20">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t("titleDesktop")}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex">
                  {/* Desktop Wallet Options */}
                  <div className="flex-1 p-6">
                    {/* All Wallets */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Available Wallets
                      </h3>
                      <div className="space-y-1">
                        {recommendedWallets.map((walletInfo) => (
                          <WalletButton
                            key={walletInfo.name}
                            walletInfo={walletInfo}
                            showInstallationStatus
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Educational Content */}
                  <div className="w-64 bg-white/10 dark:bg-black/10 p-6 border-l border-gray-200/20 dark:border-gray-700/20">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {t("educationalContent.titleDesktop")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                      {t("educationalContent.descriptionDesktop")}
                    </p>

                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          window.open(
                            "https://phantom.app",
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        {t("educationalContent.getWallet")}
                      </button>
                      <button
                        onClick={() =>
                          window.open(
                            "https://docs.solana.com/wallet-guide",
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        {t("educationalContent.learnMore")}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );

  // Use portal to render at document body level
  return createPortal(modalContent, document.body);
};
