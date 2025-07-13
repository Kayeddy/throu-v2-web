"use client";

import { Chip } from "@heroui/react";
import { SupportedChain } from "@/utils/types/shared/project";
import Image from "next/image";

interface ChainIndicatorProps {
  chain: SupportedChain;
  variant?: "default" | "compact" | "dot";
  className?: string;
}

// Chain configuration for display
const CHAIN_CONFIG = {
  polygon: {
    name: "Polygon",
    color: "secondary" as const,
    icon: "/assets/svg_icons/EthIcon.svg", // Using ETH icon for EVM/Polygon
    bgColor: "bg-purple-500",
  },
  solana: {
    name: "Solana",
    color: "success" as const,
    icon: "/assets/svg_icons/SolIcon.svg",
    bgColor: "bg-green-500",
  },
} as const;

export default function ChainIndicator({
  chain,
  variant = "default",
  className = "",
}: ChainIndicatorProps) {
  const config = CHAIN_CONFIG[chain];

  if (variant === "dot") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${config.bgColor}`} />
        <span className="text-xs font-medium">{config.name}</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Chip
        color={config.color}
        radius="sm"
        size="sm"
        className="bg-quaternary font-jakarta text-light cacpitalize"
        startContent={
          <Image
            src={config.icon}
            alt={`${config.name} icon`}
            width={12}
            height={12}
            className="w-3 h-3"
          />
        }
      >
        {config.name}
      </Chip>
    );
  }

  return (
    <Chip
      color={config.color}
      variant="solid"
      size="sm"
      className={`font-medium ${className}`}
      startContent={
        <Image
          src={config.icon}
          alt={`${config.name} icon`}
          width={16}
          height={16}
          className="w-4 h-4"
        />
      }
    >
      {config.name}
    </Chip>
  );
}
