import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { headers } from "next/headers";
import AppProviders from "@/contexts/app-providers";
import { Locale } from "@/utils/types/shared/common";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Throu - Real Estate Tokenization",
  description: "Invest in real estate through blockchain tokenization",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const cookies = (await headers()).get("cookie");

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <AppProviders locale={locale as Locale} cookies={cookies}>
            {children}
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
