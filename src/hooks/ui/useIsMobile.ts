"use client";

import { useState, useEffect } from "react";

// Tailwind's lg breakpoint is 1024px (desktop starts at 1024px)
const lgBreakpoint = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if current viewport is smaller than the lg breakpoint
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < lgBreakpoint);
    };

    // Initial check
    checkIsMobile();

    // Event listener to update isMobile when window is resized
    window.addEventListener("resize", checkIsMobile);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
}
