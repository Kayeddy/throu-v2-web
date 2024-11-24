"use client";

import { useSession } from "@clerk/nextjs";
import { ReactNode, useEffect } from "react";
import useLoadingStore from "@/stores/useLoadingStore";
import Loader from "@/components/shared/Loader";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isLoaded, session } = useSession();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const removeLoading = useLoadingStore((state) => state.removeLoading);

  // Manage loading state using useEffect
  useEffect(() => {
    if (!isLoaded) {
      setLoading("clerk-session-loading");
    } else {
      removeLoading("clerk-session-loading");
    }
  }, [isLoaded, setLoading, removeLoading]);

  // Show loader while session is loading
  if (!isLoaded) {
    return <Loader />;
  }

  // Render children once session is ready
  return <>{children}</>;
};

export default AuthWrapper;
