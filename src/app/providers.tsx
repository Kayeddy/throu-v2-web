"use client";

import { useMemo } from "react";
import { HeroUIProvider } from "@heroui/react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, useTheme } from "next-themes";
import { WagmiProvider, cookieToInitialState } from "wagmi";
import { darkTheme, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";
import { ReactNode } from "react";
import { Locale } from "@/utils/types/shared/common";
import { CustomAvatar } from "@/components/ui/wallet-emoji-avatar";
import { enUS, esES, frFR, arSA } from "@clerk/localizations";
import { useLocale } from "next-intl";

// Application color scheme
const appColors = {
  primary: "#062147", // Deep blue
  secondary: "#18A5FF", // Bright blue
  light: "#F7FAFF", // Light background
  dark: "#01070E", // Dark background
};

const clerkLocalizations = {
  en: enUS,
  es: esES,
  fr: frFR,
  ar: arSA,
};

// Custom theme with dynamic attributes based on the current theme
const useCustomRainbowKitTheme = (theme: string): Theme => {
  return useMemo(() => {
    const baseTheme = darkTheme({
      accentColorForeground: appColors.light,
    });

    return {
      ...baseTheme, // Extend the darkTheme
      colors: {
        ...baseTheme.colors,
        connectButtonBackground: appColors.primary,
        connectButtonText: appColors.light,
        modalBackground: "rgba(0, 0, 0, 0.6)", // Semi-transparent modal background
        modalText: appColors.light,
        modalTextDim: appColors.light,
      },
      blurs: {
        ...baseTheme.blurs,
        modalOverlay: "blur(10px)", // Backdrop blur effect
      },
      fonts: {
        ...baseTheme.fonts,
        body: "Sen, sans-serif", // Set font to Sen
      },
    };
  }, [theme]);
};

// Query client for React Query
const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
  locale: Locale;
  cookie?: string | null;
}

export function Providers({ children, locale, cookie }: ProvidersProps) {
  const cookieInitialState = cookieToInitialState(config, cookie);

  // Get the current theme from next-themes
  const { theme } = useTheme();

  // Use the custom theme
  const rainbowKitTheme = useCustomRainbowKitTheme(theme || "light");

  // Get the Clerk localization for the current locale
  const clerkLocalization = clerkLocalizations[locale] || enUS;

  return (
    <ClerkProvider
      signInUrl={`/${locale}/sign-in`}
      signUpUrl={`/${locale}/sign-up`}
      localization={clerkLocalization}
    >
      <WagmiProvider config={config} initialState={cookieInitialState}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={rainbowKitTheme}
            locale={locale}
            avatar={CustomAvatar}
          >
            <HeroUIProvider>
              <ThemeProvider attribute="class">{children}</ThemeProvider>
            </HeroUIProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ClerkProvider>
  );
}
