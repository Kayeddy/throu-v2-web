import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { Providers } from "../providers";
import { headers } from "next/headers";

import "../globals.css";
import Loader from "@/components/shared/Loader";
import AuthWrapper from "@/components/shared/AuthWrapper";
import { Locale } from "@/utils/types/shared/common";

const inter = Inter({ subsets: ["latin"] });

// Constants
const DOMAIN = "https://throu.app";
const DESCRIPTION =
  "Throu is a DeFi platform enabling real estate tokenization, allowing investors to securely purchase and sell property fractions with transparency ensured by Smart Contracts.";
const KEYWORDS =
  "real estate tokenization, real estate investments, DeFi platform, fractional real estate, property investment, blockchain real estate, smart contracts, decentralized finance, tokenized real estate projects";
const OG_IMAGE = `${DOMAIN}/assets/shared/og-image.jpg`;
const TWITTER_IMAGE = `${DOMAIN}/assets/shared/twitter-card.jpg`;
const OG_TITLE = "Throu: Tokenized Real Estate Investments";
const OG_DESCRIPTION =
  "Access exclusive real estate projects with affordable investments. Throu offers decentralized finance opportunities through fractional tokens, secured by Smart Contracts.";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Get locale and messages through next-intl API
  const locale = await getLocale();
  const messages = await getMessages();

  // Properly await headers()
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <title>THROU</title>

        {/* Essential Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={DESCRIPTION} />
        <meta name="keywords" content={KEYWORDS} />
        <meta name="robots" content="index, follow" />

        {/* Canonical and Alternate Links */}
        <link rel="canonical" href={DOMAIN} />
        <link rel="alternate" hrefLang="en" href={`${DOMAIN}/en`} />
        <link rel="alternate" hrefLang="es" href={`${DOMAIN}/es`} />
        <link rel="alternate" hrefLang="fr" href={`${DOMAIN}/fr`} />
        <link rel="alternate" hrefLang="ar" href={`${DOMAIN}/ar`} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={OG_TITLE} />
        <meta property="og:description" content={OG_DESCRIPTION} />
        <meta property="og:url" content={DOMAIN} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Throu" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Throu platform overview" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={OG_TITLE} />
        <meta name="twitter:description" content={OG_DESCRIPTION} />
        <meta name="twitter:image" content={TWITTER_IMAGE} />
        <meta name="twitter:image:alt" content="Throu platform overview" />

        {/* Theme Color */}
        <meta name="theme-color" content="#062147" />
      </head>
      <body className={`${inter.className}`}>
        <NextIntlClientProvider messages={messages}>
          <Providers locale={locale as Locale} cookie={cookie}>
            <AuthWrapper>
              <Loader />
              {children}
            </AuthWrapper>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
