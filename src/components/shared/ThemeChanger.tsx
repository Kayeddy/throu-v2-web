"use client";

import { useTheme } from "next-themes";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useReownTheme } from "@/contexts/reown-theme-context";

export default function ThemeChanger() {
  const { theme, setTheme, systemTheme } = useTheme();
  const { updateReownTheme, locale, updateReownLanguage } = useReownTheme();
  const t = useTranslations("ui.theme");

  // Update Reown language when locale changes
  useEffect(() => {
    updateReownLanguage(locale);
  }, [locale, updateReownLanguage]);

  const handleThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    updateReownTheme(newTheme);
  };

  const getCurrentTheme = () => {
    if (theme === "system") {
      return systemTheme === "dark" ? "dark" : "light";
    }
    return theme === "dark" ? "dark" : "light";
  };

  const currentTheme = getCurrentTheme();

  return (
    <Button
      onClick={handleThemeChange}
      variant="ghost"
      size="sm"
      className="min-w-unit-10 px-2"
      aria-label={t("toggle")}
    >
      {currentTheme === "dark" ? (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
      <span className="sr-only">{t("toggle")}</span>
    </Button>
  );
}
