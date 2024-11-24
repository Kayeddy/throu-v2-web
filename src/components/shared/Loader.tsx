"use client";

import useLoadingStore from "@/stores/useLoadingStore";
import { Image } from "@nextui-org/react";
import AnimatedSpinner from "../ui/animated-spinner";

export default function Loader() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <>
      {isLoading && (
        <div className="fixed z-[1000] flex h-screen w-screen flex-col items-center justify-center bg-light">
          <Image
            alt="Loader-logo-image"
            src="/assets/shared/logo_lg.webp"
            className="mx-auto h-40 max-h-40 w-80 max-w-80 animate-pulse object-contain"
            fetchPriority="high"
          />
          <AnimatedSpinner />
        </div>
      )}
    </>
  );
}
