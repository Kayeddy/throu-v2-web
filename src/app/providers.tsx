"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ClerkProvider } from "@clerk/nextjs";
import { enUS, esES, frFR, arSA } from "@clerk/localizations";
import { WagmiProvider, cookieToInitialState } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";
import { ReactNode } from "react";
import { Locale } from "@/utils/types/shared/common";

// Initialize a new QueryClient for React Query
const queryClient = new QueryClient();

// Define the mapping between the locales and Clerk localization resources
const clerkLocalizations: Record<Locale, Partial<typeof enUS>> = {
  en: enUS,
  es: esES,
  fr: frFR,
  ar: arSA,
};

interface ProvidersProps {
  children: ReactNode;
  locale: Locale; // Locale prop now typed to match available locales
  cookie?: string | null;
}

export function Providers({ children, locale, cookie }: ProvidersProps) {
  const cookieInitialState = cookieToInitialState(config, cookie);

  // Choose the localization based on the current locale
  const clerkLocalization = clerkLocalizations[locale] || clerkLocalizations.en;

  return (
    <ClerkProvider
      signInUrl={`/${locale}/sign-in`}
      signUpUrl={`/${locale}/sign-up`}
      localization={clerkLocalization} // Dynamically use the correct localization
    >
      <WagmiProvider config={config} initialState={cookieInitialState}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#0E76FD",
              accentColorForeground: "white",
              borderRadius: "large",
              fontStack: "system",
              overlayBlur: "small",
            })}
          >
            <NextUIProvider>{children}</NextUIProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ClerkProvider>
  );
}
