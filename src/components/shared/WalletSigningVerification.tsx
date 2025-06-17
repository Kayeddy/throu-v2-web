// 2025 REUSABLE WALLET SIGNING VERIFICATION COMPONENT
// This component provides a universal signing verification flow for both EVM and Solana wallets

"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useSignMessage } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTranslations } from "next-intl";
import { ChainType } from "@/stores/useUnifiedWalletStore";

interface WalletSigningVerificationProps {
  walletName: string;
  walletAddress: string;
  chainType: ChainType;
  walletIcon?: string;
  onSigningSuccess: (signature: string) => void;
  onSigningError: (error: string) => void;
  onCancel: () => void;
  customMessage?: string;
  className?: string;
}

export function WalletSigningVerification({
  walletName,
  walletAddress,
  chainType,
  walletIcon,
  onSigningSuccess,
  onSigningError,
  onCancel,
  customMessage,
  className = "",
}: WalletSigningVerificationProps) {
  const [isSigning, setIsSigning] = useState(false);

  // Translations
  const t = useTranslations("Shared.walletSigningVerification");

  // EVM signing hook
  const { signMessage: signEVMMessage } = useSignMessage();

  // Solana signing hook
  const { signMessage: signSolanaMessage } = useWallet();

  const defaultMessage = `${t("defaultMessage")}

Wallet address:
${walletAddress}

Nonce: ${Date.now()}`;

  const message = customMessage || defaultMessage;

  const handleSignMessage = async () => {
    if (isSigning) return;

    try {
      setIsSigning(true);

      if (chainType === "evm") {
        console.log("🔐 Requesting EVM message signature...");
        console.log("📝 Message to sign:", message);

        // Create a promise with timeout to handle cases where user closes extension
        const signature = await new Promise<string>((resolve, reject) => {
          let hasResolved = false;

          // Set up timeout to catch cases where user closes wallet extension
          const timeout = setTimeout(() => {
            if (!hasResolved) {
              hasResolved = true;
              reject(new Error(t("errors.signingTimeout")));
            }
          }, 60000); // 60 second timeout

          signEVMMessage(
            { message },
            {
              onSuccess: (signature) => {
                if (!hasResolved) {
                  hasResolved = true;
                  clearTimeout(timeout);
                  console.log("✅ EVM message signed successfully:", signature);
                  console.log("🔍 Signature details:", {
                    length: signature.length,
                    format: signature.startsWith("0x") ? "hex" : "unknown",
                  });
                  resolve(signature);
                }
              },
              onError: (error) => {
                if (!hasResolved) {
                  hasResolved = true;
                  clearTimeout(timeout);
                  console.error("❌ EVM signing failed:", error);

                  // Enhanced error handling for specific wallet errors
                  const errorWithCode = error as any;
                  if (
                    error.message?.includes("User denied") ||
                    errorWithCode.code === 4001
                  ) {
                    reject(new Error(t("errors.userRejected")));
                  } else if (error.message?.includes("User rejected")) {
                    reject(new Error(t("errors.userRejected")));
                  } else {
                    reject(error);
                  }
                }
              },
            }
          );
        });

        console.log("✅ EVM signing completed successfully:", signature);
        onSigningSuccess(signature);
      } else {
        console.log("🔐 Requesting Solana message signature...");

        // Check if this is a direct Phantom connection
        if (
          walletName.toLowerCase().includes("phantom") &&
          typeof window !== "undefined" &&
          (window as any).phantom?.solana
        ) {
          console.log("🔐 Using direct Phantom signing API...");

          const phantom = (window as any).phantom.solana;
          const encodedMessage = new TextEncoder().encode(message);

          // Use direct Phantom API for signing - following official docs
          const signingPromise = new Promise<{
            signature: Uint8Array;
            publicKey: string;
          }>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error(t("errors.signingTimeout")));
            }, 60000); // 60 second timeout

            phantom
              .signMessage(encodedMessage, "utf8")
              .then((result: { signature: Uint8Array; publicKey: string }) => {
                clearTimeout(timeout);
                console.log("✅ Phantom signing result:", result);
                resolve(result);
              })
              .catch((error: any) => {
                clearTimeout(timeout);
                console.error("❌ Phantom signing error:", error);
                reject(error);
              });
          });

          const result = await signingPromise;
          console.log("✅ Phantom message signed successfully:", {
            signature: result.signature,
            publicKey: result.publicKey,
          });

          // Convert signature to hex string for consistency
          const signatureHex = `0x${Array.from(result.signature)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")}`;
          onSigningSuccess(signatureHex);
        } else if (signSolanaMessage) {
          // Use wallet adapter for other Solana wallets
          console.log("🔐 Using wallet adapter for Solana signing...");
          console.log("📝 Message to sign:", message);

          const signingPromise = new Promise<Uint8Array>((resolve, reject) => {
            const encodedMessage = new TextEncoder().encode(message);

            const timeout = setTimeout(() => {
              reject(new Error(t("errors.signingTimeout")));
            }, 60000); // 60 second timeout

            signSolanaMessage(encodedMessage)
              .then((signature) => {
                clearTimeout(timeout);
                console.log(
                  "✅ Solana wallet adapter signing result:",
                  signature
                );
                resolve(signature);
              })
              .catch((error) => {
                clearTimeout(timeout);
                console.error("❌ Solana wallet adapter signing error:", error);

                // Enhanced error handling for Solana wallet errors
                if (
                  error.message?.includes("User rejected") ||
                  error.message?.includes("cancelled")
                ) {
                  reject(new Error(t("errors.userRejected")));
                } else if (error.message?.includes("not connected")) {
                  reject(new Error(t("errors.walletNotConnected")));
                } else {
                  reject(error);
                }
              });
          });

          const signature = await signingPromise;
          console.log("✅ Solana message signed successfully:", {
            signature,
            length: signature.length,
            type: typeof signature,
          });

          // Verify the signature was actually created (Solana returns the signature)
          if (!signature || signature.length === 0) {
            throw new Error("Signature was not created");
          }

          // Convert signature to hex string for consistency
          const signatureHex = `0x${Array.from(signature)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")}`;
          onSigningSuccess(signatureHex);
        } else {
          throw new Error(t("errors.walletNotSupported", { walletName }));
        }
      }
    } catch (error: any) {
      console.error("❌ Message signing failed:", error);

      let errorMessage = t("errors.signingFailed");

      if (error.message?.includes("User rejected") || error.code === 4001) {
        errorMessage = t("errors.userRejected");
      } else if (error.message?.includes("timed out")) {
        errorMessage = error.message; // Use the timeout message directly
      } else if (error.message?.includes("not support")) {
        errorMessage = t("errors.walletNotSupported", { walletName });
      } else if (
        error.message?.includes("User denied") ||
        error.message?.includes("cancelled")
      ) {
        errorMessage = t("errors.signingCancelled");
      }

      onSigningError(errorMessage);
    } finally {
      setIsSigning(false);
    }
  };

  const getWalletIcon = () => {
    if (walletIcon) return walletIcon;

    // Default wallet icons
    const icons: Record<string, string> = {
      phantom: "/assets/wallets/phantom_logo.png",
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

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <div className="mb-6">
          <img
            src={getWalletIcon()}
            alt={walletName}
            className="w-16 h-16 rounded-full mx-auto mb-4 object-contain"
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
          <h3 className="text-lg font-medium mb-2">{t("title")}</h3>
          <p className="text-sm text-gray-500 mb-4">{t("description")}</p>

          <div className="bg-gray-50 dark:bg-gray-800/70 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {t("walletAddressLabel")}
            </p>
            <p className="text-sm font-mono break-all">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">i</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 text-left">
                {t("trustWarning")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleSignMessage}
            color="primary"
            className="w-full"
            isLoading={isSigning}
            disabled={isSigning}
          >
            {isSigning ? t("signingButton") : t("confirmButton")}
          </Button>
          <Button
            onClick={onCancel}
            variant="bordered"
            className="w-full"
            disabled={isSigning}
          >
            {t("cancelButton")}
          </Button>
        </div>
      </div>
    </div>
  );
}
