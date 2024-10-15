"use client";
import { Image } from "@nextui-org/react";
import { BlurImage } from "./blur-image";

interface BackgroundImageProps {
  src: string;
  containerStyles: string;
  imageStyles: string;
}

export default function BackgroundImage({
  src,
  containerStyles,
  imageStyles,
}: BackgroundImageProps) {
  return (
    <div className={containerStyles}>
      <BlurImage
        src={src}
        className={imageStyles}
        width={200}
        height={200}
        alt={`background-logo-decoration`}
        loading="lazy"
      />
    </div>
  );
}
