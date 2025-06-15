import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from requestLocale - it's a Promise<string>
  const requested = await requestLocale;

  // Validate that the incoming locale is valid or use default
  const locale =
    requested && routing.locales.includes(requested as any)
      ? requested
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
