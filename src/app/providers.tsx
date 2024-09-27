"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { WagmiProvider, cookieToInitialState } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export function Providers({
  children,
  locale,
  cookie,
}: {
  children: ReactNode;
  locale: string;
  cookie?: string | null;
}) {
  const cookieInitialState = cookieToInitialState(config, cookie);
  return (
    <ClerkProvider
      signInForceRedirectUrl={`/${locale}/sign-in`}
      signUpForceRedirectUrl={`/${locale}/sign-up`}
      signInUrl={`/${locale}/sign-in`}
      signUpUrl={`/${locale}/sign-up`}
      localization={esES}
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
