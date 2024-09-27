import { Image } from "@nextui-org/react";

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
      <Image
        src={src}
        className={imageStyles}
        alt={`background-logo-decoration`}
      />
    </div>
  );
}
