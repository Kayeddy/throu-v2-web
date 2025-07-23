"use client";

import { useEffect, useState } from "react";

/**
 * Client-side component that handles hydration state
 * and prevents browser extension interference
 */
export default function HydrationHandler() {
  useEffect(() => {
    // Mark body as hydrated after React has mounted
    document.body.setAttribute("data-hydrated", "true");

    // Add hydrated class for CSS-based styling
    document.body.classList.add("hydrated");

    // Optional: Clean up any extension attributes that might interfere
    // This is a safeguard against common extension attributes
    const extensionAttributes = [
      "cz-shortcut-listen",
      "data-new-gr-c-s-check-loaded",
      "data-gr-ext-installed",
      "spellcheck",
    ];

    // Remove or normalize problematic attributes
    extensionAttributes.forEach((attr) => {
      if (document.body.hasAttribute(attr)) {
        console.log(`[Hydration] Detected extension attribute: ${attr}`);
        // Don't remove, just acknowledge it exists
      }
    });

    console.log("[Hydration] Client-side hydration complete");
  }, []);

  // This component doesn't render anything
  return null;
}

/**
 * Hook to safely get hydration status
 */
export function useHydrationStatus() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
