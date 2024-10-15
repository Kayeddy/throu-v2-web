// "use client";

// import { NextUIProvider } from "@nextui-org/react";
// import { ClerkProvider } from "@clerk/nextjs";
// import { ThemeProvider } from "next-themes";
// import { enUS, esES, frFR, arSA } from "@clerk/localizations";
// import { WagmiProvider, cookieToInitialState } from "wagmi";
// import {
//   RainbowKitProvider,
//   darkTheme,
//   lightTheme,
// } from "@rainbow-me/rainbowkit";
// import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// import { config } from "@/lib/wagmi";
// import { ReactNode } from "react";
// import { Locale } from "@/utils/types/shared/common";

// // Initialize a new QueryClient for React Query
// const queryClient = new QueryClient();

// // Define the mapping between the locales and Clerk localization resources
// const clerkLocalizations: Record<Locale, Partial<typeof enUS>> = {
//   en: enUS,
//   es: esES,
//   fr: frFR,
//   ar: arSA,
// };

// interface ProvidersProps {
//   children: ReactNode;
//   locale: Locale; // Locale prop now typed to match available locales
//   cookie?: string | null;
// }

// export function Providers({ children, locale, cookie }: ProvidersProps) {
//   const cookieInitialState = cookieToInitialState(config, cookie);

//   // Choose the localization based on the current locale
//   const clerkLocalization = clerkLocalizations[locale] || clerkLocalizations.en;

//   return (
//     <ClerkProvider
//       signInUrl={`/${locale}/sign-in`}
//       signUpUrl={`/${locale}/sign-up`}
//       localization={clerkLocalization} // Dynamically use the correct localization
//     >
//       <WagmiProvider config={config} initialState={cookieInitialState}>
//         <QueryClientProvider client={queryClient}>
//           <RainbowKitProvider
//             theme={darkTheme({
//               accentColor: "#062147",
//               accentColorForeground: "white",
//               borderRadius: "large",
//               fontStack: "system",
//               overlayBlur: "small",
//             })}
//             locale={locale}
//           >
//             <NextUIProvider>
//               <ThemeProvider attribute="class">{children}</ThemeProvider>
//             </NextUIProvider>
//           </RainbowKitProvider>
//         </QueryClientProvider>
//       </WagmiProvider>
//     </ClerkProvider>
//   );
// }
"use client";

import { useMemo } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, useTheme } from "next-themes";
import { WagmiProvider, cookieToInitialState } from "wagmi";
import { darkTheme, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";
import { ReactNode } from "react";
import { Locale } from "@/utils/types/shared/common";

// Application color scheme
const appColors = {
  primary: "#062147", // Deep blue
  secondary: "#18A5FF", // Bright blue
  light: "#F7FAFF", // Light background
  dark: "#01070E", // Dark background
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

  return (
    <ClerkProvider
      signInUrl={`/${locale}/sign-in`}
      signUpUrl={`/${locale}/sign-up`}
    >
      <WagmiProvider config={config} initialState={cookieInitialState}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={rainbowKitTheme} locale={locale}>
            <NextUIProvider>
              <ThemeProvider attribute="class">{children}</ThemeProvider>
            </NextUIProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ClerkProvider>
  );
}
