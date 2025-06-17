"use client";

import { useSession } from "@clerk/nextjs";
import { ReactNode, useEffect, useState } from "react";
import useLoadingStore from "@/stores/useLoadingStore";
import Loader from "@/components/shared/Loader";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isLoaded, session } = useSession();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const removeLoading = useLoadingStore((state) => state.removeLoading);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Manage loading state using useEffect
  useEffect(() => {
    if (!mounted) return; // Don't set loading state until mounted

    if (!isLoaded) {
      setLoading("clerk-session-loading");
    } else {
      removeLoading("clerk-session-loading");
    }
  }, [isLoaded, setLoading, removeLoading, mounted]);

  // Show nothing during SSR to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Show loader while session is loading
  if (!isLoaded) {
    return <Loader />;
  }

  // Render children once session is ready
  return <>{children}</>;
};

export default AuthWrapper;
