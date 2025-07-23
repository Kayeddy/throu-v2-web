"use client";

import { HeroUIProvider } from "@heroui/react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Locale } from "@/utils/types/shared/common";
import { enUS, esES, frFR, arSA } from "@clerk/localizations";
import { wagmiAdapter, solanaAdapter, projectId } from "@/lib/wagmi-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { polygon, solanaDevnet } from "@reown/appkit/networks";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { ReownThemeProvider } from "./reown-theme-context";

// Set up queryClient - singleton pattern
const queryClient = new QueryClient();

// Suppress WalletConnect console warnings
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("WalletConnect") ||
        args[0].includes("wagmi") ||
        args[0].includes("connector"))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

// Clerk localization mapping
const clerkLocalizations = {
  en: enUS,
  es: esES,
  fr: frFR,
  ar: arSA,
};

// Reown AppKit configuration
if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "Throu - Real Estate Tokenization",
  description: "Invest in real estate through blockchain tokenization",
  url: "https://throu.app",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Create the AppKit instance following official multichain documentation
const modal = createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  networks: [polygon as any, solanaDevnet as any],
  defaultNetwork: polygon as any,
  metadata: metadata,
  projectId,
  enableNetworkSwitch: true,
  themeMode: "light", // Will be updated dynamically by ReownThemeProvider
  features: {
    analytics: true,
    email: false,
    socials: false,
    swaps: false,
    onramp: false,
  },
});

// Expose modal globally for theme switching following official documentation
if (typeof window !== "undefined") {
  (window as any).appkit = modal;
}

interface AppProvidersProps {
  children: ReactNode;
  locale: Locale;
  cookies: string | null;
}

export default function AppProviders({
  children,
  locale,
  cookies,
}: AppProvidersProps) {
  // Get the appropriate Clerk localization
  const clerkLocalization = clerkLocalizations[locale] || enUS;

  // Initialize wagmi state from cookies
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <ClerkProvider localization={clerkLocalization}>
      <WagmiProvider
        config={wagmiAdapter.wagmiConfig as Config}
        initialState={initialState}
      >
        <QueryClientProvider client={queryClient}>
          <HeroUIProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <ReownThemeProvider>{children}</ReownThemeProvider>
            </ThemeProvider>
          </HeroUIProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ClerkProvider>
  );
}
