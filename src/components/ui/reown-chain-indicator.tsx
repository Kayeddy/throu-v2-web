"use client";

import React from "react";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";

interface ChainIndicatorProps {
  className?: string;
  showText?: boolean;
}

export default function ReownChainIndicator({
  className = "",
  showText = true,
}: ChainIndicatorProps) {
  const { isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  if (!isConnected) {
    return null;
  }

  const getChainInfo = () => {
    // Determine EVM chain based on chainId
    if (chainId === 137) {
      return {
        name: "Polygon",
        color: "bg-purple-600",
        textColor: "text-purple-700",
        bgColor: "bg-purple-50",
        icon: "⬟",
      };
    } else if (chainId === 80001) {
      return {
        name: "Mumbai",
        color: "bg-orange-500",
        textColor: "text-orange-700",
        bgColor: "bg-orange-50",
        icon: "⬟",
      };
    } else {
      return {
        name: "Unknown",
        color: "bg-gray-500",
        textColor: "text-gray-700",
        bgColor: "bg-gray-50",
        icon: "?",
      };
    }
  };

  const chainInfo = getChainInfo();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${chainInfo.bgColor} ${className}`}
    >
      <div className={`w-2 h-2 rounded-full ${chainInfo.color}`} />
      {showText && (
        <span className={`text-sm font-medium ${chainInfo.textColor}`}>
          {chainInfo.name}
        </span>
      )}
    </div>
  );
}
