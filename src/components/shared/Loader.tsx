"use client";

import useLoadingStore from "@/stores/useLoadingStore";
import { Spinner } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import AnimatedSpinner from "../ui/animated-spinner";

export default function Loader() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <>
      {isLoading && (
        <div className="flex flex-col items-center justify-center z-[1000] fixed w-screen h-screen bg-light">
          <Image
            src="/assets/shared/logo_lg.png"
            className="w-80 h-40 object-contain animate-pulse"
          />
          <AnimatedSpinner />
        </div>
      )}
    </>
  );
}
