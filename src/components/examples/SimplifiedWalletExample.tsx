/**
 * Example Component - Simplified Wallet Integration
 *
 * This component demonstrates how to use the simplified Reown AppKit hooks
 * following the official documentation patterns.
 */

import React from "react";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
  useWalletConnection,
  useWalletBalance,
  useWalletInfo,
  useProject,
  useInvestTransaction,
  useMultiChainWallet,
} from "@/hooks/blockchain";

export const SimplifiedWalletExample: React.FC = () => {
  // Modal control and wallet connection - uses direct Reown AppKit hooks
  const { open, close } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { caipNetwork, isSolana, isEVM } = useWalletConnection();

  // Simple balance fetching - uses direct Reown AppKit balance hook
  const {
    balances,
    isLoading: balanceLoading,
  } = useWalletBalance();

  // Simple wallet info - uses direct Reown AppKit hooks
  const walletInfo = useWalletInfo();

  // Simple project fetching - uses direct wagmi hooks
  const {
    project,
    isLoading: projectLoading,
    error: projectError,
  } = useProject(1);

  // Simple investment transaction - uses direct wagmi hooks
  const {
    invest,
    isLoading: investLoading,
    isSuccess,
    error: investError,
  } = useInvestTransaction();

  // Multi-chain wallet support - uses direct Reown AppKit hooks
  const { currentChain, supportedChains } = useMultiChainWallet();

  const handleInvest = async () => {
    if (project) {
      await invest(1, 100); // Invest 100 USDT in project 1
    }
  };

  const handleConnect = () => {
    open({ view: "Connect" });
  };

  const handleConnectEthereum = () => {
    open({ view: "Connect", namespace: "eip155" });
  };

  const handleConnectSolana = () => {
    open({ view: "Connect", namespace: "solana" });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Simplified Wallet Integration Example
      </h1>

      {/* Wallet Connection */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Wallet Connection</h2>
        <div className="space-y-4">
          {!isConnected ? (
            <div className="space-y-2">
              <button
                onClick={handleConnect}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Connect Wallet
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={handleConnectEthereum}
                  className="border px-3 py-1 rounded text-sm hover:bg-gray-100"
                >
                  Connect to Ethereum
                </button>
                <button
                  onClick={handleConnectSolana}
                  className="border px-3 py-1 rounded text-sm hover:bg-gray-100"
                >
                  Connect to Solana
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">Connected: {address}</p>
              <p className="text-sm">
                Network: {caipNetwork?.name} ({caipNetwork?.id})
              </p>
              <p className="text-sm">
                Chain Type: {isEVM ? "EVM" : isSolana ? "Solana" : "Other"}
              </p>
              <button
                onClick={() => disconnect()}
                className="border px-4 py-2 rounded hover:bg-gray-100"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Balance */}
      {isConnected && (
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Wallet Balance</h2>
          <div>
            {balanceLoading ? (
              <p>Loading balance...</p>
            ) : balances ? (
              <div className="space-y-2">
                <p>
                  Native: {balances.native.formatted} {balances.native.symbol}
                </p>
                <p>
                  USDT: {balances.usdt.formatted} {balances.usdt.symbol}
                </p>
              </div>
            ) : (
              <p>No balance data</p>
            )}
          </div>
        </div>
      )}

      {/* Project Information */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Project Example</h2>
        <div>
          {projectLoading ? (
            <p>Loading project...</p>
          ) : projectError ? (
            <p className="text-red-500">Error: {projectError}</p>
          ) : project ? (
            <div className="space-y-2">
              <p>Project ID: {project.projectId}</p>
              <p>Price: ${project.projectPrice}</p>
              <p>Chain: {project.chain}</p>
              <p>Active: {project.projectActive ? "Yes" : "No"}</p>
              {project.projectURI && <p>Name: {project.projectURI.name}</p>}
            </div>
          ) : (
            <p>No project data</p>
          )}
        </div>
      </div>

      {/* Investment Transaction */}
      {isConnected && project && (
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Investment Transaction</h2>
          <div className="space-y-4">
            <button
              onClick={handleInvest}
              disabled={investLoading || !project}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
            >
              {investLoading ? "Processing..." : "Invest 100 USDT"}
            </button>

            {investError && (
              <p className="text-red-500">Error: {investError}</p>
            )}

            {isSuccess && (
              <p className="text-green-500">Investment successful!</p>
            )}
          </div>
        </div>
      )}

      {/* Benefits of Simplified Approach */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">
          Benefits of This Simplified Approach
        </h2>
        <div>
          <ul className="list-disc pl-5 space-y-2">
            <li>Uses direct Reown AppKit hooks without custom abstractions</li>
            <li>Follows official documentation patterns exactly</li>
            <li>Simpler state management with less complexity</li>
            <li>Direct wagmi hooks for contract interactions</li>
            <li>Easy to understand and maintain</li>
            <li>Built-in error handling and loading states</li>
            <li>Multi-chain support out of the box</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
