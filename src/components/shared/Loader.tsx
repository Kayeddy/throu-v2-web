"use client";

import useLoadingStore from "@/stores/useLoadingStore";
import { Image } from "@nextui-org/react";
import AnimatedSpinner from "../ui/animated-spinner";
import { BlurImage } from "../ui/blur-image";

export default function Loader() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <>
      {isLoading && (
        <div className="fixed z-[1000] flex h-screen w-screen flex-col items-center justify-center bg-light">
          <BlurImage
            width={50}
            height={50}
            alt="Loader-logo-image"
            src="/assets/shared/logo_lg.png"
            className="h-40 w-80 animate-pulse object-contain"
            loading="lazy"
          />
          <AnimatedSpinner />
        </div>
      )}
    </>
  );
}
