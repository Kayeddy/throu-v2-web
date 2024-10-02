"use client"; // Ensures this component is client-side

import { useSession } from "@clerk/nextjs";
import { ReactNode } from "react";
import useLoadingStore from "@/stores/useLoadingStore";
import Loader from "@/components/shared/Loader"; // Your custom loader component

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isLoaded, session } = useSession(); // Clerk session hook to check if the session is loaded
  const setLoading = useLoadingStore((state) => state.setLoading);
  const removeLoading = useLoadingStore((state) => state.removeLoading);

  if (!isLoaded) {
    // While the session is loading, trigger the global loading state
    setLoading("clerk-session-loading");
    return <Loader />; // Render your loader component
  }

  // Once session is loaded, remove the loading state
  removeLoading("clerk-session-loading");

  // Render children (the actual content) when session is ready
  return <>{children}</>;
};

export default AuthWrapper;
