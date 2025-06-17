"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

export const SolanaWalletTest = () => {
  const [status, setStatus] = useState<string>("Ready");
  const [address, setAddress] = useState<string>("");

  const testPhantomConnection = async () => {
    setStatus("Testing Phantom connection...");
    console.log("🔍 Testing Phantom wallet connection");

    try {
      // Check for Phantom availability
      const phantom = (window as any).phantom?.solana;
      const solana = (window as any).solana;

      console.log("Phantom provider:", phantom);
      console.log("Solana provider:", solana);
      console.log("Is Phantom available:", !!phantom?.isPhantom);
      console.log("Is legacy Solana available:", !!solana?.isPhantom);

      let response;

      if (phantom?.isPhantom) {
        console.log("🔌 Connecting via window.phantom.solana");
        response = await phantom.connect();
        console.log("✅ Phantom connected:", response);
      } else if (solana?.isPhantom) {
        console.log("🔌 Connecting via window.solana (legacy)");
        response = await solana.connect();
        console.log("✅ Phantom connected (legacy):", response);
      } else {
        throw new Error("Phantom wallet not found");
      }

      if (response?.publicKey) {
        const pubKey = response.publicKey.toString();
        setAddress(pubKey);
        setStatus(`Connected: ${pubKey.slice(0, 4)}...${pubKey.slice(-4)}`);
        console.log("✅ Successfully connected to Phantom:", pubKey);
      } else {
        throw new Error("No public key returned");
      }
    } catch (error: any) {
      console.error("❌ Phantom connection failed:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const testSolflareConnection = async () => {
    setStatus("Testing Solflare connection...");
    console.log("🔍 Testing Solflare wallet connection");

    try {
      const solflare = (window as any).solflare;
      console.log("Solflare provider:", solflare);

      if (!solflare) {
        throw new Error("Solflare wallet not found");
      }

      console.log("🔌 Connecting via window.solflare");
      const response = await solflare.connect();
      console.log("✅ Solflare connected:", response);

      if (response?.publicKey) {
        const pubKey = response.publicKey.toString();
        setAddress(pubKey);
        setStatus(`Connected: ${pubKey.slice(0, 4)}...${pubKey.slice(-4)}`);
        console.log("✅ Successfully connected to Solflare:", pubKey);
      } else {
        throw new Error("No public key returned");
      }
    } catch (error: any) {
      console.error("❌ Solflare connection failed:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const testWalletDetection = () => {
    console.log("🔍 Testing wallet detection...");

    const phantom = (window as any).phantom?.solana;
    const solana = (window as any).solana;
    const solflare = (window as any).solflare;

    console.log("Detection results:");
    console.log("- phantom.solana:", !!phantom);
    console.log("- phantom.isPhantom:", !!phantom?.isPhantom);
    console.log("- solana:", !!solana);
    console.log("- solana.isPhantom:", !!solana?.isPhantom);
    console.log("- solflare:", !!solflare);

    const results = {
      "window.phantom.solana": !!phantom,
      "phantom.isPhantom": !!phantom?.isPhantom,
      "window.solana": !!solana,
      "solana.isPhantom": !!solana?.isPhantom,
      "window.solflare": !!solflare,
    };

    setStatus(`Detection: ${JSON.stringify(results)}`);
  };

  const disconnect = async () => {
    try {
      const phantom = (window as any).phantom?.solana;
      const solflare = (window as any).solflare;

      if (phantom?.isConnected) {
        await phantom.disconnect();
        console.log("✅ Disconnected from Phantom");
      }

      if (solflare?.isConnected) {
        await solflare.disconnect();
        console.log("✅ Disconnected from Solflare");
      }

      setStatus("Disconnected");
      setAddress("");
    } catch (error: any) {
      console.error("❌ Disconnect failed:", error);
      setStatus(`Disconnect error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg space-y-4 max-w-md">
      <h3 className="text-lg font-semibold">Solana Wallet Test</h3>

      <div className="text-sm">
        <div className="font-medium">Status:</div>
        <div className="text-gray-600 break-all">{status}</div>
      </div>

      {address && (
        <div className="text-sm">
          <div className="font-medium">Address:</div>
          <div className="text-gray-600 break-all font-mono text-xs">
            {address}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Button
          onClick={testWalletDetection}
          variant="bordered"
          size="sm"
          className="w-full"
        >
          Test Detection
        </Button>

        <Button
          onClick={testPhantomConnection}
          color="primary"
          size="sm"
          className="w-full"
        >
          Test Phantom
        </Button>

        <Button
          onClick={testSolflareConnection}
          color="secondary"
          size="sm"
          className="w-full"
        >
          Test Solflare
        </Button>

        <Button
          onClick={disconnect}
          color="danger"
          variant="light"
          size="sm"
          className="w-full"
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
};
