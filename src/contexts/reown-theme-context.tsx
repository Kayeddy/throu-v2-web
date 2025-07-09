"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";

export interface ReownThemeContextState {
  reownTheme: "light" | "dark";
  isThemeLoaded: boolean;
  locale: string;
}

export interface ReownThemeContextDispatch {
  updateReownTheme: (theme: "light" | "dark") => void;
  updateReownLanguage: (locale: string) => void;
}

export interface ReownThemeContextProps
  extends ReownThemeContextState,
    ReownThemeContextDispatch {}

const ReownThemeContext = createContext<ReownThemeContextProps | null>(null);

interface ReownThemeProviderProps {
  children: ReactNode;
}

export function ReownThemeProvider({ children }: ReownThemeProviderProps) {
  const { resolvedTheme } = useTheme();
  const locale = useLocale();
  const [reownTheme, setReownTheme] = useState<"light" | "dark">("light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted before accessing DOM
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update Reown theme based on next-themes - following official documentation
  useEffect(() => {
    if (!isMounted) return;

    if (resolvedTheme) {
      const newTheme = resolvedTheme === "dark" ? "dark" : "light";
      setReownTheme(newTheme);
      setIsThemeLoaded(true);

      // Use official Reown AppKit API to set theme mode
      // Following: https://docs.reown.com/appkit/next/core/theming
      if (
        typeof window !== "undefined" &&
        (window as any).appkit?.setThemeMode
      ) {
        (window as any).appkit.setThemeMode(newTheme);
      }
    }
  }, [resolvedTheme, isMounted]);

  // Note: Reown AppKit doesn't have built-in internationalization support
  // It relies on browser language detection automatically

  const updateReownTheme = (newTheme: "light" | "dark") => {
    setReownTheme(newTheme);
    if (!isMounted) return;

    // Use official Reown AppKit API to set theme mode
    if (typeof window !== "undefined" && (window as any).appkit?.setThemeMode) {
      (window as any).appkit.setThemeMode(newTheme);
    }
  };

  const updateReownLanguage = (newLocale: string) => {
    // Note: Reown AppKit doesn't have built-in language switching
    // It automatically detects browser language
    console.log(
      "Language change requested:",
      newLocale,
      "but Reown AppKit uses browser detection"
    );
  };

  const contextState: ReownThemeContextState = {
    reownTheme,
    isThemeLoaded,
    locale,
  };

  const contextDispatch: ReownThemeContextDispatch = {
    updateReownTheme,
    updateReownLanguage,
  };

  return (
    <ReownThemeContext.Provider value={{ ...contextState, ...contextDispatch }}>
      {children}
    </ReownThemeContext.Provider>
  );
}

export function useReownTheme() {
  const context = useContext(ReownThemeContext);
  if (context === null) {
    throw new Error("useReownTheme must be used within a ReownThemeProvider");
  }
  return context;
}

// Extend Window interface for AppKit
declare global {
  interface Window {
    appkit?: {
      setThemeMode: (mode: "light" | "dark") => void;
    };
  }
}
