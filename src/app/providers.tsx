"use client";

import { useMemo, useEffect, useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { WagmiProvider, cookieToInitialState } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { getEVMConfig } from "@/lib/unified-wallet-config";
import { ReactNode } from "react";
import { Locale } from "@/utils/types/shared/common";
import { enUS, esES, frFR, arSA } from "@clerk/localizations";
import type { Config } from "wagmi";

// Suppress WalletConnect console warnings
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    // Filter out WalletConnect history warnings
    if (
      args.some(
        (arg) =>
          typeof arg === "string" &&
          (arg.includes("Restore will override") ||
            arg.includes("core/history"))
      )
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

const clerkLocalizations = {
  en: enUS,
  es: esES,
  fr: frFR,
  ar: arSA,
};

// Singleton query client to prevent multiple instances
let queryClient: QueryClient | null = null;

const getQueryClient = () => {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          refetchOnWindowFocus: false,
        },
      },
    });
  }
  return queryClient;
};

// EVM Providers Wrapper - Client-side only to prevent indexedDB errors
function EVMProvidersWrapper({
  children,
  evmConfig,
  cookieInitialState,
}: {
  children: ReactNode;
  evmConfig: Config | null;
  cookieInitialState: any;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render EVM providers until mounted to prevent SSR issues
  // Also don't render if evmConfig is null (server-side)
  if (!mounted || !evmConfig) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={evmConfig} initialState={cookieInitialState}>
      <QueryClientProvider client={getQueryClient()}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Solana Provider Component - properly structured
function SolanaProvidersWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [solanaComponents, setSolanaComponents] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    // Load Solana components after mount
    const loadSolanaComponents = async () => {
      try {
        const [
          { ConnectionProvider, WalletProvider },
          { WalletModalProvider },
          { WalletAdapterNetwork },
          { clusterApiUrl },
          { PhantomWalletAdapter },
        ] = await Promise.all([
          import("@solana/wallet-adapter-react"),
          import("@solana/wallet-adapter-react-ui"),
          import("@solana/wallet-adapter-base"),
          import("@solana/web3.js"),
          import("@solana/wallet-adapter-phantom"),
        ]);

        const network = WalletAdapterNetwork.Mainnet;
        const endpoint = clusterApiUrl(network);

        // Only Phantom for Solana - Coinbase Solana support is inconsistent
        const wallets = [new PhantomWalletAdapter()];

        console.log(
          "ℹ️ Solana wallets configured: Phantom only (Coinbase Solana support is limited)"
        );

        console.log(
          "✅ Solana wallet adapters loaded:",
          wallets.map((w) => w.name)
        );

        setSolanaComponents({
          ConnectionProvider,
          WalletProvider,
          WalletModalProvider,
          endpoint,
          wallets,
        });
      } catch (error) {
        console.error("❌ Failed to load Solana components:", error);
      }
    };

    loadSolanaComponents();
  }, []);

  // Don't render Solana providers until mounted and components are loaded
  if (!mounted || !solanaComponents) {
    return <>{children}</>;
  }

  const {
    ConnectionProvider,
    WalletProvider,
    WalletModalProvider,
    endpoint,
    wallets,
  } = solanaComponents;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

interface ProvidersProps {
  children: ReactNode;
  locale: Locale;
  cookie?: string | null;
}

export function Providers({ children, locale, cookie }: ProvidersProps) {
  const evmConfig = getEVMConfig();
  const cookieInitialState = evmConfig
    ? cookieToInitialState(evmConfig, cookie)
    : undefined;

  // Get the Clerk localization for the current locale
  const clerkLocalization = clerkLocalizations[locale] || enUS;

  return (
    <ClerkProvider
      signInUrl={`/${locale}/sign-in`}
      signUpUrl={`/${locale}/sign-up`}
      localization={clerkLocalization}
    >
      {/* EVM Wallet Providers - Client-side only */}
      <EVMProvidersWrapper
        evmConfig={evmConfig}
        cookieInitialState={cookieInitialState}
      >
        {/* Solana Providers */}
        <SolanaProvidersWrapper>
          <HeroUIProvider>
            <ThemeProvider attribute="class">{children}</ThemeProvider>
          </HeroUIProvider>
        </SolanaProvidersWrapper>
      </EVMProvidersWrapper>
    </ClerkProvider>
  );
}
