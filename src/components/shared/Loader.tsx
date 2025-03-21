"use client";

import useLoadingStore from "@/stores/useLoadingStore";
import AnimatedSpinner from "../ui/animated-spinner";
import Image from "next/image";

export default function Loader() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <>
      {isLoading && (
        <div className="fixed z-[1000] flex h-screen w-screen flex-col items-center justify-center bg-light">
          <Image
            width={200}
            height={200}
            alt="Loader-logo-image"
            src="/assets/shared/logo_lg.webp"
            className="mx-auto my-6 h-auto w-auto max-w-80 animate-pulse bg-transparent object-contain"
            priority
          />
          <AnimatedSpinner />
        </div>
      )}
    </>
  );
}
