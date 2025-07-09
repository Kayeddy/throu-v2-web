/**
 * SOLANA WALLET TEST PAGE - DISABLED
 * This page has been disabled since we're now using Reown AppKit for wallet connections
 */

"use client";

import React from "react";

export default function TestSolanaPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Solana Test Page - Disabled
        </h1>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <p className="text-gray-600">
            This test page has been disabled. We're now using Reown AppKit for
            all wallet connections.
          </p>
        </div>
      </div>
    </div>
  );
}
