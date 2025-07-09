"use client";

import React from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Button } from "@heroui/react";

interface ReownWalletButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ReownWalletButton({
  className = "",
  size = "md",
}: ReownWalletButtonProps) {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const handleClick = () => {
    open();
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "text-sm px-3 py-2";
      case "lg":
        return "text-lg px-6 py-3";
      default:
        return "text-base px-4 py-2";
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={`font-sen ${getSizeClass()} ${className}`}
      color="secondary"
      variant="bordered"
    >
      {isConnected
        ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
        : "Connect Wallet"}
    </Button>
  );
}
