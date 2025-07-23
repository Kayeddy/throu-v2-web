"use client";

import { useEffect, useState } from "react";

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * NoSSR component that prevents hydration mismatches
 * by only rendering children on the client side
 */
export default function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR and before hydration, show fallback
  if (!isClient) {
    return <>{fallback}</>;
  }

  // After hydration, show actual content
  return <>{children}</>;
}

/**
 * Hook to detect if we're in a hydrated client environment
 * Returns false during SSR and before hydration completes
 */
export function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Only set to true after the component has mounted
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Higher-order component that wraps a component with NoSSR
 */
export function withNoSSR<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function NoSSRComponent(props: T) {
    return (
      <NoSSR fallback={fallback}>
        <Component {...props} />
      </NoSSR>
    );
  };
}
