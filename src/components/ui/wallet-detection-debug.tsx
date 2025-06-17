"use client";

import { useEffect, useState } from "react";
import { useWalletDetection } from "@/hooks/dual-chain/useWalletDetection";
import { BrowserWalletDetection } from "@/lib/solana";

// Safe JSON stringify that handles circular references
const safeStringify = (obj: any, space: number = 2): string => {
  const seen = new Set();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular Reference]";
        }
        seen.add(value);
      }
      // Skip complex objects that usually cause issues
      if (typeof value === "function") {
        return "[Function]";
      }
      if (key === "_events" || key === "listeners" || key === "context") {
        return "[Excluded]";
      }
      return value;
    },
    space
  );
};

// Extract only relevant wallet properties
const extractRelevantWalletInfo = (obj: any) => {
  if (!obj) return obj;

  return {
    // Basic wallet info
    isPhantom: obj.isPhantom,
    isCoinbaseWallet: obj.isCoinbaseWallet,
    isConnected: obj.isConnected,
    publicKey: obj.publicKey?.toString(),

    // Availability info
    readyState: obj.readyState,
    connecting: obj.connecting,
    connected: obj.connected,

    // Exclude complex objects
    hasEvents: !!obj._events,
    hasListeners: !!obj.listeners,
  };
};

export const WalletDetectionDebug = () => {
  const walletDetection = useWalletDetection();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [realTimeCheck, setRealTimeCheck] = useState<any>({});

  useEffect(() => {
    if (walletDetection.mounted) {
      const providers = BrowserWalletDetection.getAvailableWalletProviders();

      // Extract only safe properties to avoid circular references
      const safeProviders = {
        phantom: extractRelevantWalletInfo(providers.phantom),
        solana: extractRelevantWalletInfo(providers.solana),
        coinbase: extractRelevantWalletInfo(providers.coinbase),
        backpack: extractRelevantWalletInfo(providers.backpack),
        solflare: extractRelevantWalletInfo(providers.solflare),
      };

      setDebugInfo({
        windowSolana: !!(window as any).solana,
        windowPhantom: !!(window as any).phantom,
        phantomSolana: !!(window as any).phantom?.solana,
        solanaIsPhantom: !!(window as any).solana?.isPhantom,
        phantomIsPhantom: !!(window as any).phantom?.solana?.isPhantom,
        providers: safeProviders,
        detection: {
          phantom: BrowserWalletDetection.isPhantomInstalled(),
          coinbase: BrowserWalletDetection.isCoinbaseWalletInstalled(),
          solana: BrowserWalletDetection.isSolanaWalletInstalled(),
        },
      });
    }
  }, [walletDetection.mounted]);

  // Real-time check button
  const performRealTimeCheck = async () => {
    const phantomInstalled = BrowserWalletDetection.isPhantomInstalled();
    const phantomAsync = await BrowserWalletDetection.waitForWalletInjection(
      "phantom",
      1000
    );

    const phantomObject = (window as any).phantom;
    const phantomSolana = (window as any).phantom?.solana;

    setRealTimeCheck({
      timestamp: new Date().toISOString(),
      phantomInstalled,
      phantomAsync,
      phantomObject: extractRelevantWalletInfo(phantomObject),
      phantomSolana: extractRelevantWalletInfo(phantomSolana),
      isPhantom: phantomSolana?.isPhantom,
      connectionStatus:
        BrowserWalletDetection.getWalletConnectionStatus("phantom"),
      rawChecks: {
        windowPhantom: !!phantomObject,
        windowPhantomSolana: !!phantomSolana,
        isPhantomProperty: phantomSolana?.isPhantom,
      },
    });
  };

  // Safe wallet detection state (remove circular references)
  const safeWalletDetection = {
    mounted: walletDetection.mounted,
    phantom: walletDetection.phantom,
    coinbase: walletDetection.coinbase,
    solana: walletDetection.solana,
    hasSolanaWallets: walletDetection.hasSolanaWallets,
    isLoading: walletDetection.isLoading,
  };

  if (!walletDetection.mounted) {
    return (
      <div className="p-4 border rounded">Loading wallet detection...</div>
    );
  }

  return (
    <div className="p-4 border rounded bg-gray-50 dark:bg-gray-800 text-sm max-w-4xl mx-auto">
      <h3 className="font-bold mb-2 text-red-600">
        🔧 Wallet Detection Debug Panel
      </h3>

      <div className="mb-4">
        <h4 className="font-semibold text-blue-600">Hook State:</h4>
        <pre className="bg-black text-green-400 p-2 rounded text-xs overflow-auto max-h-40">
          {safeStringify(safeWalletDetection)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-blue-600">
          Browser Environment (Initial):
        </h4>
        <pre className="bg-black text-green-400 p-2 rounded text-xs overflow-auto max-h-40">
          {safeStringify(debugInfo)}
        </pre>
      </div>

      {realTimeCheck.timestamp && (
        <div className="mb-4">
          <h4 className="font-semibold text-purple-600">Real-time Check:</h4>
          <pre className="bg-black text-yellow-400 p-2 rounded text-xs overflow-auto max-h-40">
            {safeStringify(realTimeCheck)}
          </pre>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={performRealTimeCheck}
          className="px-3 py-1 bg-green-500 text-white rounded text-xs"
        >
          🔄 Real-time Check
        </button>

        <button
          onClick={() => {
            const info = walletDetection.getWalletInfo("phantom");
            const phantomExists = !!(window as any).phantom;
            const phantomSolanaExists = !!(window as any).phantom?.solana;
            const isPhantom = !!(window as any).phantom?.solana?.isPhantom;

            alert(`Phantom Detection Results:
- Hook says installed: ${info.isInstalled}
- Phantom object exists: ${phantomExists}
- Phantom Solana exists: ${phantomSolanaExists}  
- IsPhantom property: ${isPhantom}
- Browser detection: ${BrowserWalletDetection.isPhantomInstalled()}`);
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
        >
          ℹ️ Check Phantom
        </button>

        <button
          onClick={() => {
            console.log("=== WALLET DETECTION DEBUG ===");
            console.log("Window phantom:", (window as any).phantom);
            console.log(
              "Window phantom.solana:",
              (window as any).phantom?.solana
            );
            console.log("Window solana:", (window as any).solana);
            console.log(
              "Phantom installed?",
              BrowserWalletDetection.isPhantomInstalled()
            );
            console.log(
              "Available providers:",
              BrowserWalletDetection.getAvailableWalletProviders()
            );
            console.log("=== END DEBUG ===");
          }}
          className="px-3 py-1 bg-orange-500 text-white rounded text-xs"
        >
          📝 Log to Console
        </button>

        <button
          onClick={() => walletDetection.promptWalletInstall("phantom")}
          className="px-3 py-1 bg-purple-500 text-white rounded text-xs"
        >
          📥 Install Phantom
        </button>
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-400">
        <p>
          <strong>Debug Info:</strong> This panel shows the current state of
          wallet detection.
        </p>
        <p>
          <strong>Expected:</strong> If Phantom is installed, `phantom: true`
          should appear in Hook State.
        </p>
        <p>
          <strong>Issue:</strong> If Phantom shows as false but you have it
          installed, there's a detection issue.
        </p>
        <p>
          <strong>Note:</strong> Circular references are handled safely in this
          debug view.
        </p>
        <p>
          <strong>Debug Info:</strong> This panel shows the current state of
          wallet detection.
        </p>
        <p>
          <strong>Expected:</strong> If Phantom is installed, `phantom: true`
          should appear in Hook State.
        </p>
        <p>
          <strong>Issue:</strong> If Phantom shows as false but you have it
          installed, there's a detection issue.
        </p>
      </div>
    </div>
  );
};
