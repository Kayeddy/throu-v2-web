/**
 * SOLANA WALLET TEST PAGE
 * Test page to validate Solana wallet connections following official documentation
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  SolanaWalletConnection,
  SolanaWalletModalButton,
} from "@/components/ui/solana-wallet-connection";
import { BrowserWalletDetection } from "@/lib/solana";
import { Button } from "@heroui/react";

export default function TestSolanaPage() {
  const [phantomStatus, setPhantomStatus] = useState<string>("Checking...");
  const [connectionResult, setConnectionResult] = useState<string>("");

  useEffect(() => {
    // Check Phantom status on mount
    checkPhantomStatus();
  }, []);

  const checkPhantomStatus = async () => {
    const isInstalled = BrowserWalletDetection.isPhantomInstalled();
    const isMobile = BrowserWalletDetection.isMobileDevice();

    if (isMobile) {
      setPhantomStatus("Mobile device - Phantom app required");
    } else if (isInstalled) {
      setPhantomStatus("Phantom wallet detected ✅");
    } else {
      setPhantomStatus("Phantom wallet not found ❌");
    }
  };

  const testPhantomConnection = async () => {
    setConnectionResult("Connecting...");

    try {
      if (BrowserWalletDetection.isMobileDevice()) {
        BrowserWalletDetection.handleMobilePhantomConnection();
        setConnectionResult("Redirected to Phantom app 📱");
        return;
      }

      const result = await BrowserWalletDetection.connectPhantom();

      if (result.success) {
        setConnectionResult(
          `Connected! Public Key: ${result.publicKey.slice(0, 20)}...`
        );
      } else {
        setConnectionResult(`Failed: ${result.error}`);
      }
    } catch (error: any) {
      setConnectionResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Solana Wallet Connection Test
        </h1>

        {/* Enhanced Debug Section */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Enhanced Phantom Debug</h2>
          <div className="space-y-4">
            <div>
              <strong>Status:</strong> {phantomStatus}
            </div>
            <div className="flex gap-4">
              <Button onClick={checkPhantomStatus} variant="bordered">
                Recheck Phantom
              </Button>
              <Button onClick={testPhantomConnection} color="primary">
                Test Direct Connection
              </Button>
            </div>
            {connectionResult && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <strong>Result:</strong> {connectionResult}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Method 1: Custom Connection Component
          </h2>
          <p className="text-gray-600 mb-4">
            This uses the useWallet hook directly with custom UI:
          </p>
          <SolanaWalletConnection
            onSuccess={(address) => {
              console.log("✅ Wallet connected:", address);
              alert(`Wallet connected: ${address}`);
            }}
          />
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Method 2: Official Wallet Modal
          </h2>
          <p className="text-gray-600 mb-4">
            This uses the official wallet adapter modal:
          </p>
          <SolanaWalletModalButton />
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <p className="text-sm text-gray-600">
            Check the browser console for connection logs. If wallets don't
            connect, ensure you have Phantom or Solflare installed.
          </p>
        </div>
      </div>
    </div>
  );
}
