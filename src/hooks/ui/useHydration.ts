"use client";

import { useEffect, useState } from "react";

/**
 * Hook to safely detect when hydration is complete
 * Prevents hydration mismatches by ensuring client-side only features
 * are rendered only after hydration
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook to safely detect if we're in a browser environment
 * Always returns false during SSR to prevent hydration mismatches
 */
export function useIsBrowser() {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);

  return isBrowser;
}
